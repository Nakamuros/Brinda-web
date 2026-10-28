package com.brinda.api.complaint;

import com.brinda.api.complaint.dto.ComplaintDetailResponse;
import com.brinda.api.complaint.dto.ComplaintSummaryResponse;
import com.brinda.api.complaint.dto.DeadlineInfo;
import com.brinda.api.complaint.dto.RespondComplaintRequest;
import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.GoodType;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.complaint.service.BusinessDays;
import com.brinda.api.complaint.service.ComplaintAdminService;
import com.brinda.api.complaint.service.ComplaintDeadlines;
import com.brinda.api.complaint.service.ComplaintPdfService;
import com.brinda.api.complaint.service.ComplaintProperties;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.crypto.CryptoProperties;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ComplaintAdminTest {

    private static final String DNI = "12345678";

    // Reclamo del miércoles 2026-10-28 (Lima) → vence el miércoles 2026-11-18 (15 días hábiles)
    private static final OffsetDateTime FILED = OffsetDateTime.parse("2026-10-28T15:00:00Z");

    private final DniCipher cipher = spy(new DniCipher(new CryptoProperties(Base64.getEncoder().encodeToString(new byte[32]))));
    private final ComplaintRepository repository = mock(ComplaintRepository.class);
    private final AuditService audit = mock(AuditService.class);
    private final ComplaintProperties props = new ComplaintProperties("BRINDA PERU SAC", "20616579607", "", 5, 15);
    private final UUID actor = UUID.randomUUID();
    private final UUID id = UUID.randomUUID();
    private final Complaint complaint = sample();

    private Complaint sample() {
        Complaint c = new Complaint();
        c.setId(id);
        c.setComplaintYear((short) 2026);
        c.setComplaintNumber(5);
        c.setCode("LR-2026-000005");
        c.setFiledAt(FILED);
        c.setConsumerName("Ana Pérez");
        c.setDocumentType(DocumentType.DNI);
        c.setDocumentEncrypted(cipher.encrypt(DNI));
        c.setConsumerAddress("Av. Larco 123");
        c.setConsumerPhone("987654321");
        c.setConsumerEmail("ana@correo.pe");
        c.setGoodType(GoodType.PRODUCT);
        c.setClaimedAmount(BigDecimal.TEN);
        c.setGoodDescription("Whisky");
        c.setComplaintType(ComplaintType.CLAIM);
        c.setDetail("Detalle");
        c.setConsumerRequest("Pedido");
        return c;
    }

    private ComplaintAdminService service(String now) {
        Clock clock = Clock.fixed(Instant.parse(now), ZoneOffset.UTC);
        ComplaintDeadlines deadlines = new ComplaintDeadlines(props, clock);
        when(repository.findById(id)).thenReturn(Optional.of(complaint));
        when(repository.lockById(id)).thenReturn(Optional.of(complaint));
        return new ComplaintAdminService(repository, deadlines, new ComplaintPdfService(cipher), cipher, audit, clock);
    }

    @SuppressWarnings("unchecked")
    private void listReturns(Complaint... items) {
        Page<Complaint> page = new PageImpl<>(List.of(items));
        when(repository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
    }

    // ---- días hábiles ----

    @Test
    void sumaDiasHabilesSaltandoFinesDeSemana() {
        assertEquals(LocalDate.of(2026, 11, 18), BusinessDays.add(LocalDate.of(2026, 10, 28), 15));
        assertEquals(LocalDate.of(2026, 11, 2), BusinessDays.add(LocalDate.of(2026, 10, 30), 1)); // viernes → lunes
        assertEquals(LocalDate.of(2026, 11, 2), BusinessDays.add(LocalDate.of(2026, 10, 31), 1)); // sábado → lunes
    }

    @Test
    void cuentaDiasHabilesConSigno() {
        LocalDate fri = LocalDate.of(2026, 10, 30);
        LocalDate mon = LocalDate.of(2026, 11, 2);
        assertEquals(0, BusinessDays.between(fri, fri));
        assertEquals(1, BusinessDays.between(fri, mon));
        assertEquals(-1, BusinessDays.between(mon, fri));
        assertEquals(5, BusinessDays.between(LocalDate.of(2026, 10, 26), LocalDate.of(2026, 11, 2)));
    }

    @Test
    void elPlazoSeMarcaPorVencerYVencido() {
        ComplaintDeadlines d = new ComplaintDeadlines(props, Clock.fixed(Instant.parse("2026-10-29T15:00:00Z"), ZoneOffset.UTC));
        assertEquals(DeadlineInfo.Level.ON_TIME, d.of(complaint).level());
        assertEquals(LocalDate.of(2026, 11, 18), d.of(complaint).dueOn());

        d = new ComplaintDeadlines(props, Clock.fixed(Instant.parse("2026-11-13T15:00:00Z"), ZoneOffset.UTC)); // vie
        assertEquals(DeadlineInfo.Level.SOON, d.of(complaint).level());
        assertEquals(3, d.of(complaint).businessDaysLeft());

        d = new ComplaintDeadlines(props, Clock.fixed(Instant.parse("2026-11-18T15:00:00Z"), ZoneOffset.UTC)); // vence hoy
        assertEquals(DeadlineInfo.Level.SOON, d.of(complaint).level());
        assertEquals(0, d.of(complaint).businessDaysLeft());

        d = new ComplaintDeadlines(props, Clock.fixed(Instant.parse("2026-11-19T15:00:00Z"), ZoneOffset.UTC));
        assertEquals(DeadlineInfo.Level.OVERDUE, d.of(complaint).level());
        assertEquals(-1, d.of(complaint).businessDaysLeft());
    }

    @Test
    void usaLaFechaDeLimaNoLaDeUtc() {
        // 2026-11-19 03:00 UTC = 2026-11-18 22:00 en Lima: todavía es el último día
        ComplaintDeadlines d = new ComplaintDeadlines(props, Clock.fixed(Instant.parse("2026-11-19T03:00:00Z"), ZoneOffset.UTC));
        assertEquals(DeadlineInfo.Level.SOON, d.of(complaint).level());
    }

    // ---- lista: sin datos personales ----

    @Test
    void laListaNoDescifraNiExponeElDocumento() throws Exception {
        ComplaintAdminService s = service("2026-10-29T15:00:00Z");
        listReturns(complaint);
        var page = s.list(null, null, null, null, 0, 20);
        assertEquals(1, page.content().size());
        verify(cipher, never()).decrypt(any());
        String json = new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(page);
        assertFalse(json.contains(DNI));
        assertFalse(json.contains("987654321"));
        assertFalse(json.contains("ana@correo.pe"));
        assertFalse(json.contains("Larco"));
        ComplaintSummaryResponse row = page.content().get(0);
        assertEquals("LR-2026-000005", row.code());
    }

    @Test
    void elFiltroDePlazoSoloTraeLosPendientesEnEseEstado() {
        ComplaintAdminService s = service("2026-11-19T15:00:00Z"); // vencido
        listReturns(complaint);
        assertEquals(1, s.list(null, null, null, DeadlineInfo.Level.OVERDUE, 0, 20).totalElements());
        assertEquals(0, s.list(null, null, null, DeadlineInfo.Level.SOON, 0, 20).totalElements());
        assertThrows(BusinessRuleException.class, () -> s.list(null, null, null, DeadlineInfo.Level.ON_TIME, 0, 20));
    }

    @Test
    void losContadoresSeparanPorVencerYVencidos() {
        ComplaintAdminService s = service("2026-11-19T15:00:00Z");
        listReturns(complaint);
        when(repository.countByStatus(ComplaintStatus.RECEIVED)).thenReturn(1L);
        var counts = s.counts();
        assertEquals(1, counts.pending());
        assertEquals(1, counts.overdue());
        assertEquals(0, counts.dueSoon());
    }

    // ---- detalle: descifra y audita sin guardar el documento ----

    @Test
    void elDetalleDescifraYDejaAuditoriaSinElDocumento() {
        ComplaintAdminService s = service("2026-10-29T15:00:00Z");
        ComplaintDetailResponse d = s.detail(id, actor, "10.0.0.1");
        assertEquals(DNI, d.documentNumber());
        verify(audit).record(eq(actor), eq("COMPLAINT_VIEW"), eq("complaints"), eq("LR-2026-000005"), eq("10.0.0.1"));
        // ningún argumento de la auditoría contiene el documento
        verify(audit, never()).record(any(), any(), any(), eq(DNI), any());
        verify(audit, never()).record(any(), any(), any(), any(), any(), org.mockito.ArgumentMatchers.contains(DNI));
    }

    @Test
    void elPdfDelPanelTambienQuedaAuditado() {
        ComplaintAdminService s = service("2026-10-29T15:00:00Z");
        var file = s.pdf(id, actor, "10.0.0.1");
        assertTrue(file.bytes().length > 1000);
        assertEquals("hoja-reclamacion-LR-2026-000005.pdf", file.fileName());
        verify(audit).record(eq(actor), eq("COMPLAINT_PDF"), eq("complaints"), eq("LR-2026-000005"), eq("10.0.0.1"));
    }

    // ---- respuesta ----

    @Test
    void respondeGuardaTextoFechaYEstadoYAudita() {
        ComplaintAdminService s = service("2026-11-05T15:00:00Z");
        ComplaintDetailResponse d = s.respond(id, new RespondComplaintRequest(" Se repone el producto. ",
                LocalDate.of(2026, 11, 5)), actor, "10.0.0.1");
        assertEquals(ComplaintStatus.ANSWERED, complaint.getStatus());
        assertEquals("Se repone el producto.", complaint.getResponseText());
        assertEquals(LocalDate.of(2026, 11, 5), complaint.getResponseDate());
        assertEquals(actor, complaint.getRespondedBy());
        assertEquals(DeadlineInfo.Level.ANSWERED, d.deadline().level());
        assertFalse(d.deadline().answeredLate());
        ArgumentCaptor<String> details = ArgumentCaptor.forClass(String.class);
        verify(audit).record(eq(actor), eq("COMPLAINT_RESPOND"), eq("complaints"), eq("LR-2026-000005"),
                eq("10.0.0.1"), details.capture());
        assertTrue(details.getValue().contains("RECEIVED -> ANSWERED"));
        assertFalse(details.getValue().contains(DNI));
    }

    @Test
    void noAceptaFechasFuturasNiAnterioresAlReclamo() {
        ComplaintAdminService s = service("2026-11-05T15:00:00Z");
        assertThrows(BusinessRuleException.class, () -> s.respond(id,
                new RespondComplaintRequest("ok", LocalDate.of(2026, 11, 6)), actor, "ip"));
        assertThrows(BusinessRuleException.class, () -> s.respond(id,
                new RespondComplaintRequest("ok", LocalDate.of(2026, 10, 27)), actor, "ip"));
        assertEquals(ComplaintStatus.RECEIVED, complaint.getStatus());
        assertNull(complaint.getResponseDate());
    }

    @Test
    void unReclamoRespondidoNoSeVuelveAResponder() {
        ComplaintAdminService s = service("2026-11-05T15:00:00Z");
        s.respond(id, new RespondComplaintRequest("ok", LocalDate.of(2026, 11, 5)), actor, "ip");
        assertThrows(BusinessRuleException.class, () -> s.respond(id,
                new RespondComplaintRequest("otra", LocalDate.of(2026, 11, 5)), actor, "ip"));
        assertEquals("ok", complaint.getResponseText());
    }

    @Test
    void marcaLaRespuestaTardia() {
        ComplaintAdminService s = service("2026-11-25T15:00:00Z");
        ComplaintDetailResponse d = s.respond(id, new RespondComplaintRequest("tarde", LocalDate.of(2026, 11, 24)),
                actor, "ip");
        assertTrue(d.deadline().answeredLate());
    }
}
