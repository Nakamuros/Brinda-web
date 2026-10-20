package com.brinda.api.inventory.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record RestockRequest(
        @Min(1) @Max(100000) int quantity,
        @Size(max = 255) String reason
) {
}
