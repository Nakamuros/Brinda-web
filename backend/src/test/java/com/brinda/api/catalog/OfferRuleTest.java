package com.brinda.api.catalog;

import com.brinda.api.catalog.model.OfferRule;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OfferRuleTest {

    private static final OffsetDateTime NOW = OffsetDateTime.parse("2026-10-19T12:00:00-05:00");
    private static final BigDecimal DISCOUNT = new BigDecimal("30.00");

    @Test
    void sinPrecioDeOfertaNuncaEstaActiva() {
        assertFalse(OfferRule.isActive(null, null, NOW));
        assertFalse(OfferRule.isActive(null, NOW.plusDays(1), NOW));
    }

    @Test
    void fechaFuturaEstaActiva() {
        assertTrue(OfferRule.isActive(DISCOUNT, NOW.plusSeconds(1), NOW));
    }

    @Test
    void fechaPasadaNoEstaActiva() {
        assertFalse(OfferRule.isActive(DISCOUNT, NOW.minusSeconds(1), NOW));
    }

    @Test
    void justoEnLaFechaDeFinYaNoEstaActiva() {
        assertFalse(OfferRule.isActive(DISCOUNT, NOW, NOW));
    }

    @Test
    void sinFechaDeFinEsOfertaSinFin() {
        assertTrue(OfferRule.isActive(DISCOUNT, null, NOW));
    }

    @Test
    void comparaInstantesAunqueLaZonaSeaDistinta() {
        assertTrue(OfferRule.isActive(DISCOUNT, OffsetDateTime.parse("2026-10-19T18:00:01Z"), NOW));   // 13:00:01 Lima
        assertFalse(OfferRule.isActive(DISCOUNT, OffsetDateTime.parse("2026-10-19T16:59:59Z"), NOW));  // 11:59:59 Lima
    }
}
