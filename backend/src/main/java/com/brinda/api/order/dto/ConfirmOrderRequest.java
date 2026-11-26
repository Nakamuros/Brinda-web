package com.brinda.api.order.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Delivery cobrado de verdad (S/), para confirmar un pedido o corregirlo después. El tope sale de
 * {@code brinda.order.max-delivery-fee}; S/ 0 exige {@code zeroFeeConfirmed = true}.
 */
public record ConfirmOrderRequest(
        @NotNull(message = "Indica el delivery cobrado")
        @DecimalMin(value = "0.00", message = "El delivery no puede ser negativo")
        @Digits(integer = 6, fraction = 2, message = "Usa como máximo 2 decimales") BigDecimal deliveryFee,
        boolean zeroFeeConfirmed
) {
}
