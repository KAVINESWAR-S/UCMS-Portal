package com.ucms.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "officer_assignments")
public class OfficerAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "officer_email", nullable = false)
    private String officerEmail;

    @Column(name = "officer_name")
    private String officerName;

    @Column(name = "village", nullable = false)
    private String village;

    @CreationTimestamp
    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "assigned_by_admin_email")
    private String assignedByAdminEmail;

    @Column(name = "revoked_by_admin_email")
    private String revokedByAdminEmail;

    @Column(name = "notes")
    private String notes;

    public OfficerAssignment() {
    }

    public OfficerAssignment(String officerEmail, String officerName, String village, String assignedByAdminEmail, String notes) {
        this.officerEmail = officerEmail;
        this.officerName = officerName;
        this.village = village;
        this.assignedByAdminEmail = assignedByAdminEmail;
        this.notes = notes;
        this.isActive = true;
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
