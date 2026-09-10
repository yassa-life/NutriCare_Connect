# Module 05: Git Commit Schedule & Strategy (Till Sept 19)
**Owner:** Punsara M.H. (`IT25103601`)  
**Module:** Messaging & Reminders System (`05-messaging-reminders-IT25103601`)

---

## 🎯 Purpose & Strategy

This guide outlines a high-frequency commit schedule (18 commits) spread across **September 10 to September 19, 2026**. 
By staging and committing specific files incrementally rather than committing everything in one large batch, you will establish a realistic, professional Git contribution graph on GitHub.

> ⚠️ **Golden Rules for Committing:**
> 1. Never run `git add .` to dump all files at once. Always stage specific file paths as indicated.
> 2. Test your backend code (`mvn -pl 05-messaging-reminders-IT25103601/backend -am test`) after major backend commits.
> 3. Verify frontend build (`npm run build`) after major UI commits.

---

## 📅 Day-by-Day Commit Schedule

### 🔹 Phase A: Module Scaffolding & Setup (Sept 10 - Sept 11)

#### Commit 1: Module Documentation Setup
- **Date:** `2026-09-10`
- **Goal:** Initialize UC-05 requirements documentation and contribution record.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/README.md 05-messaging-reminders-IT25103601/docs/
  git commit -m "docs(messaging-reminders): initialize UC-05 module documentation and requirements"
  ```

#### Commit 2: Module POM Configuration
- **Date:** `2026-09-10`
- **Goal:** Configure dependencies for WebSocket/Messaging and JPA entities.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/pom.xml
  git commit -m "build(messaging-reminders): configure module pom dependencies for messaging"
  ```

#### Commit 3: Database Flyway Migration V5 Script
- **Date:** `2026-09-11`
- **Goal:** Create Flyway SQL migration script for `messages`, `conversations`, and `reminders`.
- **Commands:**
  ```bash
  git add backend/src/main/resources/db/migration/V5__messaging_reminders_schema.sql
  git commit -m "feat(messaging-reminders): add Flyway V5 schema for messages and notification queues"
  ```

---

### 🔹 Phase B: Domain Entities, Repositories & Delivery Service (Sept 12 - Sept 13)

#### Commit 4: Message & Reminder JPA Entities
- **Date:** `2026-09-12`
- **Goal:** Define DirectMessage, Conversation, Reminder, and DeliveryStatus JPA entities.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/entity/
  git commit -m "feat(messaging-reminders): create JPA entities for DirectMessage and Reminder models"
  ```

#### Commit 5: DTO Models for Messaging & Reminders
- **Date:** `2026-09-12`
- **Goal:** Implement MessageRequest, MessageResponse, and ReminderScheduleDto.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/dto/
  git commit -m "feat(messaging-reminders): define DTO models for message payloads and reminder schedules"
  ```

#### Commit 6: JPA Repositories
- **Date:** `2026-09-13`
- **Goal:** Create MessageRepository and ReminderRepository interfaces with thread ordering.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/repository/
  git commit -m "feat(messaging-reminders): implement repositories for messages and reminder scheduling"
  ```

#### Commit 7: Simulated Notification Dispatcher
- **Date:** `2026-09-13`
- **Goal:** Build notification dispatch service supporting simulated SMS/In-App alerts.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/service/NotificationDispatcher.java
  git commit -m "feat(messaging-reminders): build NotificationDispatcher for simulated delivery alerts"
  ```

---

### 🔹 Phase C: Service Layer & REST Controllers (Sept 14 - Sept 15)

#### Commit 8: Messaging Service Engine
- **Date:** `2026-09-14`
- **Goal:** Implement secure messaging logic, unread count tracking, and recipient validation.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/service/MessagingService.java
  git commit -m "feat(messaging-reminders): implement MessagingService for secure conversation threads"
  ```

#### Commit 9: Reminder Scheduling Service
- **Date:** `2026-09-14`
- **Goal:** Create service for appointment reminders and daily diet check-in triggers.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/service/ReminderService.java
  git commit -m "feat(messaging-reminders): implement ReminderService for scheduled patient notifications"
  ```

#### Commit 10: Messages REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/messages` REST endpoints for fetching threads and sending messages.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/controller/MessagingController.java
  git commit -m "feat(messaging-reminders): create MessagingController REST endpoints"
  ```

#### Commit 11: Reminders REST Controller
- **Date:** `2026-09-15`
- **Goal:** Expose `/api/v1/reminders` endpoints for active reminder rules and status toggles.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/main/java/lk/sliit/nutricare/messagingreminders/controller/ReminderController.java
  git commit -m "feat(messaging-reminders): create ReminderController endpoints for reminder management"
  ```

---

### 🔹 Phase D: Frontend React Views & UI Components (Sept 16 - Sept 17)

#### Commit 12: Messaging UI Package Setup
- **Date:** `2026-09-16`
- **Goal:** Define frontend module export settings.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/frontend/package.json
  git commit -m "build(messaging-reminders-ui): configure package file for messaging UI"
  ```

#### Commit 13: Messaging & Reminders API Client
- **Date:** `2026-09-16`
- **Goal:** Add client API integration helper functions for messages and notifications.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/frontend/src/api/messagingApi.js
  git commit -m "feat(messaging-reminders-ui): implement API client methods for messaging and reminders"
  ```

#### Commit 14: Chat Conversation Inbox & Message Thread Component
- **Date:** `2026-09-17`
- **Goal:** Build React view for selecting contacts and displaying real-time chat threads.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/frontend/src/components/ChatInbox.jsx 05-messaging-reminders-IT25103601/frontend/src/components/MessageThread.jsx
  git commit -m "feat(messaging-reminders-ui): create ChatInbox and MessageThread view components"
  ```

#### Commit 15: Notification Center & Reminder Toast Component
- **Date:** `2026-09-17`
- **Goal:** Build notification drawer and reminder alert widget UI.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/frontend/src/components/NotificationCenter.jsx
  git commit -m "feat(messaging-reminders-ui): build NotificationCenter drawer and alert list"
  ```

---

### 🔹 Phase E: Testing, Integration & Final Merge (Sept 18 - Sept 19)

#### Commit 16: Messaging & Delivery Unit Tests
- **Date:** `2026-09-18`
- **Goal:** Write unit tests for MessagingService and NotificationDispatcher.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/backend/src/test/
  git commit -m "test(messaging-reminders): add unit tests for messaging service and delivery alerts"
  ```

#### Commit 17: Feature Integration Export
- **Date:** `2026-09-18`
- **Goal:** Export `MessagingRemindersFeature.jsx` for the integrated React app.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/frontend/src/MessagingRemindersFeature.jsx
  git commit -m "refactor(messaging-reminders-ui): export MessagingRemindersFeature for root UI shell"
  ```

#### Commit 18: Documentation & Contribution Log Finalization
- **Date:** `2026-09-19`
- **Goal:** Complete contribution record table and module documentation.
- **Commands:**
  ```bash
  git add 05-messaging-reminders-IT25103601/docs/CONTRIBUTION.md 05-messaging-reminders-IT25103601/README.md
  git commit -m "docs(messaging-reminders): update contribution log and test evidence documentation"
  ```

---

## 📌 Summary Checklist (Before Sept 19th Deadline)

- [ ] All 18 commits completed on your feature branch / repository.
- [ ] Backend test suite passes: `mvn -pl 05-messaging-reminders-IT25103601/backend -am test`.
- [ ] Integrated frontend builds cleanly: `npm run build`.
- [ ] Contribution table in `05-messaging-reminders-IT25103601/docs/CONTRIBUTION.md` updated with commit hashes.
