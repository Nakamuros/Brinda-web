package com.brinda.api.order.service;

import com.brinda.api.order.model.OrderItem;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class OrderLineTextTest {

    private static OrderItem item(int qty, String discount, Short buy, Short pay) {
        OrderItem i = new OrderItem();
        i.setProductName("Pilsen");
        i.setQuantity(qty);
        i.setPromoDiscount(new BigDecimal(discount));
        i.setPromoBuy(buy);
        i.setPromoPay(pay);
        return i;
    }

    @Test
    void lineaConPromocion() {
        assertEquals("3 x Pilsen (lleva 3 paga 2: -S/ 40.00)", OrderLineText.line(item(3, "40.00", (short) 3, (short) 2)));
    }

    @Test
    void lineaSinPromocion() {
        OrderItem i = item(2, "0.00", null, null);
        assertEquals("2 x Pilsen", OrderLineText.line(i));
        assertNull(OrderLineText.promo(i));
    }
}
