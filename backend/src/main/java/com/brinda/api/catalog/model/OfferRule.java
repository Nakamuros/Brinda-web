package com.brinda.api.catalog.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Regla única de "oferta activa": hay precio de oferta y no ha vencido.
 * Sin fecha de fin = oferta sin fin (datos antiguos). Equivalente en consultas: ProductSpecifications.onOffer.
 */
public final class OfferRule {

    private OfferRule() {
    }

    public static boolean isActive(BigDecimal discountPrice, OffsetDateTime endsAt, OffsetDateTime now) {
        return discountPrice != null && (endsAt == null || endsAt.isAfter(now));
    }
}
