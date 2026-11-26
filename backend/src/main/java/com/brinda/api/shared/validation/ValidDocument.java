package com.brinda.api.shared.validation;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Número de documento según su tipo: DNI = 8 dígitos; CE = 8 a 12 alfanuméricos; PASSPORT = 6 a 12 alfanuméricos
 * (criterios por confirmar con el asesor). Cada formulario decide qué tipos admite con su propio enum
 * (el Libro de Reclamaciones solo DNI y CE). Error en {@code documentNumber}.
 */
@Documented
@Constraint(validatedBy = ValidDocument.Validator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidDocument {

    String message() default "Documento inválido";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    /** Lo implementa el record validado. */
    interface HasDocument {
        Enum<?> documentType();

        String documentNumber();
    }

    class Validator implements ConstraintValidator<ValidDocument, HasDocument> {

        @Override
        public boolean isValid(HasDocument r, ConstraintValidatorContext ctx) {
            if (r.documentType() == null || r.documentNumber() == null) {
                return true; // lo reportan @NotNull / @NotBlank
            }
            String error = error(r.documentType().name(), r.documentNumber());
            if (error != null) {
                ctx.disableDefaultConstraintViolation();
                ctx.buildConstraintViolationWithTemplate(error).addPropertyNode("documentNumber")
                        .addConstraintViolation();
            }
            return error == null;
        }

        /** Mensaje de error, o null si el número es válido para ese tipo. */
        static String error(String type, String number) {
            return switch (type) {
                case "DNI" -> number.matches("^[0-9]{8}$") ? null : "El DNI debe tener 8 dígitos";
                case "CE" -> number.matches("^[A-Za-z0-9]{8,12}$") ? null
                        : "El CE debe tener entre 8 y 12 letras o números";
                case "PASSPORT" -> number.matches("^[A-Za-z0-9]{6,12}$") ? null
                        : "El pasaporte debe tener entre 6 y 12 letras o números";
                default -> "Tipo de documento inválido";
            };
        }
    }
}
