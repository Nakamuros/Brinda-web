package com.brinda.api.config;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Falla el build si db/migration (lo que corre en producción) contiene datos del seed de desarrollo.
 * Causa típica: un target/ viejo con V3 copiado antes de moverlo a seed-dev. Los builds de release usan `mvn clean`.
 */
class MigrationsSeedGuardTest {

    private static final List<String> SEED_MARKERS = List.of("admin@brinda.local", "Stock inicial (seed)");

    @Test
    void migracionesDeProduccionNoContienenElSeed() throws IOException, URISyntaxException {
        URL dir = getClass().getClassLoader().getResource("db/migration");
        assertTrue(dir != null && "file".equals(dir.getProtocol()), "No se encontró db/migration en target/classes");
        Path migrations = Paths.get(dir.toURI());
        try (Stream<Path> files = Files.list(migrations)) {
            for (Path f : files.filter(Files::isRegularFile).toList()) {
                String content = Files.readString(f);
                for (String marker : SEED_MARKERS) {
                    assertFalse(content.contains(marker),
                            f.getFileName() + " contiene datos del seed ('" + marker + "'). Ejecuta `mvn clean`.");
                }
            }
        }
    }
}
