package com.ucms.dto;

public class AadhaarLookupResponse {
    private boolean exists;
    private String aadhaarNumber;
    private String fullName;
    private String maskedEmail;
    private String maskedPhone;
    private String village;
    private String address;
    private boolean accountCreated;
    private String message;

    private boolean success = true;

    public AadhaarLookupResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public boolean isExists() { return exists; }
    public void setExists(boolean exists) { this.exists = exists; this.success = exists; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getName() { return fullName; }
    public void setName(String name) { this.fullName = name; }

    public String getMaskedEmail() { return maskedEmail; }
    public void setMaskedEmail(String maskedEmail) { this.maskedEmail = maskedEmail; }

    public String getMaskedPhone() { return maskedPhone; }
    public void setMaskedPhone(String maskedPhone) { this.maskedPhone = maskedPhone; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getPanchayatName() { return village; }
    public void setPanchayatName(String panchayatName) { this.village = panchayatName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public boolean isAccountCreated() { return accountCreated; }
    public void setAccountCreated(boolean accountCreated) { this.accountCreated = accountCreated; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
