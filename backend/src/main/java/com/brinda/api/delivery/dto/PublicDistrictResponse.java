package com.brinda.api.delivery.dto;

import com.brinda.api.delivery.model.District;

import java.math.BigDecimal;

/** Lista desplegable del formulario de entrega: distrito y tarifa estimada. */
public record PublicDistrictResponse(Long id, String name, String zoneName, BigDecimal fee) {

    public static PublicDistrictResponse from(District d) {
        return new PublicDistrictResponse(d.getId(), d.getName(), d.getZone().getName(), d.getZone().getFee());
    }
}
