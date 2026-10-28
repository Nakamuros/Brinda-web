package com.brinda.api.complaint.service;

import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.complaint.dto.ComplaintCountsResponse;
import com.brinda.api.complaint.dto.ComplaintDetailResponse;
import com.brinda.api.complaint.dto.ComplaintSummaryResponse;
import com.brinda.api.complaint.dto.DeadlineInfo;
import com.brinda.api.complaint.dto.RespondComplaintRequest;
import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.Clock;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Gestión de reclamos desde el panel. El documento (DNI/CE) se descifra solo en el detalle y en la copia en PDF, y
 * cada lectura queda en la auditoría (quién, cuándo, desde qué IP) SIN el documento. Nada se borra.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintAdminService {

    private static final int MAX_SCAN = 1000;

    private final ComplaintRepository repository;
    private final ComplaintDeadlines deadlines;
    private final ComplaintPdfService pdf;
    private final DniCipher cipher;
    private final AuditService audit;
    private final Clock clock;

    /**
     * Lista sin datos personales. Con {@code deadline} (SOON u OVERDUE) solo trae los pendientes en ese estado.
     * Los pendientes salen del más antiguo al más reciente (los más urgentes primero); el resto, del más reciente.
     */
    @Transactional(readOnly = true)
    public PageResponse<ComplaintSummaryResponse> list(ComplaintStatus status, ComplaintType type, String q,
                                                       DeadlineInfo.Level deadline, int page, int size) {
        int safeSize = Math.min(Math.max(size, 1), 50);
        int safePage = Math.max(page, 0);
        Sort sort = Sort.by(status == ComplaintStatus.RECEIVED || deadline != null ? Sort.Direction.ASC
                : Sort.Direction.DESC, "filedAt");
        Specification<Complaint> spec = filter(deadline != null ? ComplaintStatus.RECEIVED : status, type, q);

        if (deadline == null) {
            var result = repository.findAll(spec, PageRequest.of(safePage, safeSize, sort));
            return PageResponse.of(result, c -> ComplaintSummaryResponse.from(c, deadlines.of(c)));
        }
        if (deadline != DeadlineInfo.Level.SOON && deadline != DeadlineInfo.Level.OVERDUE) {
            throw new BusinessRuleException("El filtro de plazo admite SOON u OVERDUE");
        }
        // El plazo se calcula en memoria: se recorren los pendientes (pocos) y se pagina a mano.
        List<ComplaintSummaryResponse> all = repository
                .findAll(spec, PageRequest.of(0, MAX_SCAN, sort)).getContent().stream()
                .map(c -> ComplaintSummaryResponse.from(c, deadlines.of(c)))
                .filter(s -> s.deadline().level() == deadline)
                .toList();
        int from = Math.min(safePage * safeSize, all.size());
        int to = Math.min(from + safeSize, all.size());
        Pageable pageable = PageRequest.of(safePage, safeSize);
        var pageOf = new PageImpl<>(all.subList(from, to), pageable, all.size());
        return new PageResponse<>(pageOf.getContent(), safePage, safeSize, all.size(), pageOf.getTotalPages());
    }

    @Transactional(readOnly = true)
    public ComplaintCountsResponse counts() {
        long soon = 0;
        long overdue = 0;
        List<Complaint> pending = repository.findAll(filter(ComplaintStatus.RECEIVED, null, null),
                PageRequest.of(0, MAX_SCAN)).getContent();
        for (Complaint c : pending) {
            DeadlineInfo.Level level = deadlines.of(c).level();
            if (level == DeadlineInfo.Level.OVERDUE) {
                overdue++;
            } else if (level == DeadlineInfo.Level.SOON) {
                soon++;
            }
        }
        return new ComplaintCountsResponse(repository.countByStatus(ComplaintStatus.RECEIVED), soon, overdue);
    }

    /** Muestra el documento descifrado: deja huella (usuario, hora e IP) sin guardar el documento. */
    public ComplaintDetailResponse detail(UUID id, UUID actor, String ip) {
        Complaint c = find(id);
        audit.record(actor, "COMPLAINT_VIEW", "complaints", c.getCode(), ip);
        return ComplaintDetailResponse.from(c, cipher.decrypt(c.getDocumentEncrypted()), deadlines.of(c));
    }

    /** La hoja en PDF para el panel (incluye el documento): también auditada. */
    public PdfFile pdf(UUID id, UUID actor, String ip) {
        Complaint c = find(id);
        audit.record(actor, "COMPLAINT_PDF", "complaints", c.getCode(), ip);
        return new PdfFile("hoja-reclamacion-" + c.getCode() + ".pdf", pdf.render(c));
    }

    /**
     * Registra la respuesta (sección 4) y pasa el reclamo a ANSWERED. Una vez respondido no se edita: la hoja y su
     * respuesta son un registro que se conserva (corregirlo, si hace falta, lo decide el asesor).
     */
    public ComplaintDetailResponse respond(UUID id, RespondComplaintRequest req, UUID actor, String ip) {
        Complaint c = repository.lockById(id).orElseThrow(() -> new ResourceNotFoundException("Reclamo no encontrado"));
        if (c.getStatus() == ComplaintStatus.ANSWERED) {
            throw new BusinessRuleException("El reclamo ya fue respondido");
        }
        var filedOn = c.getFiledAt().atZoneSameInstant(ComplaintPdfService.LIMA).toLocalDate();
        if (req.responseDate().isAfter(deadlines.today())) {
            throw new BusinessRuleException("La fecha de comunicación no puede ser futura");
        }
        if (req.responseDate().isBefore(filedOn)) {
            throw new BusinessRuleException("La fecha de comunicación no puede ser anterior a la del reclamo");
        }
        ComplaintStatus before = c.getStatus();
        c.setResponseText(req.responseText().strip());
        c.setResponseDate(req.responseDate());
        c.setRespondedBy(actor);
        c.setRespondedAt(OffsetDateTime.now(clock));
        c.setStatus(ComplaintStatus.ANSWERED);
        audit.record(actor, "COMPLAINT_RESPOND", "complaints", c.getCode(), ip,
                "status " + before + " -> " + c.getStatus() + ", fecha " + req.responseDate());
        return ComplaintDetailResponse.from(c, cipher.decrypt(c.getDocumentEncrypted()), deadlines.of(c));
    }

    private Complaint find(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reclamo no encontrado"));
    }

    private static Specification<Complaint> filter(ComplaintStatus status, ComplaintType type, String q) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            if (status != null) {
                p.add(cb.equal(root.get("status"), status));
            }
            if (type != null) {
                p.add(cb.equal(root.get("complaintType"), type));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + q.strip().toLowerCase(Locale.ROOT).replace("%", "").replace("_", "") + "%";
                p.add(cb.or(cb.like(cb.lower(root.get("code")), like),
                        cb.like(cb.lower(root.get("consumerName")), like)));
            }
            return cb.and(p.toArray(Predicate[]::new));
        };
    }

    public record PdfFile(String fileName, byte[] bytes) {
    }
}
