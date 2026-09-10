# Module requirements

Accept valid registration, default public registration to PATIENT, hash passwords with BCrypt, issue an eight-hour signed token, reject unknown roles, lock after five failed logins and permit an administrator-controlled unlock. Validate email and minimum eight-character passwords. See FR-01–04 and AT-01–04.

Generate and verify expiring password-reset OTPs, but delegate all message delivery through the public `AccountMailer` boundary implemented by Module 03. Module 01 must not contain SMTP credentials or transport code.
