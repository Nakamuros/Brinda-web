package com.brinda.api.order.service;

import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

/**
 * Arma el mensaje y el enlace wa.me en el servidor: el número de destino sale de la configuración,
 * nunca del navegador. Mensaje corto, SIN datos personales (solo código, total y método de pago):
 * así el navegador puede recordar el enlace junto al código, y el detalle lo ve la dueña en el panel.
 */
@Component
@RequiredArgsConstructor
public class WhatsAppMessageBuilder {

    private final OrderProperties props;

    /** Devuelve null si el número de WhatsApp aún no está configurado. */
    public String url(Order order) {
        String number = props.whatsappNumber() == null ? "" : props.whatsappNumber().replaceAll("\\D", "");
        if (number.isEmpty()) {
            return null;
        }
        String encoded = URLEncoder.encode(message(order), StandardCharsets.UTF_8).replace("+", "%20");
        return "https://wa.me/" + number + "?text=" + encoded;
    }

    String message(Order o) {
        String method = o.getPaymentMethod().name();
        return "*Pedido BRINDA " + o.getOrderCode() + "*\n"
                + "Total: S/ " + money(o.getTotalAmount()) + "\n"
                + "Pago: " + method.charAt(0) + method.substring(1).toLowerCase(Locale.ROOT);
    }

    static String money(BigDecimal amount) {
        return String.format(Locale.US, "%.2f", amount);
    }
}
