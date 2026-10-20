package com.brinda.api.shared.crypto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "brinda.crypto")
public record CryptoProperties(@NotBlank String dniKey) {
}
