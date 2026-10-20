package com.brinda.api.catalog;

import com.brinda.api.catalog.dto.PublicProductResponse;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PublicProductResponseTest {

    private static int pct(String price, String discount) {
        return PublicProductResponse.percent(new BigDecimal(price), new BigDecimal(discount));
    }

    @Test
    void porcentajeEntero() {
        assertEquals(25, pct("40.00", "30.00"));
    }

    @Test
    void redondeaHaciaArribaDesdeLaMitad() {
        assertEquals(6, pct("159.90", "149.90"));   // 6.25
        assertEquals(13, pct("40.00", "35.00"));    // 12.5 sube a 13
    }
}
