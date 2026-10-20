package com.brinda.api.order.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/** Línea con copia del nombre y de los precios: el historial no cambia si luego se edita el producto. */
@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, updatable = false)
    private Order order;

    @Column(name = "product_id", nullable = false, updatable = false)
    private UUID productId;

    @Column(name = "product_name", nullable = false, length = 150, updatable = false)
    private String productName;

    @Column(nullable = false, updatable = false)
    private int quantity;

    @Column(name = "list_price", nullable = false, precision = 10, scale = 2, updatable = false)
    private BigDecimal listPrice;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2, updatable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2, updatable = false)
    private BigDecimal subtotal;

    /** Descuento por promoción "lleva N paga M"; 0 si no aplicó. subtotal = quantity x unitPrice - promoDiscount. */
    @Column(name = "promo_discount", nullable = false, precision = 10, scale = 2, updatable = false)
    private BigDecimal promoDiscount = BigDecimal.ZERO;

    @Column(name = "promo_buy", updatable = false)
    private Short promoBuy;

    @Column(name = "promo_pay", updatable = false)
    private Short promoPay;

    /** Oferta aplicada al momento de la venta; null = sin promoción. */
    @Enumerated(EnumType.STRING)
    @Column(name = "promo_type", length = 20, updatable = false)
    private PromoType promoType;
}
