package com.brinda.api.delivery.controller;

import com.brinda.api.auth.security.AuthenticatedUser;
import com.brinda.api.delivery.dto.DistrictRequest;
import com.brinda.api.delivery.dto.DistrictResponse;
import com.brinda.api.delivery.dto.ZoneRequest;
import com.brinda.api.delivery.dto.ZoneResponse;
import com.brinda.api.delivery.service.DeliveryAdminService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/delivery")
@RequiredArgsConstructor
public class DeliveryAdminController {

    private final DeliveryAdminService service;

    @GetMapping("/zones")
    public List<ZoneResponse> zones() {
        return service.zones();
    }

    @PostMapping("/zones")
    @ResponseStatus(HttpStatus.CREATED)
    public ZoneResponse createZone(@Valid @RequestBody ZoneRequest req,
                                   @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.createZone(req, user.id(), ClientIp.of(http));
    }

    @PutMapping("/zones/{id}")
    public ZoneResponse updateZone(@PathVariable Long id, @Valid @RequestBody ZoneRequest req,
                                   @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.updateZone(id, req, user.id(), ClientIp.of(http));
    }

    @GetMapping("/districts")
    public List<DistrictResponse> districts() {
        return service.districts();
    }

    @PostMapping("/districts")
    @ResponseStatus(HttpStatus.CREATED)
    public DistrictResponse createDistrict(@Valid @RequestBody DistrictRequest req,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.createDistrict(req, user.id(), ClientIp.of(http));
    }

    @PutMapping("/districts/{id}")
    public DistrictResponse updateDistrict(@PathVariable Long id, @Valid @RequestBody DistrictRequest req,
                                           @AuthenticationPrincipal AuthenticatedUser user, HttpServletRequest http) {
        return service.updateDistrict(id, req, user.id(), ClientIp.of(http));
    }
}
