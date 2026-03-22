-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  CET CONNECT PORTAL — UNIFIED SCHEMA (UPDATED)                          ║
-- ║  Qualification : FET Certificate: IT Systems Development (SAQA 78965)   ║
-- ║  NQF Level     : 4 | Provider: Data Science Academy                     ║
-- ║  Supabase proj : ebzsvbbmahvqlshydkxg                                   ║
-- ║                                                                          ║
-- ║  ARCHITECTURE:                                                          ║
-- ║    - auth.users: Authentication only (email, password)                  ║
-- ║    - cet.learners: All learner profile data (single source of truth)    ║
-- ║    - No dependency on public.users table                                ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- ── 0. Extensions ────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ── 1. Schema + grants ───────────────────────────────────────────────────────
create schema if not exists cet;

grant usage on schema cet to authenticated;
grant usage on schema cet to service_role;

-- ── 2. ENUMs ─────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role' and typnamespace = (select oid from pg_namespace where nspname = 'cet')) then
    create type cet.user_role as enum ('admin', 'lecturer', 'learner');
  end if;
  if not exists (select 1 from pg_type where typname = 'module_type' and typnamespace = (select oid from pg_namespace where nspname = 'cet')) then
    create type cet.module_type as enum ('Knowledge', 'Practical');
  end if;
  if not exists (select 1 from pg_type where typname = 'record_status' and typnamespace = (select oid from pg_namespace where nspname = 'cet')) then
    create type cet.record_status as enum ('Ready', 'In Progress', 'Not Started');
  end if;
  if not exists (select 1 from pg_type where typname = 'assessment_type' and typnamespace = (select oid from pg_namespace where nspname = 'cet')) then
    create type cet.assessment_type as enum ('Formative', 'Summative');
  end if;
end
$$;

-- ── 3. Shared trigger function ───────────────────────────────────────────────
create or replace function cet.set_updated_at () returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── 4. Tables ────────────────────────────────────────────────────────────────

-- 4a. Programs
create table if not exists cet.programs (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  saqa_id text unique not null,
  nqf_level integer,
  total_credits integer,
  provider text,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4b. Modules
create table if not exists cet.modules (
  id uuid primary key default gen_random_uuid (),
  program_id uuid not null references cet.programs (id) on delete cascade,
  title text not null,
  unit_standard_id text unique,
  module_type cet.module_type,
  block_no integer,
  day_label text,
  credits integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4c. Learners (SINGLE SOURCE OF TRUTH for profile data)
create table if not exists cet.learners (
  id uuid primary key default gen_random_uuid (),
  user_id uuid references auth.users (id) on delete cascade unique,
  learner_code text unique,
  full_name text,
  display_name text,
  email text,
  phone text,
  id_number text,
  department text,
  school text,
  bio text,
  avatar_url text,
  location text,
  website text,
  role text default 'learner',
  status text default 'Active' check (status in ('Active', 'Inactive', 'Graduated')),
  progress integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4d. Enrollments
create table if not exists cet.enrollments (
  id uuid primary key default gen_random_uuid (),
  learner_id uuid not null references cet.learners (id) on delete cascade,
  program_id uuid not null references cet.programs (id) on delete cascade,
  enrollment_date timestamptz not null default now(),
  status text not null default 'Active' check (status in ('Active', 'Completed', 'Dropped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_id, program_id)
);

-- 4e. Attendance Sessions
create table if not exists cet.attendance_sessions (
  id uuid primary key default gen_random_uuid (),
  module_id uuid not null references cet.modules (id) on delete cascade,
  session_date date not null,
  session_label text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, session_date)
);

-- 4f. Attendance Records
create table if not exists cet.attendance_records (
  id uuid primary key default gen_random_uuid (),
  session_id uuid not null references cet.attendance_sessions (id) on delete cascade,
  learner_id uuid not null references cet.learners (id) on delete cascade,
  present boolean not null default true,
  check_in_at timestamptz,
  check_out_at timestamptz,
  marked_by uuid references auth.users (id) on delete set null,
  marked_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, learner_id)
);

-- 4g. Assessments
create table if not exists cet.assessments (
  id uuid primary key default gen_random_uuid (),
  module_id uuid not null references cet.modules (id) on delete cascade,
  type cet.assessment_type not null,
  title text not null,
  weight numeric check (weight >= 0 and weight <= 100),
  instructions text,
  due_date timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4h. Assessment Results
create table if not exists cet.assessment_results (
  id uuid primary key default gen_random_uuid (),
  assessment_id uuid not null references cet.assessments (id) on delete cascade,
  learner_id uuid not null references cet.learners (id) on delete cascade,
  score numeric check (score >= 0 and score <= 100),
  feedback text,
  graded_by uuid references auth.users (id) on delete set null,
  graded_at timestamptz,
  submitted_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, learner_id)
);

-- 4i. Announcements
create table if not exists cet.announcements (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  message text not null,
  audience text not null default 'All' check (audience in ('All', 'Block 1', 'Block 2', 'Admin Only')),
  pinned boolean not null default false,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4j. Learner Progress
create table if not exists cet.learner_progress (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_unit_standard_id text not null,
  guide_completed boolean not null default false,
  quiz_passed boolean not null default false,
  assessment_unlocked boolean not null default false,
  submission_path text,
  submission_uploaded_at timestamptz,
  assessment_submitted boolean not null default false,
  assessment_submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_unit_standard_id)
);

-- 4k. Module content flows
create table if not exists cet.module_content_flows (
  id uuid primary key default gen_random_uuid (),
  unit_standard_id text unique not null,
  flow jsonb not null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4l. Conversations
create table if not exists cet.conversations (
  id uuid primary key default gen_random_uuid (),
  participant_a uuid not null references auth.users (id) on delete cascade,
  participant_b uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_conversation check (participant_a <> participant_b)
);

-- 4m. Messages
create table if not exists cet.messages (
  id uuid primary key default gen_random_uuid (),
  conversation_id uuid not null references cet.conversations (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (length(trim(body)) > 0),
  sent_at timestamptz not null default now(),
  read_at timestamptz
);

-- 4n. Assessment OTP
create table if not exists cet.assessment_otp (
  id uuid primary key default gen_random_uuid (),
  module_id text not null,
  otp_code text not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  is_active boolean not null default true
);

-- ── 5. Indexes ───────────────────────────────────────────────────────────────
create index if not exists idx_cet_modules_program_id on cet.modules (program_id);
create index if not exists idx_cet_modules_block_no on cet.modules (block_no);
create index if not exists idx_cet_learners_user_id on cet.learners (user_id);
create index if not exists idx_cet_learners_learner_code on cet.learners (learner_code);
create index if not exists idx_cet_learners_role on cet.learners (role);
create index if not exists idx_cet_enrollments_learner_id on cet.enrollments (learner_id);
create index if not exists idx_cet_enrollments_program_id on cet.enrollments (program_id);
create index if not exists idx_cet_attendance_sessions_mod_id on cet.attendance_sessions (module_id);
create index if not exists idx_cet_attendance_records_chkin on cet.attendance_records (check_in_at);
create index if not exists idx_cet_attendance_records_chkout on cet.attendance_records (check_out_at);
create index if not exists idx_cet_attendance_records_lrn_id on cet.attendance_records (learner_id);
create index if not exists idx_cet_assessments_module_id on cet.assessments (module_id);
create index if not exists idx_cet_assessment_results_lrn_id on cet.assessment_results (learner_id);
create index if not exists idx_cet_learner_progress_user_id on cet.learner_progress (user_id);
create index if not exists idx_cet_module_content_flows_std on cet.module_content_flows (unit_standard_id);
create index if not exists idx_messages_conversation_id on cet.messages (conversation_id);
create index if not exists idx_messages_sent_at on cet.messages (sent_at);

-- Unique conversation pair (order-independent)
create unique index if not exists idx_conversations_pair on cet.conversations (
  least(participant_a::text, participant_b::text),
  greatest(participant_a::text, participant_b::text)
);

-- ── 6. Triggers ──────────────────────────────────────────────────────────────
do $$
declare tbl text;
begin
  foreach tbl in array array[
    'programs','modules','learners','assessments','assessment_results',
    'announcements','learner_progress','module_content_flows','conversations'
  ] loop
    execute format('drop trigger if exists set_%s_updated_at on cet.%I', tbl, tbl);
    execute format(
      'create trigger set_%s_updated_at before update on cet.%I for each row execute function cet.set_updated_at()',
      tbl, tbl
    );
  end loop;
end
$$;

-- ── 7. RLS Policies ─────────────────────────────────────────────────────────
alter table cet.programs enable row level security;
alter table cet.modules enable row level security;
alter table cet.learners enable row level security;
alter table cet.enrollments enable row level security;
alter table cet.attendance_sessions enable row level security;
alter table cet.attendance_records enable row level security;
alter table cet.assessments enable row level security;
alter table cet.assessment_results enable row level security;
alter table cet.announcements enable row level security;
alter table cet.learner_progress enable row level security;
alter table cet.module_content_flows enable row level security;
alter table cet.conversations enable row level security;
alter table cet.messages enable row level security;
alter table cet.assessment_otp enable row level security;

-- Drop existing policies
do $$
declare p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'cet'
  loop
    execute format('drop policy if exists %I on cet.%I', p.policyname, p.tablename);
  end loop;
end
$$;

-- Learners policies
create policy "Admins and lecturers can read learners" on cet.learners for select
  using (cet.get_my_role() in ('admin', 'lecturer'));
create policy "Learners can read own record" on cet.learners for select
  using (user_id = auth.uid());
create policy "Learners can update own record" on cet.learners for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- (Continue with other policies similar to original but using cet.learners.role instead of public.users)

-- ── 8. RPC Functions ─────────────────────────────────────────────────────────

-- Get my profile (from auth.users + cet.learners)
create or replace function public.cet_get_my_profile_v2()
returns table (
  id uuid,
  email text,
  full_name text,
  display_name text,
  phone text,
  id_number text,
  department text,
  school text,
  bio text,
  avatar_url text,
  location text,
  website text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
) language sql security definer
set search_path = public, cet as $$
  select 
    au.id,
    au.email,
    l.full_name,
    coalesce(l.display_name, l.full_name, split_part(au.email, '@', 1)) as display_name,
    l.phone,
    l.id_number,
    l.department,
    l.school,
    l.bio,
    l.avatar_url,
    l.location,
    l.website,
    l.role,
    l.created_at,
    l.updated_at
  from auth.users au
  left join cet.learners l on l.user_id = au.id
  where au.id = auth.uid();
$$;

-- Update my profile (only updates cet.learners)
create or replace function public.cet_update_my_profile_v2 (
  p_full_name text default null,
  p_display_name text default null,
  p_phone text default null,
  p_id_number text default null,
  p_department text default null,
  p_school text default null,
  p_bio text default null,
  p_avatar_url text default null,
  p_location text default null,
  p_website text default null,
  p_role text default null
) returns table (
  id uuid,
  email text,
  full_name text,
  display_name text,
  phone text,
  id_number text,
  department text,
  school text,
  bio text,
  avatar_url text,
  location text,
  website text,
  role text,
  created_at timestamptz,
  updated_at timestamptz
) language plpgsql security definer
set search_path = public, cet as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text;
  v_learner_code text;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  -- Get user email
  select email into v_user_email from auth.users where id = v_user_id;

  -- Clean inputs
  p_full_name := nullif(trim(coalesce(p_full_name, '')), '');
  p_display_name := nullif(trim(coalesce(p_display_name, '')), '');
  p_phone := nullif(trim(coalesce(p_phone, '')), '');
  p_id_number := nullif(trim(coalesce(p_id_number, '')), '');
  p_department := nullif(trim(coalesce(p_department, '')), '');
  p_school := nullif(trim(coalesce(p_school, '')), '');
  p_bio := nullif(trim(coalesce(p_bio, '')), '');
  p_avatar_url := nullif(trim(coalesce(p_avatar_url, '')), '');
  p_location := nullif(trim(coalesce(p_location, '')), '');
  p_website := nullif(trim(coalesce(p_website, '')), '');
  p_role := nullif(trim(coalesce(p_role, '')), '');

  -- Get or generate learner_code
  select learner_code into v_learner_code from cet.learners where user_id = v_user_id;
  if v_learner_code is null then
    v_learner_code := 'L-' || upper(substr(replace(v_user_id::text, '-', ''), 1, 7));
  end if;

  -- Upsert learner
  insert into cet.learners (
    user_id, full_name, display_name, phone, id_number,
    department, school, bio, avatar_url, location,
    website, role, learner_code, status, progress
  ) values (
    v_user_id,
    p_full_name,
    coalesce(p_display_name, p_full_name, split_part(v_user_email, '@', 1)),
    p_phone,
    p_id_number,
    p_department,
    p_school,
    p_bio,
    p_avatar_url,
    p_location,
    p_website,
    coalesce(p_role, 'learner'),
    v_learner_code,
    'Active',
    0
  ) on conflict (user_id) do update set
    full_name = coalesce(excluded.full_name, cet.learners.full_name),
    display_name = coalesce(excluded.display_name, cet.learners.display_name),
    phone = coalesce(excluded.phone, cet.learners.phone),
    id_number = coalesce(excluded.id_number, cet.learners.id_number),
    department = coalesce(excluded.department, cet.learners.department),
    school = coalesce(excluded.school, cet.learners.school),
    bio = coalesce(excluded.bio, cet.learners.bio),
    avatar_url = coalesce(excluded.avatar_url, cet.learners.avatar_url),
    location = coalesce(excluded.location, cet.learners.location),
    website = coalesce(excluded.website, cet.learners.website),
    role = coalesce(excluded.role, cet.learners.role),
    updated_at = now();

  return query select * from public.cet_get_my_profile_v2();
end;
$$;

-- Auto-create learner on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into cet.learners (user_id, full_name, display_name, learner_code, status)
  values (
    new.id,
    split_part(new.email, '@', 1),
    split_part(new.email, '@', 1),
    'L-' || upper(substr(replace(new.id::text, '-', ''), 1, 7)),
    'Active'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Get user role helper
create or replace function cet.get_my_role() returns cet.user_role language sql stable security definer
set search_path = public, cet as $$
  select coalesce(
    (select role::cet.user_role from cet.learners where user_id = auth.uid()),
    'learner'::cet.user_role
  );
$$;

-- Grant permissions
grant execute on function public.cet_get_my_profile_v2() to authenticated;
grant execute on function public.cet_update_my_profile_v2(text, text, text, text, text, text, text, text, text, text, text) to authenticated;
grant execute on function cet.get_my_role() to authenticated;

-- ── 9. Grant table permissions ───────────────────────────────────────────────
grant select on table cet.programs, cet.modules, cet.enrollments, cet.learners,
  cet.attendance_sessions, cet.attendance_records, cet.assessments,
  cet.assessment_results, cet.announcements, cet.learner_progress,
  cet.module_content_flows, cet.conversations, cet.messages to authenticated;
grant insert, update on cet.learners to authenticated;
grant insert, update on cet.learner_progress to authenticated;

-- ── 10. Realtime publications ───────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'cet' and tablename = 'announcements') then
    alter publication supabase_realtime add table cet.announcements;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'cet' and tablename = 'conversations') then
    alter publication supabase_realtime add table cet.conversations;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'cet' and tablename = 'messages') then
    alter publication supabase_realtime add table cet.messages;
  end if;
end
$$;

-- ── End of updated unified schema ───────────────────────────────────────────