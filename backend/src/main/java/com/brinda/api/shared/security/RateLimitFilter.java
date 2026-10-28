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

/** Protege los endpoints públicos delicados: pedidos anónimos, login y Libro de Reclamaciones. Límite por IP. */
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private static final String COMPLAINT_COPY = "/api/v1/complaints/copy/";
    private static final Duration WINDOW = Duration.ofMinutes(1);

    private final SecurityProperties props;
    private final ObjectMapper objectMapper;
    private final SlidingWindowLimiter limiter = new SlidingWindowLimiter();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        int limit = limitFor(request);
        if (limit > 0 && !limiter.tryAcquire(keyFor(request) + "|" + ClientIp.of(request), limit, WINDOW)) {
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

    /** Las copias de reclamos llevan el token en la ruta: se agrupan para que adivinar tokens también cuente. */
    private static String keyFor(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith(COMPLAINT_COPY) ? COMPLAINT_COPY : uri;
    }

    private int limitFor(HttpServletRequest request) {
        if ("GET".equals(request.getMethod()) && request.getRequestURI().startsWith(COMPLAINT_COPY)) {
            return props.complaintCopiesPerMinute();
        }
        if (!"POST".equals(request.getMethod())) {
            return 0;
        }
        return switch (request.getRequestURI()) {
            case "/api/v1/orders" -> props.ordersPerMinute();
            case "/api/v1/auth/login" -> props.loginsPerMinute();
            case "/api/v1/complaints" -> props.complaintsPerMinute();
            default -> 0;
        };
    }
}
