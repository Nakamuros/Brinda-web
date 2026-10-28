package com.brinda.api.complaint.repository;

import com.brinda.api.complaint.model.Complaint;
import com.brinda.api.complaint.model.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {

    Optional<Complaint> findByCopyTokenHash(String copyTokenHash);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    /** Candidatos a (re)enviar correo; el filtro fino de intentos lo aplica el servicio. */
    @Query("""
            select c from Complaint c
            where c.consumerEmailDelivery.status <> com.brinda.api.complaint.model.EmailStatus.SENT
               or c.ownerEmailDelivery.status <> com.brinda.api.complaint.model.EmailStatus.SENT
            order by c.filedAt""")
    List<Complaint> findWithUnsentEmail(Pageable pageable);
}
