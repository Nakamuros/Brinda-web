package com.brinda.api.inventory.controller;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.catalog.dto.AdminProductResponse;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.inventory.dto.AdjustRequest;
import com.brinda.api.inventory.dto.MovementResponse;
import com.brinda.api.inventory.dto.RestockBatchRequest;
import com.brinda.api.inventory.dto.RestockRequest;
import com.brinda.api.inventory.service.InventoryService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/inventory")
@RequiredArgsConstructor
public class InventoryAdminController {

    private final InventoryService service;

    @GetMapping("/alerts")
    public List<AdminProductResponse> alerts() {
        return service.alerts();
    }

    @PostMapping("/products/{id}/restock")
    @ResponseStatus(HttpStatus.CREATED)
    public MovementResponse restock(@PathVariable UUID id, @Valid @RequestBody RestockRequest req,
                                    @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.restock(id, req, user.id(), ClientIp.of(http));
    }

    @PostMapping("/restock-batch")
    @ResponseStatus(HttpStatus.CREATED)
    public List<MovementResponse> restockBatch(@Valid @RequestBody RestockBatchRequest req,
                                               @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.restockBatch(req, user.id(), ClientIp.of(http));
    }

    @PostMapping("/products/{id}/adjust")
    @ResponseStatus(HttpStatus.CREATED)
    public MovementResponse adjust(@PathVariable UUID id, @Valid @RequestBody AdjustRequest req,
                                   @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.adjust(id, req, user.id(), ClientIp.of(http));
    }

    @GetMapping("/products/{id}/movements")
    public PageResponse<MovementResponse> movements(@PathVariable UUID id,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        return service.movements(id, page, size);
    }
}
