ALTER TABLE user_accounts
  ADD COLUMN phone_number VARCHAR(30) NULL AFTER email,
  ADD COLUMN date_of_birth DATE NULL AFTER phone_number,
  ADD COLUMN address VARCHAR(500) NULL AFTER date_of_birth,
  ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER role,
  ADD COLUMN updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) AFTER created_at;

ALTER TABLE availability_slots
  ADD CONSTRAINT fk_slot_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE appointments
  ADD CONSTRAINT fk_appointment_slot FOREIGN KEY (slot_id) REFERENCES availability_slots(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_appointment_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE invoices
  ADD CONSTRAINT fk_invoice_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT;
ALTER TABLE payments
  ADD CONSTRAINT fk_payment_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE RESTRICT;

ALTER TABLE health_checks
  ADD CONSTRAINT fk_health_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_health_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE health_alerts
  ADD CONSTRAINT fk_alert_check FOREIGN KEY (health_check_id) REFERENCES health_checks(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_alert_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;

ALTER TABLE diet_plans
  ADD CONSTRAINT fk_diet_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_diet_dietitian FOREIGN KEY (dietitian_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE progress_logs
  ADD CONSTRAINT fk_progress_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_progress_plan FOREIGN KEY (diet_plan_id) REFERENCES diet_plans(id) ON DELETE RESTRICT;

ALTER TABLE secure_messages
  ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_message_recipient FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_message_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE notifications
  ADD CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;

ALTER TABLE feedback
  ADD CONSTRAINT fk_feedback_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_feedback_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_feedback_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT;
ALTER TABLE complaints
  ADD CONSTRAINT fk_complaint_feedback FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE RESTRICT;

INSERT INTO user_accounts (id, full_name, email, password_hash, role, enabled, locked, failed_attempts, created_at, updated_at) VALUES
(UNHEX(REPLACE('88888888-8888-8888-8888-888888888888','-','')), 'Medical Center Coordinator', 'coordinator@nutricare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'MEDICAL_CENTER_COORDINATOR', TRUE, FALSE, 0, NOW(), NOW()),
(UNHEX(REPLACE('99999999-9999-9999-9999-999999999999','-','')), 'Patient Relations Officer', 'relations@nutricare.demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT_RELATIONS_OFFICER', TRUE, FALSE, 0, NOW(), NOW());
