package com.brinda.api.complaint.service;

import com.brinda.api.complaint.dto.CreateComplaintRequest;
import com.brinda.api.complaint.dto.CreatedComplaintResponse;
import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.repository.ComplaintNumberGenerator;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;

/** Registro público del reclamo. Se guarda SIEMPRE primero; los correos van aparte (ComplaintNotifier). */
@Service
@RequiredArgsConstructor
public class ComplaintService {

    public static final String COPY_PATH = "/api/v1/complaints/copy/";
    private static final int TOKEN_BYTES = 32;

    private final ComplaintRepository repository;
    private final ComplaintNumberGenerator numbers;
    private final DniCipher cipher;
    private final Clock clock;
    private final SecureRandom random = new SecureRandom();

    /** Devuelve el reclamo guardado y el token de descarga en claro (solo existe en esta respuesta). */
    @Transactional
    public Created create(CreateComplaintRequest req) {
        OffsetDateTime now = OffsetDateTime.now(clock);
        int year = now.atZoneSameInstant(ComplaintPdfService.LIMA).getYear();
        int number = numbers.next(year);

        byte[] raw = new byte[TOKEN_BYTES];
        random.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);

        Complaint c = new Complaint();
        c.setComplaintYear((short) year);
        c.setComplaintNumber(number);
        c.setCode(String.format("LR-%d-%06d", year, number));
        c.setFiledAt(now);
        c.setCopyTokenHash(hash(token));
        c.setConsumerName(req.consumerName().strip());
        c.setDocumentType(req.documentType());
        c.setDocumentEncrypted(cipher.encrypt(normalizeDocument(req)));
        c.setConsumerAddress(req.address().strip());
        c.setConsumerPhone(req.phone().strip());
        c.setConsumerEmail(req.email().strip().toLowerCase(Locale.ROOT));
        c.setGuardianName(blankToNull(req.guardianName()));
        c.setGoodType(req.goodType());
        c.setClaimedAmount(req.claimedAmount());
        c.setGoodDescription(req.goodDescription().strip());
        c.setComplaintType(req.complaintType());
        c.setDetail(req.detail().strip());
        c.setConsumerRequest(req.consumerRequest().strip());
        c.setPrivacyAcceptedAt(now);
        Complaint saved = repository.save(c);

        CreatedComplaintResponse response = new CreatedComplaintResponse(saved.getCode(), number, year,
                now.atZoneSameInstant(ComplaintPdfService.LIMA).toLocalDate(), token, COPY_PATH + token);
        return new Created(saved.getId(), response);
    }

    /** La copia solo se entrega con el token aleatorio de ese reclamo; no hay forma de listar ni adivinar otros. */
    @Transactional(readOnly = true)
    public Complaint findByCopyToken(String token) {
        return repository.findByCopyTokenHash(hash(token))
                .orElseThrow(() -> new ResourceNotFoundException("Copia no encontrada"));
    }

    public record Created(java.util.UUID id, CreatedComplaintResponse response) {
    }

    static String normalizeDocument(CreateComplaintRequest req) {
        String number = req.documentNumber().strip();
        return req.documentType() == DocumentType.CE ? number.toUpperCase(Locale.ROOT) : number;
    }

    static String hash(String token) {
        try {
            byte[] d = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(d);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(ex);
        }
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.strip();
    }
}
