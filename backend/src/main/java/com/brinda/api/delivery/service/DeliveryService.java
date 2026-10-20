package com.brinda.api.delivery.service;

import com.brinda.api.delivery.dto.PublicDistrictResponse;
import com.brinda.api.delivery.model.District;
import com.brinda.api.delivery.repository.DistrictRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Lectura pública: distritos de reparto con su tarifa. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DeliveryService {

    private final DistrictRepository districtRepository;

    public List<PublicDistrictResponse> deliverableDistricts() {
        return districtRepository.findAllByOrderByNameAsc().stream()
                .filter(District::isDeliverable)
                .map(PublicDistrictResponse::from)
                .toList();
    }
}
