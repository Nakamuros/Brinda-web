package com.brinda.api.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertTrue;

/** La sesión es JWT: la configuración base no debe dejar que Spring cree un usuario con clave generada en el log. */
class SecurityAutoConfigTest {

    @Test
    void usuarioEnMemoriaDeSpringEstaExcluido() throws IOException {
        Properties props = new Properties();
        try (InputStream in = new ClassPathResource("application.properties").getInputStream()) {
            props.load(in);
        }
        assertTrue(props.getProperty("spring.autoconfigure.exclude", "")
                        .contains(UserDetailsServiceAutoConfiguration.class.getName()),
                "UserDetailsServiceAutoConfiguration debe estar en spring.autoconfigure.exclude");
    }
}
