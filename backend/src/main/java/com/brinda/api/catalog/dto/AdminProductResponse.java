package com.brinda.api.catalog.dto;

import com.brinda.api.catalog.model.Product;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/** discountPrice/offerEndsAt se muestran tal cual están guardados; offerActive/offerExpired dicen su vigencia. */
public record AdminProductResponse(UUID id, Long categoryId, String categoryName, String sku, String name, String slug, String productType,
                                   String description, BigDecimal price, BigDecimal discountPrice,
                                   OffsetDateTime offerEndsAt, boolean offerActive, boolean offerExpired,
                                   Short promoBuy, Short promoPay, OffsetDateTime promoEndsAt,
                                   boolean promoActive, boolean promoExpired,
                                   BigDecimal finalPrice, String imageUrl,
                                   int stockQuantity, int minStock, int maxStock, String stockLevel,
                                   boolean available, boolean featured) {

    public static AdminProductResponse from(Product p, OffsetDateTime now) {
        return new AdminProductResponse(p.getId(), p.getCategory().getId(), p.getCategory().getName(), p.getSku(),
                p.getName(), p.getSlug(), p.getProductType().name(), p.getDescription(), p.getPrice(), p.getDiscountPrice(),
                p.getOfferEndsAt(), p.isOfferActive(now), p.isOfferExpired(now),
                p.getPromoBuy(), p.getPromoPay(), p.getPromoEndsAt(), p.isPromoActive(now), p.isPromoExpired(now), p.effectivePrice(now), p.getImageUrl(),
                p.getStockQuantity(), p.getMinStock(), p.getMaxStock(), stockLevel(p),
                p.isAvailable(), p.isFeatured());
    }

    /** OUT = agotado, LOW = en mínimo o menos, HIGH = en máximo o más, NORMAL = en medio. */
    static String stockLevel(Product p) {
        if (p.getStockQuantity() == 0) return "OUT";
        if (p.getStockQuantity() <= p.getMinStock()) return "LOW";
        if (p.getMaxStock() > 0 && p.getStockQuantity() >= p.getMaxStock()) return "HIGH";
        return "NORMAL";
    }
}
