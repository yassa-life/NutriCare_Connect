# Verification and Acceptance Test Plan

## Levels

- Unit: domain state changes such as login locking, slot holding and feedback rating handling.
- Repository: Flyway migration, uniqueness, locking and indexed lookup behavior against MySQL.
- API: validation, authentication, role authorization and response contracts.
- UI: form behavior, navigation, responsive layout and accessible labels.
- End to end: the complete patient journey with synthetic records.

## Acceptance matrix

| Test | Scenario | Expected result |
| --- | --- | --- |
| AT-01 | Register valid patient | Account is created with hashed password and PATIENT role. |
| AT-02 | Submit invalid email or short password | HTTP 400 identifies invalid fields. |
| AT-03 | Fail login five times | Account becomes locked; later valid password is rejected. |
| AT-04 | Access clinical endpoint as reception | HTTP 403 and no clinical record is returned. |
| AT-05 | Hold the same slot concurrently | One request succeeds; the other receives a conflict/rejection. |
| AT-06 | Leave held booking unpaid | Slot is released after ten minutes and appointment expires. |
| AT-07 | Submit demo payment | Status and reference are stored; card/CVV fields do not exist. |
| AT-08 | Record blood sugar above 140 | A HIGH alert is created with the non-diagnostic disclaimer. |
| AT-09 | Publish diet plan and add progress | Plan becomes visible and progress sorts by date. |
| AT-10 | Simulate notification failure | FAILED is saved and changes to simulated delivered on retry. |
| AT-11 | Submit two-star feedback | Feedback and one urgent open complaint are committed together. |
| AT-12 | Request summary with dates | Counts and average rating match database fixtures. |
| AT-13 | Complete full patient journey | Registration through reporting succeeds without manual database edits. |
| AT-14 | Use UI at 320 px and keyboard only | Navigation/forms remain usable with visible focus. |

## Evidence record

For every run, record date, build identifier, tester, environment, test ID, input fixture, actual result, pass/fail, screenshot or response evidence, and linked defect. Never capture a real password or sensitive record in evidence.

## Exit criteria

All high-priority acceptance tests pass, no critical/high defect is open, migrations work on an empty database, backend tests and frontend production build succeed, and the demo script completes twice using a freshly seeded environment.

