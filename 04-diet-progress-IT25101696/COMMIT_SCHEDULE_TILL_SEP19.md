# Module 04: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Mohanaranjan M. (`IT25101696`)  
**Module:** Diet Planning & Progress Tracking (`04-diet-progress-IT25101696`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026**. 
By staging and committing specific files incrementally rather than committing everything in one large batch, you will establish a realistic, professional Git contribution graph on GitHub.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 04-diet-progress-IT25101696/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding & Setup (Sept 10 - Sept 11)

#### Commit 1: Module Documentation Setup
- **Date:** `2026-09-10`
- **Goal:** Initialize UC-04 requirements documentation and contribution tracker.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/README.md 04-diet-progress-IT25101696/docs/
  git commit -m "docs(diet-progress): initialize UC-04 documentation and requirement specifications"
  ```

#### Commit 2: Module POM Dependencies
- **Date:** `2026-09-10`
- **Goal:** Add Maven dependencies for JSON serialization and JPA entities.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/pom.xml
  git commit -m "build(diet-progress): add JPA and JSON mapping dependencies to module pom"
  ```

#### Commit 3: Database Flyway Migration V4 Script
- **Date:** `2026-09-11`
- **Goal:** Create SQL migration script for `diet_plans`, `meal_schedules`, and `weight_logs`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V4__diet_progress_schema.sql
  git commit -m "feat(diet-progress): create Flyway V4 database schema for diet plans and weight tracking"
  ```

---

### 🔹 Phase B: Domain Entities & Repositories (Sept 12 - Sept 13)

#### Commit 4: Diet Plan & Meal JPA Entities
- **Date:** `2026-09-12`
- **Goal:** Create JPA entities for DietPlan, MealItem, MacroTarget, and WeightLog.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/entity/
  git commit -m "feat(diet-progress): create JPA entities for DietPlan, MealItem, and WeightLog"
  ```

#### Commit 5: Diet & Progress DTO Models
- **Date:** `2026-09-12`
- **Goal:** Implement DietPlanRequest, MealLogDto, MacroSummaryDto, and WeightProgressDto.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/dto/
  git commit -m "feat(diet-progress): implement DTO models for meal planning and progress tracking"
  ```

#### Commit 6: Spring Data JPA Repositories
- **Date:** `2026-09-13`
- **Goal:** Create DietPlanRepository, MealLogRepository, and WeightLogRepository interfaces.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/repository/
  git commit -m "feat(diet-progress): implement repositories for diet plans and weight history"
  ```

#### Commit 7: Macro Intake Calculator Utility
- **Date:** `2026-09-13`
- **Goal:** Add calculation helper for recommended Daily Calorie Intake & Macronutrient distribution.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/util/MacroCalculator.java
  git commit -m "feat(diet-progress): add MacroCalculator utility for daily target estimations"
  ```

---

### 🔹 Phase C: Service Layer & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: Diet Planning Service
- **Date:** `2026-09-14`
- **Goal:** Create service logic for dietitian diet plan creation and patient meal assignment.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/service/DietPlanService.java
  git commit -m "feat(diet-progress): implement DietPlanService for meal schedule management"
  ```

#### Commit 9: Weight & Progress Tracking Service
- **Date:** `2026-09-14`
- **Goal:** Implement service for tracking daily weight changes and calorie progress goals.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/service/ProgressTrackingService.java
  git commit -m "feat(diet-progress): implement ProgressTrackingService for calorie and weight logs"
  ```

#### Commit 10: Diet Plan REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/diet-plans` REST endpoints for dietitians and patients.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/controller/DietPlanController.java
  git commit -m "feat(diet-progress): create DietPlanController REST endpoints"
  ```

#### Commit 11: Progress REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/progress` endpoints for weight logs and macro analytics.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/dietprogress/controller/ProgressController.java
  git commit -m "feat(diet-progress): create ProgressController endpoints for weight and macro tracking"
  ```

---

### 🔹 Phase D: Frontend React Views & Components (Sept 16 - Sept 17)

#### Commit 12: Diet UI Package Setup
- **Date:** `2026-09-16`
- **Goal:** Define module export configurations.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/frontend/package.json
  git commit -m "build(diet-progress-ui): add package configuration for diet UI module"
  ```

#### Commit 13: Diet & Progress API Client Service
- **Date:** `2026-09-16`
- **Goal:** Implement Axios functions for diet plans, meal logs, and weight chart API data.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/frontend/src/api/dietProgressApi.js
  git commit -m "feat(diet-progress-ui): implement API client methods for diet plans and progress"
  ```

#### Commit 14: Daily Meal Schedule & Planner Component
- **Date:** `2026-09-17`
- **Goal:** Build React view for displaying meal breakdown and macro intake cards.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/frontend/src/components/MealPlanner.jsx 04-diet-progress-IT25101696/frontend/src/components/MacroBar.jsx
  git commit -m "feat(diet-progress-ui): build MealPlanner view and interactive MacroBar component"
  ```

#### Commit 15: Weight Loss & Calorie Progress Chart View
- **Date:** `2026-09-17`
- **Goal:** Build graphical weight progress chart component and entry modal.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/frontend/src/components/WeightTrackerChart.jsx
  git commit -m "feat(diet-progress-ui): create WeightTrackerChart for patient goal monitoring"
  ```

---

### 🔹 Phase E: Testing, Integration & Final Merge (Sept 18 - Sept 19)

#### Commit 16: Backend Macro & Progress Unit Tests
- **Date:** `2026-09-18`
- **Goal:** Write unit tests for macro calculation logic and diet plan validation.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/backend/src/test/
  git commit -m "test(diet-progress): add unit tests for MacroCalculator and ProgressTrackingService"
  ```

#### Commit 17: Feature Integration Export
- **Date:** `2026-09-18`
- **Goal:** Export `DietProgressFeature.jsx` component for the root React shell.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/frontend/src/DietProgressFeature.jsx
  git commit -m "refactor(diet-progress-ui): export DietProgressFeature component for integrated app"
  ```

#### Commit 18: Documentation & Contribution Log Finalization
- **Date:** `2026-09-19`
- **Goal:** Update contribution log and record test evidence.
- **Commands:**
  ```bash
  git add 04-diet-progress-IT25101696/docs/CONTRIBUTION.md 04-diet-progress-IT25101696/README.md
  git commit -m "docs(diet-progress): finalize contribution log and module documentation"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 04-diet-progress-IT25101696/backend -am test`.
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `04-diet-progress-IT25101696/docs/CONTRIBUTION.md` updated with commit hashes.
