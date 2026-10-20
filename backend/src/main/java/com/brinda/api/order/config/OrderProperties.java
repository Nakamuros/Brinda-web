package com.brinda.api.order.config;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;

@Validated
@ConfigurationProperties(prefix = "brinda.order")
public record OrderProperties(
        @Min(1) long expirationMinutes,
        @NotNull BigDecimal dniRequiredAbove,
        String whatsappNumber,
        String yapeNumber,
        String plinNumber
) {
}
