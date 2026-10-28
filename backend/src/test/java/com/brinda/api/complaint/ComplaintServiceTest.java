package com.brinda.api.complaint;

import com.brinda.api.complaint.dto.CreateComplaintRequest;
import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.GoodType;
import com.brinda.api.complaint.repository.ComplaintNumberGenerator;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.complaint.service.ComplaintService;
import com.brinda.api.shared.crypto.CryptoProperties;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ComplaintServiceTest {

    private final ComplaintRepository repository = mock(ComplaintRepository.class);
    private final ComplaintNumberGenerator numbers = mock(ComplaintNumberGenerator.class);
    private final DniCipher cipher = new DniCipher(new CryptoProperties(Base64.getEncoder().encodeToString(new byte[32])));
    // 2026-01-01 02:00 UTC = 2025-12-31 21:00 en Lima: el año del correlativo es el de Lima
    private final Clock clock = Clock.fixed(Instant.parse("2026-01-01T02:00:00Z"), ZoneOffset.UTC);
    private final ComplaintService service = new ComplaintService(repository, numbers, cipher, clock);

    private CreateComplaintRequest request() {
        return new CreateComplaintRequest("Ana Pérez", DocumentType.CE, "a12345678", "Av. Larco 123", "987654321",
                "ANA@Correo.pe", " ", GoodType.PRODUCT, new BigDecimal("10.00"), "Whisky", ComplaintType.CLAIM,
                "Detalle", "Pedido", true, null);
    }

    private Complaint saved() {
        when(numbers.next(2025)).thenReturn(7);
        when(repository.save(any(Complaint.class))).thenAnswer(i -> {
            Complaint c = i.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });
        service.create(request());
        ArgumentCaptor<Complaint> cap = ArgumentCaptor.forClass(Complaint.class);
        verify(repository).save(cap.capture());
        return cap.getValue();
    }

    @Test
    void usaElAnioDeLimaYGeneraElCodigo() {
        Complaint c = saved();
        assertEquals(2025, c.getComplaintYear());
        assertEquals(7, c.getComplaintNumber());
        assertEquals("LR-2025-000007", c.getCode());
    }

    @Test
    void cifraElDocumentoYNormalizaDatos() {
        Complaint c = saved();
        assertNotEquals("A12345678", c.getDocumentEncrypted());
        assertEquals("A12345678", cipher.decrypt(c.getDocumentEncrypted()));
        assertEquals("ana@correo.pe", c.getConsumerEmail());
        assertEquals(null, c.getGuardianName());
    }

    @Test
    void guardaSoloElHashDelTokenYElTokenNoSeAdivina() {
        when(numbers.next(2025)).thenReturn(1);
        when(repository.save(any(Complaint.class))).thenAnswer(i -> {
            Complaint c = i.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });
        ComplaintService.Created a = service.create(request());
        ComplaintService.Created b = service.create(request());
        String ta = a.response().copyToken();
        assertTrue(ta.length() >= 43);
        assertNotEquals(ta, b.response().copyToken());
        assertTrue(a.response().copyPath().endsWith(ta));
        ArgumentCaptor<Complaint> cap = ArgumentCaptor.forClass(Complaint.class);
        verify(repository, org.mockito.Mockito.times(2)).save(cap.capture());
        assertFalse(cap.getAllValues().get(0).getCopyTokenHash().contains(ta));
        assertEquals(64, cap.getAllValues().get(0).getCopyTokenHash().length());
    }

    @Test
    void laCopiaSoloSaleConSuToken() {
        when(repository.findByCopyTokenHash(anyString())).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.findByCopyToken("token-ajeno"));
    }
}
