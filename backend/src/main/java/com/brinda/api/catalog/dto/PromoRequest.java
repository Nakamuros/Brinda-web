package com.brinda.api.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

/** "Lleva {buy}, paga {pay}" sobre el mismo producto. La fecha de fin es obligatoria y futura. */
public record PromoRequest(
        @Min(2) @Max(20) int buy,
        @Min(1) @Max(19) int pay,
        @NotNull OffsetDateTime endsAt
) {
}
