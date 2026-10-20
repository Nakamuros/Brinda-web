package com.brinda.api.delivery.controller;

import com.brinda.api.delivery.dto.PublicDistrictResponse;
import com.brinda.api.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/delivery")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService service;

    @GetMapping("/districts")
    public List<PublicDistrictResponse> districts() {
        return service.deliverableDistricts();
    }
}
