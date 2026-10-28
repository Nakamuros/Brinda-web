package com.brinda.api.complaint.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** Correlativo único por año, atómico: debe llamarse dentro de la transacción que guarda el reclamo. */
@Component
@RequiredArgsConstructor
public class ComplaintNumberGenerator {

    private final JdbcTemplate jdbc;

    public int next(int year) {
        Integer n = jdbc.queryForObject("""
                INSERT INTO complaint_counters (year, last_number) VALUES (?, 1)
                ON CONFLICT (year) DO UPDATE SET last_number = complaint_counters.last_number + 1
                RETURNING last_number""", Integer.class, year);
        return n == null ? 1 : n;
    }
}
