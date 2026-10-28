package com.brinda.api.complaint.dto;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** DNI = 8 dígitos; CE = 8 a 12 caracteres alfanuméricos (criterio por confirmar con el asesor). Error en {@code documentNumber}. */
@Documented
@Constraint(validatedBy = ValidDocument.Validator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDocument {

    String message() default "Documento inválido";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class Validator implements ConstraintValidator<ValidDocument, CreateComplaintRequest> {

        @Override
        public boolean isValid(CreateComplaintRequest r, ConstraintValidatorContext ctx) {
            if (r.documentType() == null || r.documentNumber() == null) {
                return true; // lo reportan @NotNull / @NotBlank
            }
            boolean ok = switch (r.documentType()) {
                case DNI -> r.documentNumber().matches("^[0-9]{8}$");
                case CE -> r.documentNumber().matches("^[A-Za-z0-9]{8,12}$");
            };
            if (!ok) {
                ctx.disableDefaultConstraintViolation();
                ctx.buildConstraintViolationWithTemplate(r.documentType() == com.brinda.api.complaint.model.DocumentType.DNI
                                ? "El DNI debe tener 8 dígitos"
                                : "El CE debe tener entre 8 y 12 letras o números")
                        .addPropertyNode("documentNumber").addConstraintViolation();
            }
            return ok;
        }
    }
}
