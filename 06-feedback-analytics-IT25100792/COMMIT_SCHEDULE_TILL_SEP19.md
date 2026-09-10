# Module 06: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Gunathilaka M.D.S.T. (`IT25100792`)  
**Module:** Feedback, Complaints & Analytics Dashboard (`06-feedback-analytics-IT25100792`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026**. 
By staging and committing specific files incrementally rather than committing everything in one large batch, you will establish a realistic, professional Git contribution graph on GitHub.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 06-feedback-analytics-IT25100792/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding & Setup (Sept 10 - Sept 11)

#### Commit 1: Module Documentation Setup
- **Date:** `2026-09-10`
- **Goal:** Initialize UC-06 module requirements and contribution log.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/README.md 06-feedback-analytics-IT25100792/docs/
  git commit -m "docs(feedback-analytics): initialize UC-06 module documentation and requirement specification"
  ```

#### Commit 2: Module POM Configuration
- **Date:** `2026-09-10`
- **Goal:** Add dependencies for data aggregation, reporting libraries, and JPA entities.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/pom.xml
  git commit -m "build(feedback-analytics): add reporting dependencies to module pom"
  ```

#### Commit 3: Database Flyway Migration V6 Script
- **Date:** `2026-09-11`
- **Goal:** Create Flyway SQL migration script for `feedbacks`, `complaints`, and `analytics_summaries`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V6__feedback_analytics_schema.sql
  git commit -m "feat(feedback-analytics): create Flyway V6 schema for feedback records and management KPIs"
  ```

---

### 🔹 Phase B: Domain Entities, Repositories & Aggregators (Sept 12 - Sept 13)

#### Commit 4: Feedback & Complaint JPA Entities
- **Date:** `2026-09-12`
- **Goal:** Define PatientFeedback, ServiceRating, ComplaintRecord, and ResolutionStatus entities.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/entity/
  git commit -m "feat(feedback-analytics): create JPA entities for PatientFeedback and ComplaintRecord models"
  ```

#### Commit 5: DTO Models for Feedback & Management KPI Summaries
- **Date:** `2026-09-12`
- **Goal:** Implement FeedbackRequest, RatingSummaryDto, AnalyticsKpiResponse, and ComplaintStatusDto.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/dto/
  git commit -m "feat(feedback-analytics): implement DTO models for feedback submission and KPI reporting"
  ```

#### Commit 6: JPA Repositories & Aggregation Queries
- **Date:** `2026-09-13`
- **Goal:** Implement FeedbackRepository and AnalyticsRepository with native JPQL aggregation queries.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/repository/
  git commit -m "feat(feedback-analytics): create repositories with custom rating aggregation queries"
  ```

#### Commit 7: KPI Analytics Calculation Utility
- **Date:** `2026-09-13`
- **Goal:** Implement KPI aggregation helpers for average satisfaction scores and system usage statistics.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/util/KpiAggregator.java
  git commit -m "feat(feedback-analytics): add KpiAggregator utility for executive reporting"
  ```

---

### 🔹 Phase C: Service Layer & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: Feedback & Complaint Management Service
- **Date:** `2026-09-14`
- **Goal:** Create service for submitting feedback, logging complaints, and updating resolution status.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/service/FeedbackService.java
  git commit -m "feat(feedback-analytics): implement FeedbackService for patient rating management"
  ```

#### Commit 9: Analytics Dashboard & Report Service
- **Date:** `2026-09-14`
- **Goal:** Create service for computing system-wide KPIs and exporting management summary reports.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/service/AnalyticsReportService.java
  git commit -m "feat(feedback-analytics): implement AnalyticsReportService for management dashboard metrics"
  ```

#### Commit 10: Feedback REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/feedback` REST endpoints for patient feedback logging and rating views.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/controller/FeedbackController.java
  git commit -m "feat(feedback-analytics): create FeedbackController REST endpoints"
  ```

#### Commit 11: Analytics Dashboard REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/analytics/dashboard` REST endpoints for management reporting.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/feedbackanalytics/controller/AnalyticsController.java
  git commit -m "feat(feedback-analytics): create AnalyticsController endpoints for executive dashboard"
  ```

---

### 🔹 Phase D: Frontend React Views & Charts (Sept 16 - Sept 17)

#### Commit 12: Analytics UI Package Setup
- **Date:** `2026-09-16`
- **Goal:** Configure module export definitions for analytics UI.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/frontend/package.json
  git commit -m "build(feedback-analytics-ui): configure package file for feedback UI"
  ```

#### Commit 13: Feedback & Analytics API Client
- **Date:** `2026-09-16`
- **Goal:** Implement Axios functions for feedback submission and management dashboard data.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/frontend/src/api/feedbackAnalyticsApi.js
  git commit -m "feat(feedback-analytics-ui): implement API client methods for feedback and analytics"
  ```

#### Commit 14: Patient Feedback & Rating Form Component
- **Date:** `2026-09-17`
- **Goal:** Build React view for 5-star rating submission and complaint filing.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/frontend/src/components/FeedbackForm.jsx 06-feedback-analytics-IT25100792/frontend/src/components/RatingStars.jsx
  git commit -m "feat(feedback-analytics-ui): build FeedbackForm and interactive RatingStars component"
  ```

#### Commit 15: Management KPI Analytics Dashboard View
- **Date:** `2026-09-17`
- **Goal:** Build executive dashboard view with KPI metrics cards and rating summary charts.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/frontend/src/components/AnalyticsDashboard.jsx
  git commit -m "feat(feedback-analytics-ui): create AnalyticsDashboard view with executive KPI widgets"
  ```

---

### 🔹 Phase E: Testing, Integration & Final Merge (Sept 18 - Sept 19)

#### Commit 16: KPI Aggregation & Service Unit Tests
- **Date:** `2026-09-18`
- **Goal:** Write unit tests for rating calculation logic and feedback service endpoints.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/backend/src/test/
  git commit -m "test(feedback-analytics): add unit tests for KpiAggregator and FeedbackService"
  ```

#### Commit 17: Feature Integration Export
- **Date:** `2026-09-18`
- **Goal:** Export `FeedbackAnalyticsFeature.jsx` for root React application integration.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/frontend/src/FeedbackAnalyticsFeature.jsx
  git commit -m "refactor(feedback-analytics-ui): export FeedbackAnalyticsFeature component for root shell"
  ```

#### Commit 18: Documentation & Contribution Log Finalization
- **Date:** `2026-09-19`
- **Goal:** Record final test evidence and complete contribution log documentation.
- **Commands:**
  ```bash
  git add 06-feedback-analytics-IT25100792/docs/CONTRIBUTION.md 06-feedback-analytics-IT25100792/README.md
  git commit -m "docs(feedback-analytics): update contribution log and final test verification report"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 06-feedback-analytics-IT25100792/backend -am test`.
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `06-feedback-analytics-IT25100792/docs/CONTRIBUTION.md` updated with commit hashes.
