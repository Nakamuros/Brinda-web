package com.brinda.api.order;

import com.brinda.api.order.service.BuyXPayYCalculator;
import com.brinda.api.order.service.BuyXPayYCalculator.Result;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class BuyXPayYCalculatorTest {

    private static final BigDecimal PRICE = new BigDecimal("20.00");

    private static void assertResult(Result r, int free, String discount, String subtotal) {
        assertEquals(free, r.freeUnits());
        assertEquals(new BigDecimal(discount), r.discount());
        assertEquals(new BigDecimal(subtotal), r.subtotal());
    }

    @Test
    void cantidadMenorQueNNoHayDescuento() {
        assertResult(BuyXPayYCalculator.calculate(2, 3, 2, PRICE), 0, "0.00", "40.00");
    }

    @Test
    void multiploExactoDosPorUno() {
        // lleva 2 paga 1: 4 unidades -> 2 gratis
        assertResult(BuyXPayYCalculator.calculate(4, 2, 1, PRICE), 2, "40.00", "40.00");
    }

    @Test
    void dosPorUnoConSobrante() {
        // 5 unidades: 2 grupos, 1 suelta que se paga completa -> paga 3
        assertResult(BuyXPayYCalculator.calculate(5, 2, 1, PRICE), 2, "40.00", "60.00");
    }

    @Test
    void tresPorDosUnGrupo() {
        assertResult(BuyXPayYCalculator.calculate(3, 3, 2, PRICE), 1, "20.00", "40.00");
    }

    @Test
    void tresPorDosMultiploExacto() {
        assertResult(BuyXPayYCalculator.calculate(6, 3, 2, PRICE), 2, "40.00", "80.00");
    }

    @Test
    void tresPorDosConSobrante() {
        // 8 unidades: 2 grupos (2 gratis) + 2 sueltas -> paga 6
        assertResult(BuyXPayYCalculator.calculate(8, 3, 2, PRICE), 2, "40.00", "120.00");
    }

    @Test
    void sobranteJustoAntesDelSiguienteGrupo() {
        // 5 unidades en 3x2: un solo grupo
        assertResult(BuyXPayYCalculator.calculate(5, 3, 2, PRICE), 1, "20.00", "80.00");
    }

    @Test
    void dosPorUnoConDescuentoMayor() {
        // lleva 4 paga 1: 4 unidades -> 3 gratis
        assertResult(BuyXPayYCalculator.calculate(4, 4, 1, PRICE), 3, "60.00", "20.00");
    }

    @Test
    void preciosConCentavosSeMantienenExactos() {
        // 33.33 x 7 = 233.31; 3x2 -> 2 grupos = 2 gratis = 66.66; paga 166.65
        assertResult(BuyXPayYCalculator.calculate(7, 3, 2, new BigDecimal("33.33")), 2, "66.66", "166.65");
    }

    @Test
    void subtotalMasDescuentoIgualaCantidadPorPrecio() {
        BigDecimal price = new BigDecimal("9.99");
        for (int q = 1; q <= 50; q++) {
            Result r = BuyXPayYCalculator.calculate(q, 3, 2, price);
            assertEquals(price.multiply(BigDecimal.valueOf(q)), r.subtotal().add(r.discount()));
        }
    }

    @Test
    void parametrosInvalidosSeRechazan() {
        assertThrows(IllegalArgumentException.class, () -> BuyXPayYCalculator.calculate(0, 3, 2, PRICE));
        assertThrows(IllegalArgumentException.class, () -> BuyXPayYCalculator.calculate(3, 2, 2, PRICE));
        assertThrows(IllegalArgumentException.class, () -> BuyXPayYCalculator.calculate(3, 3, 0, PRICE));
        assertThrows(IllegalArgumentException.class, () -> BuyXPayYCalculator.calculate(3, 3, 2, BigDecimal.ZERO));
    }
}
