package com.ucms.repository;

import com.ucms.model.ServiceRequest;
import com.ucms.model.ServiceRequestStatus;
import com.ucms.model.ServiceRequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Optional<ServiceRequest> findByRequestId(String requestId);
    List<ServiceRequest> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<ServiceRequest> findAllByOrderByCreatedAtDesc();
    long countByStatus(ServiceRequestStatus status);
    long countByServiceType(ServiceRequestType type);
}
