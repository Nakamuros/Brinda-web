package com.brinda.api.shared.mail;

/** Falla del servicio de correo. El mensaje no debe contener datos personales. */
public class EmailSendException extends Exception {
    public EmailSendException(String message) {
        super(message);
    }

    public EmailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}
