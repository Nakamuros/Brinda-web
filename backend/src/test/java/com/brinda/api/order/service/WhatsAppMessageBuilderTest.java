package com.brinda.api.order.service;

import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.PaymentMethod;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class WhatsAppMessageBuilderTest {

    private static Order order() {
        Order o = new Order();
        o.setOrderCode("BR1234");
        o.setTotalAmount(new BigDecimal("101.5"));
        o.setPaymentMethod(PaymentMethod.PLIN);
        o.setCustomerFirstName("Ana");
        o.setCustomerLastName("Pérez");
        o.setCustomerPhone("987654321");
        o.setDeliveryAddress("Av. Larco 123");
        return o;
    }

    private static WhatsAppMessageBuilder builder(String number) {
        return new WhatsAppMessageBuilder(new OrderProperties(20, number, null, null));
    }

    @Test
    void mensajeCortoSoloConCodigoTotalYPago() {
        assertEquals("*Pedido BRINDA BR1234*\nTotal: S/ 101.50\nPago: Plin", builder("51900000000").message(order()));
    }

    @Test
    void elEnlaceNoLlevaDatosPersonales() {
        String url = builder("+51 900 000 000").url(order());
        assertTrue(url.startsWith("https://wa.me/51900000000?text="));
        assertFalse(url.contains("+"), "los espacios van como %20");
        String text = URLDecoder.decode(url.substring(url.indexOf("=") + 1), StandardCharsets.UTF_8);
        for (String personal : new String[]{"Ana", "Pérez", "987654321", "Larco"}) {
            assertFalse(text.contains(personal), personal);
        }
    }

    @Test
    void sinNumeroConfiguradoNoHayEnlace() {
        assertNull(builder("").url(order()));
        assertNull(builder(null).url(order()));
    }
}
