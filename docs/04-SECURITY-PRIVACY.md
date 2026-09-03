# Security and Privacy Guide

## Controls implemented

- BCrypt password hashing and constant-time JWT signature comparison.
- Five-attempt account lock with administrator unlock operation.
- Stateless bearer authentication and server-side role authorities.
- Request validation, bounded text fields, parameterized repository queries and transactional writes.
- Booking row locks, optimistic versioning and a database uniqueness constraint.
- Audit records for registration and login, with the extension point documented for all mutations.
- CORS limited to the configured frontend origin.

## Role visibility

| Data/action | Patient | Care staff | Reception | Admin | Manager | Finance |
| --- | --- | --- | --- | --- | --- | --- |
| Own profile/results/plan | Own only | Assigned patients | Minimum registration data | Account metadata | Aggregate only | No clinical data |
| Scheduling | Own | Own schedule | All schedules | Support only | Aggregate only | Invoice link only |
| Clinical entry | No | Doctor/coordinator | No | No content access | Aggregate only | No |
| Diet plan editing | No | Dietitian | No | No | Aggregate only | No |
| Payments | Own history | No | Record cash | Audit metadata | Aggregate | Full demo ledger |
| Complaints | Own | Assigned response | Refer | Manage | Manage | No |

## Prohibited data

Never enter or persist real names tied to health data, national identifiers, real payment-card numbers, CVV, online-banking credentials, insurance records or production medical results. The payment request accepts only amount, method and status. Medical thresholds are marked non-diagnostic.

## Before any public demonstration

Replace the JWT secret and default passwords, recreate the database from safe seed data, verify logs contain no confidential values, and keep the API/database on a private development network.

