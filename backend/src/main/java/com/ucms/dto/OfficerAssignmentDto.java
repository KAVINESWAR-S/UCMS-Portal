package com.ucms.dto;

import java.time.LocalDateTime;

public class OfficerAssignmentDto {
    private Long id;
    private String officerEmail;
    private String officerName;
    private String village;
    private LocalDateTime assignedAt;
    private LocalDateTime revokedAt;
    private Boolean isActive;
    private String assignedByAdminEmail;
    private String revokedByAdminEmail;
    private String notes;

    public OfficerAssignmentDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOfficerEmail() {
        return officerEmail;
    }

    public void setOfficerEmail(String officerEmail) {
        this.officerEmail = officerEmail;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(LocalDateTime revokedAt) {
        this.revokedAt = revokedAt;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getAssignedByAdminEmail() {
        return assignedByAdminEmail;
    }

    public void setAssignedByAdminEmail(String assignedByAdminEmail) {
        this.assignedByAdminEmail = assignedByAdminEmail;
    }

    public String getRevokedByAdminEmail() {
        return revokedByAdminEmail;
    }

    public void setRevokedByAdminEmail(String revokedByAdminEmail) {
        this.revokedByAdminEmail = revokedByAdminEmail;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
