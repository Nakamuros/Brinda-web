package com.brinda.api.shared.security;

import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Eventos de seguridad en el log (para alertas en Render). Todos llevan el prefijo "SECURITY".
 * Nunca registra cuerpo, cabeceras, usuario ni tokens: solo evento, método, ruta sin identificadores sensibles e IP.
 */
public final class SecurityEventLog {

    private static final Logger LOG = LoggerFactory.getLogger("SECURITY");
    private static final String COPY_PREFIX = "/api/v1/complaints/copy/";

    private SecurityEventLog() {
    }

    public static void unauthorized(HttpServletRequest request) {
        LOG.info("SECURITY unauthorized {} {} ip={}", request.getMethod(), safePath(request), ClientIp.of(request));
    }

    public static void forbidden(HttpServletRequest request) {
        LOG.warn("SECURITY forbidden {} {} ip={}", request.getMethod(), safePath(request), ClientIp.of(request));
    }

    public static void rateLimited(HttpServletRequest request) {
        LOG.warn("SECURITY rate_limited {} {} ip={}", request.getMethod(), safePath(request), ClientIp.of(request));
    }

    public static void loginFailed(String ip) {
        LOG.warn("SECURITY login_failed ip={}", ip);
    }

    public static void accountLocked(String userId, String ip) {
        LOG.warn("SECURITY account_locked user={} ip={}", userId, ip);
    }

    /** El token de la copia del reclamo viaja en la ruta: nunca va al log. */
    static String safePath(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri == null) {
            return "-";
        }
        String path = uri.startsWith(COPY_PREFIX) ? COPY_PREFIX + "*" : uri;
        return path.length() > 120 ? path.substring(0, 120) : path.replaceAll("[\r\n]", "_");
    }
}
