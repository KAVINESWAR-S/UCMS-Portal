package com.ucms.dto;

import java.math.BigDecimal;

public class VillageDto {
    private String name;
    private String officerName;
    private String officerEmail;
    private String officerPhone;
    private long citizenCount;
    private long applicationCount;
    private long grievanceCount;
    private long developmentWorkCount;
    private BigDecimal totalAllocatedBudget;
    private BigDecimal totalSpentBudget;
    private BigDecimal remainingBudget;

    public VillageDto() {
    }

    public VillageDto(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }

    public String getOfficerEmail() {
        return officerEmail;
    }

    public void setOfficerEmail(String officerEmail) {
        this.officerEmail = officerEmail;
    }

    public String getOfficerPhone() {
        return officerPhone;
    }

    public void setOfficerPhone(String officerPhone) {
        this.officerPhone = officerPhone;
    }

    public long getCitizenCount() {
        return citizenCount;
    }

    public void setCitizenCount(long citizenCount) {
        this.citizenCount = citizenCount;
    }

    public long getApplicationCount() {
        return applicationCount;
    }

    public void setApplicationCount(long applicationCount) {
        this.applicationCount = applicationCount;
    }

    public long getGrievanceCount() {
        return grievanceCount;
    }

    public void setGrievanceCount(long grievanceCount) {
        this.grievanceCount = grievanceCount;
    }

    public long getDevelopmentWorkCount() {
        return developmentWorkCount;
    }

    public void setDevelopmentWorkCount(long developmentWorkCount) {
        this.developmentWorkCount = developmentWorkCount;
    }

    public BigDecimal getTotalAllocatedBudget() {
        return totalAllocatedBudget;
    }

    public void setTotalAllocatedBudget(BigDecimal totalAllocatedBudget) {
        this.totalAllocatedBudget = totalAllocatedBudget;
    }

    public BigDecimal getTotalSpentBudget() {
        return totalSpentBudget;
    }

    public void setTotalSpentBudget(BigDecimal totalSpentBudget) {
        this.totalSpentBudget = totalSpentBudget;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }
}
