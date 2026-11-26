package com.brinda.api.order.service;

import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.PaymentMethod;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;

/** Datos de pago de BRINDA en la respuesta pública: la cuenta solo si está completa. */
class OrderPaymentInfoTest {

    private static OrderService service(String bank, String account, String cci, String holder) {
        OrderProperties props = new OrderProperties(20, null, "999111222", null, bank, account, cci, holder, null,
                new BigDecimal("100"));
        return new OrderService(null, null, null, null, null, mock(WhatsAppMessageBuilder.class), props, null, null);
    }

    private static Order order(PaymentMethod method) {
        Order o = new Order();
        o.setPaymentMethod(method);
        o.setTotalAmount(new BigDecimal("50.00"));
        return o;
    }

    @Test
    void transferenciaConLaCuentaCompleta() {
        var p = service("Banco X", "123", "00212300", "Titular").payment(order(PaymentMethod.TRANSFER));
        assertEquals("TRANSFER", p.method());
        assertEquals("00212300", p.transfer().cci());
        assertNull(p.number());
    }

    @Test
    void transferenciaSinConfigurarOIncompletaNoDaCuenta() {
        assertNull(service("", "", "", "").payment(order(PaymentMethod.TRANSFER)).transfer());
        assertNull(service("Banco X", "123", " ", "Titular").payment(order(PaymentMethod.TRANSFER)).transfer());
    }

    @Test
    void yapeSigueConSuNumero() {
        var p = service(null, null, null, null).payment(order(PaymentMethod.YAPE));
        assertEquals("999111222", p.number());
        assertNull(p.transfer());
    }
}
