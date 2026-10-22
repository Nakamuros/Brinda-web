package com.brinda.api.order.service;

import com.brinda.api.combo.model.ComboItem;
import com.brinda.api.combo.repository.ComboItemRepository;
import com.brinda.api.order.model.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/** Contenido de los combos de un pedido ("2 x Whisky X") para WhatsApp y boleta. La composición de un combo no cambia. */
@Component
@RequiredArgsConstructor
public class OrderComboContents {

    private final ComboItemRepository comboItemRepository;

    /** Por id de combo; los productos normales no aparecen en el mapa. */
    @Transactional(readOnly = true)
    public Map<UUID, List<String>> of(Collection<OrderItem> items) {
        List<UUID> ids = items.stream().map(OrderItem::getProductId).distinct().toList();
        Map<UUID, List<String>> contents = new LinkedHashMap<>();
        if (ids.isEmpty()) {
            return contents;
        }
        for (ComboItem ci : comboItemRepository.findByComboIdInOrderByIdAsc(ids)) {
            contents.computeIfAbsent(ci.getCombo().getId(), k -> new java.util.ArrayList<>())
                    .add(ci.getQuantity() + " x " + ci.getProduct().getName());
        }
        return contents;
    }
}
