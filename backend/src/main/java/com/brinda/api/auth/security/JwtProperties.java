package com.brinda.api.auth.security;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "brinda.jwt")
public record JwtProperties(
        @NotBlank @Size(min = 32, message = "JWT_SECRET debe tener al menos 32 caracteres") String secret,
        @Min(1) long expirationMinutes,
        @NotBlank String cookieName,
        boolean cookieSecure
) {
}
