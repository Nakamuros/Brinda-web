package com.brinda.api.auth;

import com.brinda.api.auth.model.Role;
import com.brinda.api.auth.model.User;
import com.brinda.api.auth.security.JwtProperties;
import com.brinda.api.auth.security.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String SECRET = "una-clave-de-prueba-de-al-menos-32-caracteres!!";
    private final JwtService jwt = new JwtService(new JwtProperties(SECRET, 480, "brinda_token", false));

    private User user() {
        User u = new User();
        u.setId(UUID.randomUUID());
        u.setRole(Role.ROLE_ADMIN);
        return u;
    }

    @Test
    void elTokenLlevaLaVersionDelUsuario() {
        User u = user();
        u.invalidateSessions();
        var session = jwt.validate(jwt.generate(u)).orElseThrow();
        assertEquals(u.getId(), session.userId());
        assertEquals(1, session.tokenVersion());
    }

    @Test
    void invalidarSesionesCambiaLaVersionEsperada() {
        User u = user();
        String viejo = jwt.generate(u);
        u.invalidateSessions();
        assertTrue(jwt.validate(viejo).orElseThrow().tokenVersion() != u.getTokenVersion());
    }

    @Test
    void tokenSinVersionNoEsValido() {
        String sinVersion = Jwts.builder().subject(UUID.randomUUID().toString())
                .expiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8))).compact();
        assertTrue(jwt.validate(sinVersion).isEmpty());
    }
}
