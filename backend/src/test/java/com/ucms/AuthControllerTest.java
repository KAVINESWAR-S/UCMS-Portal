package com.ucms;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucms.model.Citizen;
import com.ucms.repository.CitizenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SuppressWarnings("null")
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        citizenRepository.deleteAll();
    }

    private Map<String, Object> createValidRegistrationPayload() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("fullName", "Kavimalan");
        payload.put("email", "kavi@example.com");
        payload.put("phoneNumber", "9876543210");
        payload.put("password", "Password@123");
        payload.put("confirmPassword", "Password@123");
        payload.put("dateOfBirth", "2005-06-15");
        payload.put("gender", "MALE");
        payload.put("address", "Example Address");
        payload.put("village", "Melur");
        payload.put("occupation", "Agriculture");
        payload.put("annualIncome", 83884.00);
        payload.put("landArea", 1.05);
        payload.put("farmerStatus", true);
        return payload;
    }

    @Test
    void testHealthEndpoint_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(jsonPath("$.service").value("UCMS Backend"));
    }

    @Test
    void testAadhaarCheck_Success() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("aadhaarNumber", "999900000001");

        mockMvc.perform(post("/api/auth/aadhaar/check")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.exists").value(true))
                .andExpect(jsonPath("$.aadhaarNumber").value("999900000001"));
    }

    @Test
    void testAadhaarSendOtp_Success() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("aadhaarNumber", "999900000001");

        mockMvc.perform(post("/api/auth/aadhaar/send-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.maskedEmail").isString());
    }

    @Test
    void testAadhaarVerifyOtp_Success() throws Exception {
        // Send OTP first
        Map<String, String> otpReq = new HashMap<>();
        otpReq.put("aadhaarNumber", "999900000001");
        mockMvc.perform(post("/api/auth/aadhaar/send-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(otpReq)))
                .andExpect(status().isOk());

        // Verify with dev fallback OTP
        Map<String, String> verifyReq = new HashMap<>();
        verifyReq.put("aadhaarNumber", "999900000001");
        verifyReq.put("otp", "123456");

        mockMvc.perform(post("/api/auth/aadhaar/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(verifyReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.citizen.aadhaarNumber").value("999900000001"));
    }

    @Test
    void testCitizenLegacyPasswordRegistration_Disabled() throws Exception {
        Map<String, Object> payload = createValidRegistrationPayload();

        mockMvc.perform(post("/api/auth/citizen/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCitizenLegacyPasswordLogin_Disabled() throws Exception {
        Map<String, String> loginPayload = new HashMap<>();
        loginPayload.put("email", "kavi@example.com");
        loginPayload.put("password", "Password@123");

        mockMvc.perform(post("/api/auth/citizen/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginPayload)))
                .andExpect(status().isUnauthorized());
    }
}
