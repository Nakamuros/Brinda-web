package com.brinda.api.shared.mail;

public enum SendResult {
    /** El proveedor aceptó el mensaje. */
    SENT,
    /** No se envió porque no hay servicio de correo configurado (el estado queda PENDING, sin contar intento). */
    SKIPPED
}
