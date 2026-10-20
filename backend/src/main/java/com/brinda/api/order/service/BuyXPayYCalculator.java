package com.brinda.api.order.service;

import java.math.BigDecimal;

/**
 * Cálculo puro de "lleva N, paga M" sobre un mismo producto. El stock baja por todas las unidades entregadas;
 * aquí solo se calcula cuánto se cobra.
 * grupos = floor(q / N); gratis = grupos × (N − M); descuento = gratis × precio; subtotal = q × precio − descuento.
 * Las unidades sueltas que no completan un grupo se pagan completas.
 */
public final class BuyXPayYCalculator {

    private BuyXPayYCalculator() {
    }

    public record Result(int freeUnits, BigDecimal discount, BigDecimal subtotal) {
    }

    public static Result calculate(int quantity, int buy, int pay, BigDecimal unitPrice) {
        if (quantity < 1 || pay < 1 || buy <= pay || unitPrice.signum() <= 0) {
            throw new IllegalArgumentException("Parámetros de promoción inválidos");
        }
        int free = (quantity / buy) * (buy - pay);
        BigDecimal discount = unitPrice.multiply(BigDecimal.valueOf(free));
        BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity)).subtract(discount);
        return new Result(free, discount, subtotal);
    }
}
