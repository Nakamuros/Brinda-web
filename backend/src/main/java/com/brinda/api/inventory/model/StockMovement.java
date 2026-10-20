package com.brinda.api.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/** Historial inmutable: solo se insertan filas (el rol de la app no tiene UPDATE ni DELETE aquí). */
@Getter
@NoArgsConstructor
@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false, updatable = false)
    private UUID productId;

    @Column(name = "order_id", updatable = false)
    private UUID orderId;

    @Column(name = "created_by", updatable = false)
    private UUID createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20, updatable = false)
    private MovementType movementType;

    @Column(name = "quantity_change", nullable = false, updatable = false)
    private int quantityChange;

    @Column(name = "stock_after", nullable = false, updatable = false)
    private int stockAfter;

    @Column(length = 255, updatable = false)
    private String reason;

    /** En COMBO_CONSUME: combo al que se destinó el stock consumido. */
    @Column(name = "combo_id", updatable = false)
    private UUID comboId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public StockMovement(UUID productId, UUID orderId, UUID createdBy, MovementType movementType,
                         int quantityChange, int stockAfter, String reason) {
        this.productId = productId;
        this.orderId = orderId;
        this.createdBy = createdBy;
        this.movementType = movementType;
        this.quantityChange = quantityChange;
        this.stockAfter = stockAfter;
        this.reason = reason;
    }

    public StockMovement(UUID productId, UUID orderId, UUID createdBy, MovementType movementType,
                         int quantityChange, int stockAfter, String reason, UUID comboId) {
        this(productId, orderId, createdBy, movementType, quantityChange, stockAfter, reason);
        this.comboId = comboId;
    }
}
