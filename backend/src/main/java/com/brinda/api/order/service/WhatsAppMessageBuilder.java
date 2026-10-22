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
import java.util.Map;
import java.util.UUID;

/**
 * Arma el mensaje y el enlace wa.me en el servidor: el número de destino sale de la configuración,
 * nunca del navegador. El DNI no viaja por WhatsApp (se ve solo en el panel).
 */
@Component
@RequiredArgsConstructor
public class WhatsAppMessageBuilder {

    private static final int MAX_MESSAGE_CHARS = 1200;

    private final OrderProperties props;
    private final OrderComboContents comboContents;

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
        String full = build(o, false, comboContents.of(o.getItems()));
        return full.length() <= MAX_MESSAGE_CHARS ? full : build(o, true, Map.of());
    }

    private String build(Order o, boolean summary, Map<UUID, List<String>> contents) {
        StringBuilder sb = new StringBuilder();
        sb.append("*Pedido BRINDA ").append(o.getOrderCode()).append("*\n");
        if (summary) {
            int units = o.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
            sb.append(o.getItems().size()).append(" productos (").append(units)
                    .append(" unidades). Detalle completo en el sistema.\n");
        } else {
            for (OrderItem i : o.getItems()) {
                sb.append("• ").append(OrderLineText.line(i, contents.get(i.getProductId()))).append(" - S/ ").append(money(i.getSubtotal())).append('\n');
            }
        }
        sb.append("\nSubtotal: S/ ").append(money(o.getSubtotalAmount()))
                .append("\nEnvío (").append(o.getDistrict().getName()).append("): S/ ")
                .append(money(o.getDeliveryFee()))
                .append("\n*Total: S/ ").append(money(o.getTotalAmount())).append("*\n")
                .append("Pago: ").append(o.getPaymentMethod().name()).append("\n\n")
                .append("Cliente: ").append(o.customerFullName()).append('\n')
                .append("Celular: ").append(o.getCustomerPhone()).append('\n')
                .append("Dirección: ").append(o.getDeliveryAddress());
        if (o.getDeliveryReference() != null) {
            sb.append(" (").append(o.getDeliveryReference()).append(')');
        }
        return sb.toString();
    }

    static String money(BigDecimal amount) {
        return String.format(Locale.US, "%.2f", amount);
    }
}
