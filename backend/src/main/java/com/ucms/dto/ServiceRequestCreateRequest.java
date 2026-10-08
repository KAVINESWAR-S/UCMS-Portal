package com.ucms.dto;

import com.ucms.model.ServiceRequestType;

public class ServiceRequestCreateRequest {
    private ServiceRequestType serviceType;
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

    public ServiceRequestCreateRequest() {
    }

    // Getters and Setters
    public ServiceRequestType getServiceType() { return serviceType; }
    public void setServiceType(ServiceRequestType serviceType) { this.serviceType = serviceType; }

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
}
