package com.ucms.dto;

import java.math.BigDecimal;
import java.util.Map;

public class AdminDashboardStatsDto {
    private long totalVillages;
    private long totalOfficers;
    private long activeOfficers;
    private long totalCitizens;
    private long totalApplications;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long totalGrievances;
    private long pendingGrievances;
    private long resolvedGrievances;
    private long totalWorks;
    private BigDecimal totalAllocatedBudget;
    private BigDecimal totalSpentBudget;
    private BigDecimal totalRemainingBudget;
    private long totalSchemes;
    private long totalAiAnalyses;
    private long highRiskFraudCount;
    private Map<String, Long> applicationsPerVillage;
    private Map<String, Long> citizensPerVillage;

    public AdminDashboardStatsDto() {
    }

    public long getTotalVillages() {
        return totalVillages;
    }

    public void setTotalVillages(long totalVillages) {
        this.totalVillages = totalVillages;
    }

    public long getTotalOfficers() {
        return totalOfficers;
    }

    public void setTotalOfficers(long totalOfficers) {
        this.totalOfficers = totalOfficers;
    }

    public long getActiveOfficers() {
        return activeOfficers;
    }

    public void setActiveOfficers(long activeOfficers) {
        this.activeOfficers = activeOfficers;
    }

    public long getTotalCitizens() {
        return totalCitizens;
    }

    public void setTotalCitizens(long totalCitizens) {
        this.totalCitizens = totalCitizens;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(long approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }

    public long getTotalGrievances() {
        return totalGrievances;
    }

    public void setTotalGrievances(long totalGrievances) {
        this.totalGrievances = totalGrievances;
    }

    public long getPendingGrievances() {
        return pendingGrievances;
    }

    public void setPendingGrievances(long pendingGrievances) {
        this.pendingGrievances = pendingGrievances;
    }

    public long getResolvedGrievances() {
        return resolvedGrievances;
    }

    public void setResolvedGrievances(long resolvedGrievances) {
        this.resolvedGrievances = resolvedGrievances;
    }

    public long getTotalWorks() {
        return totalWorks;
    }

    public void setTotalWorks(long totalWorks) {
        this.totalWorks = totalWorks;
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

    public BigDecimal getTotalRemainingBudget() {
        return totalRemainingBudget;
    }

    public void setTotalRemainingBudget(BigDecimal totalRemainingBudget) {
        this.totalRemainingBudget = totalRemainingBudget;
    }

    public long getTotalSchemes() {
        return totalSchemes;
    }

    public void setTotalSchemes(long totalSchemes) {
        this.totalSchemes = totalSchemes;
    }

    public long getTotalAiAnalyses() {
        return totalAiAnalyses;
    }

    public void setTotalAiAnalyses(long totalAiAnalyses) {
        this.totalAiAnalyses = totalAiAnalyses;
    }

    public long getHighRiskFraudCount() {
        return highRiskFraudCount;
    }

    public void setHighRiskFraudCount(long highRiskFraudCount) {
        this.highRiskFraudCount = highRiskFraudCount;
    }

    public Map<String, Long> getApplicationsPerVillage() {
        return applicationsPerVillage;
    }

    public void setApplicationsPerVillage(Map<String, Long> applicationsPerVillage) {
        this.applicationsPerVillage = applicationsPerVillage;
    }

    public Map<String, Long> getCitizensPerVillage() {
        return citizensPerVillage;
    }

    public void setCitizensPerVillage(Map<String, Long> citizensPerVillage) {
        this.citizensPerVillage = citizensPerVillage;
    }
}
