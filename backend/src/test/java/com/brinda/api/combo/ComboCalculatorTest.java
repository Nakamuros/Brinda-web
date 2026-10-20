package com.brinda.api.combo;

import com.brinda.api.combo.service.ComboCalculator;
import com.brinda.api.combo.service.ComboCalculator.Component;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ComboCalculatorTest {

    @Test
    void sinComponentesNoSeArmaNada() {
        assertEquals(0, ComboCalculator.buildableNow(List.of()));
    }

    @Test
    void limitaElComponenteMasEscaso() {
        // 12 whiskys / 1 = 12; 25 vasos / 2 = 12; 7 hielos / 1 = 7  -> 7
        assertEquals(7, ComboCalculator.buildableNow(
                List.of(new Component(12, 1), new Component(25, 2), new Component(7, 1))));
    }

    @Test
    void redondeaHaciaAbajo() {
        assertEquals(2, ComboCalculator.buildableNow(List.of(new Component(5, 2))));
    }

    @Test
    void componenteAgotadoImpideArmar() {
        assertEquals(0, ComboCalculator.buildableNow(List.of(new Component(100, 1), new Component(0, 3))));
    }

    @Test
    void stockMenorQueLoQueLlevaCadaComboNoAlcanza() {
        assertEquals(0, ComboCalculator.buildableNow(List.of(new Component(1, 2))));
    }

    @Test
    void cantidadExactaArmaUno() {
        assertEquals(1, ComboCalculator.buildableNow(List.of(new Component(3, 3))));
    }

    @Test
    void cantidadPorComboInvalidaNoArma() {
        assertEquals(0, ComboCalculator.buildableNow(List.of(new Component(10, 0))));
    }

    @Test
    void stockNegativoSeTrataComoCero() {
        assertEquals(0, ComboCalculator.buildableNow(List.of(new Component(-5, 1))));
    }
}
