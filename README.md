# 🏛️ Unified Citizen Management System (UCMS) for Village Administration

> **A Complete, Automated, and Explainable AI Decision-Support Platform Modernizing Rural Governance**

The **Unified Citizen Management System (UCMS)** is a comprehensive, production-ready digital e-governance platform designed for village panchayats and rural administrative bodies. UCMS eliminates paper bureaucracy, streamlines welfare scheme delivery, automates digital certificate generation, provides real-time public works and budget tracking, and incorporates an **Explainable AI (XAI)** decision-support layer to detect synthetic fraud risks and explain recommendations transparently to administrative officers.

---

## 📑 Table of Contents

1. [System Architecture Overview](#-system-architecture-overview)
2. [Technology Stack](#-technology-stack)
3. [Key Portals & Features](#-key-portals--features)
   - [Citizen Portal](#1-citizen-portal)
   - [Officer (Administrative) Portal](#2-officer-administrative-portal)
   - [Public QR Verification Desk](#3-public-qr-verification-desk)
4. [Explainable AI & Machine Learning Pipeline](#-explainable-ai--machine-learning-pipeline)
   - [Citizen Profile Analyzer](#a-citizen-profile-analyzer)
   - [Scheme Recommendation Engine](#b-scheme-recommendation-engine)
   - [Fraud Intelligence Engine](#c-fraud-intelligence-engine)
   - [Explainable AI (XAI) & SHAP Attributions](#d-explainable-ai-xai--shap-attributions)
5. [Database Architecture & Entities](#-database-architecture--entities)
6. [Complete Step-by-Step Setup Guide](#-complete-step-by-step-setup-guide)
   - [Prerequisites](#prerequisites)
   - [Step 1: Python AI Service Setup](#step-1-python-ai-service-setup)
   - [Step 2: Spring Boot Backend Setup](#step-2-spring-boot-backend-setup)
   - [Step 3: React Vite Frontend Setup](#step-3-react-vite-frontend-setup)
7. [Default Test Credentials & Demo Accounts](#-default-test-credentials--demo-accounts)
8. [API Documentation & Contracts](#-api-documentation--contracts)
   - [Spring Boot Endpoints](#spring-boot-rest-api)
   - [FastAPI Endpoints & Payload Schemas](#fastapi-ai-service-api)
9. [Security, Digital Signatures & Compliance](#-security-digital-signatures--compliance)
10. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🚀 System Architecture Overview

The system is built on a decoupled, three-tier microservice architecture communicating via secure HTTP REST APIs, backed by a file-based H2 database for local development or PostgreSQL for cloud deployments:

```
                          ┌──────────────────────────────────────┐
                          │       Citizen & Officer Portal       │
                          │          (React 19 + Vite)           │
                          │        http://localhost:5173         │
                          └──────────────────┬───────────────────┘
                                             │
                                 HTTP REST   │ (JWT Authenticated)
                                             ▼
                          ┌──────────────────────────────────────┐
                          │       Core Transaction Backend       │
                          │         (Spring Boot 3 + JPA)        │
                          │        http://localhost:8080         │
                          └──────────────┬───────┬───────────────┘
                                         │       │
              H2 (Local) /               │       │ HTTP REST API
              Neon PostgreSQL (Cloud)    │       │ POST /api/v1/ai/analyze
                                         ▼       ▼
                               ┌───────────┐   ┌───────────────────────────┐
                               │ Database  │   │  Explainable AI Service   │
                               │  Instance │   │    (FastAPI + Python)     │
                               │ (ucmsdb)  │   │   http://127.0.0.1:8000   │
                               └───────────┘   └───────────────────────────┘
```

### Architectural Highlights
- **Stateless Authentication**: JWT-based session security with role-based routing (`ROLE_CITIZEN`, `ROLE_OFFICER`).
- **Resilient AI Bridge**: The Spring Boot backend incorporates an HTTP client bridge with configurable timeouts and local rule-engine fallback so the core transactional system remains operational even if the AI service is momentarily unreachable.
- **Explainability First**: Officers never receive a black-box AI score. Every prediction is backed by SHAP (SHapley Additive exPlanations) feature attributions and natural-language justifications.

---

## 💻 Technology Stack

| Tier | Technologies / Libraries | Purpose |
| :--- | :--- | :--- |
| **Frontend Portal** | React 19, Vite 6/8, React Router 7, Axios, Lucide Icons, QRCode | Interactive, responsive SPA for citizens, officers, and public verification |
| **Styling** | Vanilla CSS (Tailored Design System, CSS Variables, Glassmorphism) | High-performance, clean UI without bulky utility library overhead |
| **Transaction Backend** | Java 21 LTS, Spring Boot 3.3.3, Spring Data JPA, Spring Security | Transactional REST API, business validation, JWT verification, cryptographic hashing |
| **Databases** | H2 Database (File-based local) & PostgreSQL (Cloud / Neon) | Relational persistence, citizen registries, audit logs, schemes, budgets |
| **AI & ML Engine** | Python 3.10+, FastAPI, Uvicorn, Scikit-Learn, SHAP, Pandas, NumPy | Socio-economic profiling, Random Forest fraud classification, SHAP tree explainability |

---

## 🔑 Key Portals & Features

### 👤 1. Citizen Portal
Designed as an accessible, one-stop self-service e-governance desk for rural citizens:
- **Aadhaar-Linked Self-Registration & Login**: Captures socio-economic indicators (income, land area, farmer status, family size, ration card type, housing condition).
- **Citizen Dashboard**: Real-time KPI summary tracking active applications, approved certificates, grievance statuses, and instant notifications.
- **AI Scheme Recommender**: Automatically computes compatibility scores (0–100%) for government schemes (PM Kisan, Housing, Pension, Handloom assistance) based on citizen profile attributes.
- **Scheme Application Desk**: Digital application submissions with declared financial parameters and document verification uploads.
- **Certificate Request Desk**: Submit digital requests for 4 essential government certificates:
  1. *Income Certificate*
  2. *Birth Certificate*
  3. *Community Certificate*
  4. *Residence Certificate*
- **Downloadable E-Certificates**: Approved certificates can be viewed, downloaded, and printed, complete with verified government badges, reference codes, and instant QR verification codes.
- **Civic Grievances Desk**: Submit panchayat complaints (water supply, road repairs, electricity, sanitation) and track administrative action remarks.
- **Village Suggestions Desk**: Propose public infrastructure and development ideas directly to the Panchayat Union.

---

### 👮 2. Officer (Administrative) Portal
Equips Village Administrative Officers (VAO) and Panchayat Union officials with automated evaluation and audit utilities:
- **Administrative Overview Board**: High-level counters tracking total pending applications, unverified certificates, open grievances, and flagged fraud risks.
- **Multi-Panchayat Governance**: Scoped administrative jurisdiction across local panchayats:
  - *Sathyamangalam Panchayat*
  - *Bhavanisagar Panchayat*
  - *Gobichettipalayam Panchayat*
- **AI-Assisted Scheme Auditing**:
  - Automatically compares declared application data against verified citizen profile records (income variance, land survey variance).
  - Triggers the FastAPI machine learning service to compute fraud risk probability (`NORMAL` vs `FRAUD`).
  - Renders interactive **SHAP Force & Feature Breakdown charts** showing exactly which parameters increased or decreased the risk index.
- **Official Decision Console**: Approve, reject, or request enhanced verification on applications with administrative remarks. Automatically generates digital sanction references upon approval.
- **Certificate Issuance & Review**: Approve/reject certificate requests, assigning tamper-evident reference codes and digital signatures.
- **Village Demographic Analytics**: Visual charts summarizing village population age brackets, ration cards (PHH, NPHH, AAY), farmer percentages, and vulnerability distributions.
- **Public Works & Budget Tracker**: Configure panchayat infrastructure projects (road paving, solar streetlights, canal desilting), update completion percentages (0–100%), and track annual budget allocations and spent funds.

---

### 🌐 3. Public QR Verification Desk
- **Route**: `/verify/:refCode` (e.g. `http://localhost:5173/verify/CERT-INC-2026-10001`)
- **Publicly Accessible**: Does not require user login or authentication.
- **Instant Certificate Authenticity Check**: Scans or loads certificate reference codes, verifying digital issuance timestamps, issuing officer title, beneficiary details, and cryptographic validity directly against the backend registry.

---

## 🤖 Explainable AI & Machine Learning Pipeline

The AI engine lives in `api/` and `src/` as a dedicated Python microservice with four primary engines:

```
Raw Citizen Profile + Application Data
                  │
                  ▼
   [ CitizenProfileAnalyzer ]  ──►  Socio-Economic Enriched Profile + Vulnerability Score
                  │
                  ▼
   [ RecommendationEngine ]    ──►  Top Recommended Schemes + Eligibility Match + Reasons
                  │
                  ▼
   [ FraudIntelligenceEngine ] ──►  Random Forest Fraud Probability + Risk Classification
                  │
                  ▼
    [ ExplainableAILayer ]     ──►  SHAP Local Feature Attributions + Natural Language Rationale
```

### A. Citizen Profile Analyzer (`src/citizenProfileAnalyzer.py`)
- Standardizes raw demographic data into standardized categorical brackets (`Age Group`, `Income Bracket`, `Land Category`, `Family Category`).
- Computes an aggregate **Vulnerability Score (0–100)** incorporating income poverty levels, housing structural stability, disability indicators, and documentation readiness.

### B. Scheme Recommendation Engine (`src/recommendationEngine.py`)
- Evaluates citizen eligibility against active welfare matrices loaded from `data/schemes.csv`.
- Computes a dynamic multi-factor score:
  - Base eligibility check (Age range, income ceiling, land ceiling, farmer flag, gender).
  - Deductions for missing documentation.
  - Social equity boost for citizens holding zero or one existing active government scheme.

### C. Fraud Intelligence Engine (`src/fraudEngine.py`)
- Constructs an 18-feature behavioral and demographic vector strictly avoiding target leakage:
  - `income_deviation_pct`: Discrepancy between declared income and registered database records.
  - `land_deviation_pct`: Discrepancy between declared land area and revenue records.
  - `application_frequency`, `days_since_previous_application`.
  - `scheme_claim_count`, `benefit_overlap_count`.
  - `document_completeness`, `citizen_data_consistency`, `application_consistency_score`.
- Runs inference using a trained **Random Forest Classifier** (`models/fraud_model.joblib`).
- Outputs classified risk tiers:
  - **LOW RISK (0.00 – 0.30)**: *Standard Verification*
  - **MEDIUM RISK (0.31 – 0.70)**: *Additional Document Verification*
  - **HIGH RISK (0.71 – 1.00)**: *Enhanced Manual Verification Required*

### D. Explainable AI (XAI) & SHAP Attributions (`src/explainableAI.py`)
- Utilizes **SHAP (SHapley Additive exPlanations)** `TreeExplainer` cached in-memory for low-latency inference.
- Extracts the top 5 driving features for each individual application:
  - Feature name and observed numerical value.
  - SHAP value indicating directional impact (`INCREASES_FRAUD_RISK` vs `DECREASES_FRAUD_RISK`).
- Generates transparent, human-readable audit summaries for village officers to prevent biased or erroneous rejections.

---

## 🗄️ Database Architecture & Entities

The system supports two database profiles:
1. **`h2` (Default Local Profile)**: Zero-configuration, file-based database stored at `backend/data/ucmsdb.mv.db`. Data persists between server restarts.
2. **`postgres` (Production Cloud Profile)**: Standard PostgreSQL / Neon cloud database with SSL pooling.

### Core Domain Entities

| Entity | Table Name | Purpose |
| :--- | :--- | :--- |
| `Citizen` | `citizens` | Registered citizens and officers (demographics, credentials, role, panchayat) |
| `MockAadhaar` | `mock_aadhaar` | Simulated government Aadhaar database for registration verification |
| `Scheme` | `schemes` | Welfare schemes with age, income, and land eligibility thresholds |
| `Application` | `applications` | Welfare applications submitted by citizens |
| `CertificateRequest` | `certificate_requests` | Birth, Income, Community, and Residence certificate requests |
| `Grievance` | `grievances` | Citizen complaints regarding infrastructure or civic services |
| `ServiceRequest` | `service_requests` | Miscellaneous panchayat utility requests |
| `Suggestion` | `suggestions` | Community proposals submitted to the panchayat |
| `DevelopmentWork` | `development_works` | Public infrastructure projects, timeline, and completion percentage |
| `Budget` | `budgets` | Annual village budgets, allocated funds, and expenditure balances |
| `AiAnalysis` | `ai_analyses` | Persisted AI evaluation records, fraud scores, and SHAP JSON audit trails |
| `Document` | `documents` | Uploaded document references associated with applications |

---

## ⚙️ Complete Step-by-Step Setup Guide

### Prerequisites
Before running the system, ensure the following are installed on your machine:
- **Node.js**: Version 18+ (tested on Node 20 / 24)
- **Java**: JDK 21 LTS installed (`java -version`)
- **Apache Maven**: Version 3.8+ installed (`mvn -version`)
- **Python**: Version 3.10+ installed (`python --version`)

---

### Step 1: Python AI Service Setup

1. Open PowerShell and navigate to the root directory:
   ```powershell
   cd e:\Projects\Unified-Citizen-Management-System-main
   ```
2. Activate the virtual environment (or create one if not present):
   ```powershell
   # If venv does not exist:
   python -m venv venv

   # Activate virtual environment:
   .\venv\Scripts\Activate.ps1
   ```
3. Install required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```
4. *(Optional — already pre-generated)* Generate synthetic training data and train the model:
   ```powershell
   python src/generate_data.py
   python src/train.py
   ```
5. Launch the FastAPI AI server:
   ```powershell
   .\venv\Scripts\python.exe -m uvicorn api.main:app --host 127.0.0.1 --port 8000
   ```
   *Verify by opening `http://127.0.0.1:8000/health` in your browser. It should return `{"status":"UP","service":"UCMS AI Service","model_loaded":true}`.*

---

### Step 2: Spring Boot Backend Setup

1. Open a new PowerShell terminal and navigate to the `backend/` directory:
   ```powershell
   cd e:\Projects\Unified-Citizen-Management-System-main\backend
   ```
2. Run the Spring Boot application using Maven:
   ```powershell
   mvn spring-boot:run
   ```
   *The backend will automatically start Tomcat on port `8080`, initialize the H2 database, and pre-seed mock Aadhaar records, officer accounts, welfare schemes, and sample public works.*
   
   *Verify by opening `http://localhost:8080/api/health` in your browser. It should return `{"status":"ok","service":"UCMS Backend"}`.*

   *(Optional) To view the H2 web console, visit `http://localhost:8080/h2-console` with JDBC URL `jdbc:h2:file:./data/ucmsdb` and user `sa` (blank password).*

---

### Step 3: React Vite Frontend Setup

1. Open a new PowerShell terminal and navigate to the `frontend/` directory:
   ```powershell
   cd e:\Projects\Unified-Citizen-Management-System-main\frontend
   ```
2. Install npm dependencies (if not already installed):
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔐 Default Test Credentials & Demo Accounts

All test accounts are automatically seeded into the database on startup:

### 👮 Panchayat Officer Accounts (Administrative)

| Panchayat Office | Email Address | Password | Jurisdiction |
| :--- | :--- | :--- | :--- |
| **Sathyamangalam** | `officer.sathyamangalam@example.com` | `Officer@123` | Sathyamangalam Village |
| **Bhavanisagar** | `officer.bhavanisagar@example.com` | `Officer@123` | Bhavanisagar Village |
| **Gobichettipalayam** | `officer.gobichettipalayam@example.com` | `Officer@123` | Gobichettipalayam Village |

### 👤 Citizen Accounts (Beneficiaries)

| Citizen Name | Email Address | Password | Aadhaar Number | Profile Characteristics |
| :--- | :--- | :--- | :--- | :--- |
| **Kavineswar Shanmugam** | `kavineswarsam77@gmail.com` | `AadhaarOtp@999900000001` | `999900000001` | Farmer, Income ₹95,000, 1.5 acres land |
| **Kavineswar Kumar** | `kavineswars770@gmail.com` | `AadhaarOtp@999900000002` | `999900000002` | Handloom/Micro-enterprise, Income ₹1,40,000 |
| **Kavineswar P** | `kavineswar.p75@gmail.com` | `AadhaarOtp@999900000003` | `999900000003` | Agro-Logistics, Income ₹1,80,000, 2.0 acres land |

*Note: When self-registering a new citizen profile, any Aadhaar number matching one of the seeded mock Aadhaar records (`999900000001`, `999900000002`, `999900000003`) will validate and pre-populate verified data automatically.*

---

## 📡 API Documentation & Contracts

### Spring Boot REST API

#### Authentication & Citizen APIs (`/api/auth`, `/api/citizen`)
- `POST /api/auth/register` — Register a new citizen account
- `POST /api/auth/login` — Authenticate and receive a JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile
- `GET /api/citizen/dashboard` — Citizen dashboard statistics and counts
- `GET /api/citizen/profile` — Full citizen profile information

#### Welfare Schemes & Applications (`/api/schemes`, `/api/applications`)
- `GET /api/schemes` — List all active welfare schemes
- `GET /api/schemes/recommended` — Get AI compatibility rankings for current citizen
- `GET /api/schemes/{schemeId}` — Fetch specific scheme details
- `GET /api/applications` — List citizen's submitted scheme applications
- `POST /api/applications` — Submit a new scheme application

#### Digital Certificates (`/api/certificates`)
- `GET /api/certificates` — List citizen's requested certificates
- `POST /api/certificates` — Request an official certificate (Birth/Income/Community/Residence)
- `GET /api/certificates/{id}/download` — View approved certificate details

#### Grievances, Suggestions & Civic Feedback
- `GET /api/grievances`, `POST /api/grievances` — Citizen grievance submission & tracking
- `GET /api/suggestions`, `POST /api/suggestions` — Citizen village development suggestions
- `GET /api/service-requests`, `POST /api/service-requests` — Panchayat public service desk

#### Officer Administration APIs (`/api/officer`)
- `GET /api/officer/dashboard/stats` — High-level KPI counts and audit flags
- `GET /api/officer/applications` — List all applications within officer jurisdiction
- `POST /api/officer/applications/{id}/ai-analyze` — Trigger Python AI & SHAP audit on an application
- `GET /api/officer/applications/{id}/ai-analysis` — Fetch saved AI analysis result
- `POST /api/officer/applications/{id}/review` — Approve or reject an application with remarks
- `GET /api/officer/certificates` — Review certificate queue
- `POST /api/officer/certificates/{id}/review` — Approve/reject certificate and issue reference code
- `GET /api/officer/development-works` — Track ongoing village infrastructure works
- `POST /api/officer/development-works` — Add new infrastructure project
- `PUT /api/officer/development-works/{id}` — Update project progress (0–100%)
- `GET /api/officer/budget`, `POST /api/officer/budget` — Village budget and expenditure manager

#### Public Verification API (`/api/public`)
- `GET /api/public/verify/{referenceCode}` — Public certificate validation (returns verified status, applicant, issue date, and hash)

---

### FastAPI AI Service API

#### `GET /health`
Returns health check telemetry and model readiness status:
```json
{
  "status": "UP",
  "service": "UCMS AI Service",
  "model_loaded": true
}
```

#### `POST /api/v1/ai/analyze`
Executes profile target matching, welfare compatibility scoring, Random Forest fraud classification, and dynamic local SHAP attributions.

**Request Schema:**
```json
{
  "citizen": {
    "citizen_id": "CIT10001",
    "age": 42,
    "annual_income": 45000.0,
    "land_area": 1.2,
    "farmer_status": true,
    "occupation": "Agriculture",
    "family_size": 4,
    "disability_status": false,
    "housing_condition": "Pucca",
    "ration_card": "PHH",
    "aadhaar_verified": true,
    "bank_account": true
  },
  "application": {
    "application_id": "APP50012",
    "citizen_id": "CIT10001",
    "scheme_id": "SCH001",
    "declared_income": 45000.0,
    "declared_land_area": 1.2,
    "document_count": 3,
    "application_date": "2026-10-09"
  }
}
```

**Response Schema:**
```json
{
  "citizen_id": "CIT10001",
  "application_id": "APP50012",
  "profile": {
    "citizen_id": "CIT10001",
    "age_group": "Middle-Aged (36-50)",
    "income_category": "Very Low (<50K)",
    "occupation_category": "Agriculture",
    "land_category": "Small (1.0-2.5 acres)",
    "family_category": "Medium Family (3-5)",
    "vulnerability_score": 45.0,
    "document_readiness": 100.0,
    "aadhaar_verified": true,
    "bank_account": true,
    "farmer_indicator": true,
    "senior_citizen_indicator": false
  },
  "recommendations": [
    {
      "scheme_id": "SCH002",
      "scheme_name": "Small & Marginal Farmer Assistance Scheme",
      "eligible": true,
      "score": 88,
      "reasons": [
        "Age criterion met (42 years is within 18-75).",
        "Income criterion met (INR 45,000 <= INR 150,000 limit).",
        "Farmer status confirmed.",
        "100% Document readiness."
      ],
      "missing_documents": []
    }
  ],
  "fraud_analysis": {
    "prediction": "NORMAL",
    "fraud_probability": 0.0923,
    "risk_level": "LOW",
    "verification_requirement": "Standard Verification"
  },
  "explanation": {
    "top_factors": [
      {
        "feature": "application_consistency_score",
        "observed_value": 85.0,
        "shap_value": -0.107,
        "impact": "DECREASES_FRAUD_RISK",
        "explanation": "application_consistency_score contributed toward a lower fraud prediction."
      },
      {
        "feature": "citizen_data_consistency",
        "observed_value": 100.0,
        "shap_value": -0.067,
        "impact": "DECREASES_FRAUD_RISK",
        "explanation": "citizen_data_consistency contributed toward a lower fraud prediction."
      }
    ],
    "human_readable_explanation": "Features indicating a lower fraud risk included: application_consistency_score, citizen_data_consistency, income_deviation_pct."
  },
  "final_status": "PENDING OFFICER REVIEW",
  "officer_decision_required": true
}
```

---

## 🛡️ Security, Digital Signatures & Compliance

1. **Password Security**: All user passwords are encrypted using `BCryptPasswordEncoder` with a strength factor of 10.
2. **Stateless Authorization**: Client requests pass an HTTP header `Authorization: Bearer <JWT_TOKEN>`. The token is signed using HMAC-SHA256 with a 256-bit secret.
3. **Panchayat Scoping Isolation**: Officers can only view and audit citizen applications residing inside their assigned village panchayat. Cross-panchayat data access attempts return `403 Forbidden`.
4. **Cryptographic Sanction References**:
   - Approved welfare applications generate unique sanction reference codes formatted as `UCMS-SANCT-{SCHEME}-{YEAR}-{RANDOM}`.
   - Each approved sanction generates an SHA-256 digital signature computed from:
     ```
     SHA256(sanctionReference + ":" + citizenEmail + ":" + approvedAtTimestamp)
     ```
5. **Tamper-Evident QR Verification**:
   - E-Certificates and Sanction Letters embed a QR code linking directly to the public verification endpoint.
   - Third-party verifiers (banks, government offices) can scan the QR code to verify validity without requiring backend login credentials.

---

## ❓ Troubleshooting & FAQ

### 1. Port Conflicts (`8000`, `8080`, or `5173`)
If any port is already in use by another program, check running processes in PowerShell:
```powershell
Get-NetTCPConnection -LocalPort 8000, 8080, 5173 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, State, OwningProcess
```
Kill the conflicting process:
```powershell
Stop-Process -Id <PID> -Force
```

### 2. Spring Boot Database Reset
To reset the H2 database and reload mock data from scratch:
1. Stop the backend server.
2. Delete the file `backend/data/ucmsdb.mv.db`.
3. Restart the backend with `mvn spring-boot:run`. The schema will be recreated and re-seeded automatically.

### 3. Model Loading / SHAP Initialization
The Python service initializes SHAP `TreeExplainer` on the first evaluation and caches the explainer in-memory. If `models/fraud_model.joblib` needs retraining:
```powershell
.\venv\Scripts\python.exe src/generate_data.py
.\venv\Scripts\python.exe src/train.py
```
Then restart Uvicorn to load the fresh model weights.

---

## 📜 License & Disclaimers

- **Educational & Prototype Use**: All citizen registries, Aadhaar records, and application profiles seeded in this system are synthetic mock datasets created strictly for research and prototyping.
- **Novelty Notice**: AI features (Vulnerability Scoring Index, Random Forest Fraud Probability, and SHAP decision-attributions) represent prototype decision-support capabilities and do not constitute legal panchayat policy recommendations.
