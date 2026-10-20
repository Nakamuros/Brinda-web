package com.brinda.api.order.controller;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.catalog.dto.PageResponse;
import com.brinda.api.order.dto.CancelOrderRequest;
import com.brinda.api.order.dto.OrderDetailResponse;
import com.brinda.api.order.dto.OrderSummaryResponse;
import com.brinda.api.order.dto.PendingCountResponse;
import com.brinda.api.order.dto.TextResponse;
import com.brinda.api.order.model.OrderStatus;
import com.brinda.api.order.service.OrderAdminService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class OrderAdminController {

    private final OrderAdminService service;

    @GetMapping
    public PageResponse<OrderSummaryResponse> list(@RequestParam(required = false) OrderStatus status,
                                                   @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "20") int size) {
        return service.list(status, page, size);
    }

    @GetMapping("/pending-count")
    public PendingCountResponse pendingCount() {
        return service.pendingCount();
    }

    @GetMapping("/{id}")
    public OrderDetailResponse detail(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser user,
                                      HttpServletRequest http) {
        return service.detail(id, user.id(), ClientIp.of(http));
    }

    @PostMapping("/{id}/confirm")
    public OrderDetailResponse confirm(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser user,
                                       HttpServletRequest http) {
        return service.confirm(id, user.id(), ClientIp.of(http));
    }

    @PostMapping("/{id}/cancel")
    public OrderDetailResponse cancel(@PathVariable UUID id, @Valid @RequestBody CancelOrderRequest req,
                                      @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.cancel(id, req, user.id(), ClientIp.of(http));
    }

    @GetMapping("/{id}/copy/delivery")
    public TextResponse deliveryText(@PathVariable UUID id) {
        return service.deliveryText(id);
    }

    @GetMapping("/{id}/copy/receipt")
    public TextResponse receiptText(@PathVariable UUID id, @AuthenticationPrincipal AuthenticatedUser user,
                                    HttpServletRequest http) {
        return service.receiptText(id, user.id(), ClientIp.of(http));
    }
}
