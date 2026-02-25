create or replace function public.cet_enrolled_learners()
returns table (
  id uuid,
  learner_code text,
  full_name text,
  email text,
  phone text,
  status text,
  progress integer
)
language sql
stable
set search_path = public, cet
as $$
  select distinct
    l.id,
    l.learner_code,
    l.full_name,
    l.email,
    l.phone,
    l.status,
    l.progress
  from cet.enrollments e
  join cet.learners l on l.id = e.learner_id
  where e.status = 'Active'
  order by l.full_name;
$$;

create or replace function public.cet_modules()
returns table (
  id uuid,
  title text,
  day_label text,
  block_no integer
)
language sql
stable
set search_path = public, cet
as $$
  select m.id, m.title, m.day_label, m.block_no
  from cet.modules m
  order by m.block_no, m.day_label nulls last, m.title;
$$;

create or replace function public.cet_get_or_create_attendance_session(
  p_module_id uuid,
  p_session_date date,
  p_created_by uuid default null,
  p_session_label text default null
)
returns uuid
language plpgsql
set search_path = public, cet
as $$
declare
  v_session_id uuid;
begin
  select id into v_session_id
  from cet.attendance_sessions
  where module_id = p_module_id
    and session_date = p_session_date
  limit 1;

  if v_session_id is not null then
    return v_session_id;
  end if;

  insert into cet.attendance_sessions (module_id, session_date, session_label, created_by)
  values (p_module_id, p_session_date, coalesce(p_session_label, 'Session ' || p_session_date::text), p_created_by)
  on conflict (module_id, session_date)
  do update set session_label = coalesce(cet.attendance_sessions.session_label, excluded.session_label)
  returning id into v_session_id;

  return v_session_id;
end;
$$;

create or replace function public.cet_get_attendance_records(p_session_id uuid)
returns table (
  learner_id uuid,
  present boolean,
  check_in_at timestamptz,
  check_out_at timestamptz
)
language sql
stable
set search_path = public, cet
as $$
  select ar.learner_id, ar.present, ar.check_in_at, ar.check_out_at
  from cet.attendance_records ar
  where ar.session_id = p_session_id;
$$;

create or replace function public.cet_check_in(
  p_session_id uuid,
  p_learner_id uuid,
  p_marked_by uuid default null
)
returns void
language plpgsql
set search_path = public, cet
as $$
begin
  insert into cet.attendance_records (
    session_id,
    learner_id,
    present,
    check_in_at,
    marked_by,
    marked_at
  )
  values (
    p_session_id,
    p_learner_id,
    true,
    now(),
    p_marked_by,
    now()
  )
  on conflict (session_id, learner_id)
  do update
  set
    present = true,
    check_in_at = coalesce(cet.attendance_records.check_in_at, now()),
    marked_by = excluded.marked_by,
    marked_at = now();
end;
$$;

create or replace function public.cet_check_out(
  p_session_id uuid,
  p_learner_id uuid,
  p_marked_by uuid default null
)
returns void
language plpgsql
set search_path = public, cet
as $$
begin
  update cet.attendance_records
  set
    present = true,
    check_out_at = now(),
    marked_by = p_marked_by,
    marked_at = now()
  where session_id = p_session_id
    and learner_id = p_learner_id;
end;
$$;

grant execute on function public.cet_enrolled_learners() to authenticated;
grant execute on function public.cet_modules() to authenticated;
grant execute on function public.cet_get_or_create_attendance_session(uuid, date, uuid, text) to authenticated;
grant execute on function public.cet_get_attendance_records(uuid) to authenticated;
grant execute on function public.cet_check_in(uuid, uuid, uuid) to authenticated;
grant execute on function public.cet_check_out(uuid, uuid, uuid) to authenticated;
