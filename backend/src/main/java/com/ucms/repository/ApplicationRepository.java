package com.ucms.repository;

import com.ucms.model.Application;
import com.ucms.model.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Optional<Application> findByApplicationId(String applicationId);
    Optional<Application> findBySanctionReference(String sanctionReference);
    List<Application> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<Application> findAllByOrderByCreatedAtDesc();
    List<Application> findByCitizen_VillageIgnoreCaseOrderByCreatedAtDesc(String village);
    long countByCitizen_VillageIgnoreCase(String village);
    long countByStatus(ApplicationStatus status);
}
