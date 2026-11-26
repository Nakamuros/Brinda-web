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

    /** Tipo del documento cifrado en {@code customerDniEncrypted} (la columna conserva su nombre histórico). */
    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 10)
    private CustomerDocumentType documentType = CustomerDocumentType.DNI;

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

    /** Total estimado al crear el pedido (subtotal + tarifa base). */
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    /** Delivery que se cobró de verdad; lo escribe la dueña al confirmar. Null en pedidos sin confirmar o antiguos. */
    @Column(name = "final_delivery_fee", precision = 10, scale = 2)
    private BigDecimal finalDeliveryFee;

    @Column(name = "final_total_amount", precision = 10, scale = 2)
    private BigDecimal finalTotalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 10)
    private PaymentMethod paymentMethod;

    @Column(name = "adult_confirmed", nullable = false)
    private boolean adultConfirmed;

    @Column(name = "terms_accepted_at", nullable = false)
    private OffsetDateTime termsAcceptedAt;

    @Column(name = "privacy_accepted_at", nullable = false)
    private OffsetDateTime privacyAcceptedAt;

    /** Versión de los textos aceptados (constante del servidor); null mientras no se publiquen. */
    @Column(name = "terms_version", length = 20)
    private String termsVersion;

    @Column(name = "privacy_version", length = 20)
    private String privacyVersion;

    /** Consentimiento opcional de promociones: verdadero solo con fecha (CHECK ck_orders_marketing). */
    @Column(name = "marketing_consent", nullable = false)
    private boolean marketingConsent;

    @Column(name = "marketing_consent_at")
    private OffsetDateTime marketingConsentAt;

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

    /** Fija el delivery cobrado y recalcula el total final (misma regla que ck_orders_final). */
    public void chargeDelivery(BigDecimal fee) {
        finalDeliveryFee = fee;
        finalTotalAmount = subtotalAmount.add(fee);
    }

    /** Delivery cobrado; en pedidos antiguos o sin confirmar, la tarifa base. */
    public BigDecimal chargedDeliveryFee() {
        return finalDeliveryFee != null ? finalDeliveryFee : deliveryFee;
    }

    public BigDecimal chargedTotal() {
        return finalTotalAmount != null ? finalTotalAmount : totalAmount;
    }

    public String customerFullName() {
        return customerFirstName + " " + customerLastName;
    }
}
