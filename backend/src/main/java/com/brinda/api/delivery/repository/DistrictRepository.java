package com.brinda.api.delivery.repository;

import com.brinda.api.delivery.model.District;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DistrictRepository extends JpaRepository<District, Long> {

    @EntityGraph(attributePaths = "zone")
    List<District> findAllByOrderByNameAsc();

    @EntityGraph(attributePaths = "zone")
    Optional<District> findWithZoneById(Long id);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
