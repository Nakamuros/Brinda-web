package com.brinda.api.shared.audit;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/** Registra eventos sensibles. Nunca recibe datos personales (DNI, teléfono, dirección, etc.). */
@Service
@RequiredArgsConstructor
public class AuditService {

    private static final int MAX_DETAILS = 500;

    private final AuditLogRepository repository;

    @Transactional
    public void record(UUID userId, String action, String entity, String entityId, String ip) {
        record(userId, action, entity, entityId, ip, null);
    }

    /** {@code details}: valor anterior -> nuevo (ej. "price 40.00 -> 30.00"). Se recorta a 500 caracteres. */
    @Transactional
    public void record(UUID userId, String action, String entity, String entityId, String ip, String details) {
        String safe = details == null || details.isBlank() ? null
                : details.length() > MAX_DETAILS ? details.substring(0, MAX_DETAILS) : details;
        repository.save(new AuditLog(userId, action, entity, entityId, ip, safe));
    }
}
