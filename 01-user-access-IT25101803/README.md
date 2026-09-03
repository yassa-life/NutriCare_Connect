# Module 01 — User Access

**Owner:** Vidanage T.L. (IT25101803)  
Implements UC-01: registration, login, JWT authentication, role-based authorization, five-attempt account locking and audit events. The `backend` is a Maven feature jar; `frontend` exports `UserAccessFeature` for the integrated Vite shell.

Run tests from the repository root with `mvn -pl 01-user-access-IT25101803/backend -am test`. This module owns Flyway V1 and must never expose password hashes in API responses.
