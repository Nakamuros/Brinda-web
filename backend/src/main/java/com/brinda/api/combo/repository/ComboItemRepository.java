package com.brinda.api.combo.repository;

import com.brinda.api.combo.model.ComboItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ComboItemRepository extends JpaRepository<ComboItem, Long> {

    @EntityGraph(attributePaths = "product")
    List<ComboItem> findByComboIdOrderByIdAsc(UUID comboId);

    @EntityGraph(attributePaths = "product")
    List<ComboItem> findByComboIdInOrderByIdAsc(Collection<UUID> comboIds);
}
