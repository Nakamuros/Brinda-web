package com.brinda.api.order.service;

import com.brinda.api.order.model.OrderItem;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

/** Texto de una línea de pedido para WhatsApp y boleta; muestra la promoción si se aplicó. */
final class OrderLineText {

    private OrderLineText() {
    }

    /** "3 x Pilsen (lleva 3 paga 2: -S/ 40.00)" o "2 x Whisky" sin promoción. */
    static String line(OrderItem i) {
        return line(i, List.of());
    }

    /** Con combo: "1 x Combo Fiesta (incluye: 2 x Whisky X, 1 x Gaseosa)". */
    static String line(OrderItem i, List<String> contents) {
        String promo = promo(i);
        return i.getQuantity() + " x " + i.getProductName()
                + (contents == null || contents.isEmpty() ? "" : " (incluye: " + String.join(", ", contents) + ")")
                + (promo == null ? "" : " (" + promo + ")");
    }

    /** "lleva 3 paga 2: -S/ 40.00"; null si la línea no tuvo descuento por promoción. */
    static String promo(OrderItem i) {
        BigDecimal discount = i.getPromoDiscount();
        if (discount == null || discount.signum() <= 0) {
            return null;
        }
        return "lleva " + i.getPromoBuy() + " paga " + i.getPromoPay() + ": -S/ "
                + String.format(Locale.US, "%.2f", discount);
    }
}
