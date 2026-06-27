-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. DEPARTMENTS
create table if not exists public.departments (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    dept_code text unique not null,
    created_at timestamptz default now()
);

-- 2. JOB TITLES
create table if not exists public.job_titles (
    id uuid primary key default gen_random_uuid(),
    title text unique not null,
    created_at timestamptz default now()
);

-- 3. EMPLOYEES (Linked with Supabase Auth users)
create table if not exists public.employees (
    id uuid primary key references auth.users(id) on delete cascade,
    employee_number text unique not null,
    first_name text not null,
    last_name text not null,
    first_name_ar text,
    last_name_ar text,
    email text unique not null,
    phone text,
    gender text check (gender in ('Male', 'Female')),
    department_id uuid references public.departments(id) on delete set null,
    job_title_id uuid references public.job_titles(id) on delete set null,
    contract_type text check (contract_type in ('Full-Time', 'Part-Time', 'Contractor', 'Intern', 'Freelance')),
    source_system text,
    hire_date date not null default current_date,
    activity_type text check (activity_type in ('Direct', 'InDirect')),
    is_manager boolean not null default false,
    img_url text,
    role text check (role in ('Admin', 'Manager', 'Employee')) default 'Employee',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. LEAVES / VACATIONS
create table if not exists public.leaves (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    leave_type text not null,
    start_date date not null,
    end_date date not null,
    days_count integer not null,
    reason text,
    status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
    approved_by uuid references public.employees(id) on delete set null,
    created_at timestamptz default now(),
    constraint check_dates check (start_date <= end_date)
);

-- 5. MISSIONS
create table if not exists public.missions (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    title text not null,
    start_date date not null,
    end_date date not null,
    duration_days integer not null,
    destination text not null,
    reason text,
    status text check (status in ('Pending', 'Approved', 'Rejected')) default 'Pending',
    approved_by uuid references public.employees(id) on delete set null,
    created_at timestamptz default now(),
    constraint check_dates check (start_date <= end_date)
);

-- 6. ATTENDANCE
create table if not exists public.attendance (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    date date not null default current_date,
    clock_in time,
    clock_out time,
    status text check (status in ('Present', 'Absent', 'Late', 'On Leave')) not null,
    notes text,
    created_at timestamptz default now(),
    unique (employee_id, date)
);

-- 7. PAYROLL
create table if not exists public.payroll (
    id uuid primary key default gen_random_uuid(),
    employee_id uuid references public.employees(id) on delete cascade not null,
    month date not null, -- First day of the payroll month (e.g. '2026-06-01')
    basic_salary numeric(12, 2) not null check (basic_salary >= 0),
    allowances numeric(12, 2) not null default 0.00 check (allowances >= 0),
    deductions numeric(12, 2) not null default 0.00 check (deductions >= 0),
    bonuses numeric(12, 2) not null default 0.00 check (bonuses >= 0),
    net_salary numeric(12, 2) not null generated always as (basic_salary + allowances + bonuses - deductions) stored,
    payment_status text check (payment_status in ('Paid', 'Pending')) default 'Pending',
    created_at timestamptz default now(),
    unique (employee_id, month)
);

-- 8. ACTIVITY LOG
create table if not exists public.activity_log (
    id uuid primary key default gen_random_uuid(),
    admin_id uuid references public.employees(id) on delete set null,
    action text not null,
    date timestamptz not null default now(),
    affected_employee_number text,
    details jsonb
);

-- Enable RLS on all tables
alter table public.departments enable row level security;
alter table public.job_titles enable row level security;
alter table public.employees enable row level security;
alter table public.leaves enable row level security;
alter table public.missions enable row level security;
alter table public.attendance enable row level security;
alter table public.payroll enable row level security;
alter table public.activity_log enable row level security;

-- Setup basic RLS select rules (allowing users to view all records in directories for search functionality)
create policy "Allow read access to authenticated users on departments"
  on public.departments for select to authenticated using (true);

create policy "Allow read access to authenticated users on job_titles"
  on public.job_titles for select to authenticated using (true);

create policy "Allow read access to authenticated users on employees"
  on public.employees for select to authenticated using (true);

create policy "Allow read/write access to employees for their own leaves"
  on public.leaves for all to authenticated using (auth.uid() = employee_id);

create policy "Allow read/write access to employees for their own missions"
  on public.missions for all to authenticated using (auth.uid() = employee_id);

create policy "Allow read/write access to employees for their own attendance"
  on public.attendance for all to authenticated using (auth.uid() = employee_id);

create policy "Allow read access to employees for their own payroll"
  on public.payroll for select to authenticated using (auth.uid() = employee_id);

-- trigger for auto signup profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.employees (
    id, 
    employee_number, 
    first_name, 
    last_name, 
    email, 
    role, 
    hire_date,
    contract_type,
    activity_type
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'employee_number', substring(new.id::text from 1 for 8)),
    coalesce(new.raw_user_meta_data->>'first_name', 'New'),
    coalesce(new.raw_user_meta_data->>'last_name', 'Employee'),
    new.email,
    'Employee',
    current_date,
    'Full-Time',
    'Direct'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
