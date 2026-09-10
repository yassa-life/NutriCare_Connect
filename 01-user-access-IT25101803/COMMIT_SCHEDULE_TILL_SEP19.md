# Module 01: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Vidanage T.L. (`IT25101803`)  
**Module:** User Access & Authentication (`01-user-access-IT25101803`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026**. 
By staging and committing specific files incrementally rather than committing everything in one large batch, you will establish a realistic, professional Git contribution graph on GitHub.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 01-user-access-IT25101803/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding & Setup (Sept 10 - Sept 11)

#### Commit 1: Module Initial Scaffolding & Docs
- **Date:** `2026-09-10`
- **Goal:** Set up initial module documentation and POM configuration.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/README.md 01-user-access-IT25101803/docs/
  git commit -m "docs(user-access): initialize UC-01 module documentation and contribution log"
  ```

#### Commit 2: Module Maven POM Configuration
- **Date:** `2026-09-10`
- **Goal:** Define Maven dependencies for Spring Security, JWT, and JPA.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/pom.xml
  git commit -m "build(user-access): add Spring Security and JWT dependencies to module pom"
  ```

#### Commit 3: Database Flyway Migration V1 Script
- **Date:** `2026-09-11`
- **Goal:** Create initial database tables for `users`, `roles`, and `audit_logs`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V1__user_access_schema.sql
  git commit -m "feat(user-access): add Flyway V1 migration for users and RBAC tables"
  ```

---

### 🔹 Phase B: Domain Entities, Enums & Security Configurations (Sept 12 - Sept 13)

#### Commit 4: User Account Entity & Role Enums
- **Date:** `2026-09-12`
- **Goal:** Define core JPA entity classes for UserAccount, Role, and UserStatus.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/entity/
  git commit -m "feat(user-access): define UserAccount JPA entity and UserRole enum"
  ```

#### Commit 5: Audit Log Entity & DTOs
- **Date:** `2026-09-12`
- **Goal:** Create DTO classes for RegistrationRequest, LoginRequest, AuthResponse, and AuditLog.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/dto/
  git commit -m "feat(user-access): implement authentication request and response DTOs"
  ```

#### Commit 6: User Account Repository Interface
- **Date:** `2026-09-13`
- **Goal:** Implement Spring Data JPA repository for user lookup by username/email.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/repository/
  git commit -m "feat(user-access): create UserAccountRepository and SecurityAuditRepository"
  ```

#### Commit 7: JWT Utilities & Token Provider
- **Date:** `2026-09-13`
- **Goal:** Add JWT token generation, parsing, and signature validation logic.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/security/JwtTokenProvider.java
  git commit -m "feat(user-access): implement JWT token provider and secret key handling"
  ```

---

### 🔹 Phase C: Service Layer & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: Spring Security Authentication Filter
- **Date:** `2026-09-14`
- **Goal:** Implement JWT Authentication Filter to intercept incoming HTTP requests.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/security/JwtAuthenticationFilter.java
  git commit -m "feat(user-access): add JwtAuthenticationFilter for request authorization"
  ```

#### Commit 9: User Access Service Logic
- **Date:** `2026-09-14`
- **Goal:** Implement user registration, password encoding (BCrypt), and login logic.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/service/UserAccessService.java
  git commit -m "feat(user-access): implement core registration and authentication service"
  ```

#### Commit 10: Account Locking & Password Attempt Handler
- **Date:** `2026-09-15`
- **Goal:** Add 5-attempt failed login lock behavior and audit logging.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/service/AccountLockService.java
  git commit -m "feat(user-access): implement 5-attempt failed login account locking"
  ```

#### Commit 11: Auth REST Controller Endpoints
- **Date:** `2026-09-15`
- **Goal:** Expose POST `/api/v1/auth/login`, `/api/v1/auth/register`, and OTP endpoints.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/useraccess/controller/AuthController.java
  git commit -m "feat(user-access): create AuthController REST endpoints for login and registration"
  ```

---

### 🔹 Phase D: Frontend React Shell & UI Components (Sept 16 - Sept 17)

#### Commit 12: User Access Frontend Package Setup
- **Date:** `2026-09-16`
- **Goal:** Initialize frontend module exports and package configurations.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/frontend/package.json
  git commit -m "build(user-access-ui): setup frontend module package dependencies"
  ```

#### Commit 13: Auth API Service & Token Storage Utility
- **Date:** `2026-09-16`
- **Goal:** Add client-side Axios API calls for login/register and token persistence.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/frontend/src/api/authApi.js
  git commit -m "feat(user-access-ui): implement auth API service and local storage handler"
  ```

#### Commit 14: Patient Registration Component
- **Date:** `2026-09-17`
- **Goal:** Build React form component for patient registration with validation.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/frontend/src/components/RegisterForm.jsx
  git commit -m "feat(user-access-ui): build Patient Registration view component with validation"
  ```

#### Commit 15: Sign-In View & RBAC Access Guard Component
- **Date:** `2026-09-17`
- **Goal:** Build Sign-In screen and ProtectedRoute component for role checking.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/frontend/src/components/LoginForm.jsx 01-user-access-IT25101803/frontend/src/components/ProtectedRoute.jsx
  git commit -m "feat(user-access-ui): implement Sign-In view and RBAC ProtectedRoute guard"
  ```

---

### 🔹 Phase E: Unit Testing, Refactoring & Final Merge (Sept 18 - Sept 19)

#### Commit 16: Backend Unit & Security Tests
- **Date:** `2026-09-18`
- **Goal:** Add unit tests for UserAccessService and JwtTokenProvider.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/backend/src/test/
  git commit -m "test(user-access): add unit tests for JWT generation and login locking"
  ```

#### Commit 17: User Access Feature Export Integration
- **Date:** `2026-09-18`
- **Goal:** Export UserAccessFeature component to top-level integrated React app.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/frontend/src/UserAccessFeature.jsx
  git commit -m "refactor(user-access-ui): finalize UserAccessFeature export for root shell"
  ```

#### Commit 18: Documentation & Contribution Log Update
- **Date:** `2026-09-19`
- **Goal:** Finalize contribution log and verification evidence.
- **Commands:**
  ```bash
  git add 01-user-access-IT25101803/docs/CONTRIBUTION.md 01-user-access-IT25101803/README.md
  git commit -m "docs(user-access): update contribution log and final test verification evidence"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 01-user-access-IT25101803/backend -am test`.
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `01-user-access-IT25101803/docs/CONTRIBUTION.md` updated with commit hashes.
