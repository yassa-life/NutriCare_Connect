# Software Requirements Specification

## Purpose

NutriCare Connect centralizes patient registration, scheduling, health checks, diet plans, communication, billing, feedback and management reporting for a private wellness centre. This implementation is an academic demonstration and must never be used for clinical decisions or real payment processing.

## Users and goals

- **Patient:** manage profile and appointments; view personal results, plans, progress, invoices and notifications; message their assigned dietitian; submit feedback.
- **Dietitian:** view assigned patients, respond to alerts, publish diet plans and monitor progress.
- **Doctor / medical coordinator:** record check-ups and recommendations and schedule follow-ups.
- **Reception staff:** register patients and manage schedules and appointment changes.
- **System administrator:** manage accounts, roles, locks and audit activity.
- **Operations manager:** review visits, retention, workload, satisfaction and complaints.
- **Finance executive:** review invoices, demo payments, refunds and financial summaries.
- **Patient relations officer:** monitor questions, service issues and complaint follow-up.

## Functional requirements

| ID | Requirement | Acceptance summary |
| --- | --- | --- |
| FR-01 | Register and authenticate users | Email is unique, password is BCrypt hashed, JWT is issued after valid login. |
| FR-02 | Enforce roles and permissions | Protected API and UI actions are unavailable to unauthorized roles. |
| FR-03 | Lock unsafe login attempts | Five consecutive failures lock the account; an administrator can unlock it. |
| FR-04 | Manage patient records | Authorized users can create and view profile and medical-history information. |
| FR-05 | Manage practitioner schedules | Available slots are returned by date and practitioner. |
| FR-06 | Book without conflicts | A transactional lock and unique database constraint prevent double booking. |
| FR-07 | Reschedule or cancel | Status history is retained and cancelled slots become available. |
| FR-08 | Generate invoices and demo payments | Payment status and audit metadata are saved without sensitive card data. |
| FR-09 | Record health checks | Weight, BMI, blood pressure, blood sugar, temperature and notes are stored. |
| FR-10 | Trigger health alerts | Configured demo thresholds create prioritized dietitian alerts. |
| FR-11 | Create and publish diet plans | A plan contains targets, exclusions and a meal schedule. |
| FR-12 | Track progress | Patients log meals, water, weight and BMI; charts show trends. |
| FR-13 | Securely message care staff | Messages are restricted to authorized patient-care relationships. |
| FR-14 | Send reminders | In-app reminders work; email/SMS attempts are simulated and retried after failure. |
| FR-15 | Collect feedback | Ratings from 1–5 and optional comments are stored after consultation. |
| FR-16 | Escalate complaints | A rating of 2 or below creates an urgent complaint ticket. |
| FR-17 | Produce reports | Date-filtered operational, clinical, satisfaction and financial summaries are available. |
| FR-18 | Record audit events | Security-sensitive, clinical, financial and administrative mutations identify actor and time. |

## Non-functional requirements

- Responsive operation from 320 px mobile screens through desktop dashboards.
- Keyboard-accessible controls, visible focus states, semantic labels and readable contrast.
- API validation returns stable error codes and field-level messages.
- Database transactions protect booking and payment state transitions.
- No raw password, full card number, CVV or real patient data is logged or seeded.
- All timestamps are stored consistently and presented in Asia/Colombo time for the demo.
- Module boundaries allow each member folder to be reviewed or uploaded independently.

## Out of scope

Production clinical guidance, regulatory certification, real payment gateways, real SMS/email delivery, insurance processing, prescription management and real-world emergency response are explicitly excluded.

