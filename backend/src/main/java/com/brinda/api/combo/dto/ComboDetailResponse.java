package com.brinda.api.combo.dto;

import com.brinda.api.catalog.dto.AdminProductResponse;
import com.brinda.api.combo.model.ComboItem;

import java.util.List;
import java.util.UUID;

/** buildableNow = cuántos combos más se podrían armar con el stock actual de los componentes. */
public record ComboDetailResponse(AdminProductResponse combo, List<Line> items, int buildableNow) {

    public record Line(UUID productId, String name, int quantity, int stockQuantity, boolean available) {

        public static Line from(ComboItem i) {
            return new Line(i.getProduct().getId(), i.getProduct().getName(), i.getQuantity(),
                    i.getProduct().getStockQuantity(), i.getProduct().isAvailable());
        }
    }
}
