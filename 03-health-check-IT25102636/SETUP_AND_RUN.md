# Module 03: Setup, Download & Testing Guide
**Owner:** Herath H.M.H.Y. (`IT25102636`)  
**Module:** Health Check-up, NutriGuide AI & SMTP Email Delivery (`03-health-check-IT25102636`)

---

## 📌 Guide Overview & Ownership

This document provides step-by-step instructions for **Herath H.M.H.Y. (IT25102636)** who owns **Module 03**. 

### 🌟 Key Responsibilities Owned by IT25102636:
1. **Health Check-up & Vitals Monitoring**: Health check logging, vitals history tracking, threshold alert evaluation (BP, Glucose, BMI, Heart Rate).
2. **NutriGuide AI Health Chatbot**: Integrated Google Gemini 3.5 Flash-Lite health Q&A assistant (`PatientGuideService`), server-side emergency screening (1990 action trigger), and safe offline rules engine fallback.
3. **SMTP Email Delivery System**: Application-wide email infrastructure (`SmtpAccountMailer`), live Gmail SMTP app password setup, OTP password reset emails, and email delivery audit log tracking (`email_delivery_attempts`).

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

### Step 2: Set Up Environment Variables (Email & AI Settings)
Create a local `.env` file from `.env.example`:
```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On Linux / Git Bash / macOS
cp .env.example .env
```

Ensure your `.env` contains your MySQL, Gemini AI, and SMTP credentials:
```env
# Database Connection
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/nutricare?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root

# NutriGuide AI Settings (Owned by IT25102636)
GEMINI_API_KEY=your_google_ai_studio_api_key_here
GEMINI_MODEL=gemini-3.5-flash-lite

# Email SMTP Settings (Owned by IT25102636)
DEMO_NOTIFICATIONS=true
MAIL_LIVE_ENABLED=false
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_gmail_address@gmail.com
MAIL_PASSWORD=your_16_character_google_app_password
MAIL_FROM=your_gmail_address@gmail.com
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
```

### Step 3: Start Local MySQL & Backend API
```bash
# 1. Ensure local MySQL service is running on port 3306 (Database: nutricare)

# 2. Start Spring Boot Backend API from terminal or IntelliJ IDEA
mvn -pl backend -am spring-boot:run
```

### Step 4: Start Frontend
In a separate terminal window at the project root:
```bash
npm install
npm run dev
```
Open your web browser at: `http://localhost:5173`

---

## 🧪 Testing Module 03 Features (Email, AI & Health Checks)

As owner of **Module 03 (IT25102636)**, test the following key features:

### ✉️ 1. SMTP Email Delivery System (`SmtpAccountMailer`)
- Select **Forgot password?** on the sign-in page (`http://localhost:5173`).
- Enter a registered patient/staff email.
- **Simulated Mode (`MAIL_LIVE_ENABLED=false`)**: Check the browser/console for the 6-digit OTP code and confirm a `SIMULATED_DELIVERED` record in `email_delivery_attempts`.
- **Live Mode (`MAIL_LIVE_ENABLED=true`)**: Configure your Gmail address and 16-character Google App Password in `.env`, trigger password reset, and check your inbox for the OTP email.

### 🤖 2. NutriGuide AI Health Chatbot (`PatientGuideService`)
- Open **NutriGuide AI** on the bottom right or from the patient dashboard menu.
- **Normal Health Q&A**: Ask nutrition or health questions (e.g. *"What diet is best for managing high blood pressure?"*). Verify the AI response and non-diagnostic disclaimers.
- **Emergency Screening**: Ask severe emergency questions (e.g. *"I have severe chest pain and difficulty breathing"*). Verify that the server safety filter immediately displays the **Emergency Call 1990** prompt.
- **Offline Fallback**: Remove `GEMINI_API_KEY` from `.env` and verify that NutriGuide continues to answer common nutrition questions safely using the server-side rules engine.

### 📊 3. Health Check-up Entry & Threshold Alerts
- Sign in as a patient (`patient@nutricare.demo` / `password`).
- Navigate to **Health Checks** and log vitals (Systolic BP, Diastolic BP, Fasting Glucose, BMI).
- Test abnormal vitals entry (e.g. Systolic BP > 140) to confirm clinical alert banners and trend graphs.

---

## 🔄 Phase 2: Working on the Clean Base Repository

Once testing is complete and you understand how the system operates:

1. Download/clone the **Clean Base Repository** provided by the project lead.
2. Copy your feature files from `03-health-check-IT25102636` into your workspace.
3. Follow `COMMIT_SCHEDULE_TILL_SEP19.md` to commit your module code step-by-step until **September 19th**.

---

## 🛠️ Verification & Diagnostic Commands

Run these commands periodically to verify code integrity:
```bash
# Run Module 03 backend unit tests (includes SmtpAccountMailerTest & PatientGuideServiceTest):
mvn -pl 03-health-check-IT25102636/backend -am test

# Test top-level frontend compilation:
npm run build
```
