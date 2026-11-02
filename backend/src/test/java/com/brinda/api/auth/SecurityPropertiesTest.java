package com.brinda.api.auth;

import com.brinda.api.auth.security.SecurityProperties;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class SecurityPropertiesTest {

    private static SecurityProperties with(List<String> origins) {
        return new SecurityProperties(origins, 5, 15, 5, 10, 3, 20, 1);
    }

    @Test
    void corsConComodinOVacioNoArranca() {
        assertThrows(IllegalStateException.class, () -> with(List.of("*")));
        assertThrows(IllegalStateException.class, () -> with(List.of("https://*.example.com")));
        assertThrows(IllegalStateException.class, () -> with(List.of(" ")));
    }

    @Test
    void corsConOrigenExactoEsValido() {
        assertDoesNotThrow(() -> with(List.of("https://brinda.example", "http://localhost:4200")));
    }
}
