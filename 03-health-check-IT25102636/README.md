# Module 03 — Health Check-up, Patient Guide and Email Delivery

**Owner:** Herath H.M.H.Y. (IT25102636)

This module owns health checks, prioritized alerts, the patient-only NutriGuide assistant, and the application SMTP delivery implementation. Module 01 creates password-reset codes and calls the public `AccountMailer` interface; Module 03 sends the email and records the delivery result in `email_delivery_attempts`. The password or OTP is never stored in that delivery table.

## Run the complete application

1. Start MySQL 8 and confirm the `nutricare` database is available.
2. Open the repository root `pom.xml` in IntelliJ IDEA as a Maven project.
3. Open **Run → Edit Configurations → NutriCare Backend** and confirm the database values match your MySQL installation.
4. Run **NutriCare Backend** and wait for port `8080`.
5. In a terminal at the repository root, run `npm install` once and then `npm run dev`.
6. Open `http://localhost:5173`. Vite proxies `/api` requests to Spring Boot.

## Enable real Gmail delivery

Real mail is deliberately disabled until credentials are supplied. In the repository root `.env`, configure:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=sender@gmail.com
MAIL_PASSWORD=your-16-character-google-app-password
MAIL_FROM=sender@gmail.com
MAIL_SMTP_AUTH=true
MAIL_STARTTLS=true
MAIL_LIVE_ENABLED=true
DEMO_NOTIFICATIONS=false
```

Enable two-step verification on the sender Google account and create a Google **App Password**. Do not use the normal Google password. Do not commit `.env`, share the App Password, or put it in React/Vite variables. See [Google App Password help](https://support.google.com/accounts/answer/185833) and the [Spring Boot email reference](https://docs.spring.io/spring-boot/reference/io/email.html).

After saving `.env`, stop and restart **NutriCare Backend**. Environment changes are only read during startup.

## Test password recovery

1. Use an email that already belongs to an enabled NutriCare account.
2. Select **Forgot password?** on the sign-in page.
3. Submit the account email and check its inbox and spam folder.
4. Enter the six-digit code and choose a new password of at least eight characters.
5. The code expires after ten minutes, is single-use, and is locked after five incorrect attempts.

When `MAIL_LIVE_ENABLED=false`, no inbox email is expected. The development page displays the code and saves a `SIMULATED_DELIVERED` record. With live delivery enabled, the database records `SENT` or `FAILED`, and the code is not returned to the browser when `DEMO_NOTIFICATIONS=false`.

## NutriGuide

Set `GEMINI_API_KEY` in `.env` to use Gemini 3.5 Flash-Lite as a normal multi-turn health Q&A chatbot. NutriGuide directly answers small health and nutrition questions, adds a reminder to seek advice from a doctor or registered dietitian, and can recommend an urgency level while staff are unavailable. A deterministic server-side safety screen runs before Gemini: possible emergencies immediately display a **Call 1990** action and do not wait for an AI response. Without a key, common health answers, navigation, emergency detection and safe offline escalation continue to work. The key remains server-side; NutriGuide cannot diagnose, prescribe, alter treatment, interpret results as a diagnosis, or replace a qualified clinician.

## Troubleshooting

- **Cannot reach backend:** ensure Spring Boot is listening on `8080`; restart both backend and Vite.
- **Authentication failed:** verify the Gmail address and App Password, remove spaces from the App Password, and restart Spring Boot.
- **No email but request succeeds:** check `MAIL_LIVE_ENABLED=true`, `DEMO_NOTIFICATIONS=false`, spam, and the latest `email_delivery_attempts.status` value.
- **Backend refuses to start:** live mode validates that `MAIL_USERNAME`, `MAIL_PASSWORD`, and `MAIL_FROM` are non-empty.
- **Unknown email:** the API intentionally returns a generic response and sends nothing, preventing account discovery.

Run module tests from the repository root with `mvn -pl 03-health-check-IT25102636/backend -am test`. Module 03 owns Flyway V3; the shared V10 migration originally created the cross-module email audit table and remains immutable because it has already been applied by Flyway.
