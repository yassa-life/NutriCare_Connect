# Design Patterns in NutriCare Connect (SE2030 Final Presentation)

This document covers **only the 5 Core SE2030 Design Patterns** from your lecture syllabus:
1. **Factory Method** *(Creational)*
2. **Singleton** *(Creational)*
3. **Decorator** *(Structural)*
4. **Observer** *(Behavioral)*
5. **Strategy** *(Behavioral)*

Every single group member (**Members 1 to 6**) is assigned one of these 5 patterns with exact files, line numbers, code snippets, and a Q&A explanation for the **5-mark Design Pattern evaluation**.

---

## Assignment Table: The 5 Patterns Mapped to All 6 Members

| Member | Student ID & Name | Module Folder | Assigned Pattern (from the 5 Boxed Patterns) | File to Show in IntelliJ |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `IT25101803` — Vidanage T.L. | `01-user-access-IT25101803` | **Factory Method Pattern** | [`AccountIdService.java`](file:///d:/SLIIT/projectr/Web_project/01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/access/AccountIdService.java) & [`AuthService.java`](file:///d:/SLIIT/projectr/Web_project/01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/access/AuthService.java) |
| **2** | `IT25103681` — Hasaranga S.O. | `02-appointment-billing-IT25103681` | **Singleton Pattern** | [`AppointmentService.java`](file:///d:/SLIIT/projectr/Web_project/02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointment/AppointmentService.java) |
| **3** | `IT25102636` — Herath H.M.H.Y. | `03-health-check-IT25102636` | **Strategy Pattern** (& **Decorator Pattern**) | [`SmtpAccountMailer.java`](file:///d:/SLIIT/projectr/Web_project/03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/mail/SmtpAccountMailer.java) & [`PatientGuideService.java`](file:///d:/SLIIT/projectr/Web_project/03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/PatientGuideService.java) |
| **4** | `IT25101696` — Mohanaranjan M. | `04-diet-progress-IT25101696` | **Decorator Pattern** | [`DietController.java`](file:///d:/SLIIT/projectr/Web_project/04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/diet/DietController.java) |
| **5** | `IT25103601` — Punsara M.H. | `05-messaging-reminders-IT25103601` | **Strategy Pattern** | [`MessageController.java`](file:///d:/SLIIT/projectr/Web_project/05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/message/MessageController.java) & [`Notification.java`](file:///d:/SLIIT/projectr/Web_project/05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/message/Notification.java) |
| **6** | `IT25100792` — Gunathilaka M.D.S.T. | `06-feedback-analytics-IT25100792` | **Observer Pattern** | [`AnalyticsController.java`](file:///d:/SLIIT/projectr/Web_project/06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/analytics/AnalyticsController.java) & [`Complaint.java`](file:///d:/SLIIT/projectr/Web_project/06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/analytics/Complaint.java) |

---

## Member-by-Member Breakdown (Only the 5 Boxed Patterns)

---

### Member 1: Vidanage T.L. (`IT25101803`) — **Factory Method Pattern**

* **Pattern Category:** Creational
* **Files & Lines:**
  * [`AccountIdService.java`](file:///d:/SLIIT/projectr/Web_project/01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/access/AccountIdService.java#L26-L37) (lines 26–37)
  * [`AuthService.java`](file:///d:/SLIIT/projectr/Web_project/01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/access/AuthService.java#L60-L72) (`register` at lines 60–72 & `provisionStaff` at lines 208–227)
* **How It Works:**
  * `AccountIdService.nextId(String role)` acts as a **Factory Method** that takes a user role (`PATIENT`, `DOCTOR`, `DIETITIAN`, `RECEPTION_STAFF`, etc.), resolves its prefix (`P`, `D`, `DT`, `R`), and manufactures the next role-specific account ID (`P001`, `D001`, `DT001`).
  * `AuthService` uses two creator methods—`register(...)` for self-registered `PATIENT` accounts (`mustChangePassword = false`) and `provisionStaff(...)` for staff accounts (`mustChangePassword = true` with a generated temporary password).
* **Code to Show:**
  ```java
  // AccountIdService.java (Lines 26-37) — Factory Method for Role-Based IDs
  String nextId(String role) {
    String prefix = PREFIXES.get(role);
    if (prefix == null) throw new IllegalArgumentException("Unknown role");
    AccountIdCounter counter =
        counters
            .findForUpdate(prefix)
            .orElseThrow(
                () -> new IllegalStateException("Missing account ID counter for " + prefix));
    String id = counter.takeNextId();
    counters.save(counter);
    return id;
  }
  ```
* **What Member 1 Should Say in Q&A:**
  > *"In Module 01, I applied the **Factory Method Pattern** in `AccountIdService.nextId(role)` and `AuthService` (`register` vs. `provisionStaff`). Instead of hardcoding ID formats or account flags in the controller, the factory methods manufacture role-specific IDs (`P001`, `D001`, `DT001`) and configure patient accounts differently from staff accounts that require a first-login password change."*

---

### Member 2: Hasaranga S.O. (`IT25103681`) — **Singleton Pattern**

* **Pattern Category:** Creational
* **File & Lines:**
  * [`AppointmentService.java`](file:///d:/SLIIT/projectr/Web_project/02-appointment-billing-IT25103681/backend/src/main/java/lk/sliit/nutricare/appointment/AppointmentService.java#L13-L37) (lines 13–37 & scheduled worker at lines 175–182)
* **How It Works:**
  * `AppointmentService` is annotated with `@Service`, meaning the Spring IoC container instantiates **only one single shared instance (Singleton)** of `AppointmentService` for the entire application lifecycle.
  * That single instance is injected into `AppointmentController` via constructor injection and also runs the single background scheduler (`@Scheduled(fixedDelay = 60000) releaseExpired()`) that releases expired 10-minute slot holds across the whole system without duplicate timers.
* **Code to Show:**
  ```java
  // AppointmentService.java (Lines 13-37 & 175-182) — Singleton Service Instance
  @Service
  public class AppointmentService {
    private final SlotRepository slots;
    private final AppointmentRepository appointments;
    private final InvoiceRepository invoices;
    private final PaymentRepository payments;
    private final JdbcTemplate jdbc;

    AppointmentService(
        SlotRepository slots,
        AppointmentRepository appointments,
        InvoiceRepository invoices,
        PaymentRepository payments,
        JdbcTemplate jdbc) {
      this.slots = slots;
      this.appointments = appointments;
      this.invoices = invoices;
      this.payments = payments;
      this.jdbc = jdbc;
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void releaseExpired() {
      for (AvailabilitySlot slot : slots.findByStatusAndHoldExpiresAtBefore("HELD", Instant.now())) {
        appointments.findBySlotIdAndStatus(slot.getId(), "HELD").forEach(Appointment::expire);
        slot.release();
      }
    }
  }
  ```
* **What Member 2 Should Say in Q&A:**
  > *"In Module 02, I used the **Singleton Pattern** for `AppointmentService`. Spring creates a single shared instance of `AppointmentService` across the entire application, which ensures that all appointment bookings, payments, and the 60-second `@Scheduled` hold-expiry cleanup job are coordinated through one thread-safe instance."*

---

### Member 3: Herath H.M.H.Y. (`IT25102636`) — **Strategy Pattern** (& **Decorator Pattern**)

* **Pattern Category:** Behavioral (Strategy) & Structural (Decorator)
* **Files & Lines:**
  * [`AccountMailer.java`](file:///d:/SLIIT/projectr/Web_project/01-user-access-IT25101803/backend/src/main/java/lk/sliit/nutricare/access/AccountMailer.java#L4-L8) (Strategy Interface)
  * [`SmtpAccountMailer.java`](file:///d:/SLIIT/projectr/Web_project/03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/mail/SmtpAccountMailer.java#L13-L106) (Concrete Strategy, lines 13 & 87–106)
  * [`PatientGuideService.java`](file:///d:/SLIIT/projectr/Web_project/03-health-check-IT25102636/backend/src/main/java/lk/sliit/nutricare/health/PatientGuideService.java#L72-L117) (AI vs. Local Strategy at lines 72–117; Decorator `withCareReminder` at lines 278–301)
* **How It Works:**
  1. **Strategy Pattern (`SmtpAccountMailer` & `PatientGuideService`):**
     * `SmtpAccountMailer` implements the `AccountMailer` interface and switches at runtime between **Simulated Database Delivery** (`SIMULATED_DELIVERED`) and **Live SMTP Delivery** (`JavaMailSender`) based on `liveEmail`.
     * `PatientGuideService.answer(...)` switches at runtime between **Emergency 1990 Screening**, **Google Gemini AI (`GEMINI`)**, and **Local Rule-Based Fallback (`LOCAL`)**.
  2. **Decorator Pattern (`withCareReminder`):**
     * Wraps any medical/diet response (from either Gemini or the Local engine) by dynamically appending a clinical safety disclaimer reminding the patient to consult a doctor or dietitian.
* **Code to Show:**
  ```java
  // SmtpAccountMailer.java (Lines 13 & 87-100) — Strategy Pattern
  @Service
  class SmtpAccountMailer implements AccountMailer {
    private EmailDeliveryAttempt send(
        String email, String template, String subject, String body, String preview) {
      if (!liveEmail) {
        return deliveries.save(
            new EmailDeliveryAttempt(email, template, "SIMULATED_DELIVERED", preview));
      }
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(from);
      message.setTo(email);
      message.setSubject(subject);
      message.setText(body);
      mailSender.send(message);
      return deliveries.save(new EmailDeliveryAttempt(email, template, "SENT", preview));
    }
  }
  ```
* **What Member 3 Should Say in Q&A:**
  > *"In Module 03, I implemented the **Strategy Pattern** in two places: `SmtpAccountMailer` implements the `AccountMailer` interface to switch between simulated email logging and live SMTP delivery at runtime, and `PatientGuideService` switches between the Google Gemini AI strategy and a local offline fallback strategy. I also used the **Decorator Pattern** in `withCareReminder()` to dynamically wrap medical answers with a mandatory clinical safety disclaimer."*

---

### Member 4: Mohanaranjan M. (`IT25101696`) — **Decorator Pattern**

* **Pattern Category:** Structural
* **File & Lines:**
  * [`DietController.java`](file:///d:/SLIIT/projectr/Web_project/04-diet-progress-IT25101696/backend/src/main/java/lk/sliit/nutricare/diet/DietController.java#L42-L117) (lines 42–117)
* **How It Works:**
  * Uses the **Decorator Pattern** via Spring AOP proxy decorators (`@PreAuthorize` and `@Transactional`) around `DietController` methods (`create`, `update`, `delete`, `publish`, `plans`, `log`, `progress`).
  * Without polluting the core diet plan and progress logging code with manual role/token checks or transaction commit/rollback code, the proxy decorators dynamically wrap each method call to verify role permissions (`DIETITIAN`/`DOCTOR` vs. owning `PATIENT` where `principal == #request.patientId.toString()`) and manage database transactions.
* **Code to Show:**
  ```java
  // DietController.java (Lines 71-80 & 97-110) — Security & Transaction Proxy Decorators
  @DeleteMapping("/diet-plans/{id}")
  @PreAuthorize("hasAnyRole('DIETITIAN','DOCTOR','SYSTEM_ADMIN')")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  @Transactional
  void delete(@PathVariable UUID id) {
    DietPlan plan =
        plans.findById(id).orElseThrow(() -> new IllegalArgumentException("Diet plan not found"));
    jdbc.update("UPDATE progress_logs SET diet_plan_id = NULL WHERE diet_plan_id = ?", id.toString());
    plans.delete(plan);
  }

  @PostMapping("/progress-logs")
  @PreAuthorize("hasRole('PATIENT') and principal == #request.patientId.toString()")
  @ResponseStatus(HttpStatus.CREATED)
  ProgressLog log(@Valid @RequestBody LogRequest request) {
    return logs.save(new ProgressLog(/* ... */));
  }
  ```
* **What Member 4 Should Say in Q&A:**
  > *"In Module 04, I used the **Decorator Pattern** through `@PreAuthorize` and `@Transactional` proxy decorators on `DietController`. At runtime, these decorators wrap my diet plan and progress-logging methods with role-based access control and transactional safety—ensuring only clinicians can publish or delete plans and patients can only log progress for their own account—without modifying the core business logic."*

---

### Member 5: Punsara M.H. (`IT25103601`) — **Strategy Pattern**

* **Pattern Category:** Behavioral
* **Files & Lines:**
  * [`MessageController.java`](file:///d:/SLIIT/projectr/Web_project/05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/message/MessageController.java#L104-L133) (lines 104–133)
  * [`Notification.java`](file:///d:/SLIIT/projectr/Web_project/05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/message/Notification.java#L37-L91) (lines 37–48 & 86–90)
* **How It Works:**
  * Uses the **Strategy Pattern** concept to select both the **Notification Channel** (`IN_APP`, `EMAIL`, `SMS`) and the **Delivery / Recovery Behavior** (`DELIVERED_SIMULATED` vs. `FAILED` with scheduled retry).
  * When `simulateFailure` is selected, the notification is initialized with a 5-minute `retryAt` window, and the scheduled recovery strategy (`@Scheduled(fixedDelay = 60000) retry()`) automatically re-processes failed notifications via `Notification::retry`.
* **Code to Show:**
  ```java
  // MessageController.java (Lines 104-132) — Multi-Channel & Retry Delivery Strategy
  @PostMapping("/notifications")
  @PreAuthorize(
      "hasAnyRole('DIETITIAN','DOCTOR','RECEPTION_STAFF','SYSTEM_ADMIN','PATIENT_RELATIONS_OFFICER')")
  @ResponseStatus(HttpStatus.CREATED)
  Notification notify(@Valid @RequestBody NoticeRequest request) {
    return notifications.save(
        new Notification(
            request.recipientId(),
            request.type(),
            request.channel(), // Interchangeable channel: IN_APP | EMAIL | SMS
            request.message(),
            request.simulateFailure() ? "FAILED" : "DELIVERED_SIMULATED"));
  }

  @Scheduled(fixedDelay = 60000)
  @Transactional
  public void retry() {
    notifications
        .findByStatusAndRetryAtBefore("FAILED", Instant.now())
        .forEach(Notification::retry);
  }
  ```
* **What Member 5 Should Say in Q&A:**
  > *"In Module 05, I applied the **Strategy Pattern** to handle interchangeable notification channels (`IN_APP`, `EMAIL`, and `SMS`) and runtime delivery behaviors (`DELIVERED_SIMULATED` vs. `FAILED` with automated retry). Failed notifications schedule a 5-minute retry window and are automatically recovered by the background retry strategy."*

---

### Member 6: Gunathilaka M.D.S.T. (`IT25100792`) — **Observer Pattern**

* **Pattern Category:** Behavioral
* **Files & Lines:**
  * [`AnalyticsController.java`](file:///d:/SLIIT/projectr/Web_project/06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/analytics/AnalyticsController.java#L48-L103) (`submit` at lines 48–64 & `update` at lines 88–103)
  * [`Complaint.java`](file:///d:/SLIIT/projectr/Web_project/06-feedback-analytics-IT25100792/backend/src/main/java/lk/sliit/nutricare/analytics/Complaint.java#L26-L32) (lines 26–32)
* **How It Works:**
  * Uses the **Observer Pattern** principle where `Feedback` acts as the **Subject** being monitored for state changes.
  * Whenever a patient submits a new `Feedback` or updates an existing `Feedback` and the rating drops to 2 stars or below (`rating <= 2`), the complaint escalation listener automatically reacts by creating an `URGENT` `Complaint` (`priority = "URGENT"`, `status = "OPEN"`) for the Patient Relations Officer.
* **Code to Show:**
  ```java
  // AnalyticsController.java (Lines 52-64 & 91-103) — Observer-Style State Reaction
  @PostMapping("/feedback")
  @PreAuthorize("hasRole('PATIENT') and principal == #request.patientId.toString()")
  @ResponseStatus(HttpStatus.CREATED)
  @Transactional
  Result submit(@Valid @RequestBody FeedbackRequest request) {
    Feedback saved =
        feedback.save(
            new Feedback(
                request.patientId(),
                request.practitionerId(),
                request.appointmentId(),
                request.rating(),
                request.comments()));
    // Reacts automatically when Feedback state has rating <= 2
    Complaint complaint =
        request.rating() <= 2 ? complaints.save(new Complaint(saved.getId())) : null;
    return new Result(saved, complaint);
  }
  ```
* **What Member 6 Should Say in Q&A:**
  > *"In Module 06, I applied the **Observer Pattern** principle where `Feedback` is the subject being observed: whenever a patient creates or updates a feedback record with `rating <= 2`, the system automatically reacts to that state change by generating an `URGENT` `Complaint` record for the Patient Relations Officer."*
