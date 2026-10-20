package com.brinda.api.auth.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "brinda.security")
public record SecurityProperties(
        List<String> corsAllowedOrigins,
        int maxFailedAttempts,
        int lockMinutes,
        int ordersPerMinute,
        int loginsPerMinute
) {
}
