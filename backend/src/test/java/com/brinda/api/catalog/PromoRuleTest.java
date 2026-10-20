package com.brinda.api.catalog;

import com.brinda.api.catalog.model.PromoRule;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PromoRuleTest {

    private static final OffsetDateTime NOW = OffsetDateTime.parse("2026-10-19T12:00:00-05:00");

    @Test
    void sinCamposNoEstaActiva() {
        assertFalse(PromoRule.isActive(null, null, NOW.plusDays(1), NOW));
        assertFalse(PromoRule.isActive((short) 3, null, NOW.plusDays(1), NOW));
    }

    @Test
    void fechaFuturaEstaActiva() {
        assertTrue(PromoRule.isActive((short) 3, (short) 2, NOW.plusSeconds(1), NOW));
    }

    @Test
    void fechaPasadaOExactaNoEstaActiva() {
        assertFalse(PromoRule.isActive((short) 3, (short) 2, NOW.minusSeconds(1), NOW));
        assertFalse(PromoRule.isActive((short) 3, (short) 2, NOW, NOW));
    }

    @Test
    void sinFechaEsSinFin() {
        assertTrue(PromoRule.isActive((short) 2, (short) 1, null, NOW));
    }

    @Test
    void etiqueta() {
        assertEquals("Lleva 3, paga 2", PromoRule.label(3, 2));
    }
}
