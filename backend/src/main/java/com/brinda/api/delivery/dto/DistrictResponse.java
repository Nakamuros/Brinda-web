package com.brinda.api.delivery.dto;

import com.brinda.api.delivery.model.District;

import java.math.BigDecimal;

public record DistrictResponse(Long id, String name, Long zoneId, String zoneName, BigDecimal fee, boolean active) {

    public static DistrictResponse from(District d) {
        return new DistrictResponse(d.getId(), d.getName(), d.getZone().getId(), d.getZone().getName(),
                d.getZone().getFee(), d.isActive());
    }
}
