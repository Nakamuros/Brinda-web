package com.brinda.api.combo.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Crea el combo, fija su composición (inmutable) y arma las primeras unidades. */
public record CreateComboRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 2000) String description,
        @Size(max = 500) String imageUrl,
        @NotNull @DecimalMin("0.01") @DecimalMax("99999999.99") @Digits(integer = 8, fraction = 2) BigDecimal price,
        @Min(0) @Max(1000000) int minStock,
        @Min(0) @Max(1000000) int maxStock,
        boolean featured,
        boolean available,
        @NotEmpty @Size(max = 10) List<@Valid @NotNull Item> items,
        @Min(1) @Max(1000) int unitsToBuild
) {
    public record Item(
            @NotNull UUID productId,
            @Min(1) @Max(100) int quantity
    ) {
    }
}
