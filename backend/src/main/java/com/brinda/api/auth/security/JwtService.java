package com.brinda.api.auth.security;

import com.brinda.api.auth.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class JwtService {

    private static final String VERSION_CLAIM = "tv";

    /** Lo que se lee de un token válido: el usuario y la versión de sesión con la que se emitió. */
    public record Session(UUID userId, int tokenVersion) {
    }

    private final JwtProperties props;
    private final SecretKey key;

    public JwtService(JwtProperties props) {
        this.props = props;
        this.key = Keys.hmacShaKeyFor(props.secret().getBytes(StandardCharsets.UTF_8));
    }

    public String generate(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId().toString())
                .claim("role", user.getRole().name())
                .claim(VERSION_CLAIM, user.getTokenVersion())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(Duration.ofMinutes(props.expirationMinutes()))))
                .signWith(key)
                .compact();
    }

    /** Devuelve la sesión si el token está bien firmado y no ha vencido; vacío en cualquier otro caso. */
    public Optional<Session> validate(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            Integer version = claims.get(VERSION_CLAIM, Integer.class);
            if (version == null) {
                return Optional.empty();
            }
            return Optional.of(new Session(UUID.fromString(claims.getSubject()), version));
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    public ResponseCookie sessionCookie(String token) {
        return base(token).maxAge(Duration.ofMinutes(props.expirationMinutes())).build();
    }

    public ResponseCookie clearCookie() {
        return base("").maxAge(Duration.ZERO).build();
    }

    public String cookieName() {
        return props.cookieName();
    }

    private ResponseCookie.ResponseCookieBuilder base(String value) {
        return ResponseCookie.from(props.cookieName(), value)
                .httpOnly(true)
                .secure(props.cookieSecure())
                .sameSite("Strict")
                .path("/api");
    }
}
