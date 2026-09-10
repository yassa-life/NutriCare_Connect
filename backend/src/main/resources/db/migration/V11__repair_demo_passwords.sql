-- The earlier sample hash did not match the documented local password.
-- Rotate fictional *.demo accounts to a verified BCrypt hash for "password".
UPDATE user_accounts
SET password_hash = '$2a$10$yUQYFER9o3ppcexEwAW0PufJPeeyW2SNog2ufr7WqXXT4LoWbR/wK',
    failed_attempts = 0,
    locked = FALSE,
    updated_at = NOW(6)
WHERE email LIKE '%@nutricare.demo';
