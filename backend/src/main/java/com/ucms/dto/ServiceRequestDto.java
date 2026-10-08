package com.ucms.dto;

import com.ucms.model.ServiceRequest;
import com.ucms.model.ServiceRequestStatus;
import com.ucms.model.ServiceRequestType;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ServiceRequestDto {
    private Long id;
    private String requestId;
    private Long citizenId;
    private String citizenName;
    private String citizenEmail;
    private String citizenPhone;
    private String citizenVillage;

    private ServiceRequestType serviceType;
    private String serviceTypeName;
    private String subCategory;
    private String title;
    private String description;

    private String propertyAddress;
    private String wardNumber;
    private String surveyNumber;
    private Double latitude;
    private Double longitude;

    private String documentUrl;
    private String documentType;

    private ServiceRequestStatus status;
    private String officerRemarks;
    private String assignedStaff;
    private LocalDate inspectionDate;
    private String connectionReferenceNo;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ServiceRequestDto() {
    }

    public static ServiceRequestDto fromEntity(ServiceRequest s) {
        ServiceRequestDto dto = new ServiceRequestDto();
        dto.setId(s.getId());
        dto.setRequestId(s.getRequestId());
        if (s.getCitizen() != null) {
            dto.setCitizenId(s.getCitizen().getId());
            dto.setCitizenName(s.getCitizen().getFullName());
            dto.setCitizenEmail(s.getCitizen().getEmail());
            dto.setCitizenPhone(s.getCitizen().getPhoneNumber());
            dto.setCitizenVillage(s.getCitizen().getVillage());
        }
        dto.setServiceType(s.getServiceType());
        dto.setServiceTypeName(s.getServiceType() != null ? s.getServiceType().getDisplayName() : null);
        dto.setSubCategory(s.getSubCategory());
        dto.setTitle(s.getTitle());
        dto.setDescription(s.getDescription());

        dto.setPropertyAddress(s.getPropertyAddress());
        dto.setWardNumber(s.getWardNumber());
        dto.setSurveyNumber(s.getSurveyNumber());
        dto.setLatitude(s.getLatitude());
        dto.setLongitude(s.getLongitude());

        dto.setDocumentUrl(s.getDocumentUrl());
        dto.setDocumentType(s.getDocumentType());

        dto.setStatus(s.getStatus());
        dto.setOfficerRemarks(s.getOfficerRemarks());
        dto.setAssignedStaff(s.getAssignedStaff());
        dto.setInspectionDate(s.getInspectionDate());
        dto.setConnectionReferenceNo(s.getConnectionReferenceNo());

        dto.setCreatedAt(s.getCreatedAt());
        dto.setUpdatedAt(s.getUpdatedAt());
        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getCitizenEmail() { return citizenEmail; }
    public void setCitizenEmail(String citizenEmail) { this.citizenEmail = citizenEmail; }

    public String getCitizenPhone() { return citizenPhone; }
    public void setCitizenPhone(String citizenPhone) { this.citizenPhone = citizenPhone; }

    public String getCitizenVillage() { return citizenVillage; }
    public void setCitizenVillage(String citizenVillage) { this.citizenVillage = citizenVillage; }

    public ServiceRequestType getServiceType() { return serviceType; }
    public void setServiceType(ServiceRequestType serviceType) { this.serviceType = serviceType; }

    public String getServiceTypeName() { return serviceTypeName; }
    public void setServiceTypeName(String serviceTypeName) { this.serviceTypeName = serviceTypeName; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }

    public String getWardNumber() { return wardNumber; }
    public void setWardNumber(String wardNumber) { this.wardNumber = wardNumber; }

    public String getSurveyNumber() { return surveyNumber; }
    public void setSurveyNumber(String surveyNumber) { this.surveyNumber = surveyNumber; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public ServiceRequestStatus getStatus() { return status; }
    public void setStatus(ServiceRequestStatus status) { this.status = status; }

    public String getOfficerRemarks() { return officerRemarks; }
    public void setOfficerRemarks(String officerRemarks) { this.officerRemarks = officerRemarks; }

    public String getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }

    public LocalDate getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDate inspectionDate) { this.inspectionDate = inspectionDate; }

    public String getConnectionReferenceNo() { return connectionReferenceNo; }
    public void setConnectionReferenceNo(String connectionReferenceNo) { this.connectionReferenceNo = connectionReferenceNo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
