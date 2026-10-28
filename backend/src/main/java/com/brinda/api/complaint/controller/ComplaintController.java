package com.brinda.api.complaint.controller;

import com.brinda.api.complaint.dto.CreateComplaintRequest;
import com.brinda.api.complaint.dto.CreatedComplaintResponse;
import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.service.ComplaintNotifier;
import com.brinda.api.complaint.service.ComplaintPdfService;
import com.brinda.api.complaint.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/** Libro de Reclamaciones público. Sin listado ni consulta por número: la copia solo sale con su token. */
@RestController
@RequestMapping("/api/v1/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService service;
    private final ComplaintNotifier notifier;
    private final ComplaintPdfService pdf;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedComplaintResponse create(@Valid @RequestBody CreateComplaintRequest request) {
        if (request.isHoneypotFilled()) {
            // Un bot cree que funcionó; no se guarda nada ni se envía correo.
            return new CreatedComplaintResponse("LR-0000-000000", 0, 0, LocalDate.now(), "", "");
        }
        ComplaintService.Created created = service.create(request);
        notifier.dispatch(created.id()); // después de guardar; nunca lanza
        return created.response();
    }

    @GetMapping("/copy/{token}")
    public ResponseEntity<byte[]> copy(@PathVariable String token) {
        if (token.length() > 64) {
            throw new com.brinda.api.shared.exception.ResourceNotFoundException("Copia no encontrada");
        }
        Complaint c = service.findByCopyToken(token);
        byte[] bytes = pdf.render(c);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename("hoja-reclamacion-" + c.getCode() + ".pdf").build().toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(bytes);
    }
}
