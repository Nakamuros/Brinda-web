package com.brinda.api.order.dto;

import com.brinda.api.order.model.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

/** Pedido público y anónimo. Los precios NO viajan aquí: el servidor los calcula. */
public record CreateOrderRequest(
        @NotEmpty @Size(max = 30, message = "Máximo 30 productos distintos por pedido") List<@Valid @NotNull Item> items,
        @NotBlank @Pattern(regexp = "^[\\p{L} .'-]{1,80}$", message = "Nombre inválido") String firstName,
        @NotBlank @Pattern(regexp = "^[\\p{L} .'-]{1,80}$", message = "Apellido inválido") String lastName,
        @NotBlank @Pattern(regexp = "^[0-9]{9}$", message = "El celular debe tener 9 dígitos") String phone,
        @Pattern(regexp = "^([0-9]{8})?$", message = "El DNI debe tener 8 dígitos") String dni,
        @NotBlank @Size(max = 255) String address,
        @Size(max = 255) String reference,
        @NotNull Long districtId,
        @NotNull PaymentMethod paymentMethod,
        @AssertTrue(message = "Debes confirmar que eres mayor de 18 años") boolean adultConfirmed,
        @AssertTrue(message = "Debes aceptar los términos y condiciones") boolean termsAccepted,
        @AssertTrue(message = "Debes aceptar la política de privacidad") boolean privacyAccepted
) {

    public record Item(
            @NotNull UUID productId,
            @Min(1) @Max(50) int quantity
    ) {
    }
}
