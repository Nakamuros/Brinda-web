package com.brinda.api.order.controller;

import com.brinda.api.order.dto.CreateOrderRequest;
import com.brinda.api.order.dto.CreatedOrderResponse;
import com.brinda.api.order.service.OrderService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Único endpoint público de pedidos. Sin consulta por código: el detalle solo existe en el panel. */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreatedOrderResponse create(@Valid @RequestBody CreateOrderRequest request, HttpServletRequest http) {
        return service.create(request, ClientIp.of(http));
    }
}
