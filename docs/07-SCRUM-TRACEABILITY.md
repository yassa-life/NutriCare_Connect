# Scrum Plan and Requirements Traceability

## Eight-week plan

| Sprint | Weeks | Goal | Demonstrable outcome |
| --- | --- | --- | --- |
| 1 | 1–2 | Foundation and access | Register, login, RBAC, shared UI and schema contracts |
| 2 | 3–4 | Appointments and billing | Conflict-safe booking through demo invoice/payment |
| 3 | 5–6 | Health, diet and progress | Check-up alert through published plan and progress log |
| 4 | 7–8 | Communication and insight | Reminders, messages, feedback, complaints, reports and release |

## Traceability

| Requirement | Use case | API group | Acceptance test | Owner |
| --- | --- | --- | --- | --- |
| FR-01–04 | UC-01 | `/auth`, `/users`, `/patients` | AT-01–04 | IT25101803 |
| FR-05–08 | UC-02 | `/schedules`, `/appointments`, `/invoices`, `/payments` | AT-05–07 | IT25103681 |
| FR-09–10 | UC-03 | `/checkups`, `/health-alerts` | AT-08 | IT25102636 |
| FR-11–12 | UC-04 | `/diet-plans`, `/progress-logs` | AT-09 | IT25101696 |
| FR-13–14 | UC-05 | `/messages`, `/notifications` | AT-10 | IT25103601 |
| FR-15–18 | UC-06 | `/feedback`, `/complaints`, `/reports`, `/audit-events` | AT-11–13 | IT25100792 |

## Definition of done

Code compiles, owner tests pass, validation and failure behavior are covered, migrations run from a blank database, OpenAPI/docs are updated, no prohibited data is introduced, and the integrated journey remains operational.

