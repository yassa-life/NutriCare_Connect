-- Complete fictional dataset for local demonstrations. No real patient data is included.

UPDATE user_accounts SET phone_number = '+94 77 000 0001', date_of_birth = '1998-04-12',
  address = '12 Lake View Road, Colombo', updated_at = NOW() WHERE email = 'patient@nutricare.demo';
UPDATE user_accounts SET phone_number = '+94 77 000 0002', address = 'NutriCare Main Centre, Colombo', updated_at = NOW()
  WHERE email = 'dietitian@nutricare.demo';
UPDATE user_accounts SET phone_number = '+94 77 000 0003', address = 'NutriCare Main Centre, Colombo', updated_at = NOW()
  WHERE email = 'doctor@nutricare.demo';

INSERT INTO user_accounts
  (id, full_name, email, phone_number, date_of_birth, address, password_hash, role, enabled, locked, failed_attempts, created_at, updated_at)
VALUES
  (UNHEX(REPLACE('10101010-1010-1010-1010-101010101010','-','')), 'Nadeesha Silva', 'patient2@nutricare.demo',
   '+94 77 000 0010', '1994-11-08', '45 Temple Road, Kandy',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PATIENT', TRUE, FALSE, 0,
   DATE_SUB(NOW(6), INTERVAL 90 DAY), NOW(6));

INSERT INTO audit_events (id, actor_id, operation, entity_type, entity_id, occurred_at) VALUES
  (UNHEX(REPLACE('91000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')), 'LOGIN_SUCCESS', 'USER_ACCOUNT',
   '11111111-1111-1111-1111-111111111111', DATE_SUB(NOW(6), INTERVAL 2 HOUR)),
  (UNHEX(REPLACE('91000000-0000-0000-0000-000000000002','-','')),
   UNHEX(REPLACE('55555555-5555-5555-5555-555555555555','-','')), 'ACCOUNT_ENABLED', 'USER_ACCOUNT',
   '10101010-1010-1010-1010-101010101010', DATE_SUB(NOW(6), INTERVAL 1 DAY));

INSERT INTO availability_slots (id, practitioner_id, start_time, duration_minutes, status, hold_expires_at, version) VALUES
  (UNHEX(REPLACE('a9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')), DATE_SUB(NOW(6), INTERVAL 14 DAY), 60, 'BOOKED', NULL, 1),
  (UNHEX(REPLACE('a9000000-0000-0000-0000-000000000002','-','')),
   UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')), DATE_ADD(NOW(6), INTERVAL 3 DAY), 45, 'AVAILABLE', NULL, 0);

INSERT INTO appointments (id, slot_id, patient_id, practitioner_id, service_type, status, created_at) VALUES
  (UNHEX(REPLACE('b9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('a9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')), 'HEALTH_CHECK', 'COMPLETED',
   DATE_SUB(NOW(6), INTERVAL 16 DAY));

INSERT INTO invoices (id, invoice_number, appointment_id, amount, status, created_at) VALUES
  (UNHEX(REPLACE('c9000000-0000-0000-0000-000000000001','-','')), 'NC-DEMO-0001',
   UNHEX(REPLACE('b9000000-0000-0000-0000-000000000001','-','')), 4500.00, 'PAID',
   DATE_SUB(NOW(6), INTERVAL 16 DAY));

INSERT INTO payments (id, invoice_id, reference, amount, method, status, created_at) VALUES
  (UNHEX(REPLACE('d9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('c9000000-0000-0000-0000-000000000001','-','')), 'DEMO-PAY-0001', 4500.00,
   'DEMO_CARD', 'SUCCESS', DATE_SUB(NOW(6), INTERVAL 16 DAY));

INSERT INTO health_checks
  (id, patient_id, practitioner_id, weight_kg, bmi, systolic, diastolic, blood_sugar, temperature, notes, recorded_at)
VALUES
  (UNHEX(REPLACE('e9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')), 78.40, 26.10, 146, 92, 151.00, 36.70,
   'Fictional baseline check for the academic demo.', DATE_SUB(NOW(6), INTERVAL 14 DAY)),
  (UNHEX(REPLACE('e9000000-0000-0000-0000-000000000002','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')), 76.90, 25.60, 132, 84, 126.00, 36.60,
   'Fictional follow-up showing improvement.', DATE_SUB(NOW(6), INTERVAL 2 DAY));

INSERT INTO health_alerts (id, health_check_id, patient_id, priority, message, status, created_at) VALUES
  (UNHEX(REPLACE('f9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('e9000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')), 'HIGH',
   'Demo blood sugar threshold exceeded; clinician review required.', 'OPEN', DATE_SUB(NOW(6), INTERVAL 14 DAY));

INSERT INTO diet_plans
  (id, patient_id, dietitian_id, title, calorie_target, exclusions, meal_schedule, status, created_at)
VALUES
  (UNHEX(REPLACE('19000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')), 'Balanced Sri Lankan Starter Plan', 1900,
   'Fictional preference: no shellfish',
   'Breakfast: oats and fruit; Lunch: red rice, vegetables and protein; Dinner: vegetable roti and dhal; Snacks: fruit or curd',
   'PUBLISHED', DATE_SUB(NOW(6), INTERVAL 12 DAY));

INSERT INTO progress_logs
  (id, patient_id, diet_plan_id, log_date, weight_kg, bmi, water_glasses, meals_completed, created_at)
VALUES
  (UNHEX(REPLACE('29000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('19000000-0000-0000-0000-000000000001','-','')), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY),
   78.10, 26.00, 6, 3, DATE_SUB(NOW(6), INTERVAL 6 DAY)),
  (UNHEX(REPLACE('29000000-0000-0000-0000-000000000002','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('19000000-0000-0000-0000-000000000001','-','')), DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY),
   77.40, 25.80, 8, 4, DATE_SUB(NOW(6), INTERVAL 3 DAY)),
  (UNHEX(REPLACE('29000000-0000-0000-0000-000000000003','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('19000000-0000-0000-0000-000000000001','-','')), CURRENT_DATE,
   76.90, 25.60, 7, 4, NOW(6));

INSERT INTO secure_messages (id, sender_id, recipient_id, patient_id, body, sent_at) VALUES
  (UNHEX(REPLACE('39000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')), 'Could you confirm my next meal-plan review?',
   DATE_SUB(NOW(6), INTERVAL 5 HOUR)),
  (UNHEX(REPLACE('39000000-0000-0000-0000-000000000002','-','')),
   UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')), 'Your fictional demo review is scheduled for Friday.',
   DATE_SUB(NOW(6), INTERVAL 4 HOUR));

INSERT INTO notifications
  (id, recipient_id, type, channel, message, status, attempts, retry_at, created_at)
VALUES
  (UNHEX(REPLACE('49000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')), 'DIET_PLAN_PUBLISHED', 'IN_APP',
   'Your Balanced Sri Lankan Starter Plan is ready.', 'DELIVERED', 1, NULL, DATE_SUB(NOW(6), INTERVAL 12 DAY)),
  (UNHEX(REPLACE('49000000-0000-0000-0000-000000000002','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')), 'APPOINTMENT_REMINDER', 'SMS',
   'Demo reminder delivery awaiting retry.', 'FAILED', 1, DATE_ADD(NOW(6), INTERVAL 5 MINUTE), NOW(6));

INSERT INTO feedback (id, patient_id, practitioner_id, appointment_id, rating, comments, created_at) VALUES
  (UNHEX(REPLACE('59000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),
   UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')),
   UNHEX(REPLACE('b9000000-0000-0000-0000-000000000001','-','')), 2,
   'Fictional low rating used to demonstrate complaint escalation.', DATE_SUB(NOW(6), INTERVAL 1 DAY));

INSERT INTO complaints (id, feedback_id, priority, status, created_at) VALUES
  (UNHEX(REPLACE('69000000-0000-0000-0000-000000000001','-','')),
   UNHEX(REPLACE('59000000-0000-0000-0000-000000000001','-','')), 'HIGH', 'OPEN', DATE_SUB(NOW(6), INTERVAL 1 DAY));
