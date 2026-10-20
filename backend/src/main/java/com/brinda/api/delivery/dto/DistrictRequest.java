package com.brinda.api.delivery.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DistrictRequest(
        @NotNull Long zoneId,
        @NotBlank @Size(max = 80) String name,
        boolean active
) {
}
