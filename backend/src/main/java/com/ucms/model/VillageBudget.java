package com.ucms.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "village_budgets", uniqueConstraints = @UniqueConstraint(columnNames = {"village", "financial_year"}))
public class VillageBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "village", nullable = false)
    private String village;

    @Column(name = "financial_year", nullable = false)
    private String financialYear;

    @Column(name = "total_allocation", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalAllocation = BigDecimal.ZERO;

    @Column(name = "spent_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal spentAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal remainingAmount = BigDecimal.ZERO;

    @Column(name = "updated_by_admin_email")
    private String updatedByAdminEmail;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public VillageBudget() {
    }

    public VillageBudget(String village, String financialYear, BigDecimal totalAllocation, BigDecimal spentAmount, String updatedByAdminEmail) {
        this.village = village;
        this.financialYear = financialYear;
        this.totalAllocation = totalAllocation != null ? totalAllocation : BigDecimal.ZERO;
        this.spentAmount = spentAmount != null ? spentAmount : BigDecimal.ZERO;
        this.remainingAmount = this.totalAllocation.subtract(this.spentAmount);
        this.updatedByAdminEmail = updatedByAdminEmail;
    }

    public void recalculateRemaining() {
        if (this.totalAllocation != null && this.spentAmount != null) {
            this.remainingAmount = this.totalAllocation.subtract(this.spentAmount);
        }
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
        recalculateRemaining();
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
        recalculateRemaining();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
