package com.ucms.service;

import com.ucms.dto.ServiceRequestCreateRequest;
import com.ucms.dto.ServiceRequestDto;
import com.ucms.dto.ServiceRequestReviewRequest;
import com.ucms.model.Citizen;
import com.ucms.model.ServiceRequest;
import com.ucms.model.ServiceRequestStatus;
import com.ucms.model.ServiceRequestType;
import com.ucms.repository.CitizenRepository;
import com.ucms.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("null")
@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final CitizenRepository citizenRepository;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository,
                                 CitizenRepository citizenRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.citizenRepository = citizenRepository;
    }

    @Transactional
    public ServiceRequestDto createServiceRequest(String citizenEmail, ServiceRequestCreateRequest request) {
        Citizen citizen = citizenRepository.findByEmail(citizenEmail.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Citizen profile not found"));

        if (request.getServiceType() == null) {
            throw new IllegalArgumentException("Service type is required (e.g. EB_CONNECTION, WATER_CONNECTION)");
        }

        if (request.getPropertyAddress() == null || request.getPropertyAddress().trim().isEmpty()) {
            throw new IllegalArgumentException("Property location and address is required for utility connection");
        }

        String prefix = "SRV-";
        if (request.getServiceType() == ServiceRequestType.EB_CONNECTION) prefix = "SRV-EB-";
        else if (request.getServiceType() == ServiceRequestType.WATER_CONNECTION) prefix = "SRV-WTR-";
        else if (request.getServiceType() == ServiceRequestType.DRAINAGE_SEWAGE) prefix = "SRV-DRN-";
        else if (request.getServiceType() == ServiceRequestType.STREET_LIGHT) prefix = "SRV-LT-";

        String requestId = prefix + LocalDate.now().getYear() + "-" + (1000 + (System.currentTimeMillis() % 9000));

        ServiceRequest sr = new ServiceRequest();
        sr.setRequestId(requestId);
        sr.setCitizen(citizen);
        sr.setServiceType(request.getServiceType());
        sr.setSubCategory(request.getSubCategory() != null ? request.getSubCategory().trim() : "Standard Connection");
        sr.setTitle(request.getTitle() != null ? request.getTitle().trim() : request.getServiceType().getDisplayName());
        sr.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");

        sr.setPropertyAddress(request.getPropertyAddress().trim());
        sr.setWardNumber(request.getWardNumber() != null ? request.getWardNumber().trim() : citizen.getVillage());
        sr.setSurveyNumber(request.getSurveyNumber() != null ? request.getSurveyNumber().trim() : null);
        sr.setLatitude(request.getLatitude());
        sr.setLongitude(request.getLongitude());

        sr.setDocumentUrl(request.getDocumentUrl() != null ? request.getDocumentUrl().trim() : null);
        sr.setDocumentType(request.getDocumentType() != null ? request.getDocumentType().trim() : "Property Assessment Proof");

        sr.setStatus(ServiceRequestStatus.SUBMITTED);

        ServiceRequest saved = serviceRequestRepository.save(sr);
        return ServiceRequestDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto> getCitizenServiceRequests(String citizenEmail) {
        Citizen citizen = citizenRepository.findByEmail(citizenEmail.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Citizen profile not found"));

        return serviceRequestRepository.findByCitizenIdOrderByCreatedAtDesc(citizen.getId())
                .stream()
                .map(ServiceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto> getAllServiceRequests() {
        return serviceRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ServiceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto> getServiceRequestsByVillage(String village) {
        if (village == null || village.trim().isEmpty() || "ALL".equalsIgnoreCase(village.trim())) {
            return getAllServiceRequests();
        }
        return serviceRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(sr -> {
                    if (sr.getCitizen() != null && village.equalsIgnoreCase(sr.getCitizen().getVillage())) {
                        return true;
                    }
                    if (sr.getPropertyAddress() != null && sr.getPropertyAddress().toLowerCase().contains(village.toLowerCase())) {
                        return true;
                    }
                    return false;
                })
                .map(ServiceRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceRequestDto getServiceRequestById(Long id) {
        ServiceRequest sr = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service request not found with id: " + id));
        return ServiceRequestDto.fromEntity(sr);
    }

    @Transactional
    public ServiceRequestDto reviewServiceRequest(Long id, ServiceRequestReviewRequest request) {
        ServiceRequest sr = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service request not found with id: " + id));

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            try {
                sr.setStatus(ServiceRequestStatus.valueOf(request.getStatus().trim().toUpperCase()));
            } catch (Exception ex) {
                // Ignore invalid status enum or keep existing
            }
        }

        if (request.getRemarks() != null && !request.getRemarks().trim().isEmpty()) {
            sr.setOfficerRemarks(request.getRemarks().trim());
        }

        if (request.getAssignedStaff() != null && !request.getAssignedStaff().trim().isEmpty()) {
            sr.setAssignedStaff(request.getAssignedStaff().trim());
        }

        if (request.getConnectionReferenceNo() != null && !request.getConnectionReferenceNo().trim().isEmpty()) {
            sr.setConnectionReferenceNo(request.getConnectionReferenceNo().trim());
        }

        if (request.getInspectionDate() != null && !request.getInspectionDate().trim().isEmpty()) {
            String dateStr = request.getInspectionDate().trim();
            if (dateStr.contains("T")) {
                dateStr = dateStr.substring(0, dateStr.indexOf("T"));
            }
            try {
                sr.setInspectionDate(LocalDate.parse(dateStr));
            } catch (Exception ignored) {
            }
        }

        ServiceRequest saved = serviceRequestRepository.save(sr);
        return ServiceRequestDto.fromEntity(saved);
    }
}
