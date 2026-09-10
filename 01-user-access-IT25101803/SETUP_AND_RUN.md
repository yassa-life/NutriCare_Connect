# Module 01: Setup, Download & Testing Guide
**Owner:** Vidanage T.L. (`IT25101803`)  
**Module:** User Access & Authentication (`01-user-access-IT25101803`)

---

## 📌 Guide Overview

This document provides step-by-step instructions for:
1. **Phase 1: Full Project Setup & Test Run**: How to download the complete working repository from GitHub, set up dependencies (Java 21, Node.js, local MySQL), run the system, and verify Module 01 (User Access).
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
Ensure `.env` contains your local MySQL credentials:
```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/nutricare?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
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
1. Open IntelliJ IDEA -> **File > Open** -> select `pom.xml`.
2. Set Project SDK to Java 21 (**File > Project Structure > Project SDK**).
3. Open `backend/src/main/java/lk/sliit/nutricare/NutriCareApplication.java` and click **Run** (or select **NutriCare Backend** run configuration).

### Step 5: Start the Frontend (React + Vite)
In a new terminal window at project root:
```bash
npm install
npm run dev
```
Open your web browser at: `http://localhost:5173`

---

## 🧪 Testing Module 01 (User Access Features)

As owner of **Module 01**, test the following key workflows on `http://localhost:5173`:

1. **User Registration (`PATIENT`)**:
   - Click **Create one** on the sign-in page.
   - Register a new patient account with valid details.
   - Verify account creation and redirection to sign-in.
2. **User Sign In**:
   - Sign in with patient credentials or demo accounts (`admin@nutricare.demo` / `password`).
   - Check JWT token creation in local storage.
3. **Role-Based Access Control (RBAC)**:
   - Sign in as `admin@nutricare.demo` and navigate to **Patients & Access**.
   - Test staff/doctor account creation and password force-reset on first login.
4. **Account Locking & Audit Logs**:
   - Attempt to log in 5 times with incorrect passwords to verify account locking.
   - View security audit logs recorded for authentication events.

---

## 🔄 Phase 2: Working on the Clean Base Repository

Once the test run is complete and you understand how the system operates:

1. You will download/clone the **Clean Base Repository** provided by the project lead.
2. Copy your feature files from `01-user-access-IT25101803` into your workspace.
3. Follow `COMMIT_SCHEDULE_TILL_SEP19.md` to commit your module code step-by-step until **September 19th**.

---

## 🛠️ Verification & Diagnostic Commands

Run these commands periodically to verify code integrity:
```bash
# Test Module 01 backend code:
mvn -pl 01-user-access-IT25101803/backend -am test

# Test top-level frontend compilation:
npm run build
```
