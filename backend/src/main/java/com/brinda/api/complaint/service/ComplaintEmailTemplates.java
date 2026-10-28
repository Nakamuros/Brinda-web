package com.brinda.api.complaint.service;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.GoodType;
import com.brinda.api.shared.mail.EmailMessage;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Plantillas de texto fijo de los correos del Libro de Reclamaciones.
 * POR CONFIRMAR con el asesor: redacción, remitente y si la copia por correo basta como constancia.
 * El aviso a Lucía no lleva datos personales del consumidor (solo número, tipo y fecha).
 */
final class ComplaintEmailTemplates {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final int SUMMARY_MAX = 200;

    private ComplaintEmailTemplates() {
    }

    static EmailMessage consumerCopy(Complaint c, ComplaintProperties props, byte[] pdf) {
        String body = """
                Hemos recibido tu %s en el Libro de Reclamaciones de %s (RUC %s).

                N° de reclamo: %s
                Fecha: %s
                Bien contratado: %s · %s

                Responderemos en un plazo no mayor a quince (15) días hábiles, que es improrrogable.
                Adjuntamos la copia de tu Hoja de Reclamación en PDF.
                """.formatted(typeLabel(c), props.providerName(), props.providerRuc(), c.getCode(), date(c),
                goodLabel(c), summary(c.getGoodDescription()));
        return new EmailMessage(c.getId().toString(), c.getConsumerEmail(),
                "Copia de tu Hoja de Reclamación " + c.getCode(), body,
                List.of(new EmailMessage.Attachment("hoja-reclamacion-" + c.getCode() + ".pdf", "application/pdf", pdf)));
    }

    static EmailMessage ownerNotice(Complaint c, ComplaintProperties props, byte[] pdf) {
        String body = """
                Nuevo %s en el Libro de Reclamaciones.

                N° de reclamo: %s
                Fecha: %s

                Respóndelo desde el panel (sección Reclamos) dentro de los quince (15) días hábiles.
                """.formatted(typeLabel(c), c.getCode(), date(c));
        return new EmailMessage(c.getId().toString(), props.ownerEmail(),
                "Nuevo " + typeLabel(c) + " " + c.getCode(), body,
                List.of(new EmailMessage.Attachment("hoja-reclamacion-" + c.getCode() + ".pdf", "application/pdf", pdf)));
    }

    private static String typeLabel(Complaint c) {
        return c.getComplaintType() == ComplaintType.CLAIM ? "reclamo" : "queja";
    }

    private static String goodLabel(Complaint c) {
        return c.getGoodType() == GoodType.PRODUCT ? "Producto" : "Servicio";
    }

    private static String date(Complaint c) {
        return DATE.format(c.getFiledAt().atZoneSameInstant(ComplaintPdfService.LIMA));
    }

    private static String summary(String text) {
        String one = text.replaceAll("\\s+", " ").strip();
        return one.length() <= SUMMARY_MAX ? one : one.substring(0, SUMMARY_MAX - 1) + "…";
    }
}
