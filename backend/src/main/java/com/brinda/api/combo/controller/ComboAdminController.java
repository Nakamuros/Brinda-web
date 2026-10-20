package com.brinda.api.combo.controller;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.combo.dto.BuildComboRequest;
import com.brinda.api.combo.dto.ComboDetailResponse;
import com.brinda.api.combo.dto.ComboUpdateRequest;
import com.brinda.api.combo.dto.CreateComboRequest;
import com.brinda.api.combo.service.ComboService;
import com.brinda.api.shared.util.ClientIp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/combos")
@RequiredArgsConstructor
public class ComboAdminController {

    private final ComboService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComboDetailResponse create(@Valid @RequestBody CreateComboRequest req,
                                      @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.create(req, user.id(), ClientIp.of(http));
    }

    @GetMapping("/{id}")
    public ComboDetailResponse get(@PathVariable UUID id) {
        return service.detail(id);
    }

    @PostMapping("/{id}/build")
    public ComboDetailResponse build(@PathVariable UUID id, @Valid @RequestBody BuildComboRequest req,
                                     @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.build(id, req, user.id(), ClientIp.of(http));
    }

    @PutMapping("/{id}")
    public ComboDetailResponse update(@PathVariable UUID id, @Valid @RequestBody ComboUpdateRequest req,
                                      @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.update(id, req, user.id(), ClientIp.of(http));
    }
}
