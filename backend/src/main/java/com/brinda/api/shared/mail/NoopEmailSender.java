package com.brinda.api.shared.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

/** Implementación de desarrollo: no envía nada y registra solo la referencia (id del reclamo). */
@Slf4j
@Component
@ConditionalOnMissingBean(value = EmailSender.class, ignored = NoopEmailSender.class)
public class NoopEmailSender implements EmailSender {

    @Override
    public boolean enabled() {
        return false;
    }

    @Override
    public SendResult send(EmailMessage message) {
        log.info("Correo no enviado (sin servicio configurado). Referencia: {}", message.reference());
        return SendResult.SKIPPED;
    }
}
