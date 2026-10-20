package com.brinda.api.catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(max = 80) String name,
        @Size(max = 1000) String description,
        @Size(max = 500) String iconUrl,
        boolean active,
        @Min(0) @Max(9999) int displayOrder
) {
}
