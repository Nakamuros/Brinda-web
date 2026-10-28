package com.brinda.api.complaint;

import com.brinda.api.complaint.dto.CreateComplaintRequest;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.GoodType;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CreateComplaintRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private CreateComplaintRequest base() {
        return build(DocumentType.DNI, "12345678", "Ana Pérez", "987654321", "ana@correo.pe", true, null);
    }

    private CreateComplaintRequest build(DocumentType type, String doc, String name, String phone, String email,
                                         boolean privacy, String website) {
        return new CreateComplaintRequest(name, type, doc, "Av. Larco 123", phone, email, null, GoodType.PRODUCT,
                new BigDecimal("45.50"), "Whisky", ComplaintType.CLAIM, "Detalle", "Pedido", privacy, website);
    }

    private Set<String> invalid(CreateComplaintRequest r) {
        return validator.validate(r).stream().map(v -> v.getPropertyPath().toString()).collect(Collectors.toSet());
    }

    @Test
    void unaHojaCompletaEsValida() {
        assertTrue(invalid(base()).isEmpty());
    }

    @Test
    void dniDebeTenerOchoDigitos() {
        assertTrue(invalid(build(DocumentType.DNI, "1234567a", "Ana", "987654321", "a@b.pe", true, null))
                .contains("documentNumber"));
        assertTrue(invalid(build(DocumentType.DNI, "123456789", "Ana", "987654321", "a@b.pe", true, null))
                .contains("documentNumber"));
    }

    @Test
    void ceAceptaOchoADoceAlfanumericos() {
        assertTrue(invalid(build(DocumentType.CE, "A12345678", "Ana", "987654321", "a@b.pe", true, null)).isEmpty());
        assertTrue(invalid(build(DocumentType.CE, "000123456789", "Ana", "987654321", "a@b.pe", true, null)).isEmpty());
        assertTrue(invalid(build(DocumentType.CE, "A123", "Ana", "987654321", "a@b.pe", true, null))
                .contains("documentNumber"));
        assertTrue(invalid(build(DocumentType.CE, "A12-345678", "Ana", "987654321", "a@b.pe", true, null))
                .contains("documentNumber"));
    }

    @Test
    void exigePrivacidadCorreoYTelefono() {
        assertTrue(invalid(build(DocumentType.DNI, "12345678", "Ana", "987654321", "a@b.pe", false, null))
                .contains("privacyAccepted"));
        assertTrue(invalid(build(DocumentType.DNI, "12345678", "Ana", "987654321", "no-es-correo", true, null))
                .contains("email"));
        assertTrue(invalid(build(DocumentType.DNI, "12345678", "Ana", "ab", "a@b.pe", true, null)).contains("phone"));
    }

    @Test
    void limitaLongitudes() {
        String largo = "x".repeat(2001);
        CreateComplaintRequest r = new CreateComplaintRequest("Ana", DocumentType.DNI, "12345678", "Dir", "987654321",
                "a@b.pe", null, GoodType.SERVICE, null, "d", ComplaintType.COMPLAINT, largo, "p", true, null);
        assertTrue(invalid(r).contains("detail"));
        assertTrue(invalid(new CreateComplaintRequest("Ana", DocumentType.DNI, "12345678", "Dir", "987654321",
                "a@b.pe", null, GoodType.SERVICE, new BigDecimal("-1"), "d", ComplaintType.COMPLAINT, "x", "p", true,
                null)).contains("claimedAmount"));
    }

    @Test
    void elMontoYElApoderadoSonOpcionales() {
        CreateComplaintRequest r = new CreateComplaintRequest("Ana", DocumentType.DNI, "12345678", "Dir", "987654321",
                "a@b.pe", null, GoodType.SERVICE, null, "d", ComplaintType.COMPLAINT, "x", "p", true, null);
        assertTrue(invalid(r).isEmpty());
    }

    @Test
    void detectaElHoneypot() {
        assertTrue(build(DocumentType.DNI, "12345678", "Ana", "987654321", "a@b.pe", true, "http://spam").isHoneypotFilled());
        assertFalse(base().isHoneypotFilled());
        assertEquals(0, invalid(base()).size());
    }
}
