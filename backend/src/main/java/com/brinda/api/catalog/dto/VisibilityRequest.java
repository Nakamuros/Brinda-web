package com.brinda.api.catalog.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

/** Ocultar (false) o mostrar (true) varios productos a la vez. */
public record VisibilityRequest(
        @NotEmpty @Size(max = 200) List<@NotNull UUID> ids,
        @NotNull Boolean available
) {
}
