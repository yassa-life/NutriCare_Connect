# Module 02: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Hasaranga S.O. (`IT25103681`)  
**Module:** Appointment Scheduling & Billing (`02-appointment-billing-IT25103681`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026**. 
By staging and committing specific files incrementally rather than committing everything in one large batch, you will establish a realistic, professional Git contribution graph on GitHub.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 02-appointment-billing-IT25103681/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding & Setup (Sept 10 - Sept 11)

#### Commit 1: Module Initial Documentation & Scaffolding
- **Date:** `2026-09-10`
- **Goal:** Set up UC-02 module documentation and initial requirements log.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/README.md 02-appointment-billing-IT25103681/docs/
  git commit -m "docs(appointment-billing): initialize UC-02 module docs and requirement specification"
  ```

#### Commit 2: Module POM Configuration
- **Date:** `2026-09-10`
- **Goal:** Define Maven dependencies for transactional database operations and locking.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/pom.xml
  git commit -m "build(appointment-billing): configure module pom dependencies for transactions"
  ```

#### Commit 3: Database Flyway Migration V2 Script
- **Date:** `2026-09-11`
- **Goal:** Add SQL schema for `appointments`, `slot_holds`, and `invoices`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V2__appointment_billing_schema.sql
  git commit -m "feat(appointment-billing): create Flyway V2 schema migration for appointments and invoices"
  ```

---

### 🔹 Phase B: Entities, Repositories & Concurrency Holds (Sept 12 - Sept 13)

#### Commit 4: Appointment & Invoice JPA Entities
- **Date:** `2026-09-12`
- **Goal:** Define Appointment, Invoice, PaymentStatus, and AppointmentStatus entities.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/entity/
  git commit -m "feat(appointment-billing): create JPA entities for Appointment and Invoice models"
  ```

#### Commit 5: Data Transfer Objects (DTOs)
- **Date:** `2026-09-12`
- **Goal:** Implement BookingRequest, SlotHoldRequest, InvoiceResponse, and PaymentRequest DTOs.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/dto/
  git commit -m "feat(appointment-billing): implement booking and invoice DTO models"
  ```

#### Commit 6: JPA Repositories & Custom Query Specs
- **Date:** `2026-09-13`
- **Goal:** Create AppointmentRepository and InvoiceRepository with doctor/date query methods.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/repository/
  git commit -m "feat(appointment-billing): create repositories for appointment and billing management"
  ```

#### Commit 7: Concurrency-Safe Slot Hold Service
- **Date:** `2026-09-13`
- **Goal:** Implement pessimistic/optimistic lock service for 5-minute temporary slot reservation.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/service/SlotHoldService.java
  git commit -m "feat(appointment-billing): implement 5-minute concurrency-safe slot hold mechanism"
  ```

---

### 🔹 Phase C: Service Layer & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: Appointment Scheduling Service
- **Date:** `2026-09-14`
- **Goal:** Add appointment creation, rescheduling, and doctor availability checking logic.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/service/AppointmentService.java
  git commit -m "feat(appointment-billing): add core appointment booking and availability service logic"
  ```

#### Commit 9: Billing & Payment Gateway Integration Service
- **Date:** `2026-09-14`
- **Goal:** Create invoice calculation and simulated payment execution service.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/service/BillingService.java
  git commit -m "feat(appointment-billing): create invoice generation and simulated payment processing service"
  ```

#### Commit 10: Appointment REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/appointments` endpoints for slot search, booking, and cancellation.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/controller/AppointmentController.java
  git commit -m "feat(appointment-billing): implement AppointmentController REST endpoints"
  ```

#### Commit 11: Billing REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/invoices` endpoints for invoice retrieval and demo checkout.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointmentbilling/controller/BillingController.java
  git commit -m "feat(appointment-billing): create BillingController REST endpoints for payments"
  ```

---

### 🔹 Phase D: Frontend React Views & UI Components (Sept 16 - Sept 17)

#### Commit 12: Appointment Module Package Setup
- **Date:** `2026-09-16`
- **Goal:** Add module-level package exports for appointment & billing UI.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/frontend/package.json
  git commit -m "build(appointment-billing-ui): add package dependencies for booking UI"
  ```

#### Commit 13: Appointment & Billing API Axios Client
- **Date:** `2026-09-16`
- **Goal:** Implement frontend API service functions for appointment booking and payment.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/frontend/src/api/appointmentApi.js
  git commit -m "feat(appointment-billing-ui): implement API client methods for booking and invoices"
  ```

#### Commit 14: Doctor Slot Picker & Booking Modal Component
- **Date:** `2026-09-17`
- **Goal:** Build interactive doctor availability schedule and slot selection UI.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/frontend/src/components/SlotPicker.jsx 02-appointment-billing-IT25103681/frontend/src/components/BookingModal.jsx
  git commit -m "feat(appointment-billing-ui): create Doctor SlotPicker and interactive booking modal"
  ```

#### Commit 15: Checkout & Payment Modal Component
- **Date:** `2026-09-17`
- **Goal:** Implement payment gateway modal with invoice breakdown and demo pay trigger.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/frontend/src/components/PaymentModal.jsx
  git commit -m "feat(appointment-billing-ui): build checkout invoice viewer and demo payment modal"
  ```

---

### 🔹 Phase E: Testing, Integration & Final Merge (Sept 18 - Sept 19)

#### Commit 16: Concurrency & Booking Unit Tests
- **Date:** `2026-09-18`
- **Goal:** Write unit tests verifying slot hold expiration and double-booking prevention.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/backend/src/test/
  git commit -m "test(appointment-billing): add unit tests for slot hold concurrency and payment validation"
  ```

#### Commit 17: Module Feature Export Component
- **Date:** `2026-09-18`
- **Goal:** Integrate and export `AppointmentBillingFeature.jsx` for the root React app.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/frontend/src/AppointmentBillingFeature.jsx
  git commit -m "refactor(appointment-billing-ui): export main feature component for root UI integration"
  ```

#### Commit 18: Documentation & Contribution Log Finalization
- **Date:** `2026-09-19`
- **Goal:** Record final commit evidence and update documentation.
- **Commands:**
  ```bash
  git add 02-appointment-billing-IT25103681/docs/CONTRIBUTION.md 02-appointment-billing-IT25103681/README.md
  git commit -m "docs(appointment-billing): complete contribution record and test evidence"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 02-appointment-billing-IT25103681/backend -am test`.
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `02-appointment-billing-IT25103681/docs/CONTRIBUTION.md` updated with commit hashes.
