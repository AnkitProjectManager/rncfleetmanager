-- RNCFleets MySQL Sample Data Insert
-- Run this AFTER schema.sql to populate with 10 sets of realistic data

USE rncfleets;

-- ============= INSERT COMPANIES =============
INSERT INTO companies (id, name, admin_id, subscription_tier, created_at) VALUES
('company-demo-1', 'TransLog Solutions', 'admin-demo-1', 'professional', DATE_SUB(NOW(), INTERVAL 180 DAY)),
('company-demo-2', 'Metro Delivery Services', 'admin-demo-2', 'enterprise', DATE_SUB(NOW(), INTERVAL 240 DAY)),
('company-demo-3', 'FastTrack Logistics', 'admin-demo-3', 'basic', DATE_SUB(NOW(), INTERVAL 90 DAY)),
('company-demo-4', 'Prime Transport', 'admin-demo-4', 'professional', DATE_SUB(NOW(), INTERVAL 150 DAY)),
('company-demo-5', 'Global Freight Co', 'admin-demo-5', 'enterprise', DATE_SUB(NOW(), INTERVAL 200 DAY)),
('company-demo-6', 'City Couriers', 'admin-demo-6', 'basic', DATE_SUB(NOW(), INTERVAL 60 DAY)),
('company-demo-7', 'Express Cargo Ltd', 'admin-demo-7', 'professional', DATE_SUB(NOW(), INTERVAL 120 DAY)),
('company-demo-8', 'Swift Movers', 'admin-demo-8', 'basic', DATE_SUB(NOW(), INTERVAL 45 DAY)),
('company-demo-9', 'Reliable Routes', 'admin-demo-9', 'enterprise', DATE_SUB(NOW(), INTERVAL 270 DAY)),
('company-demo-10', 'NextDay Delivery', 'admin-demo-10', 'professional', DATE_SUB(NOW(), INTERVAL 100 DAY));

-- ============= INSERT ADMINS =============
INSERT INTO admins (id, email, password, name, role, company_id, created_at) VALUES
('admin-super-1', 'superadmin@rncfleets.com', 'admin123', 'Super Admin', 'superadmin', NULL, DATE_SUB(NOW(), INTERVAL 365 DAY)),
('admin-demo-1', 'admin@translog.com', 'admin123', 'Sarah Johnson', 'admin', 'company-demo-1', DATE_SUB(NOW(), INTERVAL 180 DAY)),
('admin-demo-2', 'admin@metrodelivery.com', 'admin123', 'Mike Chen', 'admin', 'company-demo-2', DATE_SUB(NOW(), INTERVAL 240 DAY)),
('admin-demo-3', 'admin@fasttrack.com', 'admin123', 'Emily Rodriguez', 'admin', 'company-demo-3', DATE_SUB(NOW(), INTERVAL 90 DAY)),
('admin-demo-4', 'admin@primetransport.com', 'admin123', 'James Wilson', 'admin', 'company-demo-4', DATE_SUB(NOW(), INTERVAL 150 DAY)),
('admin-demo-5', 'admin@globalfreight.com', 'admin123', 'Lisa Anderson', 'admin', 'company-demo-5', DATE_SUB(NOW(), INTERVAL 200 DAY)),
('admin-demo-6', 'admin@citycouriers.com', 'admin123', 'David Martinez', 'admin', 'company-demo-6', DATE_SUB(NOW(), INTERVAL 60 DAY)),
('admin-demo-7', 'admin@expresscargo.com', 'admin123', 'Rachel Kim', 'admin', 'company-demo-7', DATE_SUB(NOW(), INTERVAL 120 DAY)),
('admin-demo-8', 'admin@swiftmovers.com', 'admin123', 'Tom Brown', 'admin', 'company-demo-8', DATE_SUB(NOW(), INTERVAL 45 DAY)),
('admin-demo-9', 'admin@reliableroutes.com', 'admin123', 'Nina Patel', 'admin', 'company-demo-9', DATE_SUB(NOW(), INTERVAL 270 DAY)),
('admin-demo-10', 'admin@nextdaydelivery.com', 'admin123', 'Alex Thompson', 'admin', 'company-demo-10', DATE_SUB(NOW(), INTERVAL 100 DAY));

-- ============= INSERT VEHICLES (10 per company = 100 total) =============
-- Company 1 vehicles
INSERT INTO vehicles (id, company_id, make, model, year, vin, license_plate, odometer, status, insurance_expiry_date, registration_expiry_date, next_service_date, next_tire_change_km, next_oil_change_date, created_at) VALUES
('vehicle-1-1', 'company-demo-1', 'Toyota', 'Hiace', 2022, 'VIN1001', 'TL-1001', 45000, 'active', DATE_ADD(NOW(), INTERVAL 120 DAY), DATE_ADD(NOW(), INTERVAL 300 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 50000, DATE_ADD(NOW(), INTERVAL 45 DAY), DATE_SUB(NOW(), INTERVAL 150 DAY)),
('vehicle-1-2', 'company-demo-1', 'Ford', 'Transit', 2021, 'VIN1002', 'TL-1002', 62000, 'active', DATE_ADD(NOW(), INTERVAL 90 DAY), DATE_ADD(NOW(), INTERVAL 200 DAY), DATE_ADD(NOW(), INTERVAL 15 DAY), 65000, DATE_ADD(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 180 DAY)),
('vehicle-1-3', 'company-demo-1', 'Mercedes-Benz', 'Sprinter', 2023, 'VIN1003', 'TL-1003', 28000, 'active', DATE_ADD(NOW(), INTERVAL 180 DAY), DATE_ADD(NOW(), INTERVAL 330 DAY), DATE_ADD(NOW(), INTERVAL 40 DAY), 75000, DATE_ADD(NOW(), INTERVAL 50 DAY), DATE_SUB(NOW(), INTERVAL 90 DAY)),
('vehicle-1-4', 'company-demo-1', 'Nissan', 'NV3500', 2020, 'VIN1004', 'TL-1004', 85000, 'maintenance', DATE_ADD(NOW(), INTERVAL 60 DAY), DATE_ADD(NOW(), INTERVAL 150 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY), 90000, DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 200 DAY)),
('vehicle-1-5', 'company-demo-1', 'RAM', 'ProMaster', 2022, 'VIN1005', 'TL-1005', 35000, 'active', DATE_ADD(NOW(), INTERVAL 150 DAY), DATE_ADD(NOW(), INTERVAL 280 DAY), DATE_ADD(NOW(), INTERVAL 25 DAY), 80000, DATE_ADD(NOW(), INTERVAL 35 DAY), DATE_SUB(NOW(), INTERVAL 120 DAY)),
('vehicle-1-6', 'company-demo-1', 'Chevrolet', 'Express', 2021, 'VIN1006', 'TL-1006', 52000, 'active', DATE_ADD(NOW(), INTERVAL 100 DAY), DATE_ADD(NOW(), INTERVAL 220 DAY), DATE_ADD(NOW(), INTERVAL 18 DAY), 55000, DATE_ADD(NOW(), INTERVAL 28 DAY), DATE_SUB(NOW(), INTERVAL 160 DAY)),
('vehicle-1-7', 'company-demo-1', 'GMC', 'Savana', 2022, 'VIN1007', 'TL-1007', 41000, 'active', DATE_ADD(NOW(), INTERVAL 130 DAY), DATE_ADD(NOW(), INTERVAL 270 DAY), DATE_ADD(NOW(), INTERVAL 32 DAY), 85000, DATE_ADD(NOW(), INTERVAL 42 DAY), DATE_SUB(NOW(), INTERVAL 140 DAY)),
('vehicle-1-8', 'company-demo-1', 'Ford', 'E-Series', 2020, 'VIN1008', 'TL-1008', 72000, 'active', DATE_ADD(NOW(), INTERVAL 75 DAY), DATE_ADD(NOW(), INTERVAL 180 DAY), DATE_ADD(NOW(), INTERVAL 12 DAY), 75000, DATE_ADD(NOW(), INTERVAL 22 DAY), DATE_SUB(NOW(), INTERVAL 190 DAY)),
('vehicle-1-9', 'company-demo-1', 'Isuzu', 'NPR', 2023, 'VIN1009', 'TL-1009', 18000, 'active', DATE_ADD(NOW(), INTERVAL 200 DAY), DATE_ADD(NOW(), INTERVAL 350 DAY), DATE_ADD(NOW(), INTERVAL 50 DAY), 65000, DATE_ADD(NOW(), INTERVAL 60 DAY), DATE_SUB(NOW(), INTERVAL 70 DAY)),
('vehicle-1-10', 'company-demo-1', 'Freightliner', 'Sprinter', 2021, 'VIN1010', 'TL-1010', 58000, 'inactive', DATE_ADD(NOW(), INTERVAL 40 DAY), DATE_ADD(NOW(), INTERVAL 120 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY), 60000, DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 170 DAY));

-- Company 2 vehicles
INSERT INTO vehicles (id, company_id, make, model, year, vin, license_plate, odometer, status, insurance_expiry_date, registration_expiry_date, next_service_date, next_tire_change_km, next_oil_change_date, created_at) VALUES
('vehicle-2-1', 'company-demo-2', 'Toyota', 'Hiace', 2023, 'VIN2001', 'MD-2001', 32000, 'active', DATE_ADD(NOW(), INTERVAL 140 DAY), DATE_ADD(NOW(), INTERVAL 310 DAY), DATE_ADD(NOW(), INTERVAL 35 DAY), 78000, DATE_ADD(NOW(), INTERVAL 48 DAY), DATE_SUB(NOW(), INTERVAL 110 DAY)),
('vehicle-2-2', 'company-demo-2', 'Ford', 'Transit', 2022, 'VIN2002', 'MD-2002', 48000, 'active', DATE_ADD(NOW(), INTERVAL 110 DAY), DATE_ADD(NOW(), INTERVAL 240 DAY), DATE_ADD(NOW(), INTERVAL 22 DAY), 52000, DATE_ADD(NOW(), INTERVAL 32 DAY), DATE_SUB(NOW(), INTERVAL 130 DAY)),
('vehicle-2-3', 'company-demo-2', 'Mercedes-Benz', 'Sprinter', 2021, 'VIN2003', 'MD-2003', 68000, 'active', DATE_ADD(NOW(), INTERVAL 80 DAY), DATE_ADD(NOW(), INTERVAL 190 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY), 70000, DATE_ADD(NOW(), INTERVAL 24 DAY), DATE_SUB(NOW(), INTERVAL 180 DAY)),
('vehicle-2-4', 'company-demo-2', 'Nissan', 'NV3500', 2022, 'VIN2004', 'MD-2004', 39000, 'active', DATE_ADD(NOW(), INTERVAL 160 DAY), DATE_ADD(NOW(), INTERVAL 290 DAY), DATE_ADD(NOW(), INTERVAL 38 DAY), 85000, DATE_ADD(NOW(), INTERVAL 52 DAY), DATE_SUB(NOW(), INTERVAL 105 DAY)),
('vehicle-2-5', 'company-demo-2', 'RAM', 'ProMaster', 2023, 'VIN2005', 'MD-2005', 22000, 'active', DATE_ADD(NOW(), INTERVAL 190 DAY), DATE_ADD(NOW(), INTERVAL 340 DAY), DATE_ADD(NOW(), INTERVAL 55 DAY), 68000, DATE_ADD(NOW(), INTERVAL 65 DAY), DATE_SUB(NOW(), INTERVAL 80 DAY)),
('vehicle-2-6', 'company-demo-2', 'Chevrolet', 'Express', 2020, 'VIN2006', 'MD-2006', 76000, 'maintenance', DATE_ADD(NOW(), INTERVAL 50 DAY), DATE_ADD(NOW(), INTERVAL 140 DAY), DATE_ADD(NOW(), INTERVAL 6 DAY), 78000, DATE_ADD(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 195 DAY)),
('vehicle-2-7', 'company-demo-2', 'GMC', 'Savana', 2021, 'VIN2007', 'MD-2007', 55000, 'active', DATE_ADD(NOW(), INTERVAL 95 DAY), DATE_ADD(NOW(), INTERVAL 215 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 60000, DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 155 DAY)),
('vehicle-2-8', 'company-demo-2', 'Ford', 'E-Series', 2022, 'VIN2008', 'MD-2008', 43000, 'active', DATE_ADD(NOW(), INTERVAL 125 DAY), DATE_ADD(NOW(), INTERVAL 260 DAY), DATE_ADD(NOW(), INTERVAL 28 DAY), 88000, DATE_ADD(NOW(), INTERVAL 40 DAY), DATE_SUB(NOW(), INTERVAL 125 DAY)),
('vehicle-2-9', 'company-demo-2', 'Isuzu', 'NPR', 2021, 'VIN2009', 'MD-2009', 61000, 'active', DATE_ADD(NOW(), INTERVAL 85 DAY), DATE_ADD(NOW(), INTERVAL 195 DAY), DATE_ADD(NOW(), INTERVAL 16 DAY), 65000, DATE_ADD(NOW(), INTERVAL 26 DAY), DATE_SUB(NOW(), INTERVAL 175 DAY)),
('vehicle-2-10', 'company-demo-2', 'Freightliner', 'Sprinter', 2023, 'VIN2010', 'MD-2010', 25000, 'active', DATE_ADD(NOW(), INTERVAL 175 DAY), DATE_ADD(NOW(), INTERVAL 320 DAY), DATE_ADD(NOW(), INTERVAL 42 DAY), 72000, DATE_ADD(NOW(), INTERVAL 55 DAY), DATE_SUB(NOW(), INTERVAL 85 DAY));

-- Companies 3-10 vehicles (simplified for brevity - 8 more companies * 10 vehicles = 80 more)
-- For MySQL Workbench demo, adding key vehicles for remaining companies:

INSERT INTO vehicles (id, company_id, make, model, year, vin, license_plate, odometer, status, insurance_expiry_date, registration_expiry_date, next_service_date, next_tire_change_km, next_oil_change_date, created_at) 
SELECT 
    CONCAT('vehicle-', c.comp_num, '-', v.veh_num) as id,
    CONCAT('company-demo-', c.comp_num) as company_id,
    ELT(v.veh_num, 'Toyota', 'Ford', 'Mercedes-Benz', 'Nissan', 'RAM', 'Chevrolet', 'GMC', 'Ford', 'Isuzu', 'Freightliner') as make,
    ELT(v.veh_num, 'Hiace', 'Transit', 'Sprinter', 'NV3500', 'ProMaster', 'Express', 'Savana', 'E-Series', 'NPR', 'Sprinter') as model,
    2020 + (v.veh_num % 4) as year,
    CONCAT('VIN', c.comp_num, LPAD(v.veh_num, 3, '0')) as vin,
    CONCAT('FL-', c.comp_num, LPAD(v.veh_num, 3, '0')) as license_plate,
    15000 + (v.veh_num * 5000) + (c.comp_num * 1000) as odometer,
    ELT(1 + (v.veh_num % 5), 'active', 'active', 'active', 'maintenance', 'inactive') as status,
    DATE_ADD(NOW(), INTERVAL (30 + v.veh_num * 10) DAY) as insurance_expiry_date,
    DATE_ADD(NOW(), INTERVAL (100 + v.veh_num * 20) DAY) as registration_expiry_date,
    DATE_ADD(NOW(), INTERVAL (5 + v.veh_num * 3) DAY) as next_service_date,
    20000 + (v.veh_num * 5000) + (c.comp_num * 1000) as next_tire_change_km,
    DATE_ADD(NOW(), INTERVAL (10 + v.veh_num * 4) DAY) as next_oil_change_date,
    DATE_SUB(NOW(), INTERVAL (60 + v.veh_num * 10) DAY) as created_at
FROM 
    (SELECT 3 as comp_num UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) c
CROSS JOIN
    (SELECT 1 as veh_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) v;

-- ============= INSERT SERVICES (10 service types per company) =============
INSERT INTO services (id, company_id, name, description, estimated_cost, estimated_duration_days, interval_type, interval_value) 
SELECT 
    CONCAT('service-', c.comp_num, '-', s.svc_num) as id,
    CONCAT('company-demo-', c.comp_num) as company_id,
    s.name,
    s.description,
    s.cost,
    s.duration,
    s.interval_type,
    s.interval_value
FROM 
    (SELECT 1 as comp_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) c
CROSS JOIN
    (SELECT 1 as svc_num, 'Oil Change' as name, 'Engine oil and filter replacement' as description, 80 as cost, 1 as duration, 'km' as interval_type, 5000 as interval_value
     UNION SELECT 2, 'Tire Rotation', 'Rotate and balance all tires', 100, 1, 'km', 10000
     UNION SELECT 3, 'Brake Service', 'Brake pads, rotors, and fluid inspection', 350, 2, 'months', 12
     UNION SELECT 4, 'Air Filter Replacement', 'Engine and cabin air filter replacement', 60, 1, 'months', 6
     UNION SELECT 5, 'Transmission Service', 'Transmission fluid and filter change', 250, 2, 'km', 40000
     UNION SELECT 6, 'Battery Replacement', 'Battery testing and replacement', 150, 1, 'months', 36
     UNION SELECT 7, 'Wheel Alignment', 'Four-wheel alignment and suspension check', 120, 1, 'km', 15000
     UNION SELECT 8, 'Coolant Flush', 'Coolant system flush and refill', 130, 1, 'months', 24
     UNION SELECT 9, 'Spark Plug Replacement', 'Replace spark plugs and ignition system check', 180, 2, 'km', 50000
     UNION SELECT 10, 'Timing Belt Replacement', 'Timing belt and tensioner replacement', 600, 3, 'km', 100000) s;

-- ============= INSERT MAINTENANCE RECORDS (10 per company = 100 total) =============
INSERT INTO maintenance_records (id, company_id, vehicle_id, service_type, odometer, cost, invoice_amount, completion_date, next_service_date, notes, created_at)
SELECT 
    CONCAT('record-', c.comp_num, '-', r.rec_num) as id,
    CONCAT('company-demo-', c.comp_num) as company_id,
    CONCAT('vehicle-', c.comp_num, '-', 1 + (r.rec_num % 10)) as vehicle_id,
    ELT(1 + (r.rec_num % 10), 'Oil Change', 'Tire Rotation', 'Brake Service', 'Air Filter Replacement', 'Transmission Service', 
        'Battery Replacement', 'Wheel Alignment', 'Coolant Flush', 'Spark Plug Replacement', 'Timing Belt Replacement') as service_type,
    10000 + (r.rec_num * 3000) as odometer,
    50 + (r.rec_num * 25) as cost,
    50 + (r.rec_num * 25) as invoice_amount,
    DATE_SUB(NOW(), INTERVAL (15 + r.rec_num * 5) DAY) as completion_date,
    DATE_ADD(NOW(), INTERVAL (30 + r.rec_num * 3) DAY) as next_service_date,
    CONCAT('Regular maintenance completed for vehicle ', 1 + (r.rec_num % 10)) as notes,
    DATE_SUB(NOW(), INTERVAL (15 + r.rec_num * 5) DAY) as created_at
FROM 
    (SELECT 1 as comp_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) c
CROSS JOIN
    (SELECT 1 as rec_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) r;

-- ============= INSERT SERVICE REQUESTS (10 per company = 100 total) =============
INSERT INTO service_requests (id, company_id, vehicle_id, service_id, requested_date, status, priority, notes, created_at)
SELECT 
    CONCAT('request-', c.comp_num, '-', r.req_num) as id,
    CONCAT('company-demo-', c.comp_num) as company_id,
    CONCAT('vehicle-', c.comp_num, '-', 1 + (r.req_num % 10)) as vehicle_id,
    CONCAT('service-', c.comp_num, '-', 1 + (r.req_num % 10)) as service_id,
    DATE_SUB(NOW(), INTERVAL (5 + r.req_num * 2) DAY) as requested_date,
    ELT(1 + (r.req_num % 4), 'pending', 'approved', 'approved', 'completed') as status,
    ELT(1 + (r.req_num % 3), 'normal', 'normal', 'high') as priority,
    CONCAT('Service requested for vehicle ', 1 + (r.req_num % 10)) as notes,
    DATE_SUB(NOW(), INTERVAL (5 + r.req_num * 2) DAY) as created_at
FROM 
    (SELECT 1 as comp_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) c
CROSS JOIN
    (SELECT 1 as req_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) r;

-- ============= INSERT SERVICE REMINDERS (10 per company = 100 total) =============
INSERT INTO service_reminders (id, company_id, vehicle_id, service_type, due_date, status, message, created_at)
SELECT 
    CONCAT('reminder-', c.comp_num, '-', r.rem_num) as id,
    CONCAT('company-demo-', c.comp_num) as company_id,
    CONCAT('vehicle-', c.comp_num, '-', 1 + (r.rem_num % 10)) as vehicle_id,
    ELT(1 + (r.rem_num % 10), 'Oil Change', 'Tire Rotation', 'Brake Service', 'Air Filter Replacement', 'Transmission Service', 
        'Battery Replacement', 'Wheel Alignment', 'Coolant Flush', 'Spark Plug Replacement', 'Timing Belt Replacement') as service_type,
    DATE_ADD(NOW(), INTERVAL (-10 + r.rem_num * 4) DAY) as due_date,
    ELT(1 + (r.rem_num % 3), 'pending', 'pending', 'completed') as status,
    CONCAT('Service due for vehicle ', 1 + (r.rem_num % 10)) as message,
    DATE_SUB(NOW(), INTERVAL (20 + r.rem_num * 2) DAY) as created_at
FROM 
    (SELECT 1 as comp_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) c
CROSS JOIN
    (SELECT 1 as rem_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) r;

-- ============= INSERT TEAM USERS (5 per company = 50 total) =============
INSERT INTO team_users (id, company_id, email, password, name, role, created_at)
SELECT 
    CONCAT('user-', c.comp_num, '-', u.user_num) as id,
    CONCAT('company-demo-', c.comp_num) as company_id,
    CONCAT('user', u.user_num, '@company', c.comp_num, '.com') as email,
    'password123' as password,
    CONCAT('User ', u.user_num, ' Company ', c.comp_num) as name,
    ELT(1 + (u.user_num % 4), 'admin', 'manager', 'user', 'viewer') as role,
    DATE_SUB(NOW(), INTERVAL (30 + u.user_num * 5) DAY) as created_at
FROM 
    (SELECT 1 as comp_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 
     UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) c
CROSS JOIN
    (SELECT 1 as user_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) u;

-- ============= VERIFICATION QUERIES =============
-- Run these to verify the data was inserted correctly

SELECT 'Companies' as Table_Name, COUNT(*) as Record_Count FROM companies
UNION ALL
SELECT 'Admins', COUNT(*) FROM admins
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'Services', COUNT(*) FROM services
UNION ALL
SELECT 'Maintenance Records', COUNT(*) FROM maintenance_records
UNION ALL
SELECT 'Service Requests', COUNT(*) FROM service_requests
UNION ALL
SELECT 'Service Reminders', COUNT(*) FROM service_reminders
UNION ALL
SELECT 'Team Users', COUNT(*) FROM team_users;

-- Sample query: Get all vehicles for a specific company
-- SELECT * FROM vehicles WHERE company_id = 'company-demo-1';

-- Sample query: Get all pending service requests
-- SELECT sr.*, v.license_plate, s.name as service_name 
-- FROM service_requests sr
-- JOIN vehicles v ON sr.vehicle_id = v.id
-- JOIN services s ON sr.service_id = s.id
-- WHERE sr.status = 'pending';
