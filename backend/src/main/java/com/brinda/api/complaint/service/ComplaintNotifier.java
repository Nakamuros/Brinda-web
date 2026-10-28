package com.brinda.api.complaint.service;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.EmailDelivery;
import com.brinda.api.complaint.repository.ComplaintRepository;
import com.brinda.api.shared.mail.EmailMessage;
import com.brinda.api.shared.mail.EmailSender;
import com.brinda.api.shared.mail.SendResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Clock;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.function.Function;

/**
 * Correos del reclamo (copia al consumidor y aviso a Lucía), siempre DESPUÉS de guardarlo y fuera de su transacción.
 * Si falla, el reclamo no se pierde: el envío queda FAILED y el job de reintento lo vuelve a intentar.
 * En logs solo va el id del reclamo, nunca correo, DNI ni teléfono.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ComplaintNotifier {

    /** Espera entre reintentos: crece con los intentos (5 min, 10 min, 15 min…). */
    private static final Duration BACKOFF_STEP = Duration.ofMinutes(5);

    private final ComplaintRepository repository;
    private final ComplaintPdfService pdf;
    private final EmailSender sender;
    private final ComplaintProperties props;
    private final TransactionTemplate tx;
    private final Clock clock;

    /** Nunca lanza: cualquier error se registra y deja el estado para reintento. */
    public void dispatch(UUID id) {
        try {
            Complaint c = tx.execute(s -> repository.findById(id).orElse(null));
            if (c == null) {
                return;
            }
            byte[] pdfBytes = null;
            if (due(c.getConsumerEmailDelivery())) {
                pdfBytes = pdf.render(c);
                deliver(id, true, ComplaintEmailTemplates.consumerCopy(c, props, pdfBytes));
            }
            if (due(c.getOwnerEmailDelivery())) {
                if (props.ownerEmail() == null || props.ownerEmail().isBlank()) {
                    log.info("Aviso a la dueña pendiente: COMPLAINTS_OWNER_EMAIL vacío. Reclamo: {}", id);
                } else {
                    pdfBytes = pdfBytes != null ? pdfBytes : pdf.render(c);
                    deliver(id, false, ComplaintEmailTemplates.ownerNotice(c, props, pdfBytes));
                }
            }
        } catch (RuntimeException ex) {
            log.error("No se pudo preparar el correo del reclamo {} ({})", id, ex.getClass().getSimpleName());
        }
    }

    private void deliver(UUID id, boolean consumer, EmailMessage message) {
        Function<Complaint, EmailDelivery> pick = consumer ? Complaint::getConsumerEmailDelivery
                : Complaint::getOwnerEmailDelivery;
        SendResult result = null;
        boolean failed = false;
        try {
            result = sender.send(message);
        } catch (Exception ex) {
            failed = true;
            log.warn("Falló el correo del reclamo {} ({})", id, ex.getClass().getSimpleName());
        }
        if (result == SendResult.SKIPPED) {
            return; // sin servicio de correo: sigue PENDING, sin contar intento
        }
        boolean fail = failed;
        tx.executeWithoutResult(s -> repository.findById(id).ifPresent(c -> {
            OffsetDateTime now = OffsetDateTime.now(clock);
            EmailDelivery d = pick.apply(c);
            if (fail) {
                d.markFailed(now);
            } else {
                d.markSent(now);
            }
        }));
    }

    /** Pendiente, o fallido con intentos disponibles y pasada la espera. */
    public boolean due(EmailDelivery d) {
        if (!d.needsSending(props.maxEmailAttempts())) {
            return false;
        }
        return d.getLastAttemptAt() == null
                || d.getLastAttemptAt().plus(BACKOFF_STEP.multipliedBy(Math.max(1, d.getAttempts())))
                .isBefore(OffsetDateTime.now(clock));
    }
}
