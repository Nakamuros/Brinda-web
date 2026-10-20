package com.brinda.api.shared.exception;

/** Mensaje único para cualquier fallo de login: no revela si el usuario existe, está bloqueado o inactivo. */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Credenciales inválidas");
    }
}
