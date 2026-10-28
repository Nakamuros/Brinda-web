package com.brinda.api.complaint.dto;

import java.time.LocalDate;

/** {@code copyToken} solo se entrega aquí: es lo que permite descargar la copia en PDF. */
public record CreatedComplaintResponse(String code, int number, int year, LocalDate filedOn, String copyToken,
                                       String copyPath) {
}
