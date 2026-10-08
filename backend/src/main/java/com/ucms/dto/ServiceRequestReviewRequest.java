package com.ucms.dto;

public class ServiceRequestReviewRequest {
    private String status;
    private String remarks;
    private String assignedStaff;
    private String inspectionDate;
    private String connectionReferenceNo;

    public ServiceRequestReviewRequest() {
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setOfficerRemarks(String remarks) { this.remarks = remarks; }
    public String getOfficerRemarks() { return remarks; }

    public String getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }

    public String getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(String inspectionDate) { this.inspectionDate = inspectionDate; }

    public String getConnectionReferenceNo() { return connectionReferenceNo; }
    public void setConnectionReferenceNo(String connectionReferenceNo) { this.connectionReferenceNo = connectionReferenceNo; }
}
