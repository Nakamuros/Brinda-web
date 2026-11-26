package com.brinda.api.order.service;

import com.brinda.api.order.config.OrderProperties;
import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;

/**
 * Arma el mensaje y el enlace wa.me en el servidor: el número de destino sale de la configuración,
 * nunca del navegador. Lleva código, productos ("cantidad × nombre"), delivery base, total estimado y pago,
 * SIN datos personales: así el navegador puede recordar el enlace junto al código. El detalle del cliente
 * lo ve la dueña en el panel.
 */
@Component
@RequiredArgsConstructor
public class WhatsAppMessageBuilder {

    /** Largo máximo del enlace ya codificado (los enlaces wa.me muy largos fallan en algunos navegadores). */
    static final int MAX_URL_LENGTH = 2000;

    private final OrderProperties props;

    /** Devuelve null si el número de WhatsApp aún no está configurado. Recorta productos si no cabe. */
    public String url(Order order) {
        String number = props.whatsappNumber() == null ? "" : props.whatsappNumber().replaceAll("\\D", "");
        if (number.isEmpty()) {
            return null;
        }
        String prefix = "https://wa.me/" + number + "?text=";
        List<OrderItem> items = order.getItems();
        for (int shown = items.size(); ; shown--) {
            String url = prefix + encode(message(order, shown));
            if (url.length() <= MAX_URL_LENGTH || shown == 0) {
                return url;
            }
        }
    }

    String message(Order o) {
        return message(o, o.getItems().size());
    }

    /** Muestra los primeros {@code shown} productos; el resto se resume como "+N productos más". */
    String message(Order o, int shown) {
        StringBuilder sb = new StringBuilder("*Pedido BRINDA ").append(o.getOrderCode()).append("*\n");
        List<OrderItem> items = o.getItems();
        for (int i = 0; i < shown; i++) {
            sb.append(items.get(i).getQuantity()).append(" × ").append(items.get(i).getProductName()).append('\n');
        }
        int rest = items.size() - shown;
        if (rest > 0) {
            sb.append('+').append(rest).append(rest == 1 ? " producto más" : " productos más").append('\n');
        }
        return sb.append("Delivery base: S/ ").append(money(o.getDeliveryFee())).append('\n')
                .append("Total estimado: S/ ").append(money(o.getTotalAmount())).append('\n')
                .append("Pago: ").append(o.getPaymentMethod().label())
                .toString();
    }

    private static String encode(String text) {
        return URLEncoder.encode(text, StandardCharsets.UTF_8).replace("+", "%20");
    }

    static String money(BigDecimal amount) {
        return String.format(Locale.US, "%.2f", amount);
    }
}
