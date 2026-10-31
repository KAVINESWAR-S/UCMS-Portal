package com.ucms.config;

import com.ucms.model.*;
import com.ucms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CitizenRepository citizenRepository;
    private final MockAadhaarRepository mockAadhaarRepository;
    private final SchemeRepository schemeRepository;
    private final DevelopmentWorkRepository developmentWorkRepository;
    private final BudgetRepository budgetRepository;
    private final GrievanceRepository grievanceRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final ApplicationRepository applicationRepository;
    private final CertificateRequestRepository certificateRequestRepository;
    private final SuggestionRepository suggestionRepository;
    private final DocumentRepository documentRepository;
    private final VillageBudgetRepository villageBudgetRepository;
    private final OfficerAssignmentRepository officerAssignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CitizenRepository citizenRepository,
                           MockAadhaarRepository mockAadhaarRepository,
                           SchemeRepository schemeRepository,
                           DevelopmentWorkRepository developmentWorkRepository,
                           BudgetRepository budgetRepository,
                           GrievanceRepository grievanceRepository,
                           ServiceRequestRepository serviceRequestRepository,
                           ApplicationRepository applicationRepository,
                           CertificateRequestRepository certificateRequestRepository,
                           SuggestionRepository suggestionRepository,
                           DocumentRepository documentRepository,
                           VillageBudgetRepository villageBudgetRepository,
                           OfficerAssignmentRepository officerAssignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.citizenRepository = citizenRepository;
        this.mockAadhaarRepository = mockAadhaarRepository;
        this.schemeRepository = schemeRepository;
        this.developmentWorkRepository = developmentWorkRepository;
        this.budgetRepository = budgetRepository;
        this.grievanceRepository = grievanceRepository;
        this.serviceRequestRepository = serviceRequestRepository;
        this.applicationRepository = applicationRepository;
        this.certificateRequestRepository = certificateRequestRepository;
        this.suggestionRepository = suggestionRepository;
        this.documentRepository = documentRepository;
        this.villageBudgetRepository = villageBudgetRepository;
        this.officerAssignmentRepository = officerAssignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // If existing data does not have the target Sathyamangalam records, wipe old mock records cleanly
        if (!mockAadhaarRepository.existsByAadhaarNumber("999900000001")) {
            log.info(">> Wiping old mock user and officer accounts as requested...");
            cleanOldData();
        }

        log.info(">> Seeding Mock Aadhaar database (Sathyamangalam, Bhavanisagar, Gobichettipalayam)...");
        seedMockAadhaarRegistry();

        log.info(">> Seeding Panchayat Officers for Sathyamangalam, Bhavanisagar, Gobichettipalayam...");
        seedPanchayatOfficers();

        log.info(">> Seeding Central Administrator account...");
        seedAdminUser();

        log.info(">> Seeding Officer Assignments...");
        seedOfficerAssignments();

        log.info(">> Seeding Welfare Schemes...");
        seedWelfareSchemes();

        log.info(">> Seeding Village Budget and Works...");
        seedVillageBudget();
        seedVillageBudgets();
        seedDevelopmentWorks();

        log.info(">> Seeding multi-panchayat Grievances and Service Requests...");
        seedSampleCivicData();

        log.info(">> Data initialization complete! All Mock Aadhaar & Officer accounts ready.");
    }

    private void cleanOldData() {
        try {
            serviceRequestRepository.deleteAll();
            grievanceRepository.deleteAll();
            certificateRequestRepository.deleteAll();
            applicationRepository.deleteAll();
            suggestionRepository.deleteAll();
            documentRepository.deleteAll();
            citizenRepository.deleteAll();
            mockAadhaarRepository.deleteAll();
            log.info(">> Cleaned old mock citizens, officers, and dependent records.");
        } catch (Exception ex) {
            log.warn(">> Clean data note: {}", ex.getMessage());
        }
    }

    private void seedMockAadhaarRegistry() {
        if (mockAadhaarRepository.existsByAadhaarNumber("999900000001")) {
            return;
        }

        // 1. Sathyamangalam Village Aadhaar (Citizen 1)
        MockAadhaar a1 = new MockAadhaar(
                "999900000001",
                "Kavineswar S",
                "kavineswar997@gmail.com",
                "9842101111",
                LocalDate.of(1998, 5, 15),
                Gender.MALE,
                "Sathyamangalam, Erode, Tamil Nadu",
                "Sathyamangalam",
                "Agriculture & Dairy Farming",
                new BigDecimal("95000.00"),
                new BigDecimal("1.50"),
                true
        );
        mockAadhaarRepository.save(a1);

        // 2. Bhavanisagar Village Aadhaar (Citizen 2)
        MockAadhaar a2 = new MockAadhaar(
                "999900000002",
                "Kavineswar Kumar",
                "kavineswars770@gmail.com",
                "9842102222",
                LocalDate.of(1996, 8, 20),
                Gender.MALE,
                "Bhavanisagar, Erode, Tamil Nadu",
                "Bhavanisagar",
                "Micro-Enterprise & Handloom",
                new BigDecimal("140000.00"),
                new BigDecimal("0.75"),
                false
        );
        mockAadhaarRepository.save(a2);

        // 3. Gobichettipalayam Village Aadhaar (Citizen 3)
        MockAadhaar a3 = new MockAadhaar(
                "999900000003",
                "Kavineswar P",
                "kavineswar.p75@gmail.com",
                "9842103333",
                LocalDate.of(2000, 2, 10),
                Gender.MALE,
                "Gobichettipalayam, Erode, Tamil Nadu",
                "Gobichettipalayam",
                "Agro-Logistics & Tech Services",
                new BigDecimal("180000.00"),
                new BigDecimal("2.00"),
                true
        );
        mockAadhaarRepository.save(a3);

        // 4. Sathyamangalam Village Aadhaar (Citizen 4 - Women Empowerment Candidate)
        MockAadhaar a4 = new MockAadhaar(
                "999900000004",
                "Priya R",
                "priya.r@example.com",
                "9842104444",
                LocalDate.of(1992, 4, 18),
                Gender.FEMALE,
                "Kamaraj Nagar, Sathyamangalam",
                "Sathyamangalam",
                "Tailoring & Handcrafts",
                new BigDecimal("68000.00"),
                new BigDecimal("0.00"),
                false
        );
        mockAadhaarRepository.save(a4);

        // 5. Bhavanisagar Village Aadhaar (Citizen 5 - Small Farmer)
        MockAadhaar a5 = new MockAadhaar(
                "999900000005",
                "Murugan M",
                "murugan.m@example.com",
                "9842105555",
                LocalDate.of(1985, 11, 25),
                Gender.MALE,
                "Dam Road, Bhavanisagar",
                "Bhavanisagar",
                "Sugarcane & Paddy Cultivation",
                new BigDecimal("82000.00"),
                new BigDecimal("1.25"),
                true
        );
        mockAadhaarRepository.save(a5);

        // 6. Gobichettipalayam Village Aadhaar (Citizen 6 - Artisan)
        MockAadhaar a6 = new MockAadhaar(
                "999900000006",
                "Anitha S",
                "anitha.s@example.com",
                "9842106666",
                LocalDate.of(1997, 9, 30),
                Gender.FEMALE,
                "Nethaji Street, Gobichettipalayam",
                "Gobichettipalayam",
                "Silk Weaving & Artisanship",
                new BigDecimal("74000.00"),
                new BigDecimal("0.50"),
                false
        );
        mockAadhaarRepository.save(a6);

        // Also pre-create Citizen entities from mock records so immediate login/queries work seamlessly
        createCitizenFromMock(a1);
        createCitizenFromMock(a2);
        createCitizenFromMock(a3);
        createCitizenFromMock(a4);
        createCitizenFromMock(a5);
        createCitizenFromMock(a6);
    }

    private void createCitizenFromMock(MockAadhaar mock) {
        if (citizenRepository.existsByEmail(mock.getEmail().toLowerCase())) {
            return;
        }
        Citizen citizen = new Citizen();
        citizen.setFullName(mock.getFullName());
        citizen.setAadhaarNumber(mock.getAadhaarNumber());
        citizen.setEmail(mock.getEmail().toLowerCase());
        citizen.setPhoneNumber(mock.getPhoneNumber());
        citizen.setPassword(passwordEncoder.encode("AadhaarOtp@" + mock.getAadhaarNumber()));
        citizen.setDateOfBirth(mock.getDateOfBirth());
        citizen.setGender(mock.getGender());
        citizen.setAddress(mock.getAddress());
        citizen.setVillage(mock.getVillage());
        citizen.setOccupation(mock.getOccupation());
        citizen.setAnnualIncome(mock.getAnnualIncome());
        citizen.setLandArea(mock.getLandArea());
        citizen.setFarmerStatus(mock.getFarmerStatus());
        citizen.setAadhaarVerified(true);
        citizen.setRole(Role.CITIZEN);
        citizenRepository.save(citizen);
    }

    private void seedPanchayatOfficers() {
        // Officer 1: Sathyamangalam Panchayat
        if (!citizenRepository.existsByEmail("officer.sathyamangalam@example.com")) {
            Citizen off1 = new Citizen();
            off1.setFullName("Sathyamangalam Panchayat Officer");
            off1.setEmail("officer.sathyamangalam@example.com");
            off1.setPhoneNumber("9443210001");
            off1.setPassword(passwordEncoder.encode("Officer@123"));
            off1.setDateOfBirth(LocalDate.of(1982, 3, 10));
            off1.setGender(Gender.MALE);
            off1.setAddress("Panchayat Union Office, Sathyamangalam, Erode");
            off1.setVillage("Sathyamangalam");
            off1.setOccupation("Panchayat Officer");
            off1.setAnnualIncome(new BigDecimal("650000.00"));
            off1.setLandArea(BigDecimal.ZERO);
            off1.setFarmerStatus(false);
            off1.setRole(Role.OFFICER);
            citizenRepository.save(off1);
        }

        // Officer 2: Bhavanisagar Panchayat
        if (!citizenRepository.existsByEmail("officer.bhavanisagar@example.com")) {
            Citizen off2 = new Citizen();
            off2.setFullName("Bhavanisagar Panchayat Officer");
            off2.setEmail("officer.bhavanisagar@example.com");
            off2.setPhoneNumber("9443210002");
            off2.setPassword(passwordEncoder.encode("Officer@123"));
            off2.setDateOfBirth(LocalDate.of(1986, 7, 22));
            off2.setGender(Gender.FEMALE);
            off2.setAddress("Panchayat Union Office, Bhavanisagar, Erode");
            off2.setVillage("Bhavanisagar");
            off2.setOccupation("Panchayat Officer");
            off2.setAnnualIncome(new BigDecimal("620000.00"));
            off2.setLandArea(BigDecimal.ZERO);
            off2.setFarmerStatus(false);
            off2.setRole(Role.OFFICER);
            citizenRepository.save(off2);
        }

        // Officer 3: Gobichettipalayam Panchayat
        if (!citizenRepository.existsByEmail("officer.gobichettipalayam@example.com")) {
            Citizen off3 = new Citizen();
            off3.setFullName("Gobichettipalayam Panchayat Officer");
            off3.setEmail("officer.gobichettipalayam@example.com");
            off3.setPhoneNumber("9443210003");
            off3.setPassword(passwordEncoder.encode("Officer@123"));
            off3.setDateOfBirth(LocalDate.of(1980, 11, 5));
            off3.setGender(Gender.MALE);
            off3.setAddress("Taluk Office Road, Gobichettipalayam, Erode");
            off3.setVillage("Gobichettipalayam");
            off3.setOccupation("Panchayat Officer");
            off3.setAnnualIncome(new BigDecimal("680000.00"));
            off3.setLandArea(BigDecimal.ZERO);
            off3.setFarmerStatus(false);
            off3.setRole(Role.OFFICER);
            citizenRepository.save(off3);
        }

        // Legacy alias for general officer login
        if (!citizenRepository.existsByEmail("officer@ucms.gov.in")) {
            Citizen legacyOff = new Citizen();
            legacyOff.setFullName("Head Village Administrative Officer");
            legacyOff.setEmail("officer@ucms.gov.in");
            legacyOff.setPhoneNumber("9876543210");
            legacyOff.setPassword(passwordEncoder.encode("Officer@123"));
            legacyOff.setDateOfBirth(LocalDate.of(1985, 5, 15));
            legacyOff.setGender(Gender.MALE);
            legacyOff.setAddress("Panchayat Union Office, Sathyamangalam");
            legacyOff.setVillage("Sathyamangalam");
            legacyOff.setOccupation("Panchayat Officer");
            legacyOff.setAnnualIncome(new BigDecimal("600000.00"));
            legacyOff.setLandArea(BigDecimal.ZERO);
            legacyOff.setFarmerStatus(false);
            legacyOff.setRole(Role.OFFICER);
            citizenRepository.save(legacyOff);
        }
    }

    private void seedAdminUser() {
        if (!citizenRepository.existsByEmail("admin@ucms.gov.in")) {
            Citizen admin = new Citizen();
            admin.setFullName("Central Administrator");
            admin.setEmail("admin@ucms.gov.in");
            admin.setPhoneNumber("9999900000");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setDateOfBirth(LocalDate.of(1980, 1, 1));
            admin.setGender(Gender.MALE);
            admin.setAddress("State Administrative Complex, Erode District");
            admin.setVillage("All");
            admin.setOccupation("System Administrator");
            admin.setAnnualIncome(new BigDecimal("1200000.00"));
            admin.setLandArea(BigDecimal.ZERO);
            admin.setFarmerStatus(false);
            admin.setRole(Role.ADMIN);
            citizenRepository.save(admin);
            log.info(">> Seeded Admin account: admin@ucms.gov.in (Admin@123)");
        }
    }

    private void seedOfficerAssignments() {
        if (officerAssignmentRepository.count() == 0) {
            officerAssignmentRepository.save(new OfficerAssignment(
                    "officer.sathyamangalam@example.com",
                    "Sathyamangalam Panchayat Officer",
                    "Sathyamangalam",
                    "admin@ucms.gov.in",
                    "Initial system assignment"
            ));
            officerAssignmentRepository.save(new OfficerAssignment(
                    "officer.bhavanisagar@example.com",
                    "Bhavanisagar Panchayat Officer",
                    "Bhavanisagar",
                    "admin@ucms.gov.in",
                    "Initial system assignment"
            ));
            officerAssignmentRepository.save(new OfficerAssignment(
                    "officer.gobichettipalayam@example.com",
                    "Gobichettipalayam Panchayat Officer",
                    "Gobichettipalayam",
                    "admin@ucms.gov.in",
                    "Initial system assignment"
            ));
            log.info(">> Seeded default OfficerAssignments for 3 panchayats");
        }
    }

    private void seedWelfareSchemes() {
        if (schemeRepository.count() > 0) {
            return;
        }

        Scheme s1 = new Scheme();
        s1.setSchemeId("SCH001");
        s1.setSchemeName("Kalaignar Magalir Urimai Thittam");
        s1.setDepartment("Social Welfare & Women Empowerment");
        s1.setDescription("Monthly financial assistance of Rs. 1,000 to eligible women heads of households in rural Tamil Nadu.");
        s1.setEligibilityCriteria("Family annual income < Rs. 2,50,000, landholding < 5 acres wetland or < 10 acres dryland, electricity usage < 3600 units/year.");
        s1.setRequiredDocuments("Aadhaar Card, Smart Ration Card, Bank Passbook, Electricity Bill");
        s1.setBenefitDetails("Direct Benefit Transfer of Rs. 1,000 per month into woman head's bank account.");
        s1.setMaxIncomeLimit(new BigDecimal("250000.00"));
        s1.setMaxLandArea(new BigDecimal("5.00"));
        s1.setCategory("Financial Assistance");
        s1.setIsActive(true);
        schemeRepository.save(s1);

        Scheme s2 = new Scheme();
        s2.setSchemeId("SCH002");
        s2.setSchemeName("PM-KISAN Samman Nidhi (Panchayat Node)");
        s2.setDepartment("Agriculture and Farmers Welfare");
        s2.setDescription("Income support of Rs. 6,000 per year in three equal installments for all landholding farmer families.");
        s2.setEligibilityCriteria("Small and marginal farmer families with cultivable landholding up to 2 hectares in their name.");
        s2.setRequiredDocuments("Aadhaar Card, Land Revenue Documents (Patta/Chitta), Bank Account Details");
        s2.setBenefitDetails("Direct Benefit Transfer of Rs. 2,000 every 4 months (total Rs. 6,000/year).");
        s2.setMaxIncomeLimit(new BigDecimal("200000.00"));
        s2.setMaxLandArea(new BigDecimal("4.94"));
        s2.setCategory("Agriculture");
        s2.setIsActive(true);
        schemeRepository.save(s2);

        Scheme s3 = new Scheme();
        s3.setSchemeId("SCH003");
        s3.setSchemeName("Tamil Nadu Rural Housing Scheme");
        s3.setDepartment("Rural Development & Panchayat Raj");
        s3.setDescription("Financial subsidy of Rs. 2,75,000 for constructing a pucca concrete house for kutcha house dwellers.");
        s3.setEligibilityCriteria("BPL families living in huts or kutcha houses, possessing house site patta in rural area, annual income < Rs. 1,20,000.");
        s3.setRequiredDocuments("Aadhaar Card, House Site Patta, Income Certificate, Kutcha House Geo-tagged Photo, Bank Passbook");
        s3.setBenefitDetails("Direct subsidy of Rs. 2,75,000 disbursed in 4 construction milestones + 90 days MGNREGA wages.");
        s3.setMaxIncomeLimit(new BigDecimal("120000.00"));
        s3.setMaxLandArea(BigDecimal.ZERO);
        s3.setCategory("Housing");
        s3.setIsActive(true);
        schemeRepository.save(s3);
    }

    private void seedVillageBudget() {
        if (budgetRepository.count() > 0) {
            return;
        }

        Budget b = new Budget();
        b.setFinancialYear("2025-2026");
        b.setTotalRevenue(new BigDecimal("4500000.00"));
        b.setAllocatedAmount(new BigDecimal("4000000.00"));
        b.setSpentAmount(new BigDecimal("1850000.00"));
        b.setRemainingAmount(new BigDecimal("2150000.00"));
        b.setSource("State Finance Commission Grant & Local Property Tax");
        b.setStatus("ACTIVE");
        budgetRepository.save(b);
    }

    private void seedVillageBudgets() {
        if (villageBudgetRepository.count() > 0) {
            return;
        }

        villageBudgetRepository.save(new VillageBudget(
                "Sathyamangalam",
                "2025-2026",
                new BigDecimal("4000000.00"),
                new BigDecimal("1850000.00"),
                "admin@ucms.gov.in"
        ));
        villageBudgetRepository.save(new VillageBudget(
                "Bhavanisagar",
                "2025-2026",
                new BigDecimal("3500000.00"),
                new BigDecimal("1200000.00"),
                "admin@ucms.gov.in"
        ));
        villageBudgetRepository.save(new VillageBudget(
                "Gobichettipalayam",
                "2025-2026",
                new BigDecimal("5000000.00"),
                new BigDecimal("2100000.00"),
                "admin@ucms.gov.in"
        ));
        log.info(">> Seeded VillageBudgets for Sathyamangalam, Bhavanisagar, and Gobichettipalayam");
    }

    private void seedDevelopmentWorks() {
        if (developmentWorkRepository.count() > 0) {
            return;
        }

        DevelopmentWork w1 = new DevelopmentWork();
        w1.setWorkId("WRK-2025-001");
        w1.setTitle("Sathyamangalam Solar LED Streetlights Phase 2");
        w1.setDescription("Installation of 45 high-efficiency solar streetlights across main agricultural transit roads.");
        w1.setCategory("Electrification");
        w1.setLocation("Sathyamangalam North Ward");
        w1.setVillage("Sathyamangalam");
        w1.setEstimatedCost(new BigDecimal("450000.00"));
        w1.setAllocatedAmount(new BigDecimal("450000.00"));
        w1.setSpentAmount(new BigDecimal("270000.00"));
        w1.setStartDate(LocalDate.of(2025, 2, 1));
        w1.setExpectedCompletionDate(LocalDate.of(2025, 6, 30));
        w1.setProgressPercentage(60);
        w1.setStatus(WorkStatus.IN_PROGRESS);
        developmentWorkRepository.save(w1);

        DevelopmentWork w2 = new DevelopmentWork();
        w2.setWorkId("WRK-2024-002");
        w2.setTitle("Bhavanisagar Deep Borewell & Solar Pump Integration");
        w2.setDescription("50,000 liter water storage with solar pump integration for Bhavanisagar residents.");
        w2.setCategory("Water Supply");
        w2.setLocation("Bhavanisagar South Ward");
        w2.setVillage("Bhavanisagar");
        w2.setEstimatedCost(new BigDecimal("800000.00"));
        w2.setAllocatedAmount(new BigDecimal("800000.00"));
        w2.setSpentAmount(new BigDecimal("800000.00"));
        w2.setStartDate(LocalDate.of(2024, 8, 1));
        w2.setExpectedCompletionDate(LocalDate.of(2024, 12, 15));
        w2.setActualCompletionDate(LocalDate.of(2024, 12, 10));
        w2.setProgressPercentage(100);
        w2.setStatus(WorkStatus.COMPLETED);
        developmentWorkRepository.save(w2);

        DevelopmentWork w3 = new DevelopmentWork();
        w3.setWorkId("WRK-2025-003");
        w3.setTitle("Gobichettipalayam Primary Health Centre Modernization");
        w3.setDescription("Upgrading consultation rooms and maternity ward facilities with emergency solar backup.");
        w3.setCategory("Health Infrastructure");
        w3.setLocation("Gobichettipalayam East Ward");
        w3.setVillage("Gobichettipalayam");
        w3.setEstimatedCost(new BigDecimal("950000.00"));
        w3.setAllocatedAmount(new BigDecimal("950000.00"));
        w3.setSpentAmount(new BigDecimal("420000.00"));
        w3.setStartDate(LocalDate.of(2025, 1, 15));
        w3.setExpectedCompletionDate(LocalDate.of(2025, 8, 30));
        w3.setProgressPercentage(45);
        w3.setStatus(WorkStatus.IN_PROGRESS);
        developmentWorkRepository.save(w3);
    }

    private void seedSampleCivicData() {
        if (serviceRequestRepository.count() > 0 && grievanceRepository.count() > 0) {
            return;
        }

        Citizen c1 = citizenRepository.findByEmail("kavineswar997@gmail.com").orElse(null);
        Citizen c2 = citizenRepository.findByEmail("kavineswars770@gmail.com").orElse(null);
        Citizen c3 = citizenRepository.findByEmail("kavineswar.p75@gmail.com").orElse(null);

        // 1. Sathyamangalam Service Request (EB Connection)
        if (c1 != null && serviceRequestRepository.count() == 0) {
            ServiceRequest sr1 = new ServiceRequest();
            sr1.setRequestId("SRV-EB-2026-1042");
            sr1.setCitizen(c1);
            sr1.setServiceType(ServiceRequestType.EB_CONNECTION);
            sr1.setSubCategory("Domestic Three-Phase (Above 5 kW)");
            sr1.setTitle("New Domestic EB Electricity Meter Connection");
            sr1.setDescription("Requesting new 3-phase meter connection for newly constructed residential home. Nearest electric distribution pole is located 18 meters away.");
            sr1.setPropertyAddress("12, South Car Street, Sathyamangalam");
            sr1.setWardNumber("Ward 4");
            sr1.setSurveyNumber("SF-108/2A");
            sr1.setLatitude(11.5034);
            sr1.setLongitude(77.2444);
            sr1.setDocumentUrl("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400' viewBox='0 0 640 400'><rect width='640' height='400' fill='%231e293b'/><rect x='20' y='20' width='600' height='360' rx='12' fill='%230f172a' stroke='%2338bdf8' stroke-width='2'/><circle cx='320' cy='150' r='55' fill='%23eab308' opacity='0.25'/><path d='M325 110 L300 160 L325 160 L315 200 L345 145 L320 145 Z' fill='%23facc15'/><text x='320' y='260' text-anchor='middle' fill='%23f8fafc' font-family='sans-serif' font-size='20' font-weight='700'>Electricity Board (EB) Connection Site Proof</text><text x='320' y='292' text-anchor='middle' fill='%2338bdf8' font-family='sans-serif' font-size='14'>12, South Car Street | Sathyamangalam Ward 4</text><text x='320' y='320' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='12'>Survey No: SF-108/2A | GPS: 11.5034° N, 77.2444° E</text></svg>");
            sr1.setDocumentType("Building Assessment & Site Photo");
            sr1.setStatus(ServiceRequestStatus.SITE_INSPECTION_SCHEDULED);
            sr1.setAssignedStaff("Er. K. Sivakumar, TNEB Junior Engineer (9443210987)");
            sr1.setInspectionDate(LocalDate.now().plusDays(2));
            sr1.setOfficerRemarks("Feasibility verified with Sathyamangalam Revenue Office. Field inspection scheduled for meter clearance.");
            serviceRequestRepository.save(sr1);

            Grievance g1 = new Grievance();
            g1.setGrievanceId("GRV-STM-101");
            g1.setCitizen(c1);
            g1.setCategory("Infrastructure");
            g1.setSubject("Deep potholes on Sathyamangalam South Car Street");
            g1.setDescription("Water logs after rain making bicycle and bike transit hazardous.");
            g1.setLocation("12, South Car Street, Sathyamangalam");
            g1.setLatitude(11.5034);
            g1.setLongitude(77.2444);
            g1.setImageUrl("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><rect width='640' height='400' fill='%231e293b'/><text x='320' y='200' fill='%23fff' text-anchor='middle'>Sathyamangalam Road Grievance</text></svg>");
            g1.setStatus(GrievanceStatus.UNDER_REVIEW);
            g1.setOfficerResponse("Officer inspected. Patchwork sanctioned under village budget.");
            grievanceRepository.save(g1);
        }

        // 2. Bhavanisagar Service Request (Water Connection)
        if (c2 != null && serviceRequestRepository.count() <= 1) {
            ServiceRequest sr2 = new ServiceRequest();
            sr2.setRequestId("SRV-WTR-2026-2184");
            sr2.setCitizen(c2);
            sr2.setServiceType(ServiceRequestType.WATER_CONNECTION);
            sr2.setSubCategory("Household Piped Tap (0.5 inch)");
            sr2.setTitle("Piped Drinking Water Supply Connection");
            sr2.setDescription("New tap connection requested from Bhavanisagar panchayat main drinking water distribution line.");
            sr2.setPropertyAddress("45, Main Bazaar Road, Bhavanisagar");
            sr2.setWardNumber("Ward 2");
            sr2.setSurveyNumber("BVN-88/4B");
            sr2.setLatitude(11.4820);
            sr2.setLongitude(77.1230);
            sr2.setDocumentUrl("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400' viewBox='0 0 640 400'><rect width='640' height='400' fill='%23075985'/><text x='320' y='200' text-anchor='middle' fill='%23fff'>Bhavanisagar Water Pipeline Site Photo</text></svg>");
            sr2.setDocumentType("Property Tax Receipt & Photo");
            sr2.setStatus(ServiceRequestStatus.SUBMITTED);
            serviceRequestRepository.save(sr2);
        }

        // 3. Gobichettipalayam Service Request (Solar Rooftop)
        if (c3 != null && serviceRequestRepository.count() <= 2) {
            ServiceRequest sr3 = new ServiceRequest();
            sr3.setRequestId("SRV-SLR-2026-3390");
            sr3.setCitizen(c3);
            sr3.setServiceType(ServiceRequestType.SOLAR_ROOFTOP);
            sr3.setSubCategory("Residential Rooftop (1 kW - 3 kW)");
            sr3.setTitle("Rooftop Solar Grid Net-Metering Request");
            sr3.setDescription("Rooftop solar 3kW bi-directional meter installation for rural farm house.");
            sr3.setPropertyAddress("88, Bus Stand Road, Gobichettipalayam");
            sr3.setWardNumber("Ward 1");
            sr3.setSurveyNumber("GBC-112/1A");
            sr3.setLatitude(11.4550);
            sr3.setLongitude(77.4330);
            sr3.setDocumentUrl("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'><rect width='640' height='400' fill='%23ea580c'/><text x='320' y='200' fill='%23fff' text-anchor='middle'>Gobichettipalayam Solar Net-Meter Inspection</text></svg>");
            sr3.setDocumentType("Building Approval Document");
            sr3.setStatus(ServiceRequestStatus.UNDER_VERIFICATION);
            sr3.setOfficerRemarks("Document verification in progress by Gobichettipalayam Panchayat office.");
            serviceRequestRepository.save(sr3);
        }
    }
}
