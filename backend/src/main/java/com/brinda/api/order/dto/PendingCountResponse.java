package com.brinda.api.order.dto;

/** Contador liviano para el polling del panel (cada 10-15 s). */
public record PendingCountResponse(long pending) {
}
