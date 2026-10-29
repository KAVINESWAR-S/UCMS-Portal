package com.ucms.repository;

import com.ucms.model.OfficerAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfficerAssignmentRepository extends JpaRepository<OfficerAssignment, Long> {

    List<OfficerAssignment> findByVillageIgnoreCaseOrderByAssignedAtDesc(String village);

    Optional<OfficerAssignment> findFirstByVillageIgnoreCaseAndIsActiveTrue(String village);

    List<OfficerAssignment> findByOfficerEmailOrderByAssignedAtDesc(String officerEmail);

    Optional<OfficerAssignment> findFirstByOfficerEmailAndIsActiveTrue(String officerEmail);

    List<OfficerAssignment> findByIsActiveTrue();
}
