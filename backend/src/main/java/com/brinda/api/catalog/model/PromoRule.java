package com.brinda.api.catalog.model;

import java.time.OffsetDateTime;

/**
 * Regla única de "promoción lleva N paga M activa": campos completos y no vencida (sin fecha = sin fin).
 * Equivalente en consultas: ProductSpecifications.onOffer.
 */
public final class PromoRule {

    private PromoRule() {
    }

    public static boolean isActive(Short buy, Short pay, OffsetDateTime endsAt, OffsetDateTime now) {
        return buy != null && pay != null && (endsAt == null || endsAt.isAfter(now));
    }

    /** "Lleva 3, paga 2" */
    public static String label(int buy, int pay) {
        return "Lleva " + buy + ", paga " + pay;
    }
}
