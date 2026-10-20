package com.brinda.api.order.dto;

import com.brinda.api.order.model.Order;
import com.brinda.api.order.model.OrderItem;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/** Detalle para el panel autenticado. Incluye el DNI descifrado: cada consulta queda en la auditoría. */
public record OrderDetailResponse(UUID id, String code, String status, String channel,
                                  String firstName, String lastName, String phone, String dni,
                                  String address, String reference, String districtName, String zoneName,
                                  BigDecimal subtotal, BigDecimal deliveryFee, BigDecimal total, String paymentMethod,
                                  boolean adultConfirmed, OffsetDateTime termsAcceptedAt,
                                  OffsetDateTime privacyAcceptedAt, OffsetDateTime createdAt,
                                  OffsetDateTime expiresAt, OffsetDateTime confirmedAt, String cancelReason,
                                  List<Item> items) {

    public record Item(UUID productId, String name, int quantity, BigDecimal listPrice, BigDecimal unitPrice,
                       BigDecimal promoDiscount, BigDecimal subtotal, String promoType) {

        static Item from(OrderItem i) {
            return new Item(i.getProductId(), i.getProductName(), i.getQuantity(), i.getListPrice(),
                    i.getUnitPrice(), i.getPromoDiscount(), i.getSubtotal(),
                    i.getPromoType() == null ? null : i.getPromoType().name());
        }
    }

    public static OrderDetailResponse from(Order o, String dni) {
        return new OrderDetailResponse(o.getId(), o.getOrderCode(), o.getStatus().name(), o.getChannel().name(),
                o.getCustomerFirstName(), o.getCustomerLastName(), o.getCustomerPhone(), dni,
                o.getDeliveryAddress(), o.getDeliveryReference(), o.getDistrict().getName(),
                o.getDistrict().getZone().getName(), o.getSubtotalAmount(), o.getDeliveryFee(), o.getTotalAmount(),
                o.getPaymentMethod().name(), o.isAdultConfirmed(), o.getTermsAcceptedAt(), o.getPrivacyAcceptedAt(),
                o.getCreatedAt(), o.getExpiresAt(), o.getConfirmedAt(), o.getCancelReason(),
                o.getItems().stream().map(Item::from).toList());
    }
}
