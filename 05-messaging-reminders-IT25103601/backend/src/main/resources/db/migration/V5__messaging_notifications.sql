CREATE TABLE secure_messages (id BINARY(16) PRIMARY KEY, sender_id BINARY(16) NOT NULL, recipient_id BINARY(16) NOT NULL, patient_id BINARY(16) NOT NULL, body VARCHAR(2000) NOT NULL, sent_at TIMESTAMP(6) NOT NULL, INDEX idx_messages_patient(patient_id,sent_at));
CREATE TABLE notifications (id BINARY(16) PRIMARY KEY, recipient_id BINARY(16) NOT NULL, type VARCHAR(50) NOT NULL, channel VARCHAR(20) NOT NULL, message VARCHAR(500) NOT NULL, status VARCHAR(30) NOT NULL, attempts INT NOT NULL, retry_at TIMESTAMP(6), created_at TIMESTAMP(6) NOT NULL, INDEX idx_notification_retry(status,retry_at));

