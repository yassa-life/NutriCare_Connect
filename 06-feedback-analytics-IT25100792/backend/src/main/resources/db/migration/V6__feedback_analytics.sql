CREATE TABLE feedback (id BINARY(16) PRIMARY KEY, patient_id BINARY(16) NOT NULL, practitioner_id BINARY(16) NOT NULL, appointment_id BINARY(16) NOT NULL, rating INT NOT NULL, comments VARCHAR(1500), created_at TIMESTAMP(6) NOT NULL, CONSTRAINT ck_feedback_rating CHECK (rating BETWEEN 1 AND 5));
CREATE TABLE complaints (id BINARY(16) PRIMARY KEY, feedback_id BINARY(16) NOT NULL UNIQUE, priority VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL, created_at TIMESTAMP(6) NOT NULL);

