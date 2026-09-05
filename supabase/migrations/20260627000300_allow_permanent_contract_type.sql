-- Allow Permanent alongside Full-Time in contract_type check constraint
alter table public.employees drop constraint if exists employees_contract_type_check;
alter table public.employees add constraint employees_contract_type_check check (contract_type in ('Permanent', 'Full-Time', 'Part-Time', 'Contractor', 'Intern', 'Freelance'));
