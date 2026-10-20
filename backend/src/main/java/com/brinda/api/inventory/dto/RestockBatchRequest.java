package com.brinda.api.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

/** Recepción de mercadería: varias reposiciones en una sola operación (todo o nada). */
public record RestockBatchRequest(
        @Size(max = 255) String reference,
        @NotEmpty @Size(max = 100) List<@Valid Line> lines
) {
    public record Line(
            @NotNull UUID productId,
            @Min(1) @Max(100000) int quantity
    ) {
    }
}
