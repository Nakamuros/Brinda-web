package com.brinda.api.auth.security;

import com.brinda.api.auth.model.User;
import com.brinda.api.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Autentica con la cookie HttpOnly. Un token inválido o vencido simplemente deja la petición
 * sin autenticar (el entry point responde 401); nunca lanza 500.
 * Con must_change_password solo se concede PASSWORD_CHANGE_REQUIRED: ningún endpoint con rol responde.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    public static final String PASSWORD_CHANGE_AUTHORITY = "PASSWORD_CHANGE_REQUIRED";

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            jwtService.validate(token)
                    .flatMap(userRepository::findById)
                    .filter(User::isActive)
                    .filter(u -> !u.isLocked())
                    .ifPresent(this::authenticate);
        }
        chain.doFilter(request, response);
    }

    private void authenticate(User user) {
        String authority = user.isMustChangePassword() ? PASSWORD_CHANGE_AUTHORITY : user.getRole().name();
        var auth = new UsernamePasswordAuthenticationToken(
                new AuthenticatedUser(user.getId(), user.getUsername()), null,
                List.of(new SimpleGrantedAuthority(authority)));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private String extractToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (jwtService.cookieName().equals(cookie.getName()) && !cookie.getValue().isBlank()) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
