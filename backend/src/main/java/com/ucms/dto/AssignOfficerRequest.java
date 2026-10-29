package com.ucms.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignOfficerRequest {

    @NotBlank(message = "Village is required")
    private String village;

    private String notes;

    public AssignOfficerRequest() {
    }

    public AssignOfficerRequest(String village, String notes) {
        this.village = village;
        this.notes = notes;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
