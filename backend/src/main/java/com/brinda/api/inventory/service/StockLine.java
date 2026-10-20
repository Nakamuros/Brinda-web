package com.brinda.api.inventory.service;

import java.util.UUID;

/** Línea que el módulo order le pide a inventory descontar o devolver. */
public record StockLine(UUID productId, int quantity) {
}
