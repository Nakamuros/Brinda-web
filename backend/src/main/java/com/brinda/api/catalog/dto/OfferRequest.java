package com.brinda.api.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/** Fijar una oferta: el precio y su fecha de fin (con zona horaria, ej. 2026-10-26T23:59:00-05:00) son obligatorios. */
public record OfferRequest(
        @NotNull @DecimalMin("0.01") @Digits(integer = 8, fraction = 2) BigDecimal discountPrice,
        @NotNull OffsetDateTime endsAt
) {
}
