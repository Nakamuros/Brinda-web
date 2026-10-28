package com.brinda.api.complaint.dto;

import com.brinda.api.complaint.model.EmailDelivery;
import com.brinda.api.complaint.model.EmailStatus;

import java.time.OffsetDateTime;

public record EmailInfo(EmailStatus status, int attempts, OffsetDateTime lastAttemptAt, OffsetDateTime sentAt) {

    public static EmailInfo from(EmailDelivery d) {
        return new EmailInfo(d.getStatus(), d.getAttempts(), d.getLastAttemptAt(), d.getSentAt());
    }
}
