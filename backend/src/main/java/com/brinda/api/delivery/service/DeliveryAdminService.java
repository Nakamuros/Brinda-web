package com.brinda.api.delivery.service;

import com.brinda.api.delivery.dto.DistrictRequest;
import com.brinda.api.delivery.dto.DistrictResponse;
import com.brinda.api.delivery.dto.ZoneRequest;
import com.brinda.api.delivery.dto.ZoneResponse;
import com.brinda.api.delivery.model.DeliveryZone;
import com.brinda.api.delivery.model.District;
import com.brinda.api.delivery.repository.DeliveryZoneRepository;
import com.brinda.api.delivery.repository.DistrictRepository;
import com.brinda.api.shared.audit.AuditService;
import com.brinda.api.shared.exception.BusinessRuleException;
import com.brinda.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/** Zonas y tarifas editables por la dueña. Los pedidos ya hechos conservan la tarifa con la que se crearon. */
@Service
@RequiredArgsConstructor
@Transactional
public class DeliveryAdminService {

    private final DeliveryZoneRepository zoneRepository;
    private final DistrictRepository districtRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<ZoneResponse> zones() {
        Map<Long, List<String>> byZone = districtRepository.findAllByOrderByNameAsc().stream()
                .collect(Collectors.groupingBy(d -> d.getZone().getId(),
                        Collectors.mapping(District::getName, Collectors.toList())));
        return zoneRepository.findAllByOrderByFeeAscNameAsc().stream()
                .map(z -> ZoneResponse.from(z, byZone.getOrDefault(z.getId(), List.of())))
                .toList();
    }

    public ZoneResponse createZone(ZoneRequest req, UUID actor, String ip) {
        if (zoneRepository.existsByNameIgnoreCase(req.name().trim())) {
            throw new BusinessRuleException("Ya existe una zona con ese nombre");
        }
        DeliveryZone z = new DeliveryZone();
        apply(z, req);
        zoneRepository.save(z);
        auditService.record(actor, "ZONE_CREATE", "delivery_zones", String.valueOf(z.getId()), ip);
        return ZoneResponse.from(z, List.of());
    }

    public ZoneResponse updateZone(Long id, ZoneRequest req, UUID actor, String ip) {
        DeliveryZone z = zoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Zona no encontrada"));
        if (zoneRepository.existsByNameIgnoreCaseAndIdNot(req.name().trim(), id)) {
            throw new BusinessRuleException("Ya existe una zona con ese nombre");
        }
        boolean feeChanged = z.getFee().compareTo(req.fee()) != 0;
        String details = feeChanged ? "fee " + z.getFee() + " -> " + req.fee() : null;
        apply(z, req);
        auditService.record(actor, feeChanged ? "DELIVERY_FEE_CHANGE" : "ZONE_UPDATE",
                "delivery_zones", String.valueOf(id), ip, details);
        List<String> names = districtRepository.findAllByOrderByNameAsc().stream()
                .filter(d -> d.getZone().getId().equals(id)).map(District::getName).toList();
        return ZoneResponse.from(z, names);
    }

    @Transactional(readOnly = true)
    public List<DistrictResponse> districts() {
        return districtRepository.findAllByOrderByNameAsc().stream().map(DistrictResponse::from).toList();
    }

    public DistrictResponse createDistrict(DistrictRequest req, UUID actor, String ip) {
        if (districtRepository.existsByNameIgnoreCase(req.name().trim())) {
            throw new BusinessRuleException("Ya existe un distrito con ese nombre");
        }
        District d = new District();
        apply(d, req);
        districtRepository.save(d);
        auditService.record(actor, "DISTRICT_CREATE", "districts", String.valueOf(d.getId()), ip);
        return DistrictResponse.from(d);
    }

    public DistrictResponse updateDistrict(Long id, DistrictRequest req, UUID actor, String ip) {
        District d = districtRepository.findWithZoneById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Distrito no encontrado"));
        if (districtRepository.existsByNameIgnoreCaseAndIdNot(req.name().trim(), id)) {
            throw new BusinessRuleException("Ya existe un distrito con ese nombre");
        }
        apply(d, req);
        auditService.record(actor, "DISTRICT_UPDATE", "districts", String.valueOf(id), ip);
        return DistrictResponse.from(d);
    }

    private void apply(DeliveryZone z, ZoneRequest req) {
        z.setName(req.name().trim());
        z.setFee(req.fee());
        z.setActive(req.active());
    }

    private void apply(District d, DistrictRequest req) {
        d.setZone(zoneRepository.findById(req.zoneId())
                .orElseThrow(() -> new BusinessRuleException("La zona indicada no existe")));
        d.setName(req.name().trim());
        d.setActive(req.active());
    }
}
