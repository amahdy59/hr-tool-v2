-- 1. Seed Departments
insert into public.departments (id, name, dept_code) values
  ('d1000000-0000-0000-0000-000000000001', 'Marketing', 'DEPT-MKT'),
  ('d2000000-0000-0000-0000-000000000002', 'Sales', 'DEPT-SLS'),
  ('d3000000-0000-0000-0000-000000000003', 'Software', 'DEPT-SFT'),
  ('d4000000-0000-0000-0000-000000000004', 'SCADA', 'DEPT-SCA'),
  ('d5000000-0000-0000-0000-000000000005', 'Oil & Gas', 'DEPT-ONG'),
  ('d6000000-0000-0000-0000-000000000006', 'IT', 'DEPT-IT'),
  ('d7000000-0000-0000-0000-000000000007', 'HR', 'DEPT-HR'),
  ('d8000000-0000-0000-0000-000000000008', 'Finance', 'DEPT-FIN'),
  ('d9000000-0000-0000-0000-000000000009', 'Engineering', 'DEPT-ENG')
on conflict (name) do nothing;

-- 2. Seed Job Titles
insert into public.job_titles (id, title) values
  ('j1000000-0000-0000-0000-000000000001', 'Senior Solutions Architect'),
  ('j2000000-0000-0000-0000-000000000002', 'Global Operations Manager'),
  ('j3000000-0000-0000-0000-000000000003', 'Senior Project Manager'),
  ('j4000000-0000-0000-0000-000000000004', 'Senior Cybersecurity Specialist'),
  ('j5000000-0000-0000-0000-000000000005', 'Director of Supply Chain Optimization'),
  ('j6000000-0000-0000-0000-000000000006', 'Senior UX Designer & Data Analyst'),
  ('j7000000-0000-0000-0000-000000000007', 'Lead DevOps Engineer'),
  ('j8000000-0000-0000-0000-000000000008', 'HR Operations Manager'),
  ('j9000000-0000-0000-0000-000000000009', 'Senior Financial Controller'),
  ('j1010000-0000-0000-0000-000000000010', 'Frontend Intern')
on conflict (title) do nothing;

-- 3. Seed Employees
-- Note: If employees table references auth.users(id), these seeds require auth.users entries first.
-- In local development and testing, you can temporarily insert stub records into auth.users:
insert into auth.users (id, email) values
  ('e1000000-0000-0000-0000-000000000001', 'alex.garcia@acme.com'),
  ('e2000000-0000-0000-0000-000000000002', 'tanvi.l@acme.com'),
  ('e3000000-0000-0000-0000-000000000003', 'jack.g@acme.com'),
  ('e4000000-0000-0000-0000-000000000004', 'saad.j@acme.com'),
  ('e5000000-0000-0000-0000-000000000005', 'imani.a@acme.com'),
  ('e6000000-0000-0000-0000-000000000006', 'amahdy59@gmail.com'),
  ('e7000000-0000-0000-0000-000000000007', 'sarah.c@acme.com'),
  ('e8000000-0000-0000-0000-000000000008', 'tarek.a@acme.com'),
  ('e9000000-0000-0000-0000-000000000009', 'fatima.s@acme.com'),
  ('e1010000-0000-0000-0000-000000000010', 'john.d@acme.com')
on conflict (id) do nothing;

-- Populate public.employees (The signup trigger handle_new_user might do this, but running this directly guarantees matching details)
insert into public.employees (id, employee_number, first_name, last_name, email, phone, gender, department_id, job_title_id, contract_type, hire_date, activity_type, is_manager, img_url, role) values
  ('e1000000-0000-0000-0000-000000000001', '12345', 'Aleksander', 'Garcia', 'alex.garcia@acme.com', '+972(0) 2788-9451', 'Male', 'd1000000-0000-0000-0000-000000000001', 'j1000000-0000-0000-0000-000000000001', 'Freelance', '2023-04-15', 'Direct', false, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', 'Employee'),
  ('e2000000-0000-0000-0000-000000000002', '54321', 'Tanvi', 'Lumari', 'tanvi.l@acme.com', '+972(0) 2788-9452', 'Female', 'd2000000-0000-0000-0000-000000000002', 'j2000000-0000-0000-0000-000000000002', 'Permanent', '2022-01-10', 'Direct', true, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 'Manager'),
  ('e3000000-0000-0000-0000-000000000003', '98765', 'Jack', 'Gray', 'jack.g@acme.com', '+972(0) 2788-9453', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j3000000-0000-0000-0000-000000000003', 'Permanent', '2021-08-22', 'Direct', false, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 'Employee'),
  ('e4000000-0000-0000-0000-000000000004', '24680', 'Saad', 'Jawahir', 'saad.j@acme.com', '+972(0) 2788-9454', 'Male', 'd4000000-0000-0000-0000-000000000004', 'j4000000-0000-0000-0000-000000000004', 'Contractor', '2023-11-01', 'InDirect', false, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', 'Employee'),
  ('e5000000-0000-0000-0000-000000000005', '24252', 'Imani', 'Adimbola', 'imani.a@acme.com', '+972(0) 2788-9455', 'Female', 'd5000000-0000-0000-0000-000000000005', 'j5000000-0000-0000-0000-000000000005', 'Permanent', '2020-03-14', 'Direct', true, 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop', 'Manager'),
  ('e6000000-0000-0000-0000-000000000006', '30111', 'Ahmed', 'Mahdy', 'amahdy59@gmail.com', '+20 150 000 0111', 'Male', 'd6000000-0000-0000-0000-000000000006', 'j6000000-0000-0000-0000-000000000006', 'Permanent', '2023-01-15', 'Direct', true, '', 'Admin'),
  ('e7000000-0000-0000-0000-000000000007', '40222', 'Sarah', 'Connor', 'sarah.c@acme.com', '+972(0) 2788-9457', 'Female', 'd9000000-0000-0000-0000-000000000009', 'j7000000-0000-0000-0000-000000000007', 'Permanent', '2024-05-10', 'Direct', false, '', 'Employee'),
  ('e8000000-0000-0000-0000-000000000008', '50333', 'Tarek', 'Abdelaziz', 'tarek.a@acme.com', '+972(0) 2788-9458', 'Male', 'd7000000-0000-0000-0000-000000000007', 'j8000000-0000-0000-0000-000000000008', 'Permanent', '2022-09-01', 'Direct', true, '', 'Manager'),
  ('e9000000-0000-0000-0000-000000000009', '60444', 'Fatima', 'El-Sayed', 'fatima.s@acme.com', '+972(0) 2788-9459', 'Female', 'd8000000-0000-0000-0000-000000000008', 'j9000000-0000-0000-0000-000000000009', 'Permanent', '2023-02-28', 'Direct', false, '', 'Employee'),
  ('e1010000-0000-0000-0000-000000000010', '70555', 'John', 'Doe', 'john.d@acme.com', '+972(0) 2788-9460', 'Male', 'd3000000-0000-0000-0000-000000000003', 'j1010000-0000-0000-0000-000000000010', 'Intern', '2026-06-01', 'InDirect', false, '', 'Employee')
on conflict (id) do update set
  employee_number = excluded.employee_number,
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  department_id = excluded.department_id,
  job_title_id = excluded.job_title_id,
  role = excluded.role;

-- 4. Seed Leaves
insert into public.leaves (employee_id, leave_type, start_date, end_date, days_count, reason, status) values
  ('e2000000-0000-0000-0000-000000000002', 'Sick', '2026-09-10', '2026-09-14', 5, 'Fever and flu', 'Pending'),
  ('e3000000-0000-0000-0000-000000000003', 'Vacation', '2026-10-05', '2026-10-12', 8, 'Annual vacation', 'Pending');

-- 5. Seed Missions
insert into public.missions (employee_id, title, start_date, end_date, duration_days, destination, reason, status) values
  ('e2000000-0000-0000-0000-000000000002', 'Work From Home', '2026-09-10', '2026-09-14', 5, 'Remote / Home office', 'Project sprint focus time required', 'Pending'),
  ('e4000000-0000-0000-0000-000000000004', 'Client Visit', '2026-11-03', '2026-11-06', 4, 'Dubai Head Office', 'Onsite SCADA infrastructure audit', 'Approved');

-- 6. Seed Attendance
insert into public.attendance (employee_id, date, clock_in, clock_out, status, notes) values
  ('e1000000-0000-0000-0000-000000000001', '2026-06-25', '09:00:00', '17:00:00', 'Present', 'Normal checking'),
  ('e2000000-0000-0000-0000-000000000002', '2026-06-25', '10:15:00', '18:30:00', 'Late', 'Heavy traffic commute delay');

-- 7. Seed Payroll
insert into public.payroll (employee_id, month, basic_salary, allowances, deductions, bonuses, payment_status) values
  ('e1000000-0000-0000-0000-000000000001', '2026-06-01', 8500.00, 1500.00, 200.00, 500.00, 'Paid'),
  ('e2000000-0000-0000-0000-000000000002', '2026-06-01', 9200.00, 1800.00, 250.00, 600.00, 'Paid'),
  ('e3000000-0000-0000-0000-000000000003', '2026-06-01', 7800.00, 1200.00, 150.00, 400.00, 'Pending');
