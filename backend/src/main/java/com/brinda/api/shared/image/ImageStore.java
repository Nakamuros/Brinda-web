package com.brinda.api.shared.image;

import com.brinda.api.shared.exception.BusinessRuleException;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Guarda y entrega las fotos subidas desde el panel. Seguridad:
 * - el tipo se decide por los primeros bytes del archivo (PNG, JPEG o WebP), no por su nombre ni su Content-Type;
 *   SVG y cualquier otro formato se rechazan;
 * - el nombre en disco lo genera el servidor (UUID): nada de lo que envía el navegador llega a una ruta;
 * - al leer, solo se aceptan nombres con esa misma forma (sin "..", barras ni otras extensiones).
 */
@Component
public class ImageStore {

    public static final String PUBLIC_PATH = "/api/v1/catalog/images/";
    public static final long MAX_BYTES = 3L * 1024 * 1024;
    private static final Pattern NAME = Pattern.compile("^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\\.(png|jpg|webp)$");

    private final Path dir;
    private final String publicUrl;

    public ImageStore(ImageUploadProperties props) {
        this.dir = Path.of(props.dir() == null || props.dir().isBlank() ? "uploads" : props.dir().trim())
                .toAbsolutePath().normalize();
        this.publicUrl = props.publicUrl() == null ? "" : props.publicUrl().trim().replaceAll("/+$", "");
    }

    /** Guarda la imagen y devuelve su nombre en disco. */
    public String save(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            throw new BusinessRuleException("El archivo está vacío");
        }
        if (bytes.length > MAX_BYTES) {
            throw new BusinessRuleException("La imagen no puede pesar más de 3 MB");
        }
        String ext = extensionOf(bytes);
        if (ext == null) {
            throw new BusinessRuleException("La imagen debe ser PNG, JPG o WebP");
        }
        String name = UUID.randomUUID() + "." + ext;
        try {
            Files.createDirectories(dir);
            Files.write(dir.resolve(name), bytes);
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo guardar la imagen", e);
        }
        return name;
    }

    /** Ruta del archivo si el nombre tiene la forma que genera {@link #save} y existe. */
    public Optional<Path> find(String name) {
        if (name == null || !NAME.matcher(name).matches()) {
            return Optional.empty();
        }
        Path file = dir.resolve(name).normalize();
        return file.startsWith(dir) && Files.isRegularFile(file) ? Optional.of(file) : Optional.empty();
    }

    /** Valor que se guarda en image_url: URL pública si está configurada; si no, la ruta dentro de la API. */
    public String keyOf(String name) {
        return publicUrl.isEmpty() ? PUBLIC_PATH + name : publicUrl + "/" + name;
    }

    public static String contentTypeOf(String name) {
        if (name.endsWith(".png")) {
            return "image/png";
        }
        return name.endsWith(".webp") ? "image/webp" : "image/jpeg";
    }

    /** "png", "jpg" o "webp" según la firma del archivo; null si no es ninguno. */
    static String extensionOf(byte[] b) {
        if (b.length >= 8 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G'
                && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A) {
            return "png";
        }
        if (b.length >= 3 && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return "jpg";
        }
        if (b.length >= 12 && "RIFF".equals(new String(b, 0, 4, StandardCharsets.US_ASCII))
                && "WEBP".equals(new String(b, 8, 4, StandardCharsets.US_ASCII))) {
            return "webp";
        }
        return null;
    }
}
