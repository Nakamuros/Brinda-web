package com.brinda.api.shared.mail;

import java.util.List;

/** {@code reference}: id interno (p. ej. del reclamo); es lo único que puede registrarse en logs. */
public record EmailMessage(String reference, String to, String subject, String textBody, List<Attachment> attachments) {

    public record Attachment(String fileName, String contentType, byte[] content) {
    }
}
