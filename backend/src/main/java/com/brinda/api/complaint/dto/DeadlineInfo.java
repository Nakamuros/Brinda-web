package com.brinda.api.complaint.dto;

import java.time.LocalDate;

/**
 * Plazo de respuesta (15 días hábiles, lunes a viernes; feriados POR CONFIRMAR con el asesor).
 * {@code businessDaysLeft} es nulo si ya fue respondido; negativo si venció.
 */
public record DeadlineInfo(LocalDate dueOn, Integer businessDaysLeft, Level level, boolean answeredLate) {

    public enum Level {
        /** Falta más del umbral de aviso. */
        ON_TIME,
        /** Quedan pocos días hábiles (o vence hoy). */
        SOON,
        OVERDUE,
        /** Ya respondido. */
        ANSWERED
    }
}
