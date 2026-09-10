-- LEGACY MANUAL SCHEMA: DO NOT RUN AGAINST THE SPRING BOOT APPLICATION DATABASE.
-- This file uses INT identifiers and cascading deletes; the application uses UUID
-- identifiers and Flyway migrations under backend/src/main/resources/db/migration.
-- ============================================================================== 
-- NutriCare System Database Schema
-- Location: Sri Lanka
-- Currency: LKR
-- Engine: InnoDB
-- Charset: utf8mb4
-- ==============================================================================

DROP DATABASE IF EXISTS nutricare;
CREATE DATABASE nutricare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nutricare;

SET FOREIGN_KEY_CHECKS = 0;

-- ==============================================================================
-- DROP TABLES IN REVERSE DEPENDENCY ORDER
-- ==============================================================================
DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS secure_messages;
DROP TABLE IF EXISTS progress_logs;
DROP TABLE IF EXISTS diet_plans;
DROP TABLE IF EXISTS health_alerts;
DROP TABLE IF EXISTS health_checks;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS availability_slots;
DROP TABLE IF EXISTS user_accounts;

-- ==============================================================================
-- CREATE TABLES IN DEPENDENCY ORDER
-- ==============================================================================

-- 1. user_accounts
CREATE TABLE user_accounts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    locked TINYINT(1) NOT NULL DEFAULT 0,
    failed_attempts INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL
) ENGINE=InnoDB;

-- 2. availability_slots
CREATE TABLE availability_slots (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    practitioner_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    hold_expires_at DATETIME NULL,
    version INT NOT NULL DEFAULT 1,
    UNIQUE KEY uk_practitioner_time (practitioner_id, start_time),
    FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. appointments
CREATE TABLE appointments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slot_id INT NOT NULL,
    patient_id INT NOT NULL,
    practitioner_id INT NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_patient_id (patient_id),
    FOREIGN KEY (slot_id) REFERENCES availability_slots(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. invoices
CREATE TABLE invoices (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    appointment_id INT NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. payments
CREATE TABLE payments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    reference VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. health_checks
CREATE TABLE health_checks (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    practitioner_id INT NOT NULL,
    weight_kg DECIMAL(5, 2) NOT NULL,
    bmi DECIMAL(4, 2) NOT NULL,
    systolic INT NOT NULL,
    diastolic INT NOT NULL,
    blood_sugar DECIMAL(5, 2) NOT NULL,
    temperature DECIMAL(4, 2) NOT NULL,
    notes TEXT,
    recorded_at DATETIME NOT NULL,
    INDEX idx_patient_recorded (patient_id, recorded_at),
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. health_alerts
CREATE TABLE health_alerts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    health_check_id INT NOT NULL,
    patient_id INT NOT NULL,
    priority VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. diet_plans
CREATE TABLE diet_plans (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    dietitian_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    calorie_target INT NOT NULL,
    exclusions TEXT,
    meal_schedule TEXT,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_patient_id (patient_id),
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (dietitian_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. progress_logs
CREATE TABLE progress_logs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    diet_plan_id INT NULL,
    log_date DATE NOT NULL,
    weight_kg DECIMAL(5, 2) NOT NULL,
    bmi DECIMAL(4, 2) NOT NULL,
    water_glasses INT NOT NULL,
    meals_completed INT NOT NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_patient_date (patient_id, log_date),
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. secure_messages
CREATE TABLE secure_messages (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    patient_id INT NOT NULL,
    body TEXT NOT NULL,
    sent_at DATETIME NOT NULL,
    INDEX idx_patient_sent (patient_id, sent_at),
    FOREIGN KEY (sender_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. notifications
CREATE TABLE notifications (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    retry_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_status_retry (status, retry_at),
    FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. feedback
CREATE TABLE feedback (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    practitioner_id INT NOT NULL,
    appointment_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 13. complaints
CREATE TABLE complaints (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    feedback_id INT NOT NULL UNIQUE,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 14. audit_events
CREATE TABLE audit_events (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_id INT NULL,
    operation VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id INT NOT NULL,
    occurred_at DATETIME NOT NULL,
    INDEX idx_occurred_at (occurred_at),
    FOREIGN KEY (actor_id) REFERENCES user_accounts(id) ON DELETE SET NULL
) ENGINE=InnoDB;


-- ==============================================================================
-- INSERT DEMO DATA
-- ==============================================================================
START TRANSACTION;

-- 1. user_accounts
INSERT INTO user_accounts (id, full_name, email, password_hash, role, locked, failed_attempts, created_at) VALUES
(1, 'Amal Perera', 'patient@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT', 0, 0, '2026-08-01 08:00:00'),
(2, 'Ishara Jayasinghe', 'dietitian@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'DIETITIAN', 0, 0, '2026-08-01 08:05:00'),
(3, 'Chamara Fernando', 'doctor@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'DOCTOR', 0, 0, '2026-08-01 08:10:00'),
(4, 'Dilki Ranatunga', 'reception@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'RECEPTION_STAFF', 0, 0, '2026-08-01 08:15:00'),
(5, 'System Administrator', 'admin@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SYSTEM_ADMIN', 0, 0, '2026-08-01 08:20:00'),
(6, 'Nuwan Perera', 'manager@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'OPERATIONS_MANAGER', 0, 0, '2026-08-01 08:25:00'),
(7, 'Sahan Wickramasinghe', 'finance@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'FINANCE_EXECUTIVE', 0, 0, '2026-08-01 08:30:00'),
(8, 'Nadeesha Silva', 'patient2@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT', 0, 0, '2026-08-02 09:00:00'),
(9, 'Ruwan Jayasuriya', 'patient3@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT', 0, 0, '2026-08-03 10:00:00'),
(10, 'Kavindi Fonseka', 'dietitian2@nutricare.lk', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'DIETITIAN', 0, 0, '2026-08-04 11:00:00');

-- 2. availability_slots (practitioners 2,3,10 dates 2026-09-03 to 2026-09-06)
INSERT INTO availability_slots (id, practitioner_id, start_time, duration_minutes, status, hold_expires_at) VALUES
(1, 2, '2026-09-03 09:00:00', 60, 'BOOKED', NULL),
(2, 2, '2026-09-03 10:00:00', 60, 'AVAILABLE', NULL),
(3, 3, '2026-09-03 11:00:00', 60, 'BOOKED', NULL),
(4, 10, '2026-09-04 09:00:00', 60, 'HELD', '2026-09-03 20:00:00'),
(5, 2, '2026-09-04 10:00:00', 60, 'BOOKED', NULL),
(6, 3, '2026-09-04 14:00:00', 60, 'AVAILABLE', NULL),
(7, 10, '2026-09-05 09:00:00', 60, 'BOOKED', NULL),
(8, 2, '2026-09-05 11:00:00', 60, 'BOOKED', NULL),
(9, 3, '2026-09-05 13:00:00', 60, 'AVAILABLE', NULL),
(10, 10, '2026-09-06 10:00:00', 60, 'BOOKED', NULL),
(11, 2, '2026-09-06 12:00:00', 60, 'HELD', '2026-09-05 20:00:00'),
(12, 3, '2026-09-06 15:00:00', 60, 'AVAILABLE', NULL);

-- 3. appointments (patients 1,8,9 with practitioners 2,3,10)
INSERT INTO appointments (id, slot_id, patient_id, practitioner_id, service_type, status, created_at) VALUES
(1, 1, 1, 2, 'Initial consultation', 'COMPLETED', '2026-08-20 10:00:00'),
(2, 3, 8, 3, 'Health check-up', 'CONFIRMED', '2026-08-21 11:00:00'),
(3, 5, 9, 2, 'Diet follow-up', 'PENDING', '2026-08-22 12:00:00'),
(4, 7, 1, 10, 'Nutrition review', 'CONFIRMED', '2026-08-23 13:00:00'),
(5, 8, 8, 2, 'Initial consultation', 'CANCELLED', '2026-08-24 14:00:00'),
(6, 10, 9, 10, 'Health check-up', 'CONFIRMED', '2026-08-25 15:00:00'),
(7, 2, 1, 2, 'Diet follow-up', 'COMPLETED', '2026-08-26 16:00:00'),
(8, 6, 8, 3, 'Nutrition review', 'PENDING', '2026-08-27 17:00:00');

-- 4. invoices (6 rows)
INSERT INTO invoices (id, invoice_number, appointment_id, amount, status, created_at) VALUES
(1, 'INV-2026-0001', 1, 4500.00, 'PAID', '2026-08-20 10:05:00'),
(2, 'INV-2026-0002', 2, 3500.00, 'PENDING', '2026-08-21 11:05:00'),
(3, 'INV-2026-0003', 3, 2500.00, 'OVERDUE', '2026-08-22 12:05:00'),
(4, 'INV-2026-0004', 4, 3000.00, 'PAID', '2026-08-23 13:05:00'),
(5, 'INV-2026-0005', 6, 5000.00, 'PENDING', '2026-08-25 15:05:00'),
(6, 'INV-2026-0006', 7, 2800.00, 'PAID', '2026-08-26 16:05:00');

-- 5. payments (4 rows)
INSERT INTO payments (id, invoice_id, reference, amount, method, status, created_at) VALUES
(1, 1, 'PAY-2026-0001', 4500.00, 'CARD', 'COMPLETED', '2026-08-20 10:10:00'),
(2, 4, 'PAY-2026-0002', 3000.00, 'CASH', 'COMPLETED', '2026-08-23 13:10:00'),
(3, 6, 'PAY-2026-0003', 2800.00, 'BANK_TRANSFER', 'COMPLETED', '2026-08-26 16:10:00'),
(4, 2, 'PAY-2026-0004', 3500.00, 'CARD', 'PENDING', '2026-08-27 10:00:00');

-- 6. health_checks (10 rows, July-Sept 2026)
INSERT INTO health_checks (id, patient_id, practitioner_id, weight_kg, bmi, systolic, diastolic, blood_sugar, temperature, notes, recorded_at) VALUES
(1, 1, 3, 78.5, 27.2, 135, 88, 110.5, 36.8, 'Initial checkup, slightly overweight.', '2026-07-10 09:30:00'),
(2, 1, 3, 77.0, 26.6, 130, 85, 105.0, 36.6, 'Making progress.', '2026-08-10 09:30:00'),
(3, 1, 3, 75.5, 26.1, 125, 82, 98.5, 36.7, 'Good improvement.', '2026-09-01 09:30:00'),
(4, 8, 3, 65.0, 23.5, 120, 80, 95.0, 36.5, 'Healthy vitals.', '2026-07-15 10:00:00'),
(5, 8, 3, 64.5, 23.3, 118, 78, 92.5, 36.5, 'Maintained health.', '2026-08-15 10:00:00'),
(6, 9, 3, 85.0, 28.5, 145, 92, 148.0, 37.0, 'High blood sugar and pressure.', '2026-07-20 11:00:00'),
(7, 9, 3, 83.5, 28.0, 140, 90, 135.0, 36.9, 'Diet is helping, keep monitoring.', '2026-08-20 11:00:00'),
(8, 9, 3, 82.0, 27.5, 135, 85, 120.0, 36.8, 'Significant reduction in sugar levels.', '2026-09-02 11:00:00'),
(9, 1, 3, 74.0, 25.6, 122, 80, 95.0, 36.6, 'Looking very healthy now.', '2026-09-03 09:30:00'),
(10, 8, 3, 64.0, 23.1, 115, 75, 90.0, 36.4, 'Excellent condition.', '2026-09-03 10:30:00');

-- 7. health_alerts (4 rows)
INSERT INTO health_alerts (id, health_check_id, patient_id, priority, message, status, created_at) VALUES
(1, 1, 1, 'MEDIUM', 'Patient BMI and blood pressure are slightly elevated.', 'ACKNOWLEDGED', '2026-07-10 09:35:00'),
(2, 6, 9, 'HIGH', 'Urgent: High blood sugar and hypertension detected.', 'ACKNOWLEDGED', '2026-07-20 11:05:00'),
(3, 7, 9, 'MEDIUM', 'Blood sugar improving but still elevated.', 'ACTIVE', '2026-08-20 11:05:00'),
(4, 3, 1, 'LOW', 'Patient has reached near-normal blood pressure.', 'ACTIVE', '2026-09-01 09:35:00');

-- 8. diet_plans (4 rows)
INSERT INTO diet_plans (id, patient_id, dietitian_id, title, calorie_target, exclusions, meal_schedule, status, created_at) VALUES
(1, 1, 2, 'Weight management plan', 1800, 'Dairy, Processed Sugar', '3 meals, 2 snacks', 'ACTIVE', '2026-07-12 10:00:00'),
(2, 8, 10, 'High-protein recovery plan', 2200, 'Gluten', '4 meals', 'ACTIVE', '2026-07-18 11:00:00'),
(3, 9, 2, 'Low-sugar balanced plan', 1600, 'All added sugars, Red meat', '3 meals, strict portion control', 'ACTIVE', '2026-07-22 09:00:00'),
(4, 1, 10, 'Low sodium heart-healthy plan', 1700, 'High sodium foods', '3 meals', 'DRAFT', '2026-09-01 10:00:00');

-- 9. progress_logs (16 rows)
INSERT INTO progress_logs (id, patient_id, diet_plan_id, log_date, weight_kg, bmi, water_glasses, meals_completed, created_at) VALUES
(1, 1, 1, '2026-08-01', 78.0, 27.0, 6, 3, '2026-08-01 20:00:00'),
(2, 1, 1, '2026-08-08', 77.2, 26.7, 7, 3, '2026-08-08 20:00:00'),
(3, 1, 1, '2026-08-15', 76.5, 26.4, 8, 3, '2026-08-15 20:00:00'),
(4, 1, 1, '2026-08-22', 75.8, 26.2, 7, 2, '2026-08-22 20:00:00'),
(5, 8, 2, '2026-08-01', 65.0, 23.5, 8, 4, '2026-08-01 20:30:00'),
(6, 8, 2, '2026-08-08', 64.8, 23.4, 8, 4, '2026-08-08 20:30:00'),
(7, 8, 2, '2026-08-15', 64.5, 23.3, 7, 3, '2026-08-15 20:30:00'),
(8, 8, 2, '2026-08-22', 64.2, 23.2, 8, 4, '2026-08-22 20:30:00'),
(9, 9, 3, '2026-08-01', 84.5, 28.3, 5, 2, '2026-08-01 21:00:00'),
(10, 9, 3, '2026-08-08', 84.0, 28.2, 6, 3, '2026-08-08 21:00:00'),
(11, 9, 3, '2026-08-15', 83.2, 27.9, 7, 3, '2026-08-15 21:00:00'),
(12, 9, 3, '2026-08-22', 82.5, 27.7, 6, 3, '2026-08-22 21:00:00'),
(13, 1, 1, '2026-08-29', 75.0, 25.9, 8, 3, '2026-08-29 20:00:00'),
(14, 8, 2, '2026-08-29', 64.0, 23.1, 8, 4, '2026-08-29 20:30:00'),
(15, 9, 3, '2026-08-29', 82.0, 27.5, 7, 3, '2026-08-29 21:00:00'),
(16, 9, 3, '2026-09-02', 81.5, 27.3, 8, 3, '2026-09-02 21:00:00');

-- 10. secure_messages (8 rows)
INSERT INTO secure_messages (id, sender_id, recipient_id, patient_id, body, sent_at) VALUES
(1, 1, 2, 1, 'Hi Dr. Ishara, can I substitute almonds for walnuts in my diet plan?', '2026-08-13 09:00:00'),
(2, 2, 1, 1, 'Yes Amal, almonds are perfectly fine. Keep up the good work!', '2026-08-13 10:00:00'),
(3, 9, 3, 9, 'I am feeling a bit dizzy in the mornings since the new medication.', '2026-08-22 08:30:00'),
(4, 3, 9, 9, 'Please drink plenty of water. If it continues, come see me earlier.', '2026-08-22 09:15:00'),
(5, 8, 10, 8, 'Can I take protein shakes post-workout?', '2026-08-25 18:00:00'),
(6, 10, 8, 8, 'A plant-based protein shake is acceptable, but try to get protein from meals first.', '2026-08-26 08:00:00'),
(7, 4, 1, 1, 'Reminder: Your diet follow-up appointment is tomorrow at 9 AM.', '2026-09-02 10:00:00'),
(8, 1, 4, 1, 'Thank you, I will be there.', '2026-09-02 10:15:00');

-- 11. notifications (10 rows)
INSERT INTO notifications (id, recipient_id, type, channel, message, status, attempts, retry_at, created_at) VALUES
(1, 1, 'WELCOME', 'EMAIL', 'Welcome to NutriCare, Amal!', 'DELIVERED', 1, NULL, '2026-08-01 08:05:00'),
(2, 8, 'WELCOME', 'EMAIL', 'Welcome to NutriCare, Nadeesha!', 'DELIVERED', 1, NULL, '2026-08-02 09:05:00'),
(3, 9, 'WELCOME', 'EMAIL', 'Welcome to NutriCare, Ruwan!', 'DELIVERED', 1, NULL, '2026-08-03 10:05:00'),
(4, 1, 'DIET_PLAN_UPDATED', 'IN_APP', 'Your new diet plan is ready to view.', 'READ', 1, NULL, '2026-07-12 10:05:00'),
(5, 9, 'HEALTH_ALERT', 'SMS', 'Please check your recent health alert regarding blood sugar.', 'DELIVERED', 1, NULL, '2026-07-20 11:10:00'),
(6, 8, 'APPOINTMENT_REMINDER', 'SMS', 'Reminder: Health check-up appointment tomorrow.', 'DELIVERED', 1, NULL, '2026-08-20 11:00:00'),
(7, 9, 'PAYMENT_DUE', 'EMAIL', 'You have an overdue invoice INV-2026-0003.', 'PENDING', 2, '2026-09-04 10:00:00', '2026-08-30 08:00:00'),
(8, 1, 'APPOINTMENT_REMINDER', 'IN_APP', 'Upcoming appointment with Dr. Ishara.', 'READ', 1, NULL, '2026-09-02 08:00:00'),
(9, 9, 'DIET_PLAN_UPDATED', 'IN_APP', 'Adjustments made to your low-sugar plan.', 'DELIVERED', 1, NULL, '2026-08-21 09:00:00'),
(10, 8, 'PAYMENT_DUE', 'SMS', 'Please complete your pending payment for INV-2026-0002.', 'DELIVERED', 1, NULL, '2026-08-28 09:00:00');

-- 12. feedback (6 rows)
INSERT INTO feedback (id, patient_id, practitioner_id, appointment_id, rating, comments, created_at) VALUES
(1, 1, 2, 1, 5, 'Very helpful and attentive.', '2026-08-20 12:00:00'),
(2, 8, 3, 2, 4, 'Good doctor, but had to wait 15 mins.', '2026-08-21 14:00:00'),
(3, 9, 10, 6, 5, 'Thorough health check, great advice.', '2026-08-25 17:00:00'),
(4, 1, 2, 7, 5, 'Diet is working perfectly.', '2026-08-26 18:00:00'),
(5, 9, 2, 3, 2, 'Felt rushed during the follow-up, not all questions answered.', '2026-08-23 10:00:00'),
(6, 1, 10, 4, 1, 'Practitioner was rude and dismissive.', '2026-08-24 11:00:00');

-- 13. complaints (2 rows)
INSERT INTO complaints (id, feedback_id, priority, status, created_at) VALUES
(1, 5, 'MEDIUM', 'INVESTIGATING', '2026-08-23 11:00:00'),
(2, 6, 'HIGH', 'OPEN', '2026-08-24 12:00:00');

-- 14. audit_events (8 rows)
INSERT INTO audit_events (id, actor_id, operation, entity_type, entity_id, occurred_at) VALUES
(1, 5, 'REGISTER_USER', 'user_accounts', 1, '2026-08-01 08:00:00'),
(2, 1, 'LOGIN', 'user_accounts', 1, '2026-08-10 09:00:00'),
(3, 4, 'CREATE_APPOINTMENT', 'appointments', 1, '2026-08-15 10:00:00'),
(4, 2, 'CREATE_DIET_PLAN', 'diet_plans', 1, '2026-07-12 10:00:00'),
(5, 3, 'UPDATE_HEALTH_CHECK', 'health_checks', 6, '2026-07-20 11:00:00'),
(6, 9, 'SEND_MESSAGE', 'secure_messages', 3, '2026-08-22 08:30:00'),
(7, 1, 'SUBMIT_FEEDBACK', 'feedback', 1, '2026-08-20 12:00:00'),
(8, 7, 'PROCESS_PAYMENT', 'payments', 1, '2026-08-20 10:10:00');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
