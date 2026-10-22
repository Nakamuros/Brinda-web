package com.brinda.api.shared;

import com.brinda.api.shared.image.ImageUrls;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class ImageUrlsTest {

    @Test
    void vacioDevuelveNull() {
        assertNull(ImageUrls.resolve("https://img.x.com", null));
        assertNull(ImageUrls.resolve("https://img.x.com", "  "));
    }

    @Test
    void rutaRelativaSeResuelveContraLaBase() {
        assertEquals("https://img.x.com/products/a.webp", ImageUrls.resolve("https://img.x.com/", "/products/a.webp"));
        assertEquals("https://img.x.com/products/a.webp", ImageUrls.resolve("https://img.x.com", "products/a.webp"));
    }

    @Test
    void urlAbsolutaNoSeToca() {
        assertEquals("https://otro.com/a.webp", ImageUrls.resolve("https://img.x.com", "https://otro.com/a.webp"));
    }

    @Test
    void sinBaseSeDevuelveTalCual() {
        assertEquals("products/a.webp", ImageUrls.resolve("", "products/a.webp"));
        assertEquals("products/a.webp", ImageUrls.resolve(null, "products/a.webp"));
    }
}
