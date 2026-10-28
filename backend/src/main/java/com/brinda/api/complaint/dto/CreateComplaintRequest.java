package com.brinda.api.complaint.dto;

import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.DocumentType;
import com.brinda.api.complaint.model.GoodType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Hoja de Reclamación pública y anónima. Un campo por cada campo de la hoja; sin pedido previo.
 * El documento: DNI = 8 dígitos; CE = 8 a 12 caracteres alfanuméricos (criterio por confirmar con el asesor).
 */
@ValidDocument
public record CreateComplaintRequest(
        @NotBlank @Size(max = 160) @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Nombre inválido") String consumerName,
        @NotNull DocumentType documentType,
        @NotBlank @Size(max = 12, message = "Documento inválido") String documentNumber,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Pattern(regexp = "^[0-9+() -]{6,20}$", message = "Teléfono inválido") String phone,
        @NotBlank @Email @Size(max = 120) String email,
        @Size(max = 160) String guardianName,
        @NotNull GoodType goodType,
        @DecimalMin(value = "0.00", message = "El monto no puede ser negativo")
        @Digits(integer = 8, fraction = 2, message = "Monto inválido") BigDecimal claimedAmount,
        @NotBlank @Size(max = 500) String goodDescription,
        @NotNull ComplaintType complaintType,
        @NotBlank @Size(max = 2000) String detail,
        @NotBlank @Size(max = 1000) String consumerRequest,
        @AssertTrue(message = "Debes aceptar la política de privacidad") boolean privacyAccepted,
        /** Honeypot: un humano nunca lo ve ni lo llena. */
        @Size(max = 200) String website
) {

    public boolean isHoneypotFilled() {
        return website != null && !website.isBlank();
    }
}
