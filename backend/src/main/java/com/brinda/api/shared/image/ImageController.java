package com.brinda.api.shared.image;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.time.Duration;

/** Fotos de productos: las sube el panel (solo admin) y las lee la tienda (público). */
@RestController
@RequiredArgsConstructor
public class ImageController {

    private final ImageStore store;
    private final ImageProperties imageProperties;
    private final AuditService auditService;

    /** key = valor que se guarda en image_url del producto; url = dirección para mostrarla ya. */
    public record UploadedImage(String key, String url) {
    }

    @PostMapping(path = "/api/v1/admin/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public UploadedImage upload(@RequestParam("file") MultipartFile file,
                                @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http)
            throws IOException {
        String name = store.save(file.getBytes());
        auditService.record(user.id(), "IMAGE_UPLOAD", "images", name, ClientIp.of(http));
        String key = store.keyOf(name);
        return new UploadedImage(key, ImageUrls.resolve(imageProperties.baseUrl(), key));
    }

    @GetMapping(ImageStore.PUBLIC_PATH + "{name}")
    public ResponseEntity<Resource> image(@PathVariable String name) {
        Path file = store.find(name).orElseThrow(() -> new ResourceNotFoundException("Imagen no encontrada"));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(ImageStore.contentTypeOf(name)))
                // El nombre es único por archivo: se puede cachear sin caducidad práctica.
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .body(new FileSystemResource(file));
    }
}
