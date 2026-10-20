package com.brinda.api.order.model;

import com.brinda.api.delivery.model.District;
import com.brinda.api.shared.model.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Order extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "order_code", nullable = false, unique = true, length = 12, updatable = false)
    private String orderCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderChannel channel = OrderChannel.WHATSAPP;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "customer_first_name", nullable = false, length = 80)
    private String customerFirstName;

    @Column(name = "customer_last_name", nullable = false, length = 80)
    private String customerLastName;

    @Column(name = "customer_phone", nullable = false, length = 9)
    private String customerPhone;

    /** Cifrado AES-GCM; nunca se guarda ni se loguea en texto plano. */
    @Column(name = "customer_dni_encrypted", length = 255)
    private String customerDniEncrypted;

    @Column(name = "delivery_address", nullable = false, length = 255)
    private String deliveryAddress;

    @Column(name = "delivery_reference", length = 255)
    private String deliveryReference;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(name = "subtotal_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotalAmount;

    /** Copia de la tarifa al momento del pedido. */
    @Column(name = "delivery_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryFee;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 10)
    private PaymentMethod paymentMethod;

    @Column(name = "adult_confirmed", nullable = false)
    private boolean adultConfirmed;

    @Column(name = "terms_accepted_at", nullable = false)
    private OffsetDateTime termsAcceptedAt;

    @Column(name = "privacy_accepted_at", nullable = false)
    private OffsetDateTime privacyAcceptedAt;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "confirmed_at")
    private OffsetDateTime confirmedAt;

    @Column(name = "confirmed_by")
    private UUID confirmedBy;

    @Column(name = "cancel_reason", length = 255)
    private String cancelReason;

    @OneToMany(mappedBy = "order", cascade = CascadeType.PERSIST)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }

    public String customerFullName() {
        return customerFirstName + " " + customerLastName;
    }
}
