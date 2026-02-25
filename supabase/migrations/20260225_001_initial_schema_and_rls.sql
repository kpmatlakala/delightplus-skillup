create extension if not exists pgcrypto;

create schema if not exists cet;

grant usage on schema cet to authenticated;
grant usage on schema cet to service_role;

grant select on table
  cet.modules,
  cet.enrollments,
  cet.learners,
  cet.attendance_sessions,
  cet.attendance_records
to authenticated;

grant insert on table
  cet.attendance_sessions,
  cet.attendance_records
to authenticated;

grant update on table
  cet.attendance_records
to authenticated;

create type cet.user_role as enum ('admin', 'lecturer', 'learner');
create type cet.module_type as enum ('Knowledge', 'Practical');
create type cet.record_status as enum ('Ready', 'In Progress', 'Not Started');
create type cet.assessment_type as enum ('Formative', 'Summative');

create or replace function cet.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table cet.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  saqa_id text unique not null,
  nqf_level integer not null check (nqf_level >= 1 and nqf_level <= 10),
  total_credits integer not null check (total_credits >= 0),
  provider text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_programs_updated_at
before update on cet.programs
for each row
execute function cet.set_updated_at();

create table cet.modules (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references cet.programs(id) on delete cascade,
  unit_standard_id text,
  code text,
  title text not null,
  type cet.module_type not null,
  credits integer not null check (credits >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  block_no integer not null check (block_no > 0),
  day_label text,
  status cet.record_status not null default 'Not Started',
  objectives text[] not null default '{}',
  content text[] not null default '{}',
  activities text[] not null default '{}',
  resources text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, code)
);

create trigger set_modules_updated_at
before update on cet.modules
for each row
execute function cet.set_updated_at();

create table cet.learners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  learner_code text unique not null,
  full_name text not null,
  email text,
  phone text,
  status text not null default 'Active',
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_learners_updated_at
before update on cet.learners
for each row
execute function cet.set_updated_at();

create table cet.enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references cet.learners(id) on delete cascade,
  program_id uuid not null references cet.programs(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  status text not null default 'Active',
  unique (learner_id, program_id)
);

create table cet.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references cet.modules(id) on delete cascade,
  session_date date not null,
  session_label text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (module_id, session_date)
);

create table cet.attendance_records (
  session_id uuid not null references cet.attendance_sessions(id) on delete cascade,
  learner_id uuid not null references cet.learners(id) on delete cascade,
  present boolean not null,
  check_in_at timestamptz,
  check_out_at timestamptz,
  marked_by uuid references auth.users(id) on delete set null,
  marked_at timestamptz not null default now(),
  primary key (session_id, learner_id)
);

create table cet.assessments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references cet.modules(id) on delete cascade,
  title text not null,
  type cet.assessment_type not null,
  max_marks integer check (max_marks is null or max_marks >= 0),
  weight integer not null check (weight >= 0),
  status cet.record_status not null default 'Not Started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_assessments_updated_at
before update on cet.assessments
for each row
execute function cet.set_updated_at();

create table cet.assessment_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references cet.assessments(id) on delete cascade,
  learner_id uuid not null references cet.learners(id) on delete cascade,
  score numeric,
  feedback text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, learner_id)
);

create trigger set_assessment_results_updated_at
before update on cet.assessment_results
for each row
execute function cet.set_updated_at();

create table cet.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  published_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_announcements_updated_at
before update on cet.announcements
for each row
execute function cet.set_updated_at();

create or replace function cet.get_my_role()
returns cet.user_role
language sql
stable
security definer
set search_path = public, cet
as $$
  select
    case coalesce(u.role, 'user')
      when 'admin' then 'admin'::cet.user_role
      when 'moderator' then 'lecturer'::cet.user_role
      else 'learner'::cet.user_role
    end
  from public.users u
  where u.id = auth.uid();
$$;

grant execute on function cet.get_my_role() to authenticated;

alter table cet.programs enable row level security;
alter table cet.modules enable row level security;
alter table cet.learners enable row level security;
alter table cet.enrollments enable row level security;
alter table cet.attendance_sessions enable row level security;
alter table cet.attendance_records enable row level security;
alter table cet.assessments enable row level security;
alter table cet.assessment_results enable row level security;
alter table cet.announcements enable row level security;

create policy "Authenticated users can read programs"
on cet.programs
for select
using (auth.role() = 'authenticated');

create policy "Admins and lecturers can manage programs"
on cet.programs
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Authenticated users can read modules"
on cet.modules
for select
using (auth.role() = 'authenticated');

create policy "Admins and lecturers can manage modules"
on cet.modules
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Admins and lecturers can read learners"
on cet.learners
for select
using (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Learners can read own record"
on cet.learners
for select
using (user_id = auth.uid());

create policy "Admins and lecturers can manage learners"
on cet.learners
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Admins and lecturers can read enrollments"
on cet.enrollments
for select
using (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Learners can read own enrollments"
on cet.enrollments
for select
using (
  exists (
    select 1
    from cet.learners l
    where l.id = learner_id
      and l.user_id = auth.uid()
  )
);

create policy "Admins and lecturers can manage enrollments"
on cet.enrollments
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Admins and lecturers can read attendance sessions"
on cet.attendance_sessions
for select
using (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Admins and lecturers can manage attendance sessions"
on cet.attendance_sessions
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Admins and lecturers can read attendance records"
on cet.attendance_records
for select
using (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Learners can read own attendance records"
on cet.attendance_records
for select
using (
  exists (
    select 1
    from cet.learners l
    where l.id = learner_id
      and l.user_id = auth.uid()
  )
);

create policy "Admins and lecturers can manage attendance records"
on cet.attendance_records
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Authenticated users can read assessments"
on cet.assessments
for select
using (auth.role() = 'authenticated');

create policy "Admins and lecturers can manage assessments"
on cet.assessments
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Admins and lecturers can read all assessment results"
on cet.assessment_results
for select
using (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Learners can read own assessment results"
on cet.assessment_results
for select
using (
  exists (
    select 1
    from cet.learners l
    where l.id = learner_id
      and l.user_id = auth.uid()
  )
);

create policy "Admins and lecturers can manage assessment results"
on cet.assessment_results
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create policy "Authenticated users can read announcements"
on cet.announcements
for select
using (auth.role() = 'authenticated');

create policy "Admins and lecturers can manage announcements"
on cet.announcements
for all
using (cet.get_my_role() in ('admin', 'lecturer'))
with check (cet.get_my_role() in ('admin', 'lecturer'));

create index idx_cet_modules_program_id on cet.modules(program_id);
create index idx_cet_modules_block_no on cet.modules(block_no);
create index idx_cet_learners_user_id on cet.learners(user_id);
create index idx_cet_enrollments_learner_id on cet.enrollments(learner_id);
create index idx_cet_enrollments_program_id on cet.enrollments(program_id);
create index idx_cet_attendance_sessions_module_id on cet.attendance_sessions(module_id);
create index idx_cet_attendance_records_learner_id on cet.attendance_records(learner_id);
create index idx_cet_assessments_module_id on cet.assessments(module_id);
create index idx_cet_assessment_results_learner_id on cet.assessment_results(learner_id);

comment on function cet.get_my_role is 'Maps public.users.role to CET roles: admin->admin, moderator->lecturer, user->learner.';
