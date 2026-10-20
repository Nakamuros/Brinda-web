package com.brinda.api.shared.audit;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(nullable = false, length = 40)
    private String action;

    @Column(length = 60)
    private String entity;

    @Column(name = "entity_id", length = 64)
    private String entityId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /** Valor anterior -> nuevo (máx. 500). Nunca datos personales. */
    @Column(columnDefinition = "text")
    private String details;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public AuditLog(UUID userId, String action, String entity, String entityId, String ipAddress, String details) {
        this.userId = userId;
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
        this.ipAddress = ipAddress;
        this.details = details;
    }
}
