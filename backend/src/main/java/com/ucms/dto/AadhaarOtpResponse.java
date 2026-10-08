package com.ucms.dto;

public class AadhaarOtpResponse {
    private boolean success;
    private String message;
    private String maskedEmail;
    private String debugOtp; // for quick testing and UI banner display
    private String fullName;
    private String village;

    public AadhaarOtpResponse() {}

    public AadhaarOtpResponse(boolean success, String message, String maskedEmail, String debugOtp) {
        this.success = success;
        this.message = message;
        this.maskedEmail = maskedEmail;
        this.debugOtp = debugOtp;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMaskedEmail() { return maskedEmail; }
    public void setMaskedEmail(String maskedEmail) { this.maskedEmail = maskedEmail; }

    public String getDebugOtp() { return debugOtp; }
    public void setDebugOtp(String debugOtp) { this.debugOtp = debugOtp; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }
}
