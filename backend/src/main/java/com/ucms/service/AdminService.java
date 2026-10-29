package com.ucms.service;

import com.ucms.dto.*;
import com.ucms.model.*;
import com.ucms.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final CitizenRepository citizenRepository;
    private final ApplicationRepository applicationRepository;
    private final CertificateRequestRepository certificateRequestRepository;
    private final GrievanceRepository grievanceRepository;
    private final DevelopmentWorkRepository developmentWorkRepository;
    private final SchemeRepository schemeRepository;
    private final AiAnalysisRepository aiAnalysisRepository;
    private final VillageBudgetRepository villageBudgetRepository;
    private final OfficerAssignmentRepository officerAssignmentRepository;
    private final AuditLogRepository auditLogRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(CitizenRepository citizenRepository,
                        ApplicationRepository applicationRepository,
                        CertificateRequestRepository certificateRequestRepository,
                        GrievanceRepository grievanceRepository,
                        DevelopmentWorkRepository developmentWorkRepository,
                        SchemeRepository schemeRepository,
                        AiAnalysisRepository aiAnalysisRepository,
                        VillageBudgetRepository villageBudgetRepository,
                        OfficerAssignmentRepository officerAssignmentRepository,
                        AuditLogRepository auditLogRepository,
                        DocumentRepository documentRepository,
                        PasswordEncoder passwordEncoder) {
        this.citizenRepository = citizenRepository;
        this.applicationRepository = applicationRepository;
        this.certificateRequestRepository = certificateRequestRepository;
        this.grievanceRepository = grievanceRepository;
        this.developmentWorkRepository = developmentWorkRepository;
        this.schemeRepository = schemeRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.villageBudgetRepository = villageBudgetRepository;
        this.officerAssignmentRepository = officerAssignmentRepository;
        this.auditLogRepository = auditLogRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==================== DASHBOARD STATS ====================

    @Transactional(readOnly = true)
    public AdminDashboardStatsDto getAdminDashboardStats() {
        AdminDashboardStatsDto stats = new AdminDashboardStatsDto();

        List<String> distinctVillages = getKnownVillages();
        stats.setTotalVillages(distinctVillages.size());

        List<Citizen> officers = citizenRepository.findByRole(Role.OFFICER);
        stats.setTotalOfficers(officers.size());

        long activeOfficersCount = officers.stream()
                .filter(o -> o.getVillage() != null && !o.getVillage().isBlank())
                .count();
        stats.setActiveOfficers(activeOfficersCount);

        stats.setTotalCitizens(citizenRepository.countByRole(Role.CITIZEN));

        stats.setTotalApplications(applicationRepository.count());
        stats.setPendingApplications(
                applicationRepository.countByStatus(ApplicationStatus.PENDING) +
                applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW)
        );
        stats.setApprovedApplications(applicationRepository.countByStatus(ApplicationStatus.APPROVED));
        stats.setRejectedApplications(applicationRepository.countByStatus(ApplicationStatus.REJECTED));

        stats.setTotalGrievances(grievanceRepository.count());
        stats.setPendingGrievances(
                grievanceRepository.countByStatus(GrievanceStatus.SUBMITTED) +
                grievanceRepository.countByStatus(GrievanceStatus.UNDER_REVIEW)
        );
        stats.setResolvedGrievances(grievanceRepository.countByStatus(GrievanceStatus.RESOLVED));

        stats.setTotalWorks(developmentWorkRepository.count());
        stats.setTotalSchemes(schemeRepository.count());

        // Budget aggregations from VillageBudget table
        List<VillageBudget> budgets = villageBudgetRepository.findAll();
        BigDecimal totalAlloc = BigDecimal.ZERO;
        BigDecimal totalSpent = BigDecimal.ZERO;
        for (VillageBudget b : budgets) {
            if (b.getTotalAllocation() != null) totalAlloc = totalAlloc.add(b.getTotalAllocation());
            if (b.getSpentAmount() != null) totalSpent = totalSpent.add(b.getSpentAmount());
        }
        stats.setTotalAllocatedBudget(totalAlloc);
        stats.setTotalSpentBudget(totalSpent);
        stats.setTotalRemainingBudget(totalAlloc.subtract(totalSpent));

        // AI Fraud stats
        List<AiAnalysis> aiList = aiAnalysisRepository.findAll();
        stats.setTotalAiAnalyses(aiList.size());
        long highRiskCount = aiList.stream()
                .filter(a -> "HIGH".equalsIgnoreCase(a.getFraudRiskLevel()) || "true".equalsIgnoreCase(a.getPrediction()))
                .count();
        stats.setHighRiskFraudCount(highRiskCount);

        // Per village counts
        Map<String, Long> appsPerVillage = new HashMap<>();
        Map<String, Long> citizensPerVillage = new HashMap<>();
        for (String v : distinctVillages) {
            appsPerVillage.put(v, applicationRepository.countByCitizen_VillageIgnoreCase(v));
            citizensPerVillage.put(v, citizenRepository.countByVillageIgnoreCase(v));
        }
        stats.setApplicationsPerVillage(appsPerVillage);
        stats.setCitizensPerVillage(citizensPerVillage);

        return stats;
    }

    // ==================== VILLAGE MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<String> getKnownVillages() {
        Set<String> villages = new LinkedHashSet<>();
        // Standard core panchayats
        villages.add("Sathyamangalam");
        villages.add("Bhavanisagar");
        villages.add("Gobichettipalayam");

        // Distinct from citizens
        List<String> fromCitizens = citizenRepository.findDistinctVillages();
        if (fromCitizens != null) {
            for (String v : fromCitizens) {
                if (v != null && !v.trim().isEmpty() && !v.equalsIgnoreCase("all") && !v.equalsIgnoreCase("unassigned")) {
                    villages.add(v.trim());
                }
            }
        }

        // Distinct from officer assignments
        officerAssignmentRepository.findAll().forEach(oa -> {
            if (oa.getVillage() != null && !oa.getVillage().isBlank() && !oa.getVillage().equalsIgnoreCase("all") && !oa.getVillage().equalsIgnoreCase("unassigned")) {
                villages.add(oa.getVillage().trim());
            }
        });

        // Distinct from village budgets
        villageBudgetRepository.findAll().forEach(vb -> {
            if (vb.getVillage() != null && !vb.getVillage().isBlank() && !vb.getVillage().equalsIgnoreCase("all") && !vb.getVillage().equalsIgnoreCase("unassigned")) {
                villages.add(vb.getVillage().trim());
            }
        });

        return new ArrayList<>(villages);
    }

    @Transactional(readOnly = true)
    public List<VillageDto> getAllVillages() {
        List<String> villageNames = getKnownVillages();
        List<VillageDto> list = new ArrayList<>();

        for (String name : villageNames) {
            VillageDto dto = new VillageDto(name);
            dto.setCitizenCount(citizenRepository.countByVillageIgnoreCase(name));
            dto.setApplicationCount(applicationRepository.countByCitizen_VillageIgnoreCase(name));
            dto.setGrievanceCount(grievanceRepository.countByCitizen_VillageIgnoreCase(name));
            dto.setDevelopmentWorkCount(developmentWorkRepository.findByVillageIgnoreCase(name).size());

            // Active Officer
            Optional<OfficerAssignment> activeAssignment = officerAssignmentRepository.findFirstByVillageIgnoreCaseAndIsActiveTrue(name);
            if (activeAssignment.isPresent()) {
                OfficerAssignment oa = activeAssignment.get();
                dto.setOfficerEmail(oa.getOfficerEmail());
                dto.setOfficerName(oa.getOfficerName());
                citizenRepository.findByEmail(oa.getOfficerEmail()).ifPresent(c -> dto.setOfficerPhone(c.getPhoneNumber()));
            } else {
                // Fallback to citizen table officer with village match
                List<Citizen> officers = citizenRepository.findByRole(Role.OFFICER);
                for (Citizen o : officers) {
                    if (name.equalsIgnoreCase(o.getVillage())) {
                        dto.setOfficerEmail(o.getEmail());
                        dto.setOfficerName(o.getFullName());
                        dto.setOfficerPhone(o.getPhoneNumber());
                        break;
                    }
                }
            }

            // Budget
            List<VillageBudget> vbList = villageBudgetRepository.findByVillageIgnoreCase(name);
            if (!vbList.isEmpty()) {
                VillageBudget vb = vbList.get(0);
                dto.setTotalAllocatedBudget(vb.getTotalAllocation());
                dto.setTotalSpentBudget(vb.getSpentAmount());
                dto.setRemainingBudget(vb.getRemainingAmount());
            } else {
                dto.setTotalAllocatedBudget(BigDecimal.ZERO);
                dto.setTotalSpentBudget(BigDecimal.ZERO);
                dto.setRemainingBudget(BigDecimal.ZERO);
            }

            list.add(dto);
        }

        return list;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getVillageDetail(String village) {
        Map<String, Object> detail = new HashMap<>();
        detail.put("village", village);

        // Active Officer
        Optional<OfficerAssignment> activeAssignment = officerAssignmentRepository.findFirstByVillageIgnoreCaseAndIsActiveTrue(village);
        if (activeAssignment.isPresent()) {
            detail.put("activeOfficer", activeAssignment.get());
        } else {
            List<Citizen> officers = citizenRepository.findByRole(Role.OFFICER);
            officers.stream()
                    .filter(o -> village.equalsIgnoreCase(o.getVillage()))
                    .findFirst()
                    .ifPresent(o -> detail.put("activeOfficer", CitizenDto.fromEntity(o)));
        }

        // Assignment History
        detail.put("assignmentHistory", officerAssignmentRepository.findByVillageIgnoreCaseOrderByAssignedAtDesc(village));

        // Budget
        List<VillageBudget> budgets = villageBudgetRepository.findByVillageIgnoreCase(village);
        detail.put("budgets", budgets);

        // Development Works
        List<DevelopmentWorkDto> works = developmentWorkRepository.findByVillageIgnoreCaseOrderByCreatedAtDesc(village)
                .stream().map(DevelopmentWorkDto::fromEntity).collect(Collectors.toList());
        detail.put("works", works);

        // Citizens
        List<CitizenDto> citizens = citizenRepository.findByVillageIgnoreCase(village)
                .stream().filter(c -> c.getRole() == Role.CITIZEN)
                .map(this::maskCitizenAadhaar)
                .collect(Collectors.toList());
        detail.put("citizens", citizens);
        detail.put("citizenCount", citizens.size());

        // Applications
        List<ApplicationDto> apps = applicationRepository.findByCitizen_VillageIgnoreCaseOrderByCreatedAtDesc(village)
                .stream().map(ApplicationDto::fromEntity).collect(Collectors.toList());
        detail.put("applications", apps);
        detail.put("applicationCount", apps.size());

        // Grievances
        List<GrievanceDto> grievances = grievanceRepository.findByCitizen_VillageIgnoreCaseOrderByCreatedAtDesc(village)
                .stream().map(GrievanceDto::fromEntity).collect(Collectors.toList());
        detail.put("grievances", grievances);
        detail.put("grievanceCount", grievances.size());

        return detail;
    }

    // ==================== OFFICER MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<CitizenDto> getAllOfficers() {
        return citizenRepository.findByRoleOrderByFullNameAsc(Role.OFFICER)
                .stream()
                .map(CitizenDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CitizenDto createOfficer(CreateOfficerRequest request, String adminEmail) {
        String email = request.getEmail().trim().toLowerCase();
        if (citizenRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Officer with email " + email + " already exists");
        }

        String initialVillage = (request.getVillage() != null && !request.getVillage().isBlank()) 
                ? request.getVillage().trim() 
                : "Unassigned";

        Citizen officer = new Citizen();
        officer.setFullName(request.getFullName().trim());
        officer.setEmail(email);
        officer.setPhoneNumber(request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank() ? request.getPhoneNumber().trim() : "9443210000");
        officer.setPassword(passwordEncoder.encode(request.getPassword()));
        officer.setRole(Role.OFFICER);
        officer.setDateOfBirth(LocalDate.of(1985, 1, 1));
        officer.setGender(Gender.MALE);
        officer.setAddress("Panchayat Administrative Office, " + initialVillage);
        officer.setVillage(initialVillage);
        officer.setOccupation("Panchayat Officer");
        officer.setAnnualIncome(new BigDecimal("650000.00"));
        officer.setLandArea(BigDecimal.ZERO);
        officer.setFarmerStatus(false);
        officer.setAadhaarVerified(true);
        if (request.getAadhaarNumber() != null && !request.getAadhaarNumber().isBlank()) {
            officer.setAadhaarNumber(request.getAadhaarNumber().trim());
        }

        Citizen saved = citizenRepository.save(officer);

        logAudit(adminEmail, "ADMIN", "CREATE_OFFICER", "Citizen", saved.getId().toString(),
                "Created officer: " + saved.getFullName() + " (" + saved.getEmail() + ")");

        // If specific village assignment requested (not unassigned)
        if (!"Unassigned".equalsIgnoreCase(initialVillage)) {
            assignOfficerInternal(saved, initialVillage, adminEmail, "Initial assignment on officer creation");
        }

        return CitizenDto.fromEntity(saved);
    }

    @Transactional
    public CitizenDto assignOfficer(Long officerId, AssignOfficerRequest request, String adminEmail) {
        Citizen officer = citizenRepository.findById(officerId)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with id: " + officerId));

        if (officer.getRole() != Role.OFFICER) {
            throw new IllegalArgumentException("User is not an officer");
        }

        assignOfficerInternal(officer, request.getVillage().trim(), adminEmail, request.getNotes());
        return CitizenDto.fromEntity(officer);
    }

    private void assignOfficerInternal(Citizen officer, String targetVillage, String adminEmail, String notes) {
        // 1. Deactivate existing active assignment for this target village (replace officer)
        Optional<OfficerAssignment> currentVillageActive = officerAssignmentRepository
                .findFirstByVillageIgnoreCaseAndIsActiveTrue(targetVillage);

        if (currentVillageActive.isPresent()) {
            OfficerAssignment oldAssignment = currentVillageActive.get();
            oldAssignment.setIsActive(false);
            oldAssignment.setRevokedAt(LocalDateTime.now());
            oldAssignment.setRevokedByAdminEmail(adminEmail);
            officerAssignmentRepository.save(oldAssignment);

            // Also set village on displaced officer to Unassigned instead of null
            citizenRepository.findByEmail(oldAssignment.getOfficerEmail()).ifPresent(displaced -> {
                if (targetVillage.equalsIgnoreCase(displaced.getVillage())) {
                    displaced.setVillage("Unassigned");
                    citizenRepository.save(displaced);
                }
            });

            logAudit(adminEmail, "ADMIN", "REPLACE_OFFICER_ASSIGNMENT", "OfficerAssignment",
                    oldAssignment.getId().toString(),
                    "Displaced " + oldAssignment.getOfficerEmail() + " from " + targetVillage + " for replacement by " + officer.getEmail());
        }

        // 2. Deactivate officer's own prior active assignments in any village
        Optional<OfficerAssignment> currentOfficerActive = officerAssignmentRepository
                .findFirstByOfficerEmailAndIsActiveTrue(officer.getEmail());
        if (currentOfficerActive.isPresent()) {
            OfficerAssignment old = currentOfficerActive.get();
            old.setIsActive(false);
            old.setRevokedAt(LocalDateTime.now());
            old.setRevokedByAdminEmail(adminEmail);
            officerAssignmentRepository.save(old);
        }

        // 3. Create new assignment
        OfficerAssignment newAssignment = new OfficerAssignment(
                officer.getEmail(),
                officer.getFullName(),
                targetVillage,
                adminEmail,
                notes != null ? notes : "Assigned by Admin"
        );
        officerAssignmentRepository.save(newAssignment);

        // 4. Update officer's village attribute
        officer.setVillage(targetVillage);
        citizenRepository.save(officer);

        // 5. Ensure the new city/village has an initialized budget record if not present
        if (villageBudgetRepository.findByVillageIgnoreCase(targetVillage).isEmpty()) {
            VillageBudget vb = new VillageBudget();
            vb.setVillage(targetVillage);
            vb.setFinancialYear("2026-2027");
            vb.setTotalAllocation(new BigDecimal("1000000.00"));
            vb.setSpentAmount(BigDecimal.ZERO);
            vb.setRemainingAmount(new BigDecimal("1000000.00"));
            vb.setUpdatedByAdminEmail(adminEmail);
            villageBudgetRepository.save(vb);
        }

        logAudit(adminEmail, "ADMIN", "ASSIGN_OFFICER", "OfficerAssignment",
                newAssignment.getId().toString(),
                "Assigned " + officer.getFullName() + " (" + officer.getEmail() + ") to " + targetVillage);
    }

    @Transactional
    public CitizenDto revokeOfficer(Long officerId, String adminEmail) {
        Citizen officer = citizenRepository.findById(officerId)
                .orElseThrow(() -> new IllegalArgumentException("Officer not found with id: " + officerId));

        String oldVillage = officer.getVillage();

        // Deactivate active assignment
        Optional<OfficerAssignment> activeAssignment = officerAssignmentRepository
                .findFirstByOfficerEmailAndIsActiveTrue(officer.getEmail());

        if (activeAssignment.isPresent()) {
            OfficerAssignment oa = activeAssignment.get();
            oa.setIsActive(false);
            oa.setRevokedAt(LocalDateTime.now());
            oa.setRevokedByAdminEmail(adminEmail);
            officerAssignmentRepository.save(oa);
        }

        // Unset village to Unassigned - preserving account and all historical records
        officer.setVillage("Unassigned");
        citizenRepository.save(officer);

        logAudit(adminEmail, "ADMIN", "REVOKE_OFFICER", "Citizen", officer.getId().toString(),
                "Revoked officer " + officer.getFullName() + " (" + officer.getEmail() + ") from village " + oldVillage);

        return CitizenDto.fromEntity(officer);
    }

    @Transactional(readOnly = true)
    public List<OfficerAssignmentDto> getVillageAssignmentHistory(String village) {
        return officerAssignmentRepository.findByVillageIgnoreCaseOrderByAssignedAtDesc(village)
                .stream()
                .map(this::mapAssignmentDto)
                .collect(Collectors.toList());
    }

    private OfficerAssignmentDto mapAssignmentDto(OfficerAssignment oa) {
        OfficerAssignmentDto dto = new OfficerAssignmentDto();
        dto.setId(oa.getId());
        dto.setOfficerEmail(oa.getOfficerEmail());
        dto.setOfficerName(oa.getOfficerName());
        dto.setVillage(oa.getVillage());
        dto.setAssignedAt(oa.getAssignedAt());
        dto.setRevokedAt(oa.getRevokedAt());
        dto.setIsActive(oa.getIsActive());
        dto.setAssignedByAdminEmail(oa.getAssignedByAdminEmail());
        dto.setRevokedByAdminEmail(oa.getRevokedByAdminEmail());
        dto.setNotes(oa.getNotes());
        return dto;
    }

    // ==================== BUDGET MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<VillageBudgetDto> getAllVillageBudgets() {
        return villageBudgetRepository.findAll()
                .stream()
                .map(this::mapBudgetDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public VillageBudgetDto updateVillageBudget(String village, VillageBudgetDto dto, String adminEmail) {
        if (dto.getTotalAllocation() == null || dto.getTotalAllocation().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Total allocation must be non-negative");
        }
        if (dto.getSpentAmount() == null || dto.getSpentAmount().compareTo(BigDecimal.ZERO) < 0) {
            dto.setSpentAmount(BigDecimal.ZERO);
        }
        if (dto.getSpentAmount().compareTo(dto.getTotalAllocation()) > 0) {
            throw new IllegalArgumentException("Spent amount cannot exceed total allocation");
        }

        String year = dto.getFinancialYear() != null && !dto.getFinancialYear().isBlank()
                ? dto.getFinancialYear().trim() : "2025-2026";

        VillageBudget vb = villageBudgetRepository.findByVillageIgnoreCaseAndFinancialYear(village, year)
                .orElse(new VillageBudget(village, year, dto.getTotalAllocation(), dto.getSpentAmount(), adminEmail));

        vb.setTotalAllocation(dto.getTotalAllocation());
        vb.setSpentAmount(dto.getSpentAmount());
        vb.setFinancialYear(year);
        vb.setUpdatedByAdminEmail(adminEmail);
        vb.recalculateRemaining();

        VillageBudget saved = villageBudgetRepository.save(vb);

        logAudit(adminEmail, "ADMIN", "UPDATE_VILLAGE_BUDGET", "VillageBudget", saved.getId().toString(),
                "Updated budget for " + village + " (FY " + year + "): Allocation Rs. " + vb.getTotalAllocation() +
                ", Spent Rs. " + vb.getSpentAmount());

        return mapBudgetDto(saved);
    }

    private VillageBudgetDto mapBudgetDto(VillageBudget b) {
        VillageBudgetDto dto = new VillageBudgetDto();
        dto.setId(b.getId());
        dto.setVillage(b.getVillage());
        dto.setFinancialYear(b.getFinancialYear());
        dto.setTotalAllocation(b.getTotalAllocation());
        dto.setSpentAmount(b.getSpentAmount());
        dto.setRemainingAmount(b.getRemainingAmount());
        dto.setUpdatedByAdminEmail(b.getUpdatedByAdminEmail());
        dto.setUpdatedAt(b.getUpdatedAt());
        return dto;
    }

    // ==================== CITIZEN MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<CitizenDto> getAllCitizens(String village, String search) {
        List<Citizen> citizens;
        if (village != null && !village.isBlank() && !village.equalsIgnoreCase("all")) {
            citizens = citizenRepository.findByVillageIgnoreCase(village);
        } else {
            citizens = citizenRepository.findAll();
        }

        return citizens.stream()
                .filter(c -> c.getRole() == Role.CITIZEN)
                .filter(c -> {
                    if (search == null || search.isBlank()) return true;
                    String s = search.toLowerCase();
                    return (c.getFullName() != null && c.getFullName().toLowerCase().contains(s)) ||
                           (c.getEmail() != null && c.getEmail().toLowerCase().contains(s)) ||
                           (c.getPhoneNumber() != null && c.getPhoneNumber().contains(s));
                })
                .map(this::maskCitizenAadhaar)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCitizenDetail(Long id) {
        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Citizen not found with id: " + id));

        Map<String, Object> res = new HashMap<>();
        res.put("citizen", maskCitizenAadhaar(citizen));
        res.put("applications", applicationRepository.findByCitizenIdOrderByCreatedAtDesc(id)
                .stream().map(ApplicationDto::fromEntity).collect(Collectors.toList()));
        res.put("grievances", grievanceRepository.findByCitizenIdOrderByCreatedAtDesc(id)
                .stream().map(GrievanceDto::fromEntity).collect(Collectors.toList()));
        res.put("certificates", certificateRequestRepository.findByCitizenIdOrderByCreatedAtDesc(id)
                .stream().map(CertificateRequestDto::fromEntity).collect(Collectors.toList()));
        return res;
    }

    private CitizenDto maskCitizenAadhaar(Citizen c) {
        CitizenDto dto = CitizenDto.fromEntity(c);
        if (dto.getAadhaarNumber() != null && dto.getAadhaarNumber().length() >= 8) {
            String last4 = dto.getAadhaarNumber().substring(dto.getAadhaarNumber().length() - 4);
            dto.setAadhaarNumber("XXXXXXXX" + last4);
        }
        return dto;
    }

    // ==================== APPLICATION MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<ApplicationDto> getAllApplications(String village, ApplicationStatus status) {
        List<Application> list;
        if (village != null && !village.isBlank() && !village.equalsIgnoreCase("all")) {
            list = applicationRepository.findByCitizen_VillageIgnoreCaseOrderByCreatedAtDesc(village);
        } else {
            list = applicationRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream()
                .filter(a -> status == null || a.getStatus() == status)
                .map(app -> {
                    ApplicationDto dto = ApplicationDto.fromEntity(app);
                    List<DocumentDto> docs = documentRepository.findByApplicationId(app.getId()).stream()
                            .map(DocumentDto::fromEntity)
                            .collect(Collectors.toList());
                    dto.setDocuments(docs);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long id, ApplicationStatus newStatus, String remarks, String adminEmail) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found with id: " + id));

        ApplicationStatus oldStatus = app.getStatus();
        app.setStatus(newStatus);
        if (remarks != null && !remarks.isBlank()) {
            app.setOfficerRemarks(remarks);
        }
        if (newStatus == ApplicationStatus.APPROVED) {
            app.setApprovedAt(LocalDateTime.now());
            app.setApprovedByOfficer(adminEmail);
            if (app.getSanctionReference() == null) {
                app.setSanctionReference("SANC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
        }

        Application saved = applicationRepository.save(app);

        logAudit(adminEmail, "ADMIN", "UPDATE_APPLICATION_STATUS", "Application", saved.getId().toString(),
                "Changed status from " + oldStatus + " to " + newStatus + ". Remarks: " + remarks);

        return ApplicationDto.fromEntity(saved);
    }

    // ==================== GRIEVANCE MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<GrievanceDto> getAllGrievances(String village, GrievanceStatus status) {
        List<Grievance> list;
        if (village != null && !village.isBlank() && !village.equalsIgnoreCase("all")) {
            list = grievanceRepository.findByCitizen_VillageIgnoreCaseOrderByCreatedAtDesc(village);
        } else {
            list = grievanceRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream()
                .filter(g -> status == null || g.getStatus() == status)
                .map(GrievanceDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public GrievanceDto respondToGrievance(Long id, String response, GrievanceStatus newStatus, String adminEmail) {
        Grievance g = grievanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grievance not found with id: " + id));

        if (response != null && !response.isBlank()) {
            g.setOfficerResponse(response);
        }
        if (newStatus != null) {
            g.setStatus(newStatus);
        }

        Grievance saved = grievanceRepository.save(g);

        logAudit(adminEmail, "ADMIN", "RESPOND_GRIEVANCE", "Grievance", saved.getId().toString(),
                "Admin responded to grievance: " + response + ", status: " + saved.getStatus());

        return GrievanceDto.fromEntity(saved);
    }

    // ==================== CERTIFICATE MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<CertificateRequestDto> getAllCertificates(String village, CertificateStatus status) {
        List<CertificateRequest> list;
        if (village != null && !village.isBlank() && !village.equalsIgnoreCase("all")) {
            list = certificateRequestRepository.findByCitizen_VillageIgnoreCaseOrderByCreatedAtDesc(village);
        } else {
            list = certificateRequestRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream()
                .filter(c -> status == null || c.getStatus() == status)
                .map(CertificateRequestDto::fromEntity)
                .collect(Collectors.toList());
    }

    // ==================== DEVELOPMENT WORKS ====================

    @Transactional(readOnly = true)
    public List<DevelopmentWorkDto> getAllDevelopmentWorks(String village) {
        List<DevelopmentWork> list;
        if (village != null && !village.isBlank() && !village.equalsIgnoreCase("all")) {
            list = developmentWorkRepository.findByVillageIgnoreCaseOrderByCreatedAtDesc(village);
        } else {
            list = developmentWorkRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream().map(DevelopmentWorkDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional
    public DevelopmentWorkDto createDevelopmentWork(DevelopmentWorkDto dto, String adminEmail) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (dto.getEstimatedCost() == null || dto.getEstimatedCost().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Estimated cost must be greater than zero");
        }

        DevelopmentWork work = new DevelopmentWork();
        work.setWorkId("WRK-" + System.currentTimeMillis() % 1000000);
        work.setTitle(dto.getTitle().trim());
        work.setDescription(dto.getDescription());
        work.setCategory(dto.getCategory() != null ? dto.getCategory() : "Infrastructure");
        work.setLocation(dto.getLocation() != null ? dto.getLocation() : dto.getVillage());
        work.setVillage(dto.getVillage() != null ? dto.getVillage() : "Sathyamangalam");
        work.setEstimatedCost(dto.getEstimatedCost());
        work.setAllocatedAmount(dto.getAllocatedAmount() != null ? dto.getAllocatedAmount() : dto.getEstimatedCost());
        work.setSpentAmount(dto.getSpentAmount() != null ? dto.getSpentAmount() : BigDecimal.ZERO);
        work.setStartDate(dto.getStartDate());
        work.setExpectedCompletionDate(dto.getExpectedCompletionDate());
        work.setProgressPercentage(dto.getProgressPercentage() != null ? dto.getProgressPercentage() : 0);
        work.setStatus(dto.getStatus() != null ? dto.getStatus() : WorkStatus.PLANNED);

        DevelopmentWork saved = developmentWorkRepository.save(work);

        // Synchronize with village budget if exists
        if (work.getVillage() != null && work.getSpentAmount() != null && work.getSpentAmount().compareTo(BigDecimal.ZERO) > 0) {
            villageBudgetRepository.findByVillageIgnoreCaseAndFinancialYear(work.getVillage(), "2025-2026")
                    .ifPresent(vb -> {
                        vb.setSpentAmount(vb.getSpentAmount().add(work.getSpentAmount()));
                        vb.recalculateRemaining();
                        villageBudgetRepository.save(vb);
                    });
        }

        logAudit(adminEmail, "ADMIN", "CREATE_DEVELOPMENT_WORK", "DevelopmentWork", saved.getId().toString(),
                "Created work: " + saved.getTitle() + " for " + saved.getVillage() + " (Alloc: Rs. " + saved.getAllocatedAmount() + ")");

        return DevelopmentWorkDto.fromEntity(saved);
    }

    // ==================== SCHEMES CRUD ====================

    @Transactional(readOnly = true)
    public List<SchemeDto> getAllSchemes() {
        return schemeRepository.findAll()
                .stream()
                .map(SchemeDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public SchemeDto createScheme(SchemeDto dto, String adminEmail) {
        Scheme s = new Scheme();
        s.setSchemeId("SCH-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        s.setName(dto.getName());
        s.setDescription(dto.getDescription());
        s.setIncomeLimit(dto.getIncomeLimit());
        s.setAgeMin(dto.getAgeMin());
        s.setAgeMax(dto.getAgeMax());
        s.setLandLimit(dto.getLandLimit());
        s.setRequiredDocuments(dto.getRequiredDocuments());
        s.setActive(dto.getActive() != null ? dto.getActive() : true);

        Scheme saved = schemeRepository.save(s);

        logAudit(adminEmail, "ADMIN", "CREATE_SCHEME", "Scheme", saved.getId().toString(),
                "Created scheme: " + saved.getName() + " (" + saved.getSchemeId() + ")");

        return SchemeDto.fromEntity(saved);
    }

    @Transactional
    public SchemeDto updateScheme(Long id, SchemeDto dto, String adminEmail) {
        Scheme s = schemeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Scheme not found with id: " + id));

        if (dto.getName() != null) s.setName(dto.getName());
        if (dto.getDescription() != null) s.setDescription(dto.getDescription());
        if (dto.getIncomeLimit() != null) s.setIncomeLimit(dto.getIncomeLimit());
        if (dto.getAgeMin() != null) s.setAgeMin(dto.getAgeMin());
        if (dto.getAgeMax() != null) s.setAgeMax(dto.getAgeMax());
        if (dto.getLandLimit() != null) s.setLandLimit(dto.getLandLimit());
        if (dto.getRequiredDocuments() != null) s.setRequiredDocuments(dto.getRequiredDocuments());
        if (dto.getActive() != null) s.setActive(dto.getActive());

        Scheme saved = schemeRepository.save(s);

        logAudit(adminEmail, "ADMIN", "UPDATE_SCHEME", "Scheme", saved.getId().toString(),
                "Updated scheme: " + saved.getName());

        return SchemeDto.fromEntity(saved);
    }

    // ==================== AI FRAUD MONITORING ====================

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllAiAnalyses() {
        return aiAnalysisRepository.findAll().stream().map(a -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("applicationId", a.getApplication() != null ? a.getApplication().getApplicationId() : null);
            map.put("citizenEmail", a.getApplication() != null && a.getApplication().getCitizen() != null ? a.getApplication().getCitizen().getEmail() : null);
            map.put("village", a.getApplication() != null && a.getApplication().getCitizen() != null ? a.getApplication().getCitizen().getVillage() : null);
            map.put("prediction", a.getPrediction());
            map.put("fraudProbability", a.getFraudProbability());
            map.put("fraudRiskLevel", a.getFraudRiskLevel());
            map.put("verificationRequirement", a.getVerificationRequirement());
            map.put("explanation", a.getShapExplanation());
            map.put("createdAt", a.getAnalyzedAt());
            return map;
        }).collect(Collectors.toList());
    }

    // ==================== AUDIT LOGS ====================

    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::mapAuditLogDto);
    }

    @Transactional
    public void logAudit(String actorEmail, String actorRole, String action, String entityType, String entityId, String details) {
        AuditLog log = new AuditLog(actorEmail, actorRole, action, entityType, entityId, details);
        auditLogRepository.save(log);
    }

    private AuditLogDto mapAuditLogDto(AuditLog al) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(al.getId());
        dto.setActorEmail(al.getActorEmail());
        dto.setActorRole(al.getActorRole());
        dto.setAction(al.getAction());
        dto.setEntityType(al.getEntityType());
        dto.setEntityId(al.getEntityId());
        dto.setDetails(al.getDetails());
        dto.setIpAddress(al.getIpAddress());
        dto.setCreatedAt(al.getCreatedAt());
        return dto;
    }
}
