package com.brinda.api.inventory.dto;

import com.brinda.api.inventory.model.StockMovement;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MovementResponse(Long id, UUID productId, UUID orderId, UUID createdBy, String type,
                               int quantityChange, int stockAfter, String reason, UUID comboId,
                               OffsetDateTime createdAt) {

    public static MovementResponse from(StockMovement m) {
        return new MovementResponse(m.getId(), m.getProductId(), m.getOrderId(), m.getCreatedBy(),
                m.getMovementType().name(), m.getQuantityChange(), m.getStockAfter(), m.getReason(),
                m.getComboId(), m.getCreatedAt());
    }
}
