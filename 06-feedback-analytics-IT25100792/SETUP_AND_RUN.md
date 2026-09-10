# Module 06: Setup, Download & Testing Guide
**Owner:** Gunathilaka M.D.S.T. (`IT25100792`)  
**Module:** Feedback, Complaints & Analytics Dashboard (`06-feedback-analytics-IT25100792`)

---

## 📌 Guide Overview

This document provides step-by-step instructions for:
1. **Phase 1: Full Project Setup & Test Run**: How to download the complete working repository from GitHub, set up dependencies (Java 21, Node.js, MySQL/Docker), run the system, and verify Module 06 (Feedback & Analytics).
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
| **Docker Desktop / MySQL** | Docker Desktop (or MySQL Server 8.0+) | `docker --version` |
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

### Step 3: Start MySQL & Backend API
```bash
# Start MySQL
docker compose up -d mysql

# Start Backend API
mvn -pl backend -am spring-boot:run
```

### Step 4: Start Frontend
```bash
npm install
npm run dev
```
Open your web browser at: `http://localhost:5173`

---

## 🧪 Testing Module 06 (Feedback & Analytics Features)

As owner of **Module 06**, test the following key workflows on `http://localhost:5173`:

1. **Patient Feedback & Rating Submission**:
   - Sign in as a patient (`patient@nutricare.demo` / `password`).
   - Submit feedback and a 5-star rating for a consultation or diet plan service.
2. **Complaint Logging & Escalation**:
   - Submit a formal complaint and track its resolution status.
3. **Management Reporting & Executive Dashboard**:
   - Sign in as manager (`manager@nutricare.demo` / `password`).
   - Open **Analytics & Reports** to view executive KPI cards (Appointments completed, Patient satisfaction score, Revenue summaries).
4. **Export CSV / PDF Reports**:
   - Generate and download management summary reports.

---

## 🔄 Phase 2: Working on the Clean Base Repository

Once the test run is complete and you understand how the system operates:

1. Download/clone the **Clean Base Repository** provided by the project lead.
2. Copy your feature files from `06-feedback-analytics-IT25100792` into your workspace.
3. Follow `COMMIT_SCHEDULE_TILL_SEP19.md` to commit your module code step-by-step until **September 19th**.

---

## 🛠️ Verification & Diagnostic Commands

Run these commands periodically to verify code integrity:
```bash
# Test Module 06 backend code:
mvn -pl 06-feedback-analytics-IT25100792/backend -am test

# Test top-level frontend compilation:
npm run build
```
