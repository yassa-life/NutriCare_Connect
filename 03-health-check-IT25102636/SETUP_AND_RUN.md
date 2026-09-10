# Module 03: Setup, Download & Testing Guide
**Owner:** Herath H.M.H.Y. (`IT25102636`)  
**Module:** Health Check-up, NutriGuide AI & SMTP Email (`03-health-check-IT25102636`)

---

## 📌 Guide Overview

This document provides step-by-step instructions for:
1. **Phase 1: Full Project Setup & Test Run**: How to download the complete working repository from GitHub, set up dependencies (Java 21, Node.js, MySQL/Docker, SMTP / Gemini AI keys), run the system, and verify Module 03 (Health Check & NutriGuide).
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

### Step 2: Set Up Environment Variables (Including Module 03 SMTP & Gemini)
Create a local `.env` file from `.env.example`:
```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On Linux / Git Bash / macOS
cp .env.example .env
```
Ensure your `.env` includes Module 03 specific environment settings:
```env
# Optional Gemini AI key for NutriGuide Chatbot (without key, safe rule engine handles responses)
GEMINI_API_KEY=your_google_ai_studio_key_here
GEMINI_MODEL=gemini-3.5-flash-lite

# Email SMTP Settings (Owned by Module 03)
DEMO_NOTIFICATIONS=true
MAIL_LIVE_ENABLED=false
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_google_app_password
MAIL_FROM=your_gmail@gmail.com
```

### Step 3: Start MySQL & Spring Boot Backend
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

## 🧪 Testing Module 03 (Health Check & NutriGuide Features)

As owner of **Module 03**, test the following key workflows on `http://localhost:5173`:

1. **Patient Health Check-up Entry**:
   - Sign in as a patient (`patient@nutricare.demo` / `password`).
   - Navigate to **Health Checks** and submit vitals (Blood Pressure, Glucose, BMI, Heart Rate).
2. **Threshold Alerts & History Tracking**:
   - Submit abnormal vitals (e.g. Systolic BP > 140) and verify warning banner and patient advice.
   - View graphical health metric history and trends.
3. **NutriGuide AI Chatbot**:
   - Open the **NutriGuide AI** widget on the bottom right or navigation menu.
   - Ask health/nutrition questions (e.g. "What should I eat to manage high blood pressure?").
   - Test non-diagnostic disclaimers and emergency 1990 action trigger for severe symptoms.
4. **SMTP Email Notification Verification**:
   - Verify OTP email dispatch or simulated console/localhost delivery.

---

## 🔄 Phase 2: Working on the Clean Base Repository

Once the test run is complete and you understand how the system operates:

1. Download/clone the **Clean Base Repository** provided by the project lead.
2. Copy your feature files from `03-health-check-IT25102636` into your workspace.
3. Follow `COMMIT_SCHEDULE_TILL_SEP19.md` to commit your module code step-by-step until **September 19th**.

---

## 🛠️ Verification & Diagnostic Commands

Run these commands periodically to verify code integrity:
```bash
# Test Module 03 backend code:
mvn -pl 03-health-check-IT25102636/backend -am test

# Test top-level frontend compilation:
npm run build
```
