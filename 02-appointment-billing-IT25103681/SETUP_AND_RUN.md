# Module 02: Setup, Download & Testing Guide
**Owner:** Hasaranga S.O. (`IT25103681`)  
**Module:** Appointment Scheduling & Billing (`02-appointment-billing-IT25103681`)

---

## 📌 Guide Overview

This document provides step-by-step instructions for:
1. **Phase 1: Full Project Setup & Test Run**: How to download the complete working repository from GitHub, set up dependencies (Java 21, Node.js, local MySQL), run the system, and verify Module 02 (Appointment & Billing).
2. **Phase 2: Base Repository Setup**: How to clone the clean base project repository (without member feature code) and prepare your environment to commit your module code step-by-step up to **September 19th**.

---

## 💻 System Prerequisites

Before running the project, ensure your workstation has the following installed:

| Component | Minimum Required Version | Verification Command |
| :--- | :--- | :--- |
| **Java Development Kit (JDK)** | Java 21 (Amazon Corretto or OpenJDK 21) | `java -version` |
| **Apache Maven** | 3.9+ | `mvn -version` |
| **Node.js** | 20+ | `node -v` |
| **npm / pnpm** | npm 10+ or pnpm 9+ | `npm -v` or `pnpm -v` |
| **MySQL Server** | MySQL 8.0+ (or MySQL Workbench / XAMPP MySQL) | `mysql --version` |
| **IDE** | IntelliJ IDEA (Recommended for Spring Boot) | - |

---

## 🚀 Phase 1: Downloading & Testing the Full Project

Follow these steps to run and test the complete application.

### Step 1: Clone the GitHub Repository
Open your terminal (PowerShell, Command Prompt, or Git Bash) and run:
```bash
git clone <GITHUB_REPOSITORY_URL>
cd Web_project
```

### Step 2: Set Up Environment Variables
Create a local `.env` file from `.env.example`:
```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On Linux / Git Bash / macOS
cp .env.example .env
```

### Step 3: Start Local MySQL Database
Ensure your local MySQL service (or MySQL Workbench / XAMPP MySQL) is running on port `3306`.
Spring Boot will automatically create and migrate the database named `nutricare` on launch.

### Step 4: Start the Backend (Spring Boot)
Option A: From Terminal
```bash
mvn -pl backend -am spring-boot:run
```
Option B: From IntelliJ IDEA
Open IntelliJ IDEA -> **File > Open** -> select `pom.xml`, select Java 21 SDK, and run **NutriCare Backend**.

### Step 5: Start the Frontend (React + Vite)
In a new terminal window at project root:
```bash
npm install
npm run dev
```
Open your web browser at: `http://localhost:5173`

---

## 🧪 Testing Module 02 (Appointment & Billing Features)

As owner of **Module 02**, test the following key workflows on `http://localhost:5173`:

1. **Appointment Booking & Slot Holds**:
   - Sign in as a patient (e.g. `patient@nutricare.demo` / `password`).
   - Navigate to **Book Appointment**, select a doctor (`D001`), date, and time slot.
   - Test concurrency hold: verify that a selected slot holds for 5 minutes to prevent double booking.
2. **Invoice Generation**:
   - Confirm booking to generate an invoice.
   - Verify billing breakdown (consultation fee, tax, total).
3. **Simulated Payment Gateway**:
   - Select Card/Online payment option on the billing checkout screen.
   - Execute simulated payment and verify invoice status updates to `PAID`.
4. **Receptionist / Admin Desk**:
   - Sign in as reception staff (`staff@nutricare.demo` / `password`).
   - View scheduled appointments, filter by doctor/date, and update appointment status.

---

## 🔄 Phase 2: Working on the Clean Base Repository

Once the test run is complete and you understand how the system operates:

1. Download/clone the **Clean Base Repository** provided by the project lead.
2. Copy your feature files from `02-appointment-billing-IT25103681` into your workspace.
3. Follow `COMMIT_SCHEDULE_TILL_SEP19.md` to commit your module code step-by-step until **September 19th**.

---

## 🛠️ Verification & Diagnostic Commands

Run these commands periodically to verify code integrity:
```bash
# Test Module 02 backend code:
mvn -pl 02-appointment-billing-IT25103681/backend -am test

# Test top-level frontend compilation:
npm run build
```
