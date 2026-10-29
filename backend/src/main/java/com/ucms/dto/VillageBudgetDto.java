package com.ucms.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VillageBudgetDto {
    private Long id;
    private String village;
    private String financialYear;
    private BigDecimal totalAllocation;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private String updatedByAdminEmail;
    private LocalDateTime updatedAt;

    public VillageBudgetDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(String financialYear) {
        this.financialYear = financialYear;
    }

    public BigDecimal getTotalAllocation() {
        return totalAllocation;
    }

    public void setTotalAllocation(BigDecimal totalAllocation) {
        this.totalAllocation = totalAllocation;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public String getUpdatedByAdminEmail() {
        return updatedByAdminEmail;
    }

    public void setUpdatedByAdminEmail(String updatedByAdminEmail) {
        this.updatedByAdminEmail = updatedByAdminEmail;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
