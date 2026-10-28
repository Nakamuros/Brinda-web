package com.brinda.api.complaint.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

/** Seguimiento de un correo: el reclamo ya está guardado, esto solo dice si el aviso salió o hay que reintentar. */
@Getter
@NoArgsConstructor
@Embeddable
public class EmailDelivery {

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private EmailStatus status = EmailStatus.PENDING;

    @Column(name = "attempts", nullable = false)
    private int attempts;

    @Column(name = "last_attempt_at")
    private OffsetDateTime lastAttemptAt;

    @Column(name = "sent_at")
    private OffsetDateTime sentAt;

    public void markSent(OffsetDateTime now) {
        attempts++;
        lastAttemptAt = now;
        sentAt = now;
        status = EmailStatus.SENT;
    }

    public void markFailed(OffsetDateTime now) {
        attempts++;
        lastAttemptAt = now;
        status = EmailStatus.FAILED;
    }

    /** Pendiente de enviar, o fallido con intentos disponibles. */
    public boolean needsSending(int maxAttempts) {
        return status == EmailStatus.PENDING || (status == EmailStatus.FAILED && attempts < maxAttempts);
    }
}
