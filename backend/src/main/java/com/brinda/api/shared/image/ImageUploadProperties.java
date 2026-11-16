package com.brinda.api.shared.image;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Subida de fotos desde el panel. Los archivos van a una carpeta del servidor, nunca a la base de datos.
 * dir: carpeta donde se guardan (IMAGES_UPLOAD_DIR). En producción debe ser un disco PERSISTENTE:
 * el disco normal de Render se borra en cada despliegue.
 * publicUrl: URL pública de GET /api/v1/catalog/images (IMAGES_PUBLIC_URL), para cuando la web y la API
 * están en dominios distintos. Vacío = se guarda la ruta "/api/v1/catalog/images/..." (mismo origen).
 */
@ConfigurationProperties(prefix = "brinda.images.upload")
public record ImageUploadProperties(String dir, String publicUrl) {
}
