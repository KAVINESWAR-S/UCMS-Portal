package com.ucms.dto;

public class AadhaarOtpVerifyRequest {
    private String aadhaarNumber;
    private String identifier; // Aadhaar number or email
    private String otp;

    public AadhaarOtpVerifyRequest() {}
    public AadhaarOtpVerifyRequest(String identifier, String otp) {
        this.identifier = identifier;
        this.aadhaarNumber = identifier;
        this.otp = otp;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber != null ? aadhaarNumber : identifier;
    }
    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
        if (this.identifier == null) this.identifier = aadhaarNumber;
    }

    public String getIdentifier() { 
        return identifier != null ? identifier : aadhaarNumber; 
    }
    public void setIdentifier(String identifier) { 
        this.identifier = identifier; 
        if (this.aadhaarNumber == null) this.aadhaarNumber = identifier;
    }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
