package com.brinda.api.order.config;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;

/**
 * Configuración de pedidos. Los datos de pago (Yape, Plin, cuenta para transferencia) van solo en variables de
 * entorno; vacíos = aún no configurados. {@code legalDocumentsVersion} es la versión de términos y privacidad que
 * el servidor guarda en cada pedido (vacía = no se guarda versión).
 */
@Validated
@ConfigurationProperties(prefix = "brinda.order")
public record OrderProperties(
        @Min(1) long expirationMinutes,
        String whatsappNumber,
        String yapeNumber,
        String plinNumber,
        String transferBank,
        String transferAccount,
        String transferCci,
        String transferHolder,
        String legalDocumentsVersion,
        @NotNull @DecimalMin("1") BigDecimal maxDeliveryFee
) {
}
