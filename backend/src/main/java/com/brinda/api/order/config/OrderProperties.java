package com.brinda.api.order.config;

import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "brinda.order")
public record OrderProperties(
        @Min(1) long expirationMinutes,
        String whatsappNumber,
        String yapeNumber,
        String plinNumber
) {
}
