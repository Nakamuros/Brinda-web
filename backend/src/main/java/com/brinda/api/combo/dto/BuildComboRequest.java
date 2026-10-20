package com.brinda.api.combo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

/** "Armar más": rearmar unidades de un combo existente. */
public record BuildComboRequest(
        @Min(1) @Max(1000) int units,
        @Size(max = 255) String reason
) {
}
