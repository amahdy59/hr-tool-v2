-- Allow Permanent alongside Full-Time in contract_type check constraint
alter table public.employees drop constraint if exists employees_contract_type_check;
alter table public.employees add constraint employees_contract_type_check check (contract_type in ('Permanent', 'Full-Time', 'Part-Time', 'Contractor', 'Intern', 'Freelance'));

-- Ensure handle_new_user generates unique employee numbers
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
    coalesce(new.raw_user_meta_data->>'employee_number', 'EMP-' || replace(new.id::text, '-', '')),
    coalesce(new.raw_user_meta_data->>'first_name', 'New'),
    coalesce(new.raw_user_meta_data->>'last_name', 'Employee'),
    new.email,
    'Employee',
    current_date,
    'Full-Time',
    'Direct'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;
