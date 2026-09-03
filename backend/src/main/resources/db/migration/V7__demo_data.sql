-- Academic demo accounts. Password for every account: password
INSERT INTO user_accounts (id,full_name,email,password_hash,role,locked,failed_attempts,created_at) VALUES
(UNHEX(REPLACE('11111111-1111-1111-1111-111111111111','-','')),'Amal Perera','patient@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','PATIENT',FALSE,0,NOW()),
(UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')),'Ishara Jayasinghe','dietitian@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','DIETITIAN',FALSE,0,NOW()),
(UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')),'Chamara Fernando','doctor@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','DOCTOR',FALSE,0,NOW()),
(UNHEX(REPLACE('44444444-4444-4444-4444-444444444444','-','')),'Dilki Ranatunga','reception@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','RECEPTION_STAFF',FALSE,0,NOW()),
(UNHEX(REPLACE('55555555-5555-5555-5555-555555555555','-','')),'System Administrator','admin@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','SYSTEM_ADMIN',FALSE,0,NOW()),
(UNHEX(REPLACE('66666666-6666-6666-6666-666666666666','-','')),'Nuwan Perera','manager@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','OPERATIONS_MANAGER',FALSE,0,NOW()),
(UNHEX(REPLACE('77777777-7777-7777-7777-777777777777','-','')),'Sahan Wickramasinghe','finance@nutricare.demo','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','FINANCE_EXECUTIVE',FALSE,0,NOW());
INSERT INTO availability_slots (id,practitioner_id,start_time,duration_minutes,status,version) VALUES
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1','-','')),UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')),TIMESTAMP(CURRENT_DATE + INTERVAL 1 DAY,'09:00:00'),60,'AVAILABLE',0),
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2','-','')),UNHEX(REPLACE('33333333-3333-3333-3333-333333333333','-','')),TIMESTAMP(CURRENT_DATE + INTERVAL 1 DAY,'10:30:00'),60,'AVAILABLE',0),
(UNHEX(REPLACE('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3','-','')),UNHEX(REPLACE('22222222-2222-2222-2222-222222222222','-','')),TIMESTAMP(CURRENT_DATE + INTERVAL 1 DAY,'14:00:00'),60,'AVAILABLE',0);

