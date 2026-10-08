package com.ucms.dto;

public class AadhaarOtpRequest {
    private String aadhaarNumber;
    private String identifier; // Aadhaar number or email

    public AadhaarOtpRequest() {}
    public AadhaarOtpRequest(String identifier) { 
        this.identifier = identifier; 
        this.aadhaarNumber = identifier;
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
}
