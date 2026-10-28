package com.brinda.api.complaint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/** Sección 4 de la hoja: observaciones y acciones adoptadas (txtObservaciones) y fecha de comunicación (dtFechaRpta). */
public record RespondComplaintRequest(
        @NotBlank @Size(max = 1000) String responseText,
        @NotNull LocalDate responseDate
) {
}
