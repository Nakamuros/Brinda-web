package com.brinda.api.complaint.service;

import java.time.DayOfWeek;
import java.time.LocalDate;

/**
 * Días hábiles de lunes a viernes. POR CONFIRMAR con el asesor: los feriados no se descuentan todavía.
 */
public final class BusinessDays {

    private BusinessDays() {
    }

    public static boolean isBusinessDay(LocalDate d) {
        DayOfWeek w = d.getDayOfWeek();
        return w != DayOfWeek.SATURDAY && w != DayOfWeek.SUNDAY;
    }

    /** La fecha que queda tras contar {@code days} días hábiles a partir del día siguiente a {@code from}. */
    public static LocalDate add(LocalDate from, int days) {
        LocalDate d = from;
        int left = days;
        while (left > 0) {
            d = d.plusDays(1);
            if (isBusinessDay(d)) {
                left--;
            }
        }
        return d;
    }

    /**
     * Días hábiles entre {@code from} (excluido) y {@code to} (incluido). Positivo si {@code to} es posterior,
     * cero si son el mismo día y negativo si {@code to} ya pasó.
     */
    public static int between(LocalDate from, LocalDate to) {
        if (to.isBefore(from)) {
            return -between(to, from);
        }
        int n = 0;
        for (LocalDate d = from.plusDays(1); !d.isAfter(to); d = d.plusDays(1)) {
            if (isBusinessDay(d)) {
                n++;
            }
        }
        return n;
    }
}
