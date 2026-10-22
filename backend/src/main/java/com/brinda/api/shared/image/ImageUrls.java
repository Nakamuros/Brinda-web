package com.brinda.api.shared.image;

/**
 * image_url admite una ruta relativa ("products/WHI-001.webp") o una URL absoluta.
 * Las relativas se resuelven contra la URL base, así cambiar de almacenamiento no toca los datos.
 */
public final class ImageUrls {

    private ImageUrls() {
    }

    public static String resolve(String baseUrl, String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String v = value.trim();
        if (v.startsWith("http://") || v.startsWith("https://") || baseUrl == null || baseUrl.isBlank()) {
            return v;
        }
        String base = baseUrl.trim();
        while (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        while (v.startsWith("/")) {
            v = v.substring(1);
        }
        return base + "/" + v;
    }
}
