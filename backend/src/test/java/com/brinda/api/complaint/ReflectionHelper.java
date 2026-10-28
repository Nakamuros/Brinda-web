package com.brinda.api.complaint;

import com.brinda.api.complaint.model.EmailDelivery;

import java.lang.reflect.Field;
import java.time.OffsetDateTime;

/** Solo para pruebas: retrocede el último intento sin añadir un setter a la entidad. */
final class ReflectionHelper {

    private ReflectionHelper() {
    }

    static void setLastAttempt(EmailDelivery delivery, OffsetDateTime when) {
        try {
            Field f = EmailDelivery.class.getDeclaredField("lastAttemptAt");
            f.setAccessible(true);
            f.set(delivery, when);
        } catch (ReflectiveOperationException ex) {
            throw new IllegalStateException(ex);
        }
    }
}
