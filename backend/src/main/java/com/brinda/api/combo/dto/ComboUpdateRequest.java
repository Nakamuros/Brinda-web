package com.brinda.api.combo.dto;

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
import java.util.List;

/**
 * Edición de un combo. {@code items} y {@code stockQuantity} existen solo para rechazarlos con un mensaje claro:
 * la composición es fija y el stock cambia únicamente por armado, ventas y ajustes.
 */
public record ComboUpdateRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 2000) String description,
        @Size(max = 500) String imageUrl,
        @NotNull @DecimalMin("0.01") @DecimalMax("99999999.99") @Digits(integer = 8, fraction = 2) BigDecimal price,
        @DecimalMin("0.01") @Digits(integer = 8, fraction = 2) BigDecimal discountPrice,
        OffsetDateTime offerEndsAt,
        @Min(0) @Max(1000000) int minStock,
        @Min(0) @Max(1000000) int maxStock,
        boolean featured,
        boolean available,
        List<Object> items,
        Integer stockQuantity
) {
}
