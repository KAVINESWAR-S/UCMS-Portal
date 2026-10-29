package com.ucms.controller;

import com.ucms.dto.AdminDashboardStatsDto;
import com.ucms.dto.ApplicationDto;
import com.ucms.dto.AssignOfficerRequest;
import com.ucms.dto.AuditLogDto;
import com.ucms.dto.AuthResponse;
import com.ucms.dto.CertificateRequestDto;
import com.ucms.dto.CitizenDto;
import com.ucms.dto.CitizenLoginRequest;
import com.ucms.dto.CreateOfficerRequest;
import com.ucms.dto.DevelopmentWorkDto;
import com.ucms.dto.GrievanceDto;
import com.ucms.dto.OfficerAssignmentDto;
import com.ucms.dto.SchemeDto;
import com.ucms.dto.VillageBudgetDto;
import com.ucms.dto.VillageDto;
import com.ucms.model.ApplicationStatus;
import com.ucms.model.CertificateStatus;
import com.ucms.model.GrievanceStatus;
import com.ucms.service.AdminService;
import com.ucms.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(AdminService adminService, AuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }

    // ==================== AUTH ====================

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody CitizenLoginRequest request) {
        AuthResponse response = authService.adminLogin(request);
        return ResponseEntity.ok(response);
    }

    // ==================== DASHBOARD STATS ====================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }

    // ==================== VILLAGES ====================

    @GetMapping("/villages")
    public ResponseEntity<List<VillageDto>> getAllVillages() {
        return ResponseEntity.ok(adminService.getAllVillages());
    }

    @GetMapping("/villages/{village}")
    public ResponseEntity<Map<String, Object>> getVillageDetail(@PathVariable String village) {
        return ResponseEntity.ok(adminService.getVillageDetail(village));
    }

    @GetMapping("/villages/{village}/assignment-history")
    public ResponseEntity<List<OfficerAssignmentDto>> getVillageAssignmentHistory(@PathVariable String village) {
        return ResponseEntity.ok(adminService.getVillageAssignmentHistory(village));
    }

    // ==================== OFFICERS ====================

    @GetMapping("/officers")
    public ResponseEntity<List<CitizenDto>> getAllOfficers() {
        return ResponseEntity.ok(adminService.getAllOfficers());
    }

    @PostMapping("/officers")
    public ResponseEntity<CitizenDto> createOfficer(@Valid @RequestBody CreateOfficerRequest request,
                                                    Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.createOfficer(request, adminEmail));
    }

    @PostMapping("/officers/{id}/assign")
    public ResponseEntity<CitizenDto> assignOfficer(@PathVariable Long id,
                                                    @Valid @RequestBody AssignOfficerRequest request,
                                                    Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.assignOfficer(id, request, adminEmail));
    }

    @PostMapping("/officers/{id}/revoke")
    public ResponseEntity<CitizenDto> revokeOfficer(@PathVariable Long id,
                                                    Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.revokeOfficer(id, adminEmail));
    }

    // ==================== BUDGETS ====================

    @GetMapping("/budgets")
    public ResponseEntity<List<VillageBudgetDto>> getAllVillageBudgets() {
        return ResponseEntity.ok(adminService.getAllVillageBudgets());
    }

    @PutMapping("/budgets/{village}")
    public ResponseEntity<VillageBudgetDto> updateVillageBudget(@PathVariable String village,
                                                                @RequestBody VillageBudgetDto dto,
                                                                Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.updateVillageBudget(village, dto, adminEmail));
    }

    // ==================== CITIZENS ====================

    @GetMapping("/citizens")
    public ResponseEntity<List<CitizenDto>> getAllCitizens(@RequestParam(required = false) String village,
                                                           @RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllCitizens(village, search));
    }

    @GetMapping("/citizens/{id}")
    public ResponseEntity<Map<String, Object>> getCitizenDetail(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getCitizenDetail(id));
    }

    // ==================== APPLICATIONS ====================

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getAllApplications(@RequestParam(required = false) String village,
                                                                   @RequestParam(required = false) ApplicationStatus status) {
        return ResponseEntity.ok(adminService.getAllApplications(village, status));
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(@PathVariable Long id,
                                                                  @RequestBody Map<String, String> body,
                                                                  Authentication authentication) {
        String statusStr = body.get("status");
        String remarks = body.get("remarks");
        ApplicationStatus status = ApplicationStatus.valueOf(statusStr.toUpperCase());
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.updateApplicationStatus(id, status, remarks, adminEmail));
    }

    // ==================== GRIEVANCES ====================

    @GetMapping("/grievances")
    public ResponseEntity<List<GrievanceDto>> getAllGrievances(@RequestParam(required = false) String village,
                                                               @RequestParam(required = false) GrievanceStatus status) {
        return ResponseEntity.ok(adminService.getAllGrievances(village, status));
    }

    @PutMapping("/grievances/{id}/respond")
    public ResponseEntity<GrievanceDto> respondToGrievance(@PathVariable Long id,
                                                           @RequestBody Map<String, String> body,
                                                           Authentication authentication) {
        String response = body.get("response");
        String statusStr = body.get("status");
        GrievanceStatus status = statusStr != null ? GrievanceStatus.valueOf(statusStr.toUpperCase()) : null;
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.respondToGrievance(id, response, status, adminEmail));
    }

    // ==================== CERTIFICATES ====================

    @GetMapping("/certificates")
    public ResponseEntity<List<CertificateRequestDto>> getAllCertificates(@RequestParam(required = false) String village,
                                                                          @RequestParam(required = false) CertificateStatus status) {
        return ResponseEntity.ok(adminService.getAllCertificates(village, status));
    }

    // ==================== DEVELOPMENT WORKS ====================

    @GetMapping("/development-works")
    public ResponseEntity<List<DevelopmentWorkDto>> getAllDevelopmentWorks(@RequestParam(required = false) String village) {
        return ResponseEntity.ok(adminService.getAllDevelopmentWorks(village));
    }

    @PostMapping("/development-works")
    public ResponseEntity<DevelopmentWorkDto> createDevelopmentWork(@RequestBody DevelopmentWorkDto dto,
                                                                    Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.createDevelopmentWork(dto, adminEmail));
    }

    // ==================== SCHEMES ====================

    @GetMapping("/schemes")
    public ResponseEntity<List<SchemeDto>> getAllSchemes() {
        return ResponseEntity.ok(adminService.getAllSchemes());
    }

    @PostMapping("/schemes")
    public ResponseEntity<SchemeDto> createScheme(@RequestBody SchemeDto dto,
                                                  Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.createScheme(dto, adminEmail));
    }

    @PutMapping("/schemes/{id}")
    public ResponseEntity<SchemeDto> updateScheme(@PathVariable Long id,
                                                  @RequestBody SchemeDto dto,
                                                  Authentication authentication) {
        String adminEmail = authentication != null ? authentication.getName() : "admin@ucms.gov.in";
        return ResponseEntity.ok(adminService.updateScheme(id, dto, adminEmail));
    }

    // ==================== AI FRAUD ====================

    @GetMapping("/ai-fraud")
    public ResponseEntity<List<Map<String, Object>>> getAiAnalyses() {
        return ResponseEntity.ok(adminService.getAllAiAnalyses());
    }

    // ==================== AUDIT LOGS ====================

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAuditLogs(page, size));
    }
}
