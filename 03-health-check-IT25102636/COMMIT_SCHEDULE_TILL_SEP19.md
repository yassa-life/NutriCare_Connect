# Module 03: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Herath H.M.H.Y. (`IT25102636`)  
**Module:** Health Check-up, NutriGuide AI & SMTP Email Delivery (`03-health-check-IT25102636`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026** for **Herath H.M.H.Y. (IT25102636)**. 

### 💡 Capabilities Owned by IT25102636:
- ✉️ **SMTP Email Infrastructure**: `SmtpAccountMailer`, live Gmail App Password configuration, password reset OTP emails, and `email_delivery_attempts` audit logging.
- 🤖 **NutriGuide AI Chatbot**: `PatientGuideService`, Google Gemini 3.5 Flash-Lite API integration, server-side emergency screening (1990 action trigger), and offline rules engine fallback.
- 📊 **Health Check-up & Vitals**: Health check entry, vitals history trends, and clinical threshold alert evaluation.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 03-health-check-IT25102636/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding, Email Setup & Scaffolding (Sept 10 - Sept 11)

#### Commit 1: Module Documentation & Capability Specification
- **Date:** `2026-09-10`
- **Goal:** Initialize UC-03 documentation specifying Health Check, NutriGuide AI, and SMTP Email ownership.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/README.md 03-health-check-IT25102636/docs/
  git commit -m "docs(health-check): initialize UC-03 module requirements for email, AI chatbot, and health checks"
  ```

#### Commit 2: POM Dependencies for JavaMail & Gemini AI Client
- **Date:** `2026-09-10`
- **Goal:** Add Maven dependencies for `spring-boot-starter-mail` and HTTP WebClient/RestTemplate for Gemini AI.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/pom.xml
  git commit -m "build(health-check): add Spring Mail SMTP and Gemini AI client dependencies to pom"
  ```

#### Commit 3: Database Flyway Migration V3 & V10 Scripts
- **Date:** `2026-09-11`
- **Goal:** Create SQL schema for `health_checks`, `vitals_alerts`, and `email_delivery_attempts`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V3__health_check_schema.sql backend/src/main/resources/db/migration/V10__email_delivery_audit.sql
  git commit -m "feat(health-check): add Flyway schemas for health check records and email delivery audit log"
  ```

---

### 🔹 Phase B: Domain Entities, Repositories & SMTP Mailer (Sept 12 - Sept 13)

#### Commit 4: Health Check & Email Delivery JPA Entities
- **Date:** `2026-09-12`
- **Goal:** Define HealthCheck, VitalsMetric, EmailDeliveryAttempt, and AlertSeverity entities.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/HealthCheck.java 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/mail/EmailDeliveryAttempt.java
  git commit -m "feat(health-check): create JPA entities for HealthCheck and EmailDeliveryAttempt models"
  ```

#### Commit 5: NutriGuide AI & Email DTO Models
- **Date:** `2026-09-12`
- **Goal:** Create HealthCheckRequest, VitalsAlertResponse, ChatRequest, ChatResponse, and EmailRequest DTOs.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/dto/
  git commit -m "feat(health-check): define DTO models for vitals submission, email delivery, and NutriGuide chat"
  ```

#### Commit 6: SMTP Account Mailer Service Implementation
- **Date:** `2026-09-13`
- **Goal:** Implement `SmtpAccountMailer` for live Gmail app password email dispatch and simulated OTP delivery logging.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/mail/SmtpAccountMailer.java 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/mail/EmailDeliveryAttemptRepository.java
  git commit -m "feat(email-service): implement SmtpAccountMailer for Gmail SMTP dispatch and delivery logging"
  ```

#### Commit 7: Vitals Threshold Evaluator Service
- **Date:** `2026-09-13`
- **Goal:** Add clinical vitals threshold checker (BP > 140, Glucose thresholds) and patient alert generator.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/HealthAlert.java 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/HealthRepositories.java
  git commit -m "feat(health-check): implement vitals threshold evaluator and alert repository"
  ```

---

### 🔹 Phase C: NutriGuide AI & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: NutriGuide AI Service & Gemini 3.5 Integration
- **Date:** `2026-09-14`
- **Goal:** Implement `PatientGuideService` with Google Gemini 3.5 Flash-Lite API integration and non-diagnostic disclaimers.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/PatientGuideService.java
  git commit -m "feat(nutriguide-ai): implement PatientGuideService with Gemini 3.5 Flash-Lite API integration"
  ```

#### Commit 9: Emergency 1990 Screening & Offline Safety Engine
- **Date:** `2026-09-14`
- **Goal:** Add server-side deterministic emergency symptom screen (1990 call trigger) and offline rule fallback.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/PatientGuideService.java
  git commit -m "feat(nutriguide-ai): add emergency 1990 screening and offline heuristic safety rules"
  ```

#### Commit 10: Health Check REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/health-checks` REST endpoints for vitals logging and historical trend analysis.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/HealthController.java
  git commit -m "feat(health-check): create HealthController REST endpoints for vitals management"
  ```

#### Commit 11: NutriGuide AI REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/patient-guide/ask` REST endpoint for interactive health & nutrition queries.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/PatientGuideController.java
  git commit -m "feat(nutriguide-ai): create PatientGuideController endpoint for AI chatbot interactions"
  ```

---

### 🔹 Phase D: Frontend React Views & NutriGuide UI (Sept 16 - Sept 17)

#### Commit 12: Health & AI UI Module Package Setup
- **Date:** `2026-09-16`
- **Goal:** Configure frontend module export definitions.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/package.json
  git commit -m "build(health-check-ui): configure package dependencies for health and AI UI"
  ```

#### Commit 13: Health & NutriGuide API Axios Client
- **Date:** `2026-09-16`
- **Goal:** Implement Axios API client methods for vitals logging, historical trends, and NutriGuide AI chat.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/api/healthCheckApi.js
  git commit -m "feat(health-check-ui): implement API client methods for health vitals and NutriGuide AI"
  ```

#### Commit 14: Vitals Logging Form & History Trend Charts
- **Date:** `2026-09-17`
- **Goal:** Build React form for vitals entry and graphical metric trend charts.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/components/VitalsForm.jsx 03-health-check-IT25102636/frontend/src/components/VitalsChart.jsx
  git commit -m "feat(health-check-ui): build VitalsForm view and graphical trend chart components"
  ```

#### Commit 15: NutriGuide AI Interactive Chatbot Drawer UI
- **Date:** `2026-09-17`
- **Goal:** Build interactive NutriGuide AI floating chatbot drawer with emergency call 1990 banner.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/components/NutriGuideChatbot.jsx
  git commit -m "feat(nutriguide-ui): create interactive NutriGuide AI chatbot drawer UI component"
  ```

---

### 🔹 Phase E: Unit Testing, Integration & Final Merge (Sept 18 - Sept 19)

#### Commit 16: Unit Testing Suite (SmtpAccountMailer & PatientGuide)
- **Date:** `2026-09-18`
- **Goal:** Write backend unit tests for SMTP email sending, Gemini API integration, and emergency 1990 triggers.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/backend/src/test/java/lk/sliit/nutricare/health/mail/SmtpAccountMailerTest.java 03-health-check-IT25102636/backend/src/test/java/lk/sliit/nutricare/health/PatientGuideServiceTest.java
  git commit -m "test(health-check): add unit tests for SmtpAccountMailer and PatientGuideService"
  ```

#### Commit 17: Feature Export Integration Component
- **Date:** `2026-09-18`
- **Goal:** Export `HealthCheckFeature.jsx` component for root React app integration.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/frontend/src/HealthCheckFeature.jsx
  git commit -m "refactor(health-check-ui): export HealthCheckFeature component for integrated React app"
  ```

#### Commit 18: Documentation & Email Setup Log Update
- **Date:** `2026-09-19`
- **Goal:** Record final commit hashes, SMTP setup evidence, and test report in contribution log.
- **Commands:**
  ```bash
  git add 03-health-check-IT25102636/docs/CONTRIBUTION.md 03-health-check-IT25102636/README.md
  git commit -m "docs(health-check): finalize contribution log with SMTP email and AI test evidence"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 03-health-check-IT25102636/backend -am test` (verifies `SmtpAccountMailerTest` and `PatientGuideServiceTest`).
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `03-health-check-IT25102636/docs/CONTRIBUTION.md` updated with commit hashes.
