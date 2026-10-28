package com.brinda.api.complaint.service;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * {@code ownerEmail}: aviso a Lucía por cada reclamo nuevo (vacío = no se avisa por correo).
 * {@code responseBusinessDays}: plazo de respuesta de la hoja (15 días hábiles, improrrogable).
 */
@ConfigurationProperties(prefix = "brinda.complaints")
public record ComplaintProperties(
        String providerName,
        String providerRuc,
        String ownerEmail,
        int maxEmailAttempts,
        int responseBusinessDays
) {
}
