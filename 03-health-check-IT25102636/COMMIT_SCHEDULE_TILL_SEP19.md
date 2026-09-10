# Module 03: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Herath H.M.H.Y. (`IT25102636`)  
**Module:** Health Check-up, NutriGuide AI & SMTP Email (`03-health-check-IT25102636`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026**. 
By staging and committing specific files incrementally rather than committing everything in one large batch, you will establish a realistic, professional Git contribution graph on GitHub.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 03-health-check-IT25102636/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding & Setup (Sept 10 - Sept 11)

#### Commit 1: Module Documentation Setup
- **Date:** `2026-09-10`
- **Goal:** Initialize UC-03 documentation and requirements specification.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/README.md 03-health-check-IT25102636/docs/
  git commit -m "docs(health-check): initialize UC-03 module requirements and contribution log"
  ```

#### Commit 2: Module POM Dependencies
- **Date:** `2026-09-10`
- **Goal:** Add dependencies for Spring Boot Mail (SMTP) and RestTemplate/WebClient for Gemini AI.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/pom.xml
  git commit -m "build(health-check): add Spring Mail and Gemini AI client dependencies to pom"
  ```

#### Commit 3: Database Flyway Migration V3 Script
- **Date:** `2026-09-11`
- **Goal:** Add SQL schema for `health_checks`, `vitals_history`, and `threshold_alerts`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V3__health_check_schema.sql
  git commit -m "feat(health-check): create Flyway V3 schema for health check records and threshold rules"
  ```

---

### 🔹 Phase B: Domain Entities, Repositories & SMTP Integration (Sept 12 - Sept 13)

#### Commit 4: Health Check JPA Entities & Alert Enums
- **Date:** `2026-09-12`
- **Goal:** Define HealthCheck, VitalsMetric, AlertSeverity, and EmergencyContact entities.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/entity/
  git commit -m "feat(health-check): create JPA entities for HealthCheck and VitalsMetric models"
  ```

#### Commit 5: Health Check & NutriGuide DTO Models
- **Date:** `2026-09-12`
- **Goal:** Create HealthCheckRequest, VitalsAlertResponse, ChatRequest, and ChatResponse DTOs.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/dto/
  git commit -m "feat(health-check): define DTO models for vitals submission and NutriGuide chat"
  ```

#### Commit 6: Health Check Repositories & Spring Mail Service
- **Date:** `2026-09-13`
- **Goal:** Implement HealthCheckRepository and SMTP EmailSenderService with fallback handling.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/repository/ 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/service/EmailSenderService.java
  git commit -m "feat(health-check): create HealthCheckRepository and SMTP email sender service"
  ```

#### Commit 7: Threshold Evaluation Engine
- **Date:** `2026-09-13`
- **Goal:** Add clinical vitals threshold checker (BP, Glucose, BMI) and warning generator.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/service/VitalsThresholdEvaluator.java
  git commit -m "feat(health-check): implement vitals threshold checker and alert generator"
  ```

---

### 🔹 Phase C: Service Layer & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: NutriGuide Gemini AI & Offline Fallback Service
- **Date:** `2026-09-14`
- **Goal:** Implement Gemini AI integration with safe offline rule engine for emergency screening.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/service/NutriGuideAiService.java
  git commit -m "feat(health-check): implement NutriGuide AI integration with offline safety fallbacks"
  ```

#### Commit 9: Core Health Check Service
- **Date:** `2026-09-14`
- **Goal:** Add health record recording, historical trends lookup, and patient advice generation.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/service/HealthCheckService.java
  git commit -m "feat(health-check): implement core health record management service"
  ```

#### Commit 10: Health Check REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/health-checks` endpoints for log entry and patient vitals history.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/controller/HealthCheckController.java
  git commit -m "feat(health-check): create HealthCheckController REST endpoints"
  ```

#### Commit 11: NutriGuide AI Chat REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/nutriguide/chat` REST endpoint for interactive health queries.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/healthcheck/controller/NutriGuideController.java
  git commit -m "feat(health-check): expose NutriGuide AI chatbot endpoint with non-diagnostic safeguards"
  ```

---

### 🔹 Phase D: Frontend React Views & NutriGuide UI (Sept 16 - Sept 17)

#### Commit 12: Health Check Module UI Package Setup
- **Date:** `2026-09-16`
- **Goal:** Add frontend module export definitions.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/package.json
  git commit -m "build(health-check-ui): configure package dependencies for health UI"
  ```

#### Commit 13: Health Check & NutriGuide API Client
- **Date:** `2026-09-16`
- **Goal:** Implement Axios API helper functions for vitals logging and chat assistant.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/api/healthCheckApi.js
  git commit -m "feat(health-check-ui): implement API client methods for health records and chatbot"
  ```

#### Commit 14: Health Check Vitals Form & Chart View
- **Date:** `2026-09-17`
- **Goal:** Build React form component for logging vitals and displaying trend graphs.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/components/VitalsForm.jsx 03-health-check-IT25102636/frontend/src/components/VitalsChart.jsx
  git commit -m "feat(health-check-ui): create VitalsForm and graphical vitals history trend chart"
  ```

#### Commit 15: NutriGuide Floating AI Chatbot Drawer
- **Date:** `2026-09-17`
- **Goal:** Implement interactive NutriGuide AI chatbot component with emergency trigger.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/components/NutriGuideChatbot.jsx
  git commit -m "feat(health-check-ui): build NutriGuide AI interactive chatbot UI drawer"
  ```

---

### 🔹 Phase E: Testing, Integration & Final Merge (Sept 18 - Sept 19)

#### Commit 16: Vitals & Gemini Fallback Unit Tests
- **Date:** `2026-09-18`
- **Goal:** Write unit tests for vitals threshold checker and Gemini offline fallback.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/test/
  git commit -m "test(health-check): add unit tests for vitals thresholds and NutriGuide fallback rules"
  ```

#### Commit 17: Feature Integration Export
- **Date:** `2026-09-18`
- **Goal:** Export `HealthCheckFeature.jsx` component for the root React application shell.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/HealthCheckFeature.jsx
  git commit -m "refactor(health-check-ui): export HealthCheckFeature component for integrated React app"
  ```

#### Commit 18: Documentation & Email Setup Log Update
- **Date:** `2026-09-19`
- **Goal:** Finalize module README and SMTP setup evidence in contribution log.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/docs/CONTRIBUTION.md 03-health-check-IT25102636/README.md
  git commit -m "docs(health-check): update SMTP email documentation and final contribution log"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 03-health-check-IT25102636/backend -am test`.
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `03-health-check-IT25102636/docs/CONTRIBUTION.md` updated with commit hashes.
