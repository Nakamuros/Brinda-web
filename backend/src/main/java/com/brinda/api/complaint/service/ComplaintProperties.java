package com.brinda.api.complaint.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * {@code providerAddress}: domicilio del proveedor que se escribe en la hoja (sobrescribe el de la plantilla).
 * {@code ownerEmail}: aviso a Lucía por cada reclamo nuevo (vacío = no se avisa por correo).
 * {@code responseBusinessDays}: plazo de respuesta de la hoja (15 días hábiles, improrrogable).
 */
@ConfigurationProperties(prefix = "brinda.complaints")
public record ComplaintProperties(
        String providerName,
        String providerRuc,
        String providerAddress,
        String ownerEmail,
        int maxEmailAttempts,
        int responseBusinessDays
) {
}
