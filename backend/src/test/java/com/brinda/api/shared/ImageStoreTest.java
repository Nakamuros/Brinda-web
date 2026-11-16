package com.brinda.api.shared;

import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.image.ImageStore;
import com.brinda.api.shared.image.ImageUploadProperties;
import com.brinda.api.shared.image.ImageUrls;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ImageStoreTest {

    private static final byte[] PNG = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3};
    private static final byte[] JPG = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 1, 2};
    private static final byte[] WEBP = "RIFF\0\0\0\0WEBPVP8 ".getBytes(StandardCharsets.US_ASCII);

    @TempDir
    Path dir;

    private ImageStore store(String publicUrl) {
        return new ImageStore(new ImageUploadProperties(dir.toString(), publicUrl));
    }

    @Test
    void guardaPngJpgYWebpConNombreGeneradoPorElServidor() throws Exception {
        ImageStore store = store("");
        for (byte[] image : new byte[][]{PNG, JPG, WEBP}) {
            String name = store.save(image);
            assertTrue(name.matches("[0-9a-f-]{36}\\.(png|jpg|webp)"), name);
            assertArrayEquals(image, Files.readAllBytes(store.find(name).orElseThrow()));
        }
        assertTrue(store.save(PNG).endsWith(".png"));
        assertTrue(store.save(JPG).endsWith(".jpg"));
        assertTrue(store.save(WEBP).endsWith(".webp"));
    }

    @Test
    void rechazaLoQueNoEsImagenPermitidaAunqueDigaSerlo() {
        ImageStore store = store("");
        byte[] svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert(1)</script></svg>".getBytes(StandardCharsets.UTF_8);
        byte[] gif = "GIF89a....".getBytes(StandardCharsets.US_ASCII);
        assertThrows(BusinessRuleException.class, () -> store.save(svg));
        assertThrows(BusinessRuleException.class, () -> store.save(gif));
        assertThrows(BusinessRuleException.class, () -> store.save(new byte[0]));
        assertThrows(BusinessRuleException.class, () -> store.save(new byte[(int) ImageStore.MAX_BYTES + 1]));
    }

    @Test
    void alLeerSoloAceptaNombresGeneradosPorElServidor() throws Exception {
        ImageStore store = store("");
        Files.writeString(dir.resolveSibling("secreto.txt"), "x");
        Files.writeString(dir.resolve("otro.png"), "x");
        assertTrue(store.find("../secreto.txt").isEmpty());
        assertTrue(store.find("..\\secreto.txt").isEmpty());
        assertTrue(store.find("otro.png").isEmpty());
        assertTrue(store.find("00000000-0000-4000-8000-000000000000.png").isEmpty()); // no existe
        assertTrue(store.find(null).isEmpty());
    }

    @Test
    void laClaveGuardadaNoSeAlteraConLaUrlBaseDeLasFotosOficiales() {
        String name = "00000000-0000-4000-8000-000000000000.webp";
        assertEquals("/api/v1/catalog/images/" + name, store("").keyOf(name));
        assertEquals("https://api.x.com/api/v1/catalog/images/" + name,
                store("https://api.x.com/api/v1/catalog/images/").keyOf(name));
        // Con IMAGES_BASE_URL definido, la ruta de una foto subida no recibe ese prefijo.
        assertEquals("/api/v1/catalog/images/" + name,
                ImageUrls.resolve("https://img.x.com", "/api/v1/catalog/images/" + name));
    }
}
