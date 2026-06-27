-- Seed Departments
insert into public.departments (name, dept_code) values
  ('Marketing', 'DEPT-MKT'),
  ('Sales', 'DEPT-SLS'),
  ('Software', 'DEPT-SFT'),
  ('SCADA', 'DEPT-SCA'),
  ('Oil & Gas', 'DEPT-ONG'),
  ('IT', 'DEPT-IT'),
  ('HR', 'DEPT-HR'),
  ('Finance', 'DEPT-FIN'),
  ('Engineering', 'DEPT-ENG')
on conflict (name) do nothing;

-- Seed Job Titles
insert into public.job_titles (title) values
  ('Senior Solutions Architect'),
  ('Global Operations Manager'),
  ('Senior Project Manager'),
  ('Senior Cybersecurity Specialist'),
  ('Director of Supply Chain Optimization'),
  ('Senior UX Designer & Data Analyst'),
  ('Lead DevOps Engineer'),
  ('HR Operations Manager'),
  ('Senior Financial Controller'),
  ('Frontend Intern')
on conflict (title) do nothing;
