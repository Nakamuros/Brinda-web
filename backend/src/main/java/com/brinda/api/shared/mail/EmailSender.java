package com.brinda.api.shared.mail;

/**
 * Envío de correo transaccional. Hoy solo existe {@link NoopEmailSender} (no envía nada).
 *
 * <p>Implementación real (pendiente de que exista el dominio, NO conectada): un bean {@code @Component} que
 * llame a Resend (u otro servicio) por HTTPS con {@code java.net.http.HttpClient}, con tiempos de espera cortos,
 * la clave solo en una variable de entorno ({@code RESEND_API_KEY}) y remitente de un dominio con SPF, DKIM y DMARC
 * en Cloudflare. Debe devolver {@link SendResult#SENT}, lanzar {@link EmailSendException} si el servicio falla y
 * tener {@code enabled()} verdadero. Al registrarse, {@link NoopEmailSender} se retira solo (es
 * {@code @ConditionalOnMissingBean}). Nunca registrar destinatario, DNI ni teléfono en logs: solo
 * {@link EmailMessage#reference()}.
 */
public interface EmailSender {

    /** Falso en la implementación de desarrollo: los reintentos no corren hasta que haya un envío real. */
    boolean enabled();

    SendResult send(EmailMessage message) throws EmailSendException;
}
