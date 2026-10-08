package com.ucms.controller;

import com.ucms.dto.AuthResponse;
import com.ucms.dto.CitizenLoginRequest;
import com.ucms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/officer/auth")
public class OfficerAuthController {

    private final AuthService authService;

    public OfficerAuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> officerLogin(@Valid @RequestBody CitizenLoginRequest request) {
        AuthResponse response = authService.officerLogin(request);
        return ResponseEntity.ok(response);
    }
}
