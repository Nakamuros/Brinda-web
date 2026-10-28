package com.brinda.api.complaint.service;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.model.GoodType;
import com.brinda.api.shared.crypto.DniCipher;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDCheckBox;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.apache.pdfbox.pdmodel.interactive.form.PDTextField;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * Rellena la Hoja de Reclamación oficial (AcroForm de 23 campos) y la entrega aplanada: el consumidor recibe una
 * copia idéntica al original con sus datos. Apache PDFBox (Apache 2.0). Los datos personales no se registran en logs.
 */
@Service
@RequiredArgsConstructor
public class ComplaintPdfService {

    public static final ZoneId LIMA = ZoneId.of("America/Lima");
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final String TEMPLATE = "legal/hoja-reclamacion.pdf";
    private static final double[] FONT_SIZES = {10, 9, 8, 7, 6, 5.5, 5};

    private static final CharsetEncoder WIN_ANSI = Charset.forName("windows-1252").newEncoder();

    private final DniCipher cipher;
    private byte[] template;

    public byte[] render(Complaint c) {
        try (PDDocument doc = Loader.loadPDF(template())) {
            PDAcroForm form = doc.getDocumentCatalog().getAcroForm();
            if (form == null) {
                throw new IllegalStateException("La plantilla de la hoja no tiene formulario");
            }
            form.setNeedAppearances(false);

            single(form, "dt_fecha", DATE.format(c.getFiledAt().atZoneSameInstant(LIMA)));
            single(form, "txtCorrelativo", String.format("%06d", c.getComplaintNumber()));
            single(form, "txtAnio", String.valueOf(c.getComplaintYear()));
            // txtRazonSocial, txtRUC, txtDomicilio y txtTipoHoja ya vienen prerrellenados en la plantilla oficial.

            single(form, "txtNombre", c.getConsumerName());
            single(form, "txtDNI", c.getDocumentType().name() + " " + cipher.decrypt(c.getDocumentEncrypted()));
            single(form, "txtDomicilioReclamante", c.getConsumerAddress());
            single(form, "txtTelefono", c.getConsumerPhone());
            single(form, "txtCorreo", c.getConsumerEmail());
            single(form, "txtPadre", c.getGuardianName());

            check(form, "chkTipoBienProducto", c.getGoodType() == GoodType.PRODUCT);
            check(form, "chkTipoBienServicio", c.getGoodType() == GoodType.SERVICE);
            single(form, "txtMonto", c.getClaimedAmount() == null ? null : "S/ " + c.getClaimedAmount().toPlainString());
            single(form, "txtDescripcion", c.getGoodDescription());

            check(form, "chkReclamo", c.getComplaintType() == ComplaintType.CLAIM);
            check(form, "chkQueja", c.getComplaintType() == ComplaintType.COMPLAINT);
            multi(form, "txtDetalle", c.getDetail());
            multi(form, "txtPedido", c.getConsumerRequest());

            if (c.getStatus() == ComplaintStatus.ANSWERED) {
                LocalDate responded = c.getResponseDate();
                single(form, "dtFechaRpta", responded == null ? null : DATE.format(responded));
                multi(form, "txtObservaciones", c.getResponseText());
            }

            form.flatten();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            doc.save(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new UncheckedIOException("No se pudo generar la hoja de reclamación", ex);
        }
    }

    private byte[] template() throws IOException {
        if (template == null) {
            try (InputStream in = new ClassPathResource(TEMPLATE).getInputStream()) {
                template = in.readAllBytes();
            }
        }
        return template;
    }

    private static void single(PDAcroForm form, String name, String value) throws IOException {
        PDField field = field(form, name);
        field.setValue(clean(value, false));
    }

    /** Campo de varias líneas: reduce la letra para que el texto completo quepa en el recuadro oficial. */
    private static void multi(PDAcroForm form, String name, String value) throws IOException {
        PDTextField field = (PDTextField) field(form, name);
        String text = clean(value, true);
        PDRectangle rect = field.getWidgets().get(0).getRectangle();
        double size = fitFontSize(text, rect.getWidth() - 4, rect.getHeight() - 4);
        field.setDefaultAppearance("/Helv " + size + " Tf 0 g");
        field.setValue(text);
    }

    private static void check(PDAcroForm form, String name, boolean on) throws IOException {
        PDCheckBox box = (PDCheckBox) field(form, name);
        if (on) {
            box.check();
        } else {
            box.unCheck();
        }
    }

    private static PDField field(PDAcroForm form, String name) {
        PDField f = form.getField(name);
        if (f == null) {
            throw new IllegalStateException("La plantilla no tiene el campo " + name);
        }
        return f;
    }

    /** Estimación conservadora (Helvetica ~0,55 em por carácter) del mayor tamaño con el que el texto cabe. */
    public static double fitFontSize(String text, double width, double height) {
        for (double size : FONT_SIZES) {
            int perLine = Math.max(1, (int) (width / (size * 0.55)));
            int lines = 0;
            for (String paragraph : text.split("\n", -1)) {
                lines += Math.max(1, (int) Math.ceil(paragraph.length() / (double) perLine));
            }
            if (lines * size * 1.2 <= height) {
                return size;
            }
        }
        return FONT_SIZES[FONT_SIZES.length - 1];
    }

    /** Deja solo lo que Helvetica (WinAnsi) puede dibujar: el resto de caracteres se cambia por "?". */
    public static String clean(String value, boolean keepNewlines) {
        if (value == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder(value.length());
        for (char ch : value.replace("\r\n", "\n").replace('\r', '\n').toCharArray()) {
            if (ch == '\n') {
                sb.append(keepNewlines ? '\n' : ' ');
            } else if (Character.isISOControl(ch)) {
                sb.append(' ');
            } else {
                sb.append(synchronizedCanEncode(ch) ? ch : '?');
            }
        }
        return sb.toString().strip();
    }

    private static synchronized boolean synchronizedCanEncode(char ch) {
        return WIN_ANSI.canEncode(ch);
    }
}
