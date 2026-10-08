package com.ucms.controller;

import com.ucms.dto.AuthResponse;
import com.ucms.dto.CitizenDto;
import com.ucms.dto.CitizenLoginRequest;
import com.ucms.dto.CitizenRegisterRequest;
import com.ucms.service.AuthService;
import com.ucms.service.CitizenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final CitizenService citizenService;
    private final com.ucms.service.AadhaarAuthService aadhaarAuthService;

    public AuthController(AuthService authService,
                          CitizenService citizenService,
                          com.ucms.service.AadhaarAuthService aadhaarAuthService) {
        this.authService = authService;
        this.citizenService = citizenService;
        this.aadhaarAuthService = aadhaarAuthService;
    }

    // Aadhaar Check & Discovery Endpoint
    @PostMapping(value = {"/aadhaar/check", "/aadhaar/lookup"})
    public ResponseEntity<com.ucms.dto.AadhaarLookupResponse> checkAadhaar(@RequestBody com.ucms.dto.AadhaarOtpRequest request) {
        String id = request.getAadhaarNumber() != null ? request.getAadhaarNumber() : request.getIdentifier();
        com.ucms.dto.AadhaarLookupResponse response = aadhaarAuthService.checkAadhaar(id);
        return ResponseEntity.ok(response);
    }

    // Aadhaar / Email OTP Dispatch Endpoint
    @PostMapping("/aadhaar/send-otp")
    public ResponseEntity<com.ucms.dto.AadhaarOtpResponse> sendAadhaarOtp(@RequestBody com.ucms.dto.AadhaarOtpRequest request) {
        com.ucms.dto.AadhaarOtpResponse response = aadhaarAuthService.sendOtp(request);
        return ResponseEntity.ok(response);
    }

    // Aadhaar OTP Verification & Instant Login / Auto-Registration Endpoint
    @PostMapping("/aadhaar/verify-otp")
    public ResponseEntity<AuthResponse> verifyAadhaarOtp(@RequestBody com.ucms.dto.AadhaarOtpVerifyRequest request) {
        AuthResponse response = aadhaarAuthService.verifyOtpAndLogin(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/citizen/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody CitizenRegisterRequest request) {
        // Enforce Aadhaar flow
        throw new IllegalArgumentException("Standard password registration is disabled. Please onboarding using UIDAI Aadhaar verification.");
    }

    @PostMapping("/citizen/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody CitizenLoginRequest request) {
        AuthResponse response = authService.loginCitizen(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/officer/login")
    public ResponseEntity<AuthResponse> officerLogin(@Valid @RequestBody CitizenLoginRequest request) {
        AuthResponse response = authService.officerLogin(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<CitizenDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CitizenDto profile = citizenService.getProfileByEmail(authentication.getName());
        return ResponseEntity.ok(profile);
    }
}
