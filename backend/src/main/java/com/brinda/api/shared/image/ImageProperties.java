package com.brinda.api.shared.image;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** baseUrl: prefijo de las imágenes guardadas como ruta relativa (IMAGES_BASE_URL). Vacío = se devuelve la ruta tal cual. */
@ConfigurationProperties(prefix = "brinda.images")
public record ImageProperties(String baseUrl) {
}
