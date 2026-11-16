package com.brinda.api.order.controller;

import com.brinda.api.order.dto.SalesReportResponse;
import com.brinda.api.order.service.SalesReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/** Ventas del panel (solo ROLE_ADMIN: toda la ruta /api/v1/admin/** lo exige). */
@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class SalesReportController {

    private final SalesReportService service;

    @GetMapping("/sales")
    public SalesReportResponse sales(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return service.report(from, to);
    }
}
