package com.brinda.api.catalog.model;

import com.brinda.api.shared.model.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** DynamicUpdate: editar el catálogo nunca pisa un stock modificado en paralelo. */
@Getter
@Setter
@NoArgsConstructor
@DynamicUpdate
@Entity
@Table(name = "products")
public class Product extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(columnDefinition = "text")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @Column(name = "offer_ends_at")
    private OffsetDateTime offerEndsAt;

    @Column(name = "promo_buy")
    private Short promoBuy;

    @Column(name = "promo_pay")
    private Short promoPay;

    @Column(name = "promo_ends_at")
    private OffsetDateTime promoEndsAt;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    /** Solo lo modifica el módulo inventory (con su movimiento de stock). */
    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Column(name = "min_stock", nullable = false)
    private int minStock;

    @Column(name = "max_stock", nullable = false)
    private int maxStock;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false, length = 10, updatable = false)
    private ProductType productType = ProductType.PRODUCT;

    @Column(name = "is_available", nullable = false)
    private boolean available = true;

    @Column(name = "is_featured", nullable = false)
    private boolean featured;

    public boolean isCombo() {
        return productType == ProductType.COMBO;
    }

    public boolean isOfferActive(OffsetDateTime now) {
        return OfferRule.isActive(discountPrice, offerEndsAt, now);
    }

    /** Hay precio de oferta pero su fecha de fin ya pasó. */
    public boolean isOfferExpired(OffsetDateTime now) {
        return discountPrice != null && !isOfferActive(now);
    }

    public boolean isPromoActive(OffsetDateTime now) {
        return PromoRule.isActive(promoBuy, promoPay, promoEndsAt, now);
    }

    /** Hay promoción configurada pero su fecha de fin ya pasó. */
    public boolean isPromoExpired(OffsetDateTime now) {
        return promoBuy != null && !isPromoActive(now);
    }

    public BigDecimal effectivePrice(OffsetDateTime now) {
        return isOfferActive(now) ? discountPrice : price;
    }
}
