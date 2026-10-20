package com.brinda.api.order.dto;

import com.brinda.api.order.model.Order;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Fila de la lista del panel: lo justo para comparar con el mensaje de WhatsApp. Sin DNI. */
public record OrderSummaryResponse(UUID id, String code, String status, String customerName, String districtName,
                                   BigDecimal total, String paymentMethod, OffsetDateTime createdAt,
                                   OffsetDateTime expiresAt) {

    public static OrderSummaryResponse from(Order o) {
        return new OrderSummaryResponse(o.getId(), o.getOrderCode(), o.getStatus().name(), o.customerFullName(),
                o.getDistrict().getName(), o.getTotalAmount(), o.getPaymentMethod().name(),
                o.getCreatedAt(), o.getExpiresAt());
    }
}
