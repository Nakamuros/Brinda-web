package com.brinda.api.combo.service;

import java.util.List;

/** Cálculos puros de combos (sin base de datos). */
public final class ComboCalculator {

    private ComboCalculator() {
    }

    /** Stock actual de un componente y cuántas unidades lleva cada combo. */
    public record Component(int stock, int perCombo) {
    }

    /** Combos que se pueden armar ahora: el mínimo de floor(stock / cantidad) entre los componentes. */
    public static int buildableNow(List<Component> components) {
        return components.stream()
                .mapToInt(c -> c.perCombo() <= 0 ? 0 : Math.max(c.stock(), 0) / c.perCombo())
                .min()
                .orElse(0);
    }
}
