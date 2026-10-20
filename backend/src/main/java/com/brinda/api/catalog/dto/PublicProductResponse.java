package com.brinda.api.catalog.dto;

import com.brinda.api.catalog.model.Product;
import com.brinda.api.catalog.model.PromoRule;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/** Vista pública: no expone cantidades de stock ni umbrales. discountPrice solo si la oferta está activa. */
public record PublicProductResponse(UUID id, String slug, String name, String description,
                                    BigDecimal price, BigDecimal discountPrice, BigDecimal finalPrice,
                                    boolean onOffer, Integer discountPercent, OffsetDateTime offerEndsAt,
                                    Short promoBuy, Short promoPay, String promoLabel, OffsetDateTime promoEndsAt,
                                    String imageUrl, String categorySlug, String categoryName,
                                    boolean featured, boolean inStock, String productType, List<Line> items) {

    /** Contenido de un combo ("Incluye: 2 x Whisky X"). Sin cantidades de stock. */
    public record Line(String name, int quantity) {
    }

    public static PublicProductResponse from(Product p, OffsetDateTime now, List<Line> items) {
        boolean priceOffer = p.isOfferActive(now);
        boolean promo = p.isPromoActive(now);
        return new PublicProductResponse(p.getId(), p.getSlug(), p.getName(), p.getDescription(),
                p.getPrice(), priceOffer ? p.getDiscountPrice() : null, p.effectivePrice(now),
                priceOffer || promo, priceOffer ? percent(p.getPrice(), p.getDiscountPrice()) : null,
                priceOffer ? p.getOfferEndsAt() : null,
                promo ? p.getPromoBuy() : null, promo ? p.getPromoPay() : null,
                promo ? PromoRule.label(p.getPromoBuy(), p.getPromoPay()) : null,
                promo ? p.getPromoEndsAt() : null, p.getImageUrl(),
                p.getCategory().getSlug(), p.getCategory().getName(),
                p.isFeatured(), p.isAvailable() && p.getStockQuantity() > 0, p.getProductType().name(),
                p.isCombo() ? items : null);
    }

    public static int percent(BigDecimal price, BigDecimal discount) {
        return price.subtract(discount).multiply(BigDecimal.valueOf(100))
                .divide(price, 0, RoundingMode.HALF_UP).intValue();
    }
}
