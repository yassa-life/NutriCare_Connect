# NutriCare Connect

NutriCare Connect is an academic demonstration of a web-based diet planning and health check-up platform. It combines six student-owned feature modules into one Spring Boot, React and MySQL application.

> Demo only: do not enter real patient, payment-card or confidential medical information. Health thresholds are examples and are not diagnostic.

## Modules

| Folder | Owner | Capability |
| --- | --- | --- |
| `01-user-access-IT25101803` | Vidanage T.L. | Registration, JWT login, RBAC and audit events |
| `02-appointment-billing-IT25103681` | Hasaranga S.O. | Scheduling, concurrency-safe holds, invoices and demo payments |
| `03-health-check-IT25102636` | Herath H.M.H.Y. | Check-ups, history and threshold alerts |
| `04-diet-progress-IT25101696` | Mohanaranjan M. | Diet plans, meal schedules and progress tracking |
| `05-messaging-reminders-IT25103601` | Punsara M.H. | Secure messages and simulated notification delivery |
| `06-feedback-analytics-IT25100792` | Gunathilaka M.D.S.T. | Feedback, complaints and management reporting |

## Open and run in IntelliJ IDEA

1. In IntelliJ IDEA choose **File > Open** and select the repository root `pom.xml`.
2. Select a Java 21 SDK when IntelliJ asks for the project SDK.
3. Allow Maven to import all seven modules and download dependencies.
4. Start MySQL and create an empty database named `nutricare`. The default local connection is `root` / `root` on port `3306`; edit the environment variables in the supplied **NutriCare Backend** run configuration if your credentials differ.
5. Open `backend/src/main/java/lk/sliit/nutricare/NutriCareApplication.java` and click the green Run icon, or select **NutriCare Backend** from the run configurations.

The runnable Java application lives in the top-level `backend` folder and the integrated React application lives in the top-level `frontend` folder. Each member keeps independently owned backend and frontend feature code in their numbered folder.

## Start locally from a terminal

Requirements: Java 21+, Maven 3.9+, Node 20+, npm or pnpm, Docker Desktop.

1. Copy `.env.example` to `.env` and change the JWT secret.
2. Start MySQL with `docker compose up -d mysql`.
3. Start the API with `mvn -pl backend -am spring-boot:run`.
4. Install frontend packages with `npm install` and start the top-level React UI with `npm run dev`.
5. Open `http://localhost:5173`.

All seeded accounts use the password `password`; change this before any shared demonstration. The default database credentials are intentionally local-only.

## Verification

- Backend: `mvn test`
- Frontend: `npm run build`
- API base: `http://localhost:8080/api/v1`

The complete academic pack is in [`docs`](docs/01-SRS.md), and the combined API contract is in [`openapi.yaml`](openapi.yaml).
