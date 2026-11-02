package com.brinda.api.auth.security;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@ConfigurationProperties(prefix = "brinda.security")
public record SecurityProperties(
        @NotEmpty List<String> corsAllowedOrigins,
        int maxFailedAttempts,
        int lockMinutes,
        int ordersPerMinute,
        int loginsPerMinute,
        int complaintsPerMinute,
        int complaintCopiesPerMinute,
        /** Proxies propios delante de la app (cuenta desde la derecha de X-Forwarded-For). Ver ClientIp. */
        @Min(value = 1, message = "TRUSTED_PROXY_HOPS debe ser >= 1") int trustedProxyHops
) {

    public SecurityProperties {
        // Con allowCredentials=true un comodín abriría la API a cualquier sitio: la app no debe arrancar así.
        if (corsAllowedOrigins != null && corsAllowedOrigins.stream().anyMatch(o -> o == null || o.contains("*") || o.isBlank())) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS no admite comodines ni valores vacíos");
        }
    }
}
