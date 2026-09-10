ALTER TABLE user_accounts
  ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT FALSE AFTER enabled;

CREATE TABLE password_reset_otps (
  id BINARY(16) PRIMARY KEY,
  user_id BINARY(16) NOT NULL,
  otp_hash VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP(6) NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP(6) NOT NULL,
  INDEX idx_reset_user_created (user_id, created_at),
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE RESTRICT
);

CREATE TABLE email_delivery_attempts (
  id BINARY(16) PRIMARY KEY,
  recipient_email VARCHAR(190) NOT NULL,
  template VARCHAR(80) NOT NULL,
  status VARCHAR(30) NOT NULL,
  message_preview VARCHAR(500) NOT NULL,
  created_at TIMESTAMP(6) NOT NULL,
  INDEX idx_email_status_created (status, created_at)
);

UPDATE user_accounts
SET must_change_password = TRUE, updated_at = NOW(6)
WHERE role NOT IN ('PATIENT', 'SYSTEM_ADMIN');

INSERT INTO password_reset_otps
  (id, user_id, otp_hash, expires_at, used, attempts, created_at)
VALUES
  (UNHEX(REPLACE('71000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
   DATE_SUB(NOW(6), INTERVAL 1 DAY), TRUE, 0, DATE_SUB(NOW(6), INTERVAL 1 DAY));

INSERT INTO email_delivery_attempts
  (id, recipient_email, template, status, message_preview, created_at)
VALUES
  (UNHEX(REPLACE('72000000-0000-0000-0000-000000000001','-','')),
   'patient@nutricare.demo', 'WELCOME', 'SIMULATED_DELIVERED',
   'A fictional welcome email was processed.', DATE_SUB(NOW(6), INTERVAL 10 DAY));
