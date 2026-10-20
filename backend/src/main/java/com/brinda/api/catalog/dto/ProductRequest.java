package com.brinda.api.catalog.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/** El stock no se edita aquí: lo gestiona el módulo inventory. */
public record ProductRequest(
        @NotNull Long categoryId,
        @Size(max = 50) String sku,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 2000) String description,
        @NotNull @DecimalMin("0.01") @DecimalMax("99999999.99") @Digits(integer = 8, fraction = 2) BigDecimal price,
        @DecimalMin("0.01") @Digits(integer = 8, fraction = 2) BigDecimal discountPrice,
        OffsetDateTime offerEndsAt,
        @Size(max = 500) String imageUrl,
        @Min(0) @Max(1000000) int minStock,
        @Min(0) @Max(1000000) int maxStock,
        boolean available,
        boolean featured
) {
}
