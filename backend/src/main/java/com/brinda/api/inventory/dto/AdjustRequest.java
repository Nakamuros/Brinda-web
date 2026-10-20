package com.brinda.api.inventory.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** quantityChange positivo suma, negativo resta (merma, rotura, conteo físico). El motivo es obligatorio. */
public record AdjustRequest(
        @Min(-100000) @Max(100000) int quantityChange,
        @NotBlank @Size(max = 255) String reason
) {
}
