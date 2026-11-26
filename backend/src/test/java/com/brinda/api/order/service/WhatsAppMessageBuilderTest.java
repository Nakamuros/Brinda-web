package com.brinda.api.order.service;

import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderItem;
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
        o.setDeliveryFee(new BigDecimal("8"));
        o.setTotalAmount(new BigDecimal("101.5"));
        o.setPaymentMethod(PaymentMethod.PLIN);
        o.setCustomerFirstName("Ana");
        o.setCustomerLastName("Pérez");
        o.setCustomerPhone("987654321");
        o.setDeliveryAddress("Av. Larco 123");
        o.addItem(item(2, "Pilsen"));
        o.addItem(item(1, "Combo Fiesta"));
        return o;
    }

    private static OrderItem item(int qty, String name) {
        OrderItem i = new OrderItem();
        i.setQuantity(qty);
        i.setProductName(name);
        return i;
    }

    private static WhatsAppMessageBuilder builder(String number) {
        return new WhatsAppMessageBuilder(new OrderProperties(20, number, null, null, null, null, null, null, null,
                new BigDecimal("100")));
    }

    private static String text(String url) {
        return URLDecoder.decode(url.substring(url.indexOf("=") + 1), StandardCharsets.UTF_8);
    }

    @Test
    void mensajeConProductosDeliveryBaseTotalEstimadoYPago() {
        assertEquals("*Pedido BRINDA BR1234*\n2 × Pilsen\n1 × Combo Fiesta\nDelivery base: S/ 8.00\n"
                + "Total estimado: S/ 101.50\nPago: Plin", builder("51900000000").message(order()));
    }

    @Test
    void transferenciaConSuNombre() {
        Order o = order();
        o.setPaymentMethod(PaymentMethod.TRANSFER);
        assertTrue(builder("51900000000").message(o).endsWith("Pago: Transferencia"));
    }

    @Test
    void elEnlaceNoLlevaDatosPersonales() {
        String url = builder("+51 900 000 000").url(order());
        assertTrue(url.startsWith("https://wa.me/51900000000?text="));
        assertFalse(url.contains("+"), "los espacios van como %20");
        String text = text(url);
        for (String personal : new String[]{"Ana", "Pérez", "987654321", "Larco"}) {
            assertFalse(text.contains(personal), personal);
        }
    }

    @Test
    void siElEnlaceExcedeElTopeSeResumenLosProductos() {
        Order o = order();
        o.getItems().clear();
        String longName = "Ñandú añejo reservado edición especial ".repeat(4).trim(); // 150 aprox., con tildes
        for (int i = 0; i < 30; i++) {
            o.addItem(item(50, longName + " " + i));
        }
        String url = builder("51900000000").url(o);
        assertTrue(url.length() <= WhatsAppMessageBuilder.MAX_URL_LENGTH, "largo " + url.length());
        String text = text(url);
        assertTrue(text.matches("(?s).*\\+\\d+ productos más\n.*"), text);
        assertTrue(text.contains("Total estimado: S/ 101.50"));
        assertTrue(text.endsWith("Pago: Plin"));
    }

    @Test
    void unSoloProductoDeMasEnSingular() {
        assertTrue(builder("1").message(order(), 1).contains("+1 producto más\n"));
    }

    @Test
    void sinNumeroConfiguradoNoHayEnlace() {
        assertNull(builder("").url(order()));
        assertNull(builder(null).url(order()));
    }
}
