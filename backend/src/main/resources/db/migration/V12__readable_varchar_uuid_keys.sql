-- UUIDs were originally stored as BINARY(16). Keep the same stable identifiers,
-- but expose them as readable VARCHAR(36) values for MySQL Workbench and coursework.

ALTER TABLE appointments DROP FOREIGN KEY fk_appointment_slot,
  DROP FOREIGN KEY fk_appointment_patient,
  DROP FOREIGN KEY fk_appointment_practitioner;
ALTER TABLE availability_slots DROP FOREIGN KEY fk_slot_practitioner;
ALTER TABLE invoices DROP FOREIGN KEY fk_invoice_appointment;
ALTER TABLE payments DROP FOREIGN KEY fk_payment_invoice;
ALTER TABLE health_checks DROP FOREIGN KEY fk_health_patient,
  DROP FOREIGN KEY fk_health_practitioner;
ALTER TABLE health_alerts DROP FOREIGN KEY fk_alert_check,
  DROP FOREIGN KEY fk_alert_patient;
ALTER TABLE diet_plans DROP FOREIGN KEY fk_diet_patient,
  DROP FOREIGN KEY fk_diet_dietitian;
ALTER TABLE progress_logs DROP FOREIGN KEY fk_progress_patient,
  DROP FOREIGN KEY fk_progress_plan;
ALTER TABLE secure_messages DROP FOREIGN KEY fk_message_sender,
  DROP FOREIGN KEY fk_message_recipient,
  DROP FOREIGN KEY fk_message_patient;
ALTER TABLE notifications DROP FOREIGN KEY fk_notification_recipient;
ALTER TABLE feedback DROP FOREIGN KEY fk_feedback_patient,
  DROP FOREIGN KEY fk_feedback_practitioner,
  DROP FOREIGN KEY fk_feedback_appointment;
ALTER TABLE complaints DROP FOREIGN KEY fk_complaint_feedback;
ALTER TABLE password_reset_otps DROP FOREIGN KEY fk_reset_user;

-- VARBINARY(36) is an intermediate form: widening preserves the original 16
-- bytes, then BIN_TO_UUID converts them to canonical text before VARCHAR.
ALTER TABLE user_accounts MODIFY id VARBINARY(36) NOT NULL;
UPDATE user_accounts SET id = LOWER(BIN_TO_UUID(id));
ALTER TABLE user_accounts MODIFY id VARCHAR(36) NOT NULL;

ALTER TABLE audit_events
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY actor_id VARBINARY(36) NULL;
UPDATE audit_events SET
  id = LOWER(BIN_TO_UUID(id)),
  actor_id = IF(actor_id IS NULL, NULL, LOWER(BIN_TO_UUID(actor_id)));
ALTER TABLE audit_events
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY actor_id VARCHAR(36) NULL;

ALTER TABLE availability_slots
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY practitioner_id VARBINARY(36) NOT NULL;
UPDATE availability_slots SET
  id = LOWER(BIN_TO_UUID(id)), practitioner_id = LOWER(BIN_TO_UUID(practitioner_id));
ALTER TABLE availability_slots
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY practitioner_id VARCHAR(36) NOT NULL;

ALTER TABLE appointments
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY slot_id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL,
  MODIFY practitioner_id VARBINARY(36) NOT NULL;
UPDATE appointments SET
  id = LOWER(BIN_TO_UUID(id)),
  slot_id = LOWER(BIN_TO_UUID(slot_id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id)),
  practitioner_id = LOWER(BIN_TO_UUID(practitioner_id));
ALTER TABLE appointments
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY slot_id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL,
  MODIFY practitioner_id VARCHAR(36) NOT NULL;

ALTER TABLE invoices
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY appointment_id VARBINARY(36) NOT NULL;
UPDATE invoices SET
  id = LOWER(BIN_TO_UUID(id)), appointment_id = LOWER(BIN_TO_UUID(appointment_id));
ALTER TABLE invoices
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY appointment_id VARCHAR(36) NOT NULL;

ALTER TABLE payments
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY invoice_id VARBINARY(36) NOT NULL;
UPDATE payments SET
  id = LOWER(BIN_TO_UUID(id)), invoice_id = LOWER(BIN_TO_UUID(invoice_id));
ALTER TABLE payments
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY invoice_id VARCHAR(36) NOT NULL;

ALTER TABLE health_checks
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL,
  MODIFY practitioner_id VARBINARY(36) NOT NULL;
UPDATE health_checks SET
  id = LOWER(BIN_TO_UUID(id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id)),
  practitioner_id = LOWER(BIN_TO_UUID(practitioner_id));
ALTER TABLE health_checks
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL,
  MODIFY practitioner_id VARCHAR(36) NOT NULL;

ALTER TABLE health_alerts
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY health_check_id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL;
UPDATE health_alerts SET
  id = LOWER(BIN_TO_UUID(id)),
  health_check_id = LOWER(BIN_TO_UUID(health_check_id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id));
ALTER TABLE health_alerts
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY health_check_id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL;

ALTER TABLE diet_plans
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL,
  MODIFY dietitian_id VARBINARY(36) NOT NULL;
UPDATE diet_plans SET
  id = LOWER(BIN_TO_UUID(id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id)),
  dietitian_id = LOWER(BIN_TO_UUID(dietitian_id));
ALTER TABLE diet_plans
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL,
  MODIFY dietitian_id VARCHAR(36) NOT NULL;

ALTER TABLE progress_logs
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL,
  MODIFY diet_plan_id VARBINARY(36) NULL;
UPDATE progress_logs SET
  id = LOWER(BIN_TO_UUID(id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id)),
  diet_plan_id = IF(diet_plan_id IS NULL, NULL, LOWER(BIN_TO_UUID(diet_plan_id)));
ALTER TABLE progress_logs
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL,
  MODIFY diet_plan_id VARCHAR(36) NULL;

ALTER TABLE secure_messages
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY sender_id VARBINARY(36) NOT NULL,
  MODIFY recipient_id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL;
UPDATE secure_messages SET
  id = LOWER(BIN_TO_UUID(id)),
  sender_id = LOWER(BIN_TO_UUID(sender_id)),
  recipient_id = LOWER(BIN_TO_UUID(recipient_id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id));
ALTER TABLE secure_messages
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY sender_id VARCHAR(36) NOT NULL,
  MODIFY recipient_id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL;

ALTER TABLE notifications
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY recipient_id VARBINARY(36) NOT NULL;
UPDATE notifications SET
  id = LOWER(BIN_TO_UUID(id)), recipient_id = LOWER(BIN_TO_UUID(recipient_id));
ALTER TABLE notifications
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY recipient_id VARCHAR(36) NOT NULL;

ALTER TABLE feedback
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY patient_id VARBINARY(36) NOT NULL,
  MODIFY practitioner_id VARBINARY(36) NOT NULL,
  MODIFY appointment_id VARBINARY(36) NOT NULL;
UPDATE feedback SET
  id = LOWER(BIN_TO_UUID(id)),
  patient_id = LOWER(BIN_TO_UUID(patient_id)),
  practitioner_id = LOWER(BIN_TO_UUID(practitioner_id)),
  appointment_id = LOWER(BIN_TO_UUID(appointment_id));
ALTER TABLE feedback
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY patient_id VARCHAR(36) NOT NULL,
  MODIFY practitioner_id VARCHAR(36) NOT NULL,
  MODIFY appointment_id VARCHAR(36) NOT NULL;

ALTER TABLE complaints
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY feedback_id VARBINARY(36) NOT NULL;
UPDATE complaints SET
  id = LOWER(BIN_TO_UUID(id)), feedback_id = LOWER(BIN_TO_UUID(feedback_id));
ALTER TABLE complaints
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY feedback_id VARCHAR(36) NOT NULL;

ALTER TABLE password_reset_otps
  MODIFY id VARBINARY(36) NOT NULL,
  MODIFY user_id VARBINARY(36) NOT NULL;
UPDATE password_reset_otps SET
  id = LOWER(BIN_TO_UUID(id)), user_id = LOWER(BIN_TO_UUID(user_id));
ALTER TABLE password_reset_otps
  MODIFY id VARCHAR(36) NOT NULL,
  MODIFY user_id VARCHAR(36) NOT NULL;

ALTER TABLE email_delivery_attempts MODIFY id VARBINARY(36) NOT NULL;
UPDATE email_delivery_attempts SET id = LOWER(BIN_TO_UUID(id));
ALTER TABLE email_delivery_attempts MODIFY id VARCHAR(36) NOT NULL;

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
ALTER TABLE password_reset_otps
  ADD CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
