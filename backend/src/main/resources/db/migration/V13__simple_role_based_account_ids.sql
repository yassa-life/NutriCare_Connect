-- Give people simple, stable identifiers while preserving all related records.
-- Account examples: P001 patient, D001 doctor, DT001 dietitian, A001 admin.

ALTER TABLE appointments
  DROP FOREIGN KEY fk_appointment_patient,
  DROP FOREIGN KEY fk_appointment_practitioner;
ALTER TABLE availability_slots DROP FOREIGN KEY fk_slot_practitioner;
ALTER TABLE health_checks
  DROP FOREIGN KEY fk_health_patient,
  DROP FOREIGN KEY fk_health_practitioner;
ALTER TABLE health_alerts DROP FOREIGN KEY fk_alert_patient;
ALTER TABLE diet_plans
  DROP FOREIGN KEY fk_diet_patient,
  DROP FOREIGN KEY fk_diet_dietitian;
ALTER TABLE progress_logs DROP FOREIGN KEY fk_progress_patient;
ALTER TABLE secure_messages
  DROP FOREIGN KEY fk_message_sender,
  DROP FOREIGN KEY fk_message_recipient,
  DROP FOREIGN KEY fk_message_patient;
ALTER TABLE notifications DROP FOREIGN KEY fk_notification_recipient;
ALTER TABLE feedback
  DROP FOREIGN KEY fk_feedback_patient,
  DROP FOREIGN KEY fk_feedback_practitioner;
ALTER TABLE password_reset_otps DROP FOREIGN KEY fk_reset_user;

CREATE TABLE account_id_map (
  old_id VARCHAR(36) PRIMARY KEY,
  new_id VARCHAR(16) NOT NULL UNIQUE
);

INSERT INTO account_id_map (old_id, new_id)
SELECT id,
       CONCAT(
         CASE role
           WHEN 'PATIENT' THEN 'P'
           WHEN 'DOCTOR' THEN 'D'
           WHEN 'DIETITIAN' THEN 'DT'
           WHEN 'RECEPTION_STAFF' THEN 'R'
           WHEN 'SYSTEM_ADMIN' THEN 'A'
           WHEN 'OPERATIONS_MANAGER' THEN 'O'
           WHEN 'FINANCE_EXECUTIVE' THEN 'F'
           WHEN 'MEDICAL_CENTER_COORDINATOR' THEN 'C'
           WHEN 'PATIENT_RELATIONS_OFFICER' THEN 'PR'
         END,
         LPAD(ROW_NUMBER() OVER (PARTITION BY role ORDER BY created_at, id), 3, '0')
       )
FROM user_accounts;

UPDATE audit_events e LEFT JOIN account_id_map m ON e.actor_id = m.old_id
SET e.actor_id = m.new_id WHERE e.actor_id IS NOT NULL;
UPDATE audit_events e JOIN account_id_map m ON e.entity_type = 'USER' AND e.entity_id = m.old_id
SET e.entity_id = m.new_id;
UPDATE availability_slots x JOIN account_id_map m ON x.practitioner_id = m.old_id SET x.practitioner_id = m.new_id;
UPDATE appointments x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE appointments x JOIN account_id_map m ON x.practitioner_id = m.old_id SET x.practitioner_id = m.new_id;
UPDATE health_checks x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE health_checks x JOIN account_id_map m ON x.practitioner_id = m.old_id SET x.practitioner_id = m.new_id;
UPDATE health_alerts x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE diet_plans x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE diet_plans x JOIN account_id_map m ON x.dietitian_id = m.old_id SET x.dietitian_id = m.new_id;
UPDATE progress_logs x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE secure_messages x JOIN account_id_map m ON x.sender_id = m.old_id SET x.sender_id = m.new_id;
UPDATE secure_messages x JOIN account_id_map m ON x.recipient_id = m.old_id SET x.recipient_id = m.new_id;
UPDATE secure_messages x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE notifications x JOIN account_id_map m ON x.recipient_id = m.old_id SET x.recipient_id = m.new_id;
UPDATE feedback x JOIN account_id_map m ON x.patient_id = m.old_id SET x.patient_id = m.new_id;
UPDATE feedback x JOIN account_id_map m ON x.practitioner_id = m.old_id SET x.practitioner_id = m.new_id;
UPDATE password_reset_otps x JOIN account_id_map m ON x.user_id = m.old_id SET x.user_id = m.new_id;
UPDATE user_accounts x JOIN account_id_map m ON x.id = m.old_id SET x.id = m.new_id;

ALTER TABLE user_accounts MODIFY id VARCHAR(16) NOT NULL;
ALTER TABLE audit_events MODIFY actor_id VARCHAR(16) NULL;
ALTER TABLE availability_slots MODIFY practitioner_id VARCHAR(16) NOT NULL;
ALTER TABLE appointments
  MODIFY patient_id VARCHAR(16) NOT NULL,
  MODIFY practitioner_id VARCHAR(16) NOT NULL;
ALTER TABLE health_checks
  MODIFY patient_id VARCHAR(16) NOT NULL,
  MODIFY practitioner_id VARCHAR(16) NOT NULL;
ALTER TABLE health_alerts MODIFY patient_id VARCHAR(16) NOT NULL;
ALTER TABLE diet_plans
  MODIFY patient_id VARCHAR(16) NOT NULL,
  MODIFY dietitian_id VARCHAR(16) NOT NULL;
ALTER TABLE progress_logs MODIFY patient_id VARCHAR(16) NOT NULL;
ALTER TABLE secure_messages
  MODIFY sender_id VARCHAR(16) NOT NULL,
  MODIFY recipient_id VARCHAR(16) NOT NULL,
  MODIFY patient_id VARCHAR(16) NOT NULL;
ALTER TABLE notifications MODIFY recipient_id VARCHAR(16) NOT NULL;
ALTER TABLE feedback
  MODIFY patient_id VARCHAR(16) NOT NULL,
  MODIFY practitioner_id VARCHAR(16) NOT NULL;
ALTER TABLE password_reset_otps MODIFY user_id VARCHAR(16) NOT NULL;

CREATE TABLE account_id_counters (
  prefix VARCHAR(3) PRIMARY KEY,
  next_value INT NOT NULL
);
INSERT INTO account_id_counters (prefix, next_value) VALUES
  ('P', 1), ('D', 1), ('DT', 1), ('R', 1), ('A', 1),
  ('O', 1), ('F', 1), ('C', 1), ('PR', 1);
UPDATE account_id_counters c
JOIN (
  SELECT LEFT(new_id, LENGTH(new_id) - 3) AS prefix, COUNT(*) + 1 AS next_value
  FROM account_id_map GROUP BY LEFT(new_id, LENGTH(new_id) - 3)
) used_ids ON used_ids.prefix = c.prefix
SET c.next_value = used_ids.next_value;

DROP TABLE account_id_map;

ALTER TABLE availability_slots
  ADD CONSTRAINT fk_slot_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE appointments
  ADD CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_appointment_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE health_checks
  ADD CONSTRAINT fk_health_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_health_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE health_alerts
  ADD CONSTRAINT fk_alert_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE diet_plans
  ADD CONSTRAINT fk_diet_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_diet_dietitian FOREIGN KEY (dietitian_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE progress_logs
  ADD CONSTRAINT fk_progress_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE secure_messages
  ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_message_recipient FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_message_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE notifications
  ADD CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE feedback
  ADD CONSTRAINT fk_feedback_patient FOREIGN KEY (patient_id) REFERENCES user_accounts(id) ON DELETE RESTRICT,
  ADD CONSTRAINT fk_feedback_practitioner FOREIGN KEY (practitioner_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
ALTER TABLE password_reset_otps
  ADD CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE RESTRICT;
