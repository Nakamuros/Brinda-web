package com.brinda.api.order.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/** Respuesta pública: solo código, montos e instrucciones de pago. Sin datos personales. */
public record CreatedOrderResponse(String code, String status, BigDecimal subtotal, BigDecimal deliveryFee,
                                   BigDecimal total, OffsetDateTime expiresAt, List<Line> items,
                                   Payment payment, String whatsappUrl) {

    public record Line(String name, int quantity, BigDecimal unitPrice, BigDecimal promoDiscount, String promo,
                       BigDecimal subtotal) {
    }

    /**
     * number es el Yape/Plin de BRINDA; transfer, la cuenta para TRANSFER. Ambos null si aún no están configurados
     * ("te enviaremos los datos por WhatsApp"). amount es el total estimado. Nada de esto es dato personal.
     */
    public record Payment(String method, String number, Transfer transfer, BigDecimal amount) {
    }

    public record Transfer(String bank, String account, String cci, String holder) {
    }
}
