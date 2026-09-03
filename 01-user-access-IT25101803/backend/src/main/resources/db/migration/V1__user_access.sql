CREATE TABLE user_accounts (id BINARY(16) PRIMARY KEY, full_name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL UNIQUE, password_hash VARCHAR(100) NOT NULL, role VARCHAR(50) NOT NULL, locked BOOLEAN NOT NULL DEFAULT FALSE, failed_attempts INT NOT NULL DEFAULT 0, created_at TIMESTAMP(6) NOT NULL);
CREATE TABLE audit_events (id BINARY(16) PRIMARY KEY, actor_id BINARY(16), operation VARCHAR(80) NOT NULL, entity_type VARCHAR(80) NOT NULL, entity_id VARCHAR(80), occurred_at TIMESTAMP(6) NOT NULL, INDEX idx_audit_time (occurred_at));

