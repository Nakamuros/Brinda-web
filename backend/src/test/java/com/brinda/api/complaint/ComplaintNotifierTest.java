package com.brinda.api.complaint;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.EmailStatus;
import com.brinda.api.complaint.model.GoodType;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.complaint.service.ComplaintNotifier;
import com.brinda.api.complaint.service.ComplaintPdfService;
import com.brinda.api.complaint.service.ComplaintProperties;
import com.brinda.api.shared.crypto.CryptoProperties;
import com.brinda.api.shared.crypto.DniCipher;
import com.brinda.api.shared.mail.EmailMessage;
import com.brinda.api.shared.mail.EmailSendException;
import com.brinda.api.shared.mail.EmailSender;
import com.brinda.api.shared.mail.NoopEmailSender;
import com.brinda.api.shared.mail.SendResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ComplaintNotifierTest {

    private final ComplaintRepository repository = mock(ComplaintRepository.class);
    private final DniCipher cipher = new DniCipher(new CryptoProperties(Base64.getEncoder().encodeToString(new byte[32])));
    private final ComplaintPdfService pdf = new ComplaintPdfService(cipher);
    private final TransactionTemplate tx = mock(TransactionTemplate.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-10-28T15:00:00Z"), ZoneOffset.UTC);
    private final UUID id = UUID.randomUUID();
    private Complaint complaint;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        complaint = new Complaint();
        complaint.setId(id);
        complaint.setComplaintYear((short) 2026);
        complaint.setComplaintNumber(1);
        complaint.setCode("LR-2026-000001");
        complaint.setFiledAt(OffsetDateTime.parse("2026-10-28T14:00:00Z"));
        complaint.setConsumerName("Ana");
        complaint.setDocumentType(DocumentType.DNI);
        complaint.setDocumentEncrypted(cipher.encrypt("12345678"));
        complaint.setConsumerAddress("Dir");
        complaint.setConsumerPhone("987654321");
        complaint.setConsumerEmail("ana@correo.pe");
        complaint.setGoodType(GoodType.PRODUCT);
        complaint.setClaimedAmount(BigDecimal.TEN);
        complaint.setGoodDescription("Whisky");
        complaint.setComplaintType(ComplaintType.CLAIM);
        complaint.setDetail("Detalle");
        complaint.setConsumerRequest("Pedido");
        when(repository.findById(id)).thenReturn(Optional.of(complaint));
        when(tx.execute(any())).thenAnswer(i -> ((TransactionCallback<Object>) i.getArgument(0)).doInTransaction(null));
        doAnswer(i -> {
            ((Consumer<Object>) i.getArgument(0)).accept(null);
            return null;
        }).when(tx).executeWithoutResult(any());
    }

    private ComplaintNotifier notifier(EmailSender sender, String owner) {
        return new ComplaintNotifier(repository, pdf, sender, new ComplaintProperties("BRINDA PERU SAC", "20616579607",
                owner, 3, 15), tx, clock);
    }

    private static class Recording implements EmailSender {
        final List<EmailMessage> sent = new ArrayList<>();
        boolean failing;

        @Override
        public boolean enabled() {
            return true;
        }

        @Override
        public SendResult send(EmailMessage m) throws EmailSendException {
            if (failing) {
                throw new EmailSendException("caído");
            }
            sent.add(m);
            return SendResult.SENT;
        }
    }

    @Test
    void sinServicioDeCorreoQuedaPendienteSinContarIntentos() {
        notifier(new NoopEmailSender(), "lucia@correo.pe").dispatch(id);
        assertEquals(EmailStatus.PENDING, complaint.getConsumerEmailDelivery().getStatus());
        assertEquals(0, complaint.getConsumerEmailDelivery().getAttempts());
        assertEquals(EmailStatus.PENDING, complaint.getOwnerEmailDelivery().getStatus());
    }

    @Test
    void enviaCopiaConPdfAlConsumidorYAvisoALaDuenaSinDatosPersonales() {
        Recording sender = new Recording();
        notifier(sender, "lucia@correo.pe").dispatch(id);
        assertEquals(2, sender.sent.size());
        EmailMessage toConsumer = sender.sent.get(0);
        assertEquals("ana@correo.pe", toConsumer.to());
        assertTrue(toConsumer.textBody().contains("LR-2026-000001"));
        assertEquals("application/pdf", toConsumer.attachments().get(0).contentType());
        EmailMessage toOwner = sender.sent.get(1);
        assertEquals("lucia@correo.pe", toOwner.to());
        assertFalse(toOwner.textBody().contains("12345678"));
        assertFalse(toOwner.textBody().contains("987654321"));
        assertEquals(EmailStatus.SENT, complaint.getConsumerEmailDelivery().getStatus());
        assertEquals(EmailStatus.SENT, complaint.getOwnerEmailDelivery().getStatus());
        assertNotNull(complaint.getConsumerEmailDelivery().getSentAt());
    }

    @Test
    void siElCorreoFallaElReclamoSigueYQuedaFailedParaReintentar() {
        Recording sender = new Recording();
        sender.failing = true;
        notifier(sender, "lucia@correo.pe").dispatch(id);
        assertEquals(EmailStatus.FAILED, complaint.getConsumerEmailDelivery().getStatus());
        assertEquals(1, complaint.getConsumerEmailDelivery().getAttempts());
        assertEquals(EmailStatus.FAILED, complaint.getOwnerEmailDelivery().getStatus());
    }

    @Test
    void esperaAntesDeReintentarYSeDetieneAlLlegarAlMaximo() {
        Recording sender = new Recording();
        sender.failing = true;
        ComplaintNotifier n = notifier(sender, "");
        n.dispatch(id);                                    // intento 1: FAILED
        assertEquals(1, complaint.getConsumerEmailDelivery().getAttempts());
        n.dispatch(id);                                    // el mismo instante: aún en espera
        assertEquals(1, complaint.getConsumerEmailDelivery().getAttempts());
        assertFalse(n.due(complaint.getConsumerEmailDelivery()));
        // pasada la espera
        ReflectionHelper.setLastAttempt(complaint.getConsumerEmailDelivery(), OffsetDateTime.parse("2026-10-28T14:00:00Z"));
        n.dispatch(id);
        assertEquals(2, complaint.getConsumerEmailDelivery().getAttempts());
    }

    @Test
    void sinCorreoDeLaDuenaNoSeIntentaElAviso() {
        Recording sender = new Recording();
        notifier(sender, "").dispatch(id);
        assertEquals(1, sender.sent.size()); // solo la copia al consumidor
        assertEquals(EmailStatus.PENDING, complaint.getOwnerEmailDelivery().getStatus());
        assertEquals(0, complaint.getOwnerEmailDelivery().getAttempts());
    }
}
