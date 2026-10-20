package com.brinda.api.shared.security;

import com.brinda.api.auth.security.SecurityProperties;
import com.brinda.api.shared.exception.ErrorResponse;
import com.brinda.api.shared.util.ClientIp;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

/** Protege los dos endpoints públicos delicados: pedidos anónimos y login. Límite por IP. */
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Duration WINDOW = Duration.ofMinutes(1);

    private final SecurityProperties props;
    private final ObjectMapper objectMapper;
    private final SlidingWindowLimiter limiter = new SlidingWindowLimiter();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        int limit = limitFor(request);
        if (limit > 0 && !limiter.tryAcquire(request.getRequestURI() + "|" + ClientIp.of(request), limit, WINDOW)) {
            response.setStatus(429);
            response.setHeader("Retry-After", String.valueOf(WINDOW.toSeconds()));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");
            objectMapper.writeValue(response.getWriter(),
                    ErrorResponse.of(429, "TOO_MANY_REQUESTS", "Demasiados intentos. Espera un minuto e inténtalo de nuevo."));
            return;
        }
        chain.doFilter(request, response);
    }

    private int limitFor(HttpServletRequest request) {
        if (!"POST".equals(request.getMethod())) {
            return 0;
        }
        return switch (request.getRequestURI()) {
            case "/api/v1/orders" -> props.ordersPerMinute();
            case "/api/v1/auth/login" -> props.loginsPerMinute();
            default -> 0;
        };
    }
}
