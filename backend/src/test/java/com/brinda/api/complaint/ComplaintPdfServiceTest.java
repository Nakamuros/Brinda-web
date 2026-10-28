package com.brinda.api.complaint;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.GoodType;
import com.brinda.api.complaint.service.ComplaintPdfService;
import com.brinda.api.shared.crypto.CryptoProperties;
import com.brinda.api.shared.crypto.DniCipher;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ComplaintPdfServiceTest {

    private final DniCipher cipher = new DniCipher(new CryptoProperties(Base64.getEncoder().encodeToString(new byte[32])));
    private final ComplaintPdfService pdf = new ComplaintPdfService(cipher);

    private Complaint sample() {
        Complaint c = new Complaint();
        c.setComplaintYear((short) 2026);
        c.setComplaintNumber(123);
        c.setCode("LR-2026-000123");
        c.setFiledAt(OffsetDateTime.parse("2026-10-28T15:00:00Z"));
        c.setConsumerName("Ana Núñez Pérez");
        c.setDocumentType(DocumentType.DNI);
        c.setDocumentEncrypted(cipher.encrypt("12345678"));
        c.setConsumerAddress("Av. Larco 123, Miraflores");
        c.setConsumerPhone("987654321");
        c.setConsumerEmail("ana@correo.pe");
        c.setGoodType(GoodType.PRODUCT);
        c.setClaimedAmount(new BigDecimal("45.50"));
        c.setGoodDescription("Whisky Reserva");
        c.setComplaintType(ComplaintType.CLAIM);
        c.setDetail("La botella llegó abierta.");
        c.setConsumerRequest("Quiero el cambio del producto.");
        return c;
    }

    private String text(byte[] bytes) throws Exception {
        try (PDDocument doc = Loader.loadPDF(bytes)) {
            return new PDFTextStripper().getText(doc);
        }
    }

    @Test
    void rellenaLaHojaOficialYLaEntregaAplanada() throws Exception {
        byte[] out = pdf.render(sample());
        try (PDDocument doc = Loader.loadPDF(out)) {
            assertEquals(1, doc.getNumberOfPages());
            // aplanado: ya no queda formulario editable
            assertTrue(doc.getDocumentCatalog().getAcroForm() == null
                    || doc.getDocumentCatalog().getAcroForm().getFields().isEmpty());
        }
        String t = text(out);
        assertTrue(t.contains("Ana Núñez Pérez"), t);
        assertTrue(t.contains("DNI 12345678"));
        assertTrue(t.contains("000123"));
        assertTrue(t.contains("2026"));
        assertTrue(t.contains("28/10/2026"));
        assertTrue(t.contains("La botella llegó abierta."));
        assertTrue(t.contains("BRINDA PERU SAC") && t.contains("20616579607"));
        assertTrue(t.contains("S/ 45.50"));
    }

    @Test
    void conRespuestaIncluyeLaSeccionCuatro() throws Exception {
        Complaint c = sample();
        c.setStatus(ComplaintStatus.ANSWERED);
        c.setResponseDate(LocalDate.of(2026, 11, 5));
        c.setResponseText("Se repondrá el producto.");
        String t = text(pdf.render(c));
        assertTrue(t.contains("05/11/2026"));
        assertTrue(t.contains("Se repondrá el producto."));
    }

    @Test
    void textosLargosYCaracteresRarosNoRompenLaHoja() throws Exception {
        Complaint c = sample();
        c.setDetail(("Texto largo con emoji 😀 y tabs\t. ").repeat(60).substring(0, 2000));
        c.setConsumerRequest("Línea 1\nLínea 2\r\nLínea 3".repeat(20));
        assertTrue(pdf.render(c).length > 1000);
    }

    @Test
    void limpiaCaracteresQueHelveticaNoDibuja() {
        assertEquals("Año ?", ComplaintPdfService.clean("Año 中", false));
        assertEquals("a b", ComplaintPdfService.clean("a\nb", false));
        assertEquals("a\nb", ComplaintPdfService.clean("a\r\nb", true));
        assertEquals("", ComplaintPdfService.clean(null, false));
    }

    @Test
    void elTamanoDeLetraBajaCuandoElTextoNoCabe() {
        assertEquals(10.0, ComplaintPdfService.fitFontSize("corto", 530.0, 94.0));
        assertTrue(ComplaintPdfService.fitFontSize("x".repeat(2000), 530.0, 94.0) < 8.0);
    }
}
