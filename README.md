# NutriCare Connect

NutriCare Connect is a fully working local web application and GitHub portfolio project for diet planning and health check-ups. It combines six student-owned feature modules into one Spring Boot, React and MySQL application. Fictional seed records are included for development, but user, appointment, health, diet, message and feedback changes are persisted by the API.

> Personal/academic use: this is not a customer-facing clinical product. Health thresholds are examples and are not diagnostic; payment gateway actions remain simulated.

## Modules

| Folder | Owner | Capability |
| --- | --- | --- |
| `01-user-access-IT25101803` | Vidanage T.L. | Registration, JWT login, RBAC and audit events |
| `02-appointment-billing-IT25103681` | Hasaranga S.O. | Scheduling, concurrency-safe holds, invoices and demo payments |
| `03-health-check-IT25102636` | Herath H.M.H.Y. | Check-ups, history, threshold alerts and patient NutriGuide |
| `04-diet-progress-IT25101696` | Mohanaranjan M. | Diet plans, meal schedules and progress tracking |
| `05-messaging-reminders-IT25103601` | Punsara M.H. | Secure messages and simulated notification delivery |
| `06-feedback-analytics-IT25100792` | Gunathilaka M.D.S.T. | Feedback, complaints and management reporting |

## Open and run in IntelliJ IDEA

1. In IntelliJ IDEA choose **File > Open** and select the repository root `pom.xml`.
2. Select a Java 21 SDK when IntelliJ asks for the project SDK.
3. Allow Maven to import all seven modules and download dependencies.
4. Start MySQL. The application creates and migrates a database named `nutricare`. The default local connection is `root` / `root` on port `3306`; edit the environment variables in the supplied **NutriCare Backend** run configuration if your credentials differ.
5. Open `backend/src/main/java/lk/sliit/nutricare/NutriCareApplication.java` and click the green Run icon, or select **NutriCare Backend** from the run configurations.

The runnable Java application lives in the top-level `backend` folder and the integrated React application lives in the top-level `frontend` folder. Each member keeps independently owned backend and frontend feature code in their numbered folder.

## Start locally from a terminal

Requirements: Java 21+, Maven 3.9+, Node 20+, npm or pnpm, Docker Desktop.

1. Copy `.env.example` to `.env` and change the JWT secret.
2. Start MySQL with `docker compose up -d mysql`.
3. Start the API with `mvn -pl backend -am spring-boot:run`.
4. Install frontend packages with `npm install` and start the top-level React UI with `npm run dev`.
5. Open `http://localhost:5173`.

All seeded accounts use the password `password`. Seeded staff accounts are required to replace it at first login. The default database credentials are intentionally local-only.

The sign-in screen provides fictional patient, clinical, reception, administration, management and finance accounts. A user's assigned role controls navigation and is never changed from the account menu. Users can edit their own contact profile and sign out; administrators can enable or disable accounts without deleting linked records. Patients also receive the non-diagnostic NutriGuide health chatbot owned by Module 03. It answers small health and nutrition questions, reminds patients to seek personalized professional advice, provides conservative urgency guidance when staff are unavailable, and exposes a 1990 emergency action when needed. Add a Google AI Studio key as `GEMINI_API_KEY` to use Gemini 3.5 Flash-Lite; without a key, common health answers, emergency screening and safe offline escalation remain available.

The backend automatically loads the root `.env` file when started from IntelliJ or the repository root. Keep `GEMINI_MODEL=gemini-3.5-flash-lite` there. The key is used only by Spring Boot and is never sent to the browser or committed to Git.

### Account and email setup

- Patients create their own account from **Create one** on the sign-in page. Public registration always assigns the `PATIENT` role.
- Sign in as `admin@nutricare.demo` with `password`, open **Patients & access**, and create doctor or staff accounts. The temporary password is displayed once and the new staff member must replace it immediately after signing in.
- **Forgot password?** emails a six-digit code that expires after ten minutes. For real email delivery, configure the `MAIL_*` values from `.env.example`, set `MAIL_LIVE_ENABLED=true`, and set `DEMO_NOTIFICATIONS=false` so the code is never returned to the browser. With live email disabled, localhost shows the code and records a simulated delivery.
- For Gmail SMTP, set `MAIL_USERNAME` and `MAIL_FROM` to the sender Gmail address and put a Google App Password in `MAIL_PASSWORD` (not the normal Google account password). Restart the Spring Boot run configuration after changing `.env`.

The SMTP implementation is owned by **Module 03 — IT25102636**. Complete setup, testing and troubleshooting instructions are in [03-health-check-IT25102636/README.md](03-health-check-IT25102636/README.md). Module 01 owns OTP generation and verification only. If live email is disabled, a successful request displays a localhost code but does not send an inbox message; this is expected. Never commit the root `.env` file.

The application database is named `nutricare` and is created through Flyway migrations. Account primary keys are short role-based codes such as `P001` for a patient, `D001` for a doctor and `DT001` for a dietitian. New registrations safely receive the next number for their role. Appointment, invoice and other transactional records retain UUID keys because those identifiers are internal and should not be reused. The older manually imported schema is preserved locally as `nutricare_legacy`; `nutricare.sql` is retained for reference only and must not be imported over the Flyway-managed schema.

## Verification

- Backend: `mvn test`
- Frontend: `npm run build`
- API base: `http://localhost:8080/api/v1`

The complete academic pack is in [`docs`](docs/01-SRS.md), and the combined API contract is in [`openapi.yaml`](openapi.yaml).
