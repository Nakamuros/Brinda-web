package com.brinda.api.complaint.controller;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.complaint.dto.ComplaintCountsResponse;
import com.brinda.api.complaint.dto.ComplaintDetailResponse;
import com.brinda.api.complaint.dto.ComplaintSummaryResponse;
import com.brinda.api.complaint.dto.DeadlineInfo;
import com.brinda.api.complaint.dto.RespondComplaintRequest;
import com.brinda.api.complaint.model.ComplaintStatus;
import com.brinda.api.complaint.model.ComplaintType;
import com.brinda.api.complaint.service.ComplaintAdminService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/** Panel de reclamos (login + ROLE_ADMIN por SecurityConfig). No existe ningún DELETE: los reclamos no se borran. */
@RestController
@RequestMapping("/api/v1/admin/complaints")
@RequiredArgsConstructor
public class ComplaintAdminController {

    private final ComplaintAdminService service;

    @GetMapping
    public PageResponse<ComplaintSummaryResponse> list(@RequestParam(required = false) ComplaintStatus status,
                                                       @RequestParam(required = false) ComplaintType type,
                                                       @RequestParam(required = false) String q,
                                                       @RequestParam(required = false) DeadlineInfo.Level deadline,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size) {
        return service.list(status, type, q, deadline, page, size);
    }

    @GetMapping("/counts")
    public ComplaintCountsResponse counts() {
        return service.counts();
    }

    @GetMapping("/{id}")
    public ComplaintDetailResponse detail(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser user,
                                          HttpServletRequest http) {
        return service.detail(id, user.id(), ClientIp.of(http));
    }

    @PostMapping("/{id}/respond")
    public ComplaintDetailResponse respond(@PathVariable UUID id, @Valid @RequestBody RespondComplaintRequest req,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.respond(id, req, user.id(), ClientIp.of(http));
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser user,
                                      HttpServletRequest http) {
        ComplaintAdminService.PdfFile file = service.pdf(id, user.id(), ClientIp.of(http));
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(file.fileName()).build().toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(file.bytes());
    }
}
