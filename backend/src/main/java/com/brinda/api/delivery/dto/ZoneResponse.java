package com.brinda.api.delivery.dto;

import com.brinda.api.delivery.model.DeliveryZone;

import java.math.BigDecimal;
import java.util.List;

public record ZoneResponse(Long id, String name, BigDecimal fee, boolean active, List<String> districts) {

    public static ZoneResponse from(DeliveryZone z, List<String> districts) {
        return new ZoneResponse(z.getId(), z.getName(), z.getFee(), z.isActive(), districts);
    }
}
