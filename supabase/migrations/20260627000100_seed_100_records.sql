
-- Seed 100 Dynamic Bilingual Records
-- Clean existing if needed
truncate table public.payroll cascade;
truncate table public.attendance cascade;
truncate table public.missions cascade;
truncate table public.leaves cascade;
delete from public.employees where id like 'e%';
delete from auth.users where id like 'e%';

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000001', 'sara.salem.1@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000001', '10001', 'Sara', 'Salem', 'سارة', 'سالم', 'sara.salem.1@acme.com', '+20 100 2420545', 'Male', 'd2000000-0000-0000-0000-000000000002', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-02', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000001', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000001', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000001', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000001', '2026-06-01', 5200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000002', 'omar.farouk.2@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000002', '10002', 'Omar', 'Farouk', 'عمر', 'فاروق', 'omar.farouk.2@acme.com', '+20 100 8468645', 'Female', 'd3000000-0000-0000-0000-000000000003', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-03', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000002', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000002', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000002', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000002', '2026-06-01', 5400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000003', 'fatima.shalaby.3@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000003', '10003', 'Fatima', 'Shalaby', 'فاطمة', 'شلبي', 'fatima.shalaby.3@acme.com', '+20 100 7304305', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j4000000-0000-0000-0000-000000000004', 'Contractor', '2023-01-04', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000003', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000003', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000003', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000003', '2026-06-01', 5600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000004', 'mohamed.othman.4@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000004', '10004', 'Mohamed', 'Othman', 'محمد', 'عثمان', 'mohamed.othman.4@acme.com', '+20 100 6203242', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-05', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000004', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000004', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000004', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000004', '2026-06-01', 5800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000005', 'mahmoud.khalil.5@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000005', '10005', 'Mahmoud', 'Khalil', 'محمود', 'خليل', 'mahmoud.khalil.5@acme.com', '+20 100 3333554', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-06', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000005', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000005', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000005', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000005', '2026-06-01', 6000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000006', 'ali.habib.6@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000006', '10006', 'Ali', 'Habib', 'علي', 'حبيب', 'ali.habib.6@acme.com', '+20 100 6585772', 'Female', 'd7000000-0000-0000-0000-000000000007', 'j7000000-0000-0000-0000-000000000007', 'Contractor', '2021-01-07', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000006', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000006', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000006', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000006', '2026-06-01', 6200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000007', 'youssef.nasir.7@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000007', '10007', 'Youssef', 'Nasir', 'يوسف', 'ناصر', 'youssef.nasir.7@acme.com', '+20 100 5656170', 'Male', 'd8000000-0000-0000-0000-000000000008', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-08', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000007', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000007', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000007', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000007', '2026-06-01', 6400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000008', 'ibrahim.el-amin.8@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000008', '10008', 'Ibrahim', 'El-Amin', 'إبراهيم', 'الأمين', 'ibrahim.el-amin.8@acme.com', '+20 100 6235670', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-09', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000008', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000008', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000008', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000008', '2026-06-01', 6600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000009', 'khaled.hussein.9@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000009', '10009', 'Khaled', 'Hussein', 'خالد', 'حسين', 'khaled.hussein.9@acme.com', '+20 100 6282927', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j1010000-0000-0000-0000-000000000010', 'Contractor', '2024-01-10', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000009', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000009', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000009', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000009', '2026-06-01', 6800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000010', 'mariam.abdelaziz.10@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000010', '10010', 'Mariam', 'Abdelaziz', 'مريم', 'عبد العزيز', 'mariam.abdelaziz.10@acme.com', '+20 100 3532670', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-11', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000010', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000010', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000010', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000010', '2026-06-01', 7000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000011', 'nour.el-sayed.11@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000011', '10011', 'Nour', 'El-Sayed', 'نور', 'السيد', 'nour.el-sayed.11@acme.com', '+20 100 2789595', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-12', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000011', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000011', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000011', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000011', '2026-06-01', 7200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000012', 'hassan.tarek.12@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000012', '10012', 'Hassan', 'Tarek', 'حسن', 'طارق', 'hassan.tarek.12@acme.com', '+20 100 1901749', 'Female', 'd4000000-0000-0000-0000-000000000004', 'j3000000-0000-0000-0000-000000000003', 'Contractor', '2022-01-13', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000012', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000012', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000012', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000012', '2026-06-01', 7400, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000013', 'mona.hani.13@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000013', '10013', 'Mona', 'Hani', 'منى', 'هاني', 'mona.hani.13@acme.com', '+20 100 9957955', 'Male', 'd5000000-0000-0000-0000-000000000005', 'j4000000-0000-0000-0000-000000000004', 'Permanent', '2023-01-14', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000013', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000013', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000013', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000013', '2026-06-01', 7600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000014', 'mostafa.kamal.14@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000014', '10014', 'Mostafa', 'Kamal', 'مصطفى', 'كمال', 'mostafa.kamal.14@acme.com', '+20 100 9151729', 'Female', 'd6000000-0000-0000-0000-000000000006', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-15', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000014', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000014', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000014', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000014', '2026-06-01', 7800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000015', 'zeinab.saad.15@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000015', '10015', 'Zeinab', 'Saad', 'زينب', 'سعد', 'zeinab.saad.15@acme.com', '+20 100 3886721', 'Male', 'd7000000-0000-0000-0000-000000000007', 'j6000000-0000-0000-0000-000000000006', 'Contractor', '2020-01-16', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000015', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000015', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000015', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000015', '2026-06-01', 8000, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000016', 'amr.fawzy.16@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000016', '10016', 'Amr', 'Fawzy', 'عمرو', 'فوزي', 'amr.fawzy.16@acme.com', '+20 100 1753620', 'Female', 'd8000000-0000-0000-0000-000000000008', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2021-01-17', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000016', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000016', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000016', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000016', '2026-06-01', 8200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000017', 'hoda.gaber.17@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000017', '10017', 'Hoda', 'Gaber', 'هدى', 'جابر', 'hoda.gaber.17@acme.com', '+20 100 4827975', 'Male', 'd9000000-0000-0000-0000-000000000009', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-18', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000017', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000017', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000017', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000017', '2026-06-01', 8400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000018', 'sherif.rashed.18@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000018', '10018', 'Sherif', 'Rashed', 'شريف', 'راشد', 'sherif.rashed.18@acme.com', '+20 100 8943920', 'Female', 'd1000000-0000-0000-0000-000000000001', 'j9000000-0000-0000-0000-000000000009', 'Contractor', '2023-01-19', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000018', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000018', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000018', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000018', '2026-06-01', 8600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000019', 'dina.ezzat.19@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000019', '10019', 'Dina', 'Ezzat', 'دينا', 'عزت', 'dina.ezzat.19@acme.com', '+20 100 4235865', 'Male', 'd2000000-0000-0000-0000-000000000002', 'j1010000-0000-0000-0000-000000000010', 'Permanent', '2024-01-20', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000019', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000019', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000019', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000019', '2026-06-01', 8800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000020', 'ahmed.mahdy.20@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000020', '10020', 'Ahmed', 'Mahdy', 'أحمد', 'مهدي', 'ahmed.mahdy.20@acme.com', '+20 100 1590660', 'Female', 'd3000000-0000-0000-0000-000000000003', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-21', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000020', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000020', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000020', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000020', '2026-06-01', 9000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000021', 'sara.salem.21@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000021', '10021', 'Sara', 'Salem', 'سارة', 'سالم', 'sara.salem.21@acme.com', '+20 100 7157198', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j2000000-0000-0000-0000-000000000002', 'Contractor', '2021-01-22', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000021', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000021', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000021', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000021', '2026-06-01', 9200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000022', 'omar.farouk.22@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000022', '10022', 'Omar', 'Farouk', 'عمر', 'فاروق', 'omar.farouk.22@acme.com', '+20 100 6176387', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-23', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000022', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000022', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000022', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000022', '2026-06-01', 9400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000023', 'fatima.shalaby.23@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000023', '10023', 'Fatima', 'Shalaby', 'فاطمة', 'شلبي', 'fatima.shalaby.23@acme.com', '+20 100 6328525', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j4000000-0000-0000-0000-000000000004', 'Permanent', '2023-01-24', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000023', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000023', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000023', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000023', '2026-06-01', 9600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000024', 'mohamed.othman.24@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000024', '10024', 'Mohamed', 'Othman', 'محمد', 'عثمان', 'mohamed.othman.24@acme.com', '+20 100 8846878', 'Female', 'd7000000-0000-0000-0000-000000000007', 'j5000000-0000-0000-0000-000000000005', 'Contractor', '2024-01-25', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000024', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000024', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000024', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000024', '2026-06-01', 9800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000025', 'mahmoud.khalil.25@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000025', '10025', 'Mahmoud', 'Khalil', 'محمود', 'خليل', 'mahmoud.khalil.25@acme.com', '+20 100 4188371', 'Male', 'd8000000-0000-0000-0000-000000000008', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-26', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000025', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000025', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000025', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000025', '2026-06-01', 10000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000026', 'ali.habib.26@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000026', '10026', 'Ali', 'Habib', 'علي', 'حبيب', 'ali.habib.26@acme.com', '+20 100 7772334', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2021-01-27', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000026', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000026', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000026', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000026', '2026-06-01', 10200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000027', 'youssef.nasir.27@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000027', '10027', 'Youssef', 'Nasir', 'يوسف', 'ناصر', 'youssef.nasir.27@acme.com', '+20 100 2975477', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j8000000-0000-0000-0000-000000000008', 'Contractor', '2022-01-28', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000027', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000027', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000027', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000027', '2026-06-01', 10400, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000028', 'ibrahim.el-amin.28@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000028', '10028', 'Ibrahim', 'El-Amin', 'إبراهيم', 'الأمين', 'ibrahim.el-amin.28@acme.com', '+20 100 3445259', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-01', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000028', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000028', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000028', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000028', '2026-06-01', 10600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000029', 'khaled.hussein.29@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000029', '10029', 'Khaled', 'Hussein', 'خالد', 'حسين', 'khaled.hussein.29@acme.com', '+20 100 4955515', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j1010000-0000-0000-0000-000000000010', 'Permanent', '2024-01-02', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000029', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000029', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000029', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000029', '2026-06-01', 10800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000030', 'mariam.abdelaziz.30@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000030', '10030', 'Mariam', 'Abdelaziz', 'مريم', 'عبد العزيز', 'mariam.abdelaziz.30@acme.com', '+20 100 6864703', 'Female', 'd4000000-0000-0000-0000-000000000004', 'j1000000-0000-0000-0000-000000000001', 'Contractor', '2020-01-03', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000030', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000030', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000030', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000030', '2026-06-01', 11000, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000031', 'nour.el-sayed.31@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000031', '10031', 'Nour', 'El-Sayed', 'نور', 'السيد', 'nour.el-sayed.31@acme.com', '+20 100 1461101', 'Male', 'd5000000-0000-0000-0000-000000000005', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-04', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000031', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000031', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000031', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000031', '2026-06-01', 11200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000032', 'hassan.tarek.32@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000032', '10032', 'Hassan', 'Tarek', 'حسن', 'طارق', 'hassan.tarek.32@acme.com', '+20 100 1207083', 'Female', 'd6000000-0000-0000-0000-000000000006', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-05', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000032', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000032', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000032', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000032', '2026-06-01', 11400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000033', 'mona.hani.33@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000033', '10033', 'Mona', 'Hani', 'منى', 'هاني', 'mona.hani.33@acme.com', '+20 100 9616706', 'Male', 'd7000000-0000-0000-0000-000000000007', 'j4000000-0000-0000-0000-000000000004', 'Contractor', '2023-01-06', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000033', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000033', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000033', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000033', '2026-06-01', 11600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000034', 'mostafa.kamal.34@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000034', '10034', 'Mostafa', 'Kamal', 'مصطفى', 'كمال', 'mostafa.kamal.34@acme.com', '+20 100 8443832', 'Female', 'd8000000-0000-0000-0000-000000000008', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-07', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000034', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000034', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000034', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000034', '2026-06-01', 11800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000035', 'zeinab.saad.35@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000035', '10035', 'Zeinab', 'Saad', 'زينب', 'سعد', 'zeinab.saad.35@acme.com', '+20 100 7421269', 'Male', 'd9000000-0000-0000-0000-000000000009', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-08', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000035', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000035', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000035', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000035', '2026-06-01', 12000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000036', 'amr.fawzy.36@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000036', '10036', 'Amr', 'Fawzy', 'عمرو', 'فوزي', 'amr.fawzy.36@acme.com', '+20 100 9967123', 'Female', 'd1000000-0000-0000-0000-000000000001', 'j7000000-0000-0000-0000-000000000007', 'Contractor', '2021-01-09', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000036', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000036', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000036', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000036', '2026-06-01', 12200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000037', 'hoda.gaber.37@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000037', '10037', 'Hoda', 'Gaber', 'هدى', 'جابر', 'hoda.gaber.37@acme.com', '+20 100 2795214', 'Male', 'd2000000-0000-0000-0000-000000000002', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-10', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000037', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000037', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000037', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000037', '2026-06-01', 12400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000038', 'sherif.rashed.38@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000038', '10038', 'Sherif', 'Rashed', 'شريف', 'راشد', 'sherif.rashed.38@acme.com', '+20 100 3515117', 'Female', 'd3000000-0000-0000-0000-000000000003', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-11', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000038', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000038', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000038', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000038', '2026-06-01', 12600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000039', 'dina.ezzat.39@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000039', '10039', 'Dina', 'Ezzat', 'دينا', 'عزت', 'dina.ezzat.39@acme.com', '+20 100 4801250', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j1010000-0000-0000-0000-000000000010', 'Contractor', '2024-01-12', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000039', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000039', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000039', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000039', '2026-06-01', 12800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000040', 'ahmed.mahdy.40@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000040', '10040', 'Ahmed', 'Mahdy', 'أحمد', 'مهدي', 'ahmed.mahdy.40@acme.com', '+20 100 8242334', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-13', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000040', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000040', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000040', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000040', '2026-06-01', 13000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000041', 'sara.salem.41@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000041', '10041', 'Sara', 'Salem', 'سارة', 'سالم', 'sara.salem.41@acme.com', '+20 100 4161545', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-14', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000041', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000041', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000041', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000041', '2026-06-01', 13200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000042', 'omar.farouk.42@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000042', '10042', 'Omar', 'Farouk', 'عمر', 'فاروق', 'omar.farouk.42@acme.com', '+20 100 4148799', 'Female', 'd7000000-0000-0000-0000-000000000007', 'j3000000-0000-0000-0000-000000000003', 'Contractor', '2022-01-15', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000042', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000042', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000042', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000042', '2026-06-01', 13400, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000043', 'fatima.shalaby.43@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000043', '10043', 'Fatima', 'Shalaby', 'فاطمة', 'شلبي', 'fatima.shalaby.43@acme.com', '+20 100 4112653', 'Male', 'd8000000-0000-0000-0000-000000000008', 'j4000000-0000-0000-0000-000000000004', 'Permanent', '2023-01-16', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000043', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000043', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000043', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000043', '2026-06-01', 13600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000044', 'mohamed.othman.44@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000044', '10044', 'Mohamed', 'Othman', 'محمد', 'عثمان', 'mohamed.othman.44@acme.com', '+20 100 1893098', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-17', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000044', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000044', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000044', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000044', '2026-06-01', 13800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000045', 'mahmoud.khalil.45@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000045', '10045', 'Mahmoud', 'Khalil', 'محمود', 'خليل', 'mahmoud.khalil.45@acme.com', '+20 100 3398981', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j6000000-0000-0000-0000-000000000006', 'Contractor', '2020-01-18', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000045', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000045', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000045', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000045', '2026-06-01', 14000, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000046', 'ali.habib.46@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000046', '10046', 'Ali', 'Habib', 'علي', 'حبيب', 'ali.habib.46@acme.com', '+20 100 7204627', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2021-01-19', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000046', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000046', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000046', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000046', '2026-06-01', 14200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000047', 'youssef.nasir.47@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000047', '10047', 'Youssef', 'Nasir', 'يوسف', 'ناصر', 'youssef.nasir.47@acme.com', '+20 100 3667502', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-20', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000047', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000047', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000047', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000047', '2026-06-01', 14400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000048', 'ibrahim.el-amin.48@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000048', '10048', 'Ibrahim', 'El-Amin', 'إبراهيم', 'الأمين', 'ibrahim.el-amin.48@acme.com', '+20 100 2122303', 'Female', 'd4000000-0000-0000-0000-000000000004', 'j9000000-0000-0000-0000-000000000009', 'Contractor', '2023-01-21', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000048', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000048', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000048', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000048', '2026-06-01', 14600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000049', 'khaled.hussein.49@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000049', '10049', 'Khaled', 'Hussein', 'خالد', 'حسين', 'khaled.hussein.49@acme.com', '+20 100 1737933', 'Male', 'd5000000-0000-0000-0000-000000000005', 'j1010000-0000-0000-0000-000000000010', 'Permanent', '2024-01-22', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000049', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000049', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000049', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000049', '2026-06-01', 14800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000050', 'mariam.abdelaziz.50@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000050', '10050', 'Mariam', 'Abdelaziz', 'مريم', 'عبد العزيز', 'mariam.abdelaziz.50@acme.com', '+20 100 2955621', 'Female', 'd6000000-0000-0000-0000-000000000006', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-23', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000050', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000050', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000050', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000050', '2026-06-01', 15000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000051', 'nour.el-sayed.51@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000051', '10051', 'Nour', 'El-Sayed', 'نور', 'السيد', 'nour.el-sayed.51@acme.com', '+20 100 8382669', 'Male', 'd7000000-0000-0000-0000-000000000007', 'j2000000-0000-0000-0000-000000000002', 'Contractor', '2021-01-24', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000051', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000051', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000051', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000051', '2026-06-01', 15200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000052', 'hassan.tarek.52@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000052', '10052', 'Hassan', 'Tarek', 'حسن', 'طارق', 'hassan.tarek.52@acme.com', '+20 100 2106891', 'Female', 'd8000000-0000-0000-0000-000000000008', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-25', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000052', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000052', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000052', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000052', '2026-06-01', 15400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000053', 'mona.hani.53@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000053', '10053', 'Mona', 'Hani', 'منى', 'هاني', 'mona.hani.53@acme.com', '+20 100 5930333', 'Male', 'd9000000-0000-0000-0000-000000000009', 'j4000000-0000-0000-0000-000000000004', 'Permanent', '2023-01-26', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000053', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000053', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000053', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000053', '2026-06-01', 15600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000054', 'mostafa.kamal.54@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000054', '10054', 'Mostafa', 'Kamal', 'مصطفى', 'كمال', 'mostafa.kamal.54@acme.com', '+20 100 6906742', 'Female', 'd1000000-0000-0000-0000-000000000001', 'j5000000-0000-0000-0000-000000000005', 'Contractor', '2024-01-27', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000054', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000054', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000054', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000054', '2026-06-01', 15800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000055', 'zeinab.saad.55@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000055', '10055', 'Zeinab', 'Saad', 'زينب', 'سعد', 'zeinab.saad.55@acme.com', '+20 100 4022143', 'Male', 'd2000000-0000-0000-0000-000000000002', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-28', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000055', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000055', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000055', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000055', '2026-06-01', 16000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000056', 'amr.fawzy.56@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000056', '10056', 'Amr', 'Fawzy', 'عمرو', 'فوزي', 'amr.fawzy.56@acme.com', '+20 100 9142154', 'Female', 'd3000000-0000-0000-0000-000000000003', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2021-01-01', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000056', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000056', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000056', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000056', '2026-06-01', 16200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000057', 'hoda.gaber.57@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000057', '10057', 'Hoda', 'Gaber', 'هدى', 'جابر', 'hoda.gaber.57@acme.com', '+20 100 5666049', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j8000000-0000-0000-0000-000000000008', 'Contractor', '2022-01-02', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000057', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000057', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000057', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000057', '2026-06-01', 16400, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000058', 'sherif.rashed.58@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000058', '10058', 'Sherif', 'Rashed', 'شريف', 'راشد', 'sherif.rashed.58@acme.com', '+20 100 3362851', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-03', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000058', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000058', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000058', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000058', '2026-06-01', 16600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000059', 'dina.ezzat.59@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000059', '10059', 'Dina', 'Ezzat', 'دينا', 'عزت', 'dina.ezzat.59@acme.com', '+20 100 4976500', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j1010000-0000-0000-0000-000000000010', 'Permanent', '2024-01-04', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000059', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000059', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000059', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000059', '2026-06-01', 16800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000060', 'ahmed.mahdy.60@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000060', '10060', 'Ahmed', 'Mahdy', 'أحمد', 'مهدي', 'ahmed.mahdy.60@acme.com', '+20 100 6727775', 'Female', 'd7000000-0000-0000-0000-000000000007', 'j1000000-0000-0000-0000-000000000001', 'Contractor', '2020-01-05', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000060', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000060', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000060', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000060', '2026-06-01', 17000, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000061', 'sara.salem.61@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000061', '10061', 'Sara', 'Salem', 'سارة', 'سالم', 'sara.salem.61@acme.com', '+20 100 1974302', 'Male', 'd8000000-0000-0000-0000-000000000008', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-06', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000061', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000061', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000061', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000061', '2026-06-01', 17200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000062', 'omar.farouk.62@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000062', '10062', 'Omar', 'Farouk', 'عمر', 'فاروق', 'omar.farouk.62@acme.com', '+20 100 2043546', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-07', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000062', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000062', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000062', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000062', '2026-06-01', 17400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000063', 'fatima.shalaby.63@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000063', '10063', 'Fatima', 'Shalaby', 'فاطمة', 'شلبي', 'fatima.shalaby.63@acme.com', '+20 100 9508535', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j4000000-0000-0000-0000-000000000004', 'Contractor', '2023-01-08', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000063', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000063', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000063', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000063', '2026-06-01', 17600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000064', 'mohamed.othman.64@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000064', '10064', 'Mohamed', 'Othman', 'محمد', 'عثمان', 'mohamed.othman.64@acme.com', '+20 100 8492494', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-09', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000064', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000064', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000064', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000064', '2026-06-01', 17800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000065', 'mahmoud.khalil.65@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000065', '10065', 'Mahmoud', 'Khalil', 'محمود', 'خليل', 'mahmoud.khalil.65@acme.com', '+20 100 7924606', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-10', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000065', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000065', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000065', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000065', '2026-06-01', 18000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000066', 'ali.habib.66@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000066', '10066', 'Ali', 'Habib', 'علي', 'حبيب', 'ali.habib.66@acme.com', '+20 100 4523898', 'Female', 'd4000000-0000-0000-0000-000000000004', 'j7000000-0000-0000-0000-000000000007', 'Contractor', '2021-01-11', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000066', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000066', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000066', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000066', '2026-06-01', 18200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000067', 'youssef.nasir.67@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000067', '10067', 'Youssef', 'Nasir', 'يوسف', 'ناصر', 'youssef.nasir.67@acme.com', '+20 100 6683332', 'Male', 'd5000000-0000-0000-0000-000000000005', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-12', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000067', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000067', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000067', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000067', '2026-06-01', 18400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000068', 'ibrahim.el-amin.68@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000068', '10068', 'Ibrahim', 'El-Amin', 'إبراهيم', 'الأمين', 'ibrahim.el-amin.68@acme.com', '+20 100 2833442', 'Female', 'd6000000-0000-0000-0000-000000000006', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-13', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000068', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000068', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000068', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000068', '2026-06-01', 18600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000069', 'khaled.hussein.69@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000069', '10069', 'Khaled', 'Hussein', 'خالد', 'حسين', 'khaled.hussein.69@acme.com', '+20 100 3836644', 'Male', 'd7000000-0000-0000-0000-000000000007', 'j1010000-0000-0000-0000-000000000010', 'Contractor', '2024-01-14', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000069', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000069', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000069', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000069', '2026-06-01', 18800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000070', 'mariam.abdelaziz.70@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000070', '10070', 'Mariam', 'Abdelaziz', 'مريم', 'عبد العزيز', 'mariam.abdelaziz.70@acme.com', '+20 100 5679750', 'Female', 'd8000000-0000-0000-0000-000000000008', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-15', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000070', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000070', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000070', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000070', '2026-06-01', 19000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000071', 'nour.el-sayed.71@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000071', '10071', 'Nour', 'El-Sayed', 'نور', 'السيد', 'nour.el-sayed.71@acme.com', '+20 100 4824336', 'Male', 'd9000000-0000-0000-0000-000000000009', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-16', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000071', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000071', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000071', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000071', '2026-06-01', 19200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000072', 'hassan.tarek.72@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000072', '10072', 'Hassan', 'Tarek', 'حسن', 'طارق', 'hassan.tarek.72@acme.com', '+20 100 3587565', 'Female', 'd1000000-0000-0000-0000-000000000001', 'j3000000-0000-0000-0000-000000000003', 'Contractor', '2022-01-17', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000072', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000072', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000072', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000072', '2026-06-01', 19400, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000073', 'mona.hani.73@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000073', '10073', 'Mona', 'Hani', 'منى', 'هاني', 'mona.hani.73@acme.com', '+20 100 9251322', 'Male', 'd2000000-0000-0000-0000-000000000002', 'j4000000-0000-0000-0000-000000000004', 'Permanent', '2023-01-18', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000073', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000073', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000073', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000073', '2026-06-01', 19600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000074', 'mostafa.kamal.74@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000074', '10074', 'Mostafa', 'Kamal', 'مصطفى', 'كمال', 'mostafa.kamal.74@acme.com', '+20 100 9713783', 'Female', 'd3000000-0000-0000-0000-000000000003', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-19', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000074', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000074', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000074', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000074', '2026-06-01', 19800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000075', 'zeinab.saad.75@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000075', '10075', 'Zeinab', 'Saad', 'زينب', 'سعد', 'zeinab.saad.75@acme.com', '+20 100 3674675', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j6000000-0000-0000-0000-000000000006', 'Contractor', '2020-01-20', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000075', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000075', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000075', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000075', '2026-06-01', 20000, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000076', 'amr.fawzy.76@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000076', '10076', 'Amr', 'Fawzy', 'عمرو', 'فوزي', 'amr.fawzy.76@acme.com', '+20 100 6104379', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2021-01-21', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000076', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000076', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000076', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000076', '2026-06-01', 20200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000077', 'hoda.gaber.77@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000077', '10077', 'Hoda', 'Gaber', 'هدى', 'جابر', 'hoda.gaber.77@acme.com', '+20 100 7954154', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-22', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000077', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000077', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000077', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000077', '2026-06-01', 20400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000078', 'sherif.rashed.78@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000078', '10078', 'Sherif', 'Rashed', 'شريف', 'راشد', 'sherif.rashed.78@acme.com', '+20 100 2148124', 'Female', 'd7000000-0000-0000-0000-000000000007', 'j9000000-0000-0000-0000-000000000009', 'Contractor', '2023-01-23', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000078', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000078', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000078', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000078', '2026-06-01', 20600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000079', 'dina.ezzat.79@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000079', '10079', 'Dina', 'Ezzat', 'دينا', 'عزت', 'dina.ezzat.79@acme.com', '+20 100 8925345', 'Male', 'd8000000-0000-0000-0000-000000000008', 'j1010000-0000-0000-0000-000000000010', 'Permanent', '2024-01-24', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000079', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000079', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000079', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000079', '2026-06-01', 20800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000080', 'ahmed.mahdy.80@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000080', '10080', 'Ahmed', 'Mahdy', 'أحمد', 'مهدي', 'ahmed.mahdy.80@acme.com', '+20 100 4287239', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-25', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000080', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000080', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000080', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000080', '2026-06-01', 21000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000081', 'sara.salem.81@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000081', '10081', 'Sara', 'Salem', 'سارة', 'سالم', 'sara.salem.81@acme.com', '+20 100 6041797', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j2000000-0000-0000-0000-000000000002', 'Contractor', '2021-01-26', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000081', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000081', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000081', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000081', '2026-06-01', 21200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000082', 'omar.farouk.82@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000082', '10082', 'Omar', 'Farouk', 'عمر', 'فاروق', 'omar.farouk.82@acme.com', '+20 100 8735668', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-27', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000082', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000082', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000082', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000082', '2026-06-01', 21400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000083', 'fatima.shalaby.83@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000083', '10083', 'Fatima', 'Shalaby', 'فاطمة', 'شلبي', 'fatima.shalaby.83@acme.com', '+20 100 3423801', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j4000000-0000-0000-0000-000000000004', 'Permanent', '2023-01-28', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000083', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000083', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000083', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000083', '2026-06-01', 21600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000084', 'mohamed.othman.84@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000084', '10084', 'Mohamed', 'Othman', 'محمد', 'عثمان', 'mohamed.othman.84@acme.com', '+20 100 7983488', 'Female', 'd4000000-0000-0000-0000-000000000004', 'j5000000-0000-0000-0000-000000000005', 'Contractor', '2024-01-01', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000084', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000084', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000084', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000084', '2026-06-01', 21800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000085', 'mahmoud.khalil.85@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000085', '10085', 'Mahmoud', 'Khalil', 'محمود', 'خليل', 'mahmoud.khalil.85@acme.com', '+20 100 7096634', 'Male', 'd5000000-0000-0000-0000-000000000005', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-02', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000085', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000085', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000085', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000085', '2026-06-01', 22000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000086', 'ali.habib.86@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000086', '10086', 'Ali', 'Habib', 'علي', 'حبيب', 'ali.habib.86@acme.com', '+20 100 8505775', 'Female', 'd6000000-0000-0000-0000-000000000006', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2021-01-03', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000086', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000086', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000086', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000086', '2026-06-01', 22200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000087', 'youssef.nasir.87@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000087', '10087', 'Youssef', 'Nasir', 'يوسف', 'ناصر', 'youssef.nasir.87@acme.com', '+20 100 6479828', 'Male', 'd7000000-0000-0000-0000-000000000007', 'j8000000-0000-0000-0000-000000000008', 'Contractor', '2022-01-04', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000087', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000087', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000087', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000087', '2026-06-01', 22400, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000088', 'ibrahim.el-amin.88@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000088', '10088', 'Ibrahim', 'El-Amin', 'إبراهيم', 'الأمين', 'ibrahim.el-amin.88@acme.com', '+20 100 3629863', 'Female', 'd8000000-0000-0000-0000-000000000008', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-05', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000088', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000088', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000088', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000088', '2026-06-01', 22600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000089', 'khaled.hussein.89@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000089', '10089', 'Khaled', 'Hussein', 'خالد', 'حسين', 'khaled.hussein.89@acme.com', '+20 100 1087213', 'Male', 'd9000000-0000-0000-0000-000000000009', 'j1010000-0000-0000-0000-000000000010', 'Permanent', '2024-01-06', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000089', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000089', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000089', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000089', '2026-06-01', 22800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000090', 'mariam.abdelaziz.90@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000090', '10090', 'Mariam', 'Abdelaziz', 'مريم', 'عبد العزيز', 'mariam.abdelaziz.90@acme.com', '+20 100 7315664', 'Female', 'd1000000-0000-0000-0000-000000000001', 'j1000000-0000-0000-0000-000000000001', 'Contractor', '2020-01-07', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000090', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000090', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000090', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000090', '2026-06-01', 23000, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000091', 'nour.el-sayed.91@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000091', '10091', 'Nour', 'El-Sayed', 'نور', 'السيد', 'nour.el-sayed.91@acme.com', '+20 100 8766704', 'Male', 'd2000000-0000-0000-0000-000000000002', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2021-01-08', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000091', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000091', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000091', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000091', '2026-06-01', 23200, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000092', 'hassan.tarek.92@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000092', '10092', 'Hassan', 'Tarek', 'حسن', 'طارق', 'hassan.tarek.92@acme.com', '+20 100 2917748', 'Female', 'd3000000-0000-0000-0000-000000000003', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2022-01-09', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000092', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000092', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000092', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000092', '2026-06-01', 23400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000093', 'mona.hani.93@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000093', '10093', 'Mona', 'Hani', 'منى', 'هاني', 'mona.hani.93@acme.com', '+20 100 5230512', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j4000000-0000-0000-0000-000000000004', 'Contractor', '2023-01-10', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000093', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000093', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000093', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000093', '2026-06-01', 23600, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000094', 'mostafa.kamal.94@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000094', '10094', 'Mostafa', 'Kamal', 'مصطفى', 'كمال', 'mostafa.kamal.94@acme.com', '+20 100 8848832', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2024-01-11', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000094', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000094', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000094', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000094', '2026-06-01', 23800, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000095', 'zeinab.saad.95@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000095', '10095', 'Zeinab', 'Saad', 'زينب', 'سعد', 'zeinab.saad.95@acme.com', '+20 100 6979727', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2020-01-12', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000095', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000095', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000095', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000095', '2026-06-01', 24000, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000096', 'amr.fawzy.96@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000096', '10096', 'Amr', 'Fawzy', 'عمرو', 'فوزي', 'amr.fawzy.96@acme.com', '+20 100 3584247', 'Female', 'd7000000-0000-0000-0000-000000000007', 'j7000000-0000-0000-0000-000000000007', 'Contractor', '2021-01-13', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000096', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000096', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000096', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000096', '2026-06-01', 24200, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000097', 'hoda.gaber.97@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000097', '10097', 'Hoda', 'Gaber', 'هدى', 'جابر', 'hoda.gaber.97@acme.com', '+20 100 9782419', 'Male', 'd8000000-0000-0000-0000-000000000008', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-01-14', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000097', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000097', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000097', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000097', '2026-06-01', 24400, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000098', 'sherif.rashed.98@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000098', '10098', 'Sherif', 'Rashed', 'شريف', 'راشد', 'sherif.rashed.98@acme.com', '+20 100 2768754', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-01-15', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000098', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000098', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000098', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000098', '2026-06-01', 24600, 1000, 150, 300, 'Paid');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000099', 'dina.ezzat.99@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000099', '10099', 'Dina', 'Ezzat', 'دينا', 'عزت', 'dina.ezzat.99@acme.com', '+20 100 5788001', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j1010000-0000-0000-0000-000000000010', 'Contractor', '2024-01-16', 'Direct', false, 'Employee')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000099', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Pending');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000099', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Pending');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000099', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000099', '2026-06-01', 24800, 1000, 150, 300, 'Pending');

insert into auth.users (id, email) values ('e1000000-0000-0000-0000-000000000100', 'ahmed.mahdy.100@acme.com') on conflict (id) do nothing;
insert into public.employees (id, employee_number, first_name, last_name, first_name_ar, last_name_ar, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, role) values
    ('e1000000-0000-0000-0000-000000000100', '10100', 'Ahmed', 'Mahdy', 'أحمد', 'مهدي', 'ahmed.mahdy.100@acme.com', '+20 100 1303105', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j1000000-0000-0000-0000-000000000001', 'Permanent', '2020-01-17', 'Direct', true, 'Manager')
    on conflict (id) do nothing;
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
    ('e1000000-0000-0000-0000-000000000100', 'Vacation', '2026-07-01', '2026-07-05', 4, 'Annual vacation leave', 'Approved');
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
    ('e1000000-0000-0000-0000-000000000100', 'Work From Home', '2026-08-10', '2026-08-12', 2, 'Home Office', 'Remote sprint focus', 'Approved');
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
    ('e1000000-0000-0000-0000-000000000100', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Autoseeded normal check-in');
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
    ('e1000000-0000-0000-0000-000000000100', '2026-06-01', 25000, 1000, 150, 300, 'Paid');

