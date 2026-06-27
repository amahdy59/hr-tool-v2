create or replace function public.create_leave_for_employee(
  p_employee_id uuid,
  p_leave_type text,
  p_start_date date,
  p_end_date date,
  p_days_count integer,
  p_reason text default null
)
returns public.leaves
language plpgsql
security definer
set search_path = public
as $$
declare
  created_leave public.leaves;
begin
  if p_start_date > p_end_date then
    raise exception 'Start date must be before or equal to end date';
  end if;

  if p_days_count < 1 then
    raise exception 'Days count must be at least 1';
  end if;

  if not exists (select 1 from public.employees where id = p_employee_id) then
    raise exception 'Employee does not exist';
  end if;

  insert into public.leaves (
    employee_id,
    leave_type,
    start_date,
    end_date,
    days_count,
    reason,
    status
  )
  values (
    p_employee_id,
    p_leave_type,
    p_start_date,
    p_end_date,
    p_days_count,
    p_reason,
    'Pending'
  )
  returning * into created_leave;

  return created_leave;
end;
$$;

create or replace function public.create_mission_for_employee(
  p_employee_id uuid,
  p_title text,
  p_start_date date,
  p_end_date date,
  p_duration_days integer,
  p_destination text default 'Remote / Client Site',
  p_reason text default null
)
returns public.missions
language plpgsql
security definer
set search_path = public
as $$
declare
  created_mission public.missions;
begin
  if p_start_date > p_end_date then
    raise exception 'Start date must be before or equal to end date';
  end if;

  if p_duration_days < 1 then
    raise exception 'Duration must be at least 1 day';
  end if;

  if not exists (select 1 from public.employees where id = p_employee_id) then
    raise exception 'Employee does not exist';
  end if;

  insert into public.missions (
    employee_id,
    title,
    start_date,
    end_date,
    duration_days,
    destination,
    reason,
    status
  )
  values (
    p_employee_id,
    p_title,
    p_start_date,
    p_end_date,
    p_duration_days,
    coalesce(nullif(p_destination, ''), 'Remote / Client Site'),
    p_reason,
    'Pending'
  )
  returning * into created_mission;

  return created_mission;
end;
$$;

grant execute on function public.create_leave_for_employee(uuid, text, date, date, integer, text) to anon, authenticated;
grant execute on function public.create_mission_for_employee(uuid, text, date, date, integer, text, text) to anon, authenticated;
