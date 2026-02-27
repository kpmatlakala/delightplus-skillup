-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  CET CONNECT PORTAL — UNIFIED SCHEMA                                    ║
-- ║  Qualification : FET Certificate: IT Systems Development (SAQA 78965)   ║
-- ║  NQF Level     : 4 | Provider: Data Science Academy                     ║
-- ║  Supabase proj : ebzsvbbmahvqlshydkxg                                   ║
-- ║                                                                          ║
-- ║  USAGE                                                                   ║
-- ║    Run this single file against any fresh Postgres / Supabase instance  ║
-- ║    to reproduce the complete production schema.                          ║
-- ║    It is fully idempotent — safe to re-run on an existing instance.     ║
-- ║                                                                          ║
-- ║  PREREQUISITE                                                            ║
-- ║    public.users  — Supabase extended-auth user table (auto-created by   ║
-- ║    the Supabase platform). Columns used:                                ║
-- ║      id uuid, username text, display_name text, bio text,               ║
-- ║      avatar_url text, location text, website text, role text,           ║
-- ║      reputation integer, app_metadata jsonb,                            ║
-- ║      created_at timestamptz, updated_at timestamptz                     ║
-- ║                                                                          ║
-- ║  MIGRATIONS CONSOLIDATED                                                 ║
-- ║    001  Initial schema + RLS          (2026-02-25)                       ║
-- ║    002  Attendance check-in/out cols  (2026-02-25)                       ║
-- ║    003  Public RPC bridge             (2026-02-25)                       ║
-- ║    004  Grant CET table privileges   (2026-02-25)                       ║
-- ║    005  Auto-register learner on login(2026-02-25)                       ║
-- ║    006  Profile RPC v1               (2026-02-25)                       ║
-- ║    007  Profile v2 + phone support   (2026-02-25)                       ║
-- ║    008  Fix profile role ambiguity   (2026-02-25)                       ║
-- ║    009  Fix profile id ambiguity     (2026-02-25)                       ║
-- ║    010  Backfill + harden enrollments(2026-02-25)                       ║
-- ║    011  Learner progress tracking    (2026-02-25)                       ║
-- ║    012  Module content flows (JSONB) (2026-02-25)                       ║
-- ║    013  Announcements + realtime     (2026-02-27)                       ║
-- ║    014  Learner directory RPC        (2026-02-27)  superseded by 015    ║
-- ║    015  Direct messaging + realtime  (2026-02-27)                       ║
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

create or replace function cet.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── 4. Tables ────────────────────────────────────────────────────────────────

-- 4a. Programs
create table if not exists cet.programs (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  saqa_id       text        unique not null,
  nqf_level     integer     not null check (nqf_level >= 1 and nqf_level <= 10),
  total_credits integer     not null check (total_credits >= 0),
  provider      text        not null,
  is_active     boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 4b. Modules
create table if not exists cet.modules (
  id                  uuid              primary key default gen_random_uuid(),
  program_id          uuid              not null references cet.programs(id) on delete cascade,
  unit_standard_id    text,
  code                text,
  title               text              not null,
  type                cet.module_type   not null,
  credits             integer           not null check (credits >= 0),
  duration_minutes    integer           not null check (duration_minutes > 0),
  block_no            integer           not null check (block_no > 0),
  day_label           text,
  status              cet.record_status not null default 'Not Started',
  objectives          text[]            not null default '{}',
  content             text[]            not null default '{}',
  activities          text[]            not null default '{}',
  resources           text[]            not null default '{}',
  created_at          timestamptz       not null default now(),
  updated_at          timestamptz       not null default now(),
  unique (program_id, code)
);

-- 4c. Learners
create table if not exists cet.learners (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        unique references auth.users(id) on delete set null,
  learner_code  text        unique not null,
  full_name     text        not null,
  email         text,
  phone         text,
  status        text        not null default 'Active',
  progress      integer     not null default 0 check (progress >= 0 and progress <= 100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 4d. Enrollments
create table if not exists cet.enrollments (
  id          uuid        primary key default gen_random_uuid(),
  learner_id  uuid        not null references cet.learners(id) on delete cascade,
  program_id  uuid        not null references cet.programs(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  status      text        not null default 'Active',
  unique (learner_id, program_id)
);

-- 4e. Attendance sessions
create table if not exists cet.attendance_sessions (
  id            uuid        primary key default gen_random_uuid(),
  module_id     uuid        not null references cet.modules(id) on delete cascade,
  session_date  date        not null,
  session_label text,
  created_by    uuid        references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  unique (module_id, session_date)
);

-- 4f. Attendance records (includes check-in / check-out from mig 002)
create table if not exists cet.attendance_records (
  session_id    uuid        not null references cet.attendance_sessions(id) on delete cascade,
  learner_id    uuid        not null references cet.learners(id) on delete cascade,
  present       boolean     not null,
  check_in_at   timestamptz,
  check_out_at  timestamptz,
  marked_by     uuid        references auth.users(id) on delete set null,
  marked_at     timestamptz not null default now(),
  primary key (session_id, learner_id)
);

-- 4g. Assessments
create table if not exists cet.assessments (
  id          uuid              primary key default gen_random_uuid(),
  module_id   uuid              not null references cet.modules(id) on delete cascade,
  title       text              not null,
  type        cet.assessment_type not null,
  max_marks   integer           check (max_marks is null or max_marks >= 0),
  weight      integer           not null check (weight >= 0),
  status      cet.record_status not null default 'Not Started',
  created_at  timestamptz       not null default now(),
  updated_at  timestamptz       not null default now()
);

-- 4h. Assessment results
create table if not exists cet.assessment_results (
  id              uuid        primary key default gen_random_uuid(),
  assessment_id   uuid        not null references cet.assessments(id) on delete cascade,
  learner_id      uuid        not null references cet.learners(id) on delete cascade,
  score           numeric,
  feedback        text,
  submitted_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (assessment_id, learner_id)
);

-- 4i. Announcements (migration 013 schema — audience + pinned + author)
create table if not exists cet.announcements (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  message     text        not null,
  audience    text        not null default 'All'
                check (audience in ('All','Block 1','Block 2','Block 3','Admin Only')),
  pinned      boolean     not null default false,
  author      text        not null default 'Admin',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4j. Learner progress (migration 011)
create table if not exists cet.learner_progress (
  id                        uuid        primary key default gen_random_uuid(),
  user_id                   uuid        not null references auth.users(id) on delete cascade,
  module_unit_standard_id   text        not null,
  guide_completed           boolean     not null default false,
  quiz_passed               boolean     not null default false,
  assessment_unlocked       boolean     not null default false,
  submission_path           text,
  submission_uploaded_at    timestamptz,
  assessment_submitted      boolean     not null default false,
  assessment_submitted_at   timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  unique (user_id, module_unit_standard_id)
);

-- 4k. Module content flows (migration 012)
create table if not exists cet.module_content_flows (
  id                uuid        primary key default gen_random_uuid(),
  unit_standard_id  text        unique not null,
  flow              jsonb       not null,
  updated_by        uuid        references auth.users(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 4l. Conversations (migration 015)
create table if not exists cet.conversations (
  id            uuid        primary key default gen_random_uuid(),
  participant_a uuid        not null references auth.users(id) on delete cascade,
  participant_b uuid        not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint no_self_conversation check (participant_a <> participant_b)
);

-- 4m. Messages (migration 015)
create table if not exists cet.messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references cet.conversations(id) on delete cascade,
  sender_id       uuid        not null references auth.users(id) on delete cascade,
  body            text        not null check (length(trim(body)) > 0),
  sent_at         timestamptz not null default now(),
  read_at         timestamptz
);

-- ── 5. Indexes ───────────────────────────────────────────────────────────────

create index if not exists idx_cet_modules_program_id         on cet.modules(program_id);
create index if not exists idx_cet_modules_block_no           on cet.modules(block_no);
create index if not exists idx_cet_learners_user_id           on cet.learners(user_id);
create index if not exists idx_cet_enrollments_learner_id     on cet.enrollments(learner_id);
create index if not exists idx_cet_enrollments_program_id     on cet.enrollments(program_id);
create index if not exists idx_cet_attendance_sessions_mod_id on cet.attendance_sessions(module_id);
create index if not exists idx_cet_attendance_records_chkin   on cet.attendance_records(check_in_at);
create index if not exists idx_cet_attendance_records_chkout  on cet.attendance_records(check_out_at);
create index if not exists idx_cet_attendance_records_lrn_id  on cet.attendance_records(learner_id);
create index if not exists idx_cet_assessments_module_id      on cet.assessments(module_id);
create index if not exists idx_cet_assessment_results_lrn_id  on cet.assessment_results(learner_id);
create index if not exists idx_cet_learner_progress_user_id   on cet.learner_progress(user_id);
create index if not exists idx_cet_module_content_flows_std   on cet.module_content_flows(unit_standard_id);
create index if not exists idx_messages_conversation_id       on cet.messages(conversation_id);
create index if not exists idx_messages_sent_at               on cet.messages(sent_at);

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

-- ── 7. Row-Level Security ────────────────────────────────────────────────────

alter table cet.programs               enable row level security;
alter table cet.modules                enable row level security;
alter table cet.learners               enable row level security;
alter table cet.enrollments            enable row level security;
alter table cet.attendance_sessions    enable row level security;
alter table cet.attendance_records     enable row level security;
alter table cet.assessments            enable row level security;
alter table cet.assessment_results     enable row level security;
alter table cet.announcements          enable row level security;
alter table cet.learner_progress       enable row level security;
alter table cet.module_content_flows   enable row level security;
alter table cet.conversations          enable row level security;
alter table cet.messages               enable row level security;

-- Drop then recreate every policy for idempotency
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

-- Programs
create policy "Authenticated users can read programs"       on cet.programs for select using (auth.role() = 'authenticated');
create policy "Admins and lecturers can manage programs"    on cet.programs for all   using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Modules
create policy "Authenticated users can read modules"       on cet.modules for select using (auth.role() = 'authenticated');
create policy "Admins and lecturers can manage modules"    on cet.modules for all   using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Learners
create policy "Admins and lecturers can read learners"     on cet.learners for select using (cet.get_my_role() in ('admin','lecturer'));
create policy "Learners can read own record"               on cet.learners for select using (user_id = auth.uid());
create policy "Admins and lecturers can manage learners"   on cet.learners for all   using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Enrollments
create policy "Admins and lecturers can read enrollments"  on cet.enrollments for select using (cet.get_my_role() in ('admin','lecturer'));
create policy "Learners can read own enrollments"          on cet.enrollments for select using (exists (select 1 from cet.learners l where l.id = learner_id and l.user_id = auth.uid()));
create policy "Admins and lecturers can manage enrollments" on cet.enrollments for all  using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Attendance sessions
create policy "Admins and lecturers can read att sessions"  on cet.attendance_sessions for select using (cet.get_my_role() in ('admin','lecturer'));
create policy "Admins and lecturers can manage att sessions" on cet.attendance_sessions for all  using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Attendance records
create policy "Admins and lecturers can read att records"  on cet.attendance_records for select using (cet.get_my_role() in ('admin','lecturer'));
create policy "Learners can read own att records"          on cet.attendance_records for select using (exists (select 1 from cet.learners l where l.id = learner_id and l.user_id = auth.uid()));
create policy "Admins and lecturers can manage att records" on cet.attendance_records for all  using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Assessments
create policy "Authenticated users can read assessments"    on cet.assessments for select using (auth.role() = 'authenticated');
create policy "Admins and lecturers can manage assessments" on cet.assessments for all   using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Assessment results
create policy "Admins and lecturers can read all results"  on cet.assessment_results for select using (cet.get_my_role() in ('admin','lecturer'));
create policy "Learners can read own assessment results"   on cet.assessment_results for select using (exists (select 1 from cet.learners l where l.id = learner_id and l.user_id = auth.uid()));
create policy "Admins and lecturers can manage results"    on cet.assessment_results for all   using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Announcements
create policy "admin_manage_announcements"   on cet.announcements for all    to authenticated using    (exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','moderator'))) with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('admin','moderator')));
create policy "learner_read_announcements"   on cet.announcements for select to authenticated using    (audience <> 'Admin Only');

-- Learner progress
create policy "Learners can read own progress"             on cet.learner_progress for select using (auth.uid() = user_id);
create policy "Learners can insert own progress"           on cet.learner_progress for insert with check (auth.uid() = user_id);
create policy "Learners can update own progress"           on cet.learner_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins and lecturers can read all progress" on cet.learner_progress for select using (cet.get_my_role() in ('admin','lecturer'));

-- Module content flows
create policy "Authenticated users can read module flows"   on cet.module_content_flows for select using (auth.role() = 'authenticated');
create policy "Admins and lecturers can manage module flows" on cet.module_content_flows for all   using (cet.get_my_role() in ('admin','lecturer')) with check (cet.get_my_role() in ('admin','lecturer'));

-- Conversations — both participants can read
create policy "participants_read_conversations" on cet.conversations for select to authenticated using (participant_a = auth.uid() or participant_b = auth.uid());

-- Messages — participants in the conversation can read
create policy "participants_read_messages" on cet.messages for select to authenticated
  using (exists (select 1 from cet.conversations c where c.id = conversation_id and (c.participant_a = auth.uid() or c.participant_b = auth.uid())));

-- ── 8. Table grants ──────────────────────────────────────────────────────────

grant select on table
  cet.programs, cet.modules, cet.enrollments, cet.learners,
  cet.attendance_sessions, cet.attendance_records,
  cet.assessments, cet.assessment_results,
  cet.announcements, cet.learner_progress, cet.module_content_flows,
  cet.conversations, cet.messages
to authenticated;

grant insert on table
  cet.attendance_sessions, cet.attendance_records,
  cet.learner_progress, cet.module_content_flows
to authenticated;

grant update on table
  cet.attendance_records, cet.learner_progress, cet.module_content_flows
to authenticated;

grant insert, update, delete on cet.announcements to authenticated;

-- SELECT grants needed for realtime row-level change delivery
grant select on cet.conversations to authenticated;
grant select on cet.messages       to authenticated;

-- ── 9. Realtime publications ─────────────────────────────────────────────────

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'cet' and tablename = 'announcements'
  ) then
    alter publication supabase_realtime add table cet.announcements;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'cet' and tablename = 'conversations'
  ) then
    alter publication supabase_realtime add table cet.conversations;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'cet' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table cet.messages;
  end if;
end
$$;

-- ── 10. cet-schema helper functions ─────────────────────────────────────────

-- Maps public.users.role → CET role enum
create or replace function cet.get_my_role()
returns cet.user_role
language sql
stable
security definer
set search_path = public, cet
as $$
  select
    case coalesce(u.role, 'user')
      when 'admin'     then 'admin'::cet.user_role
      when 'moderator' then 'lecturer'::cet.user_role
      else                  'learner'::cet.user_role
    end
  from public.users u
  where u.id = auth.uid();
$$;

comment on function cet.get_my_role is 'Maps public.users.role to CET roles: admin→admin, moderator→lecturer, user→learner.';
grant execute on function cet.get_my_role() to authenticated;

-- ── 11. Public RPC bridge — attendance ──────────────────────────────────────

create or replace function public.cet_enrolled_learners()
returns table (id uuid, learner_code text, full_name text, email text, phone text, status text, progress integer)
language sql stable set search_path = public, cet
as $$
  select distinct l.id, l.learner_code, l.full_name, l.email, l.phone, l.status, l.progress
  from cet.enrollments e
  join cet.learners l on l.id = e.learner_id
  where e.status = 'Active'
  order by l.full_name;
$$;

create or replace function public.cet_modules()
returns table (id uuid, title text, day_label text, block_no integer)
language sql stable set search_path = public, cet
as $$
  select m.id, m.title, m.day_label, m.block_no
  from cet.modules m
  order by m.block_no, m.day_label nulls last, m.title;
$$;

create or replace function public.cet_get_or_create_attendance_session(
  p_module_id    uuid,
  p_session_date date,
  p_created_by   uuid default null,
  p_session_label text default null
)
returns uuid
language plpgsql
set search_path = public, cet
as $$
declare v_session_id uuid;
begin
  select id into v_session_id
  from cet.attendance_sessions
  where module_id = p_module_id and session_date = p_session_date
  limit 1;

  if v_session_id is not null then return v_session_id; end if;

  insert into cet.attendance_sessions (module_id, session_date, session_label, created_by)
  values (p_module_id, p_session_date, coalesce(p_session_label, 'Session ' || p_session_date::text), p_created_by)
  on conflict (module_id, session_date)
  do update set session_label = coalesce(cet.attendance_sessions.session_label, excluded.session_label)
  returning id into v_session_id;

  return v_session_id;
end;
$$;

create or replace function public.cet_get_attendance_records(p_session_id uuid)
returns table (learner_id uuid, present boolean, check_in_at timestamptz, check_out_at timestamptz)
language sql stable set search_path = public, cet
as $$
  select ar.learner_id, ar.present, ar.check_in_at, ar.check_out_at
  from cet.attendance_records ar
  where ar.session_id = p_session_id;
$$;

create or replace function public.cet_check_in(p_session_id uuid, p_learner_id uuid, p_marked_by uuid default null)
returns void
language plpgsql set search_path = public, cet
as $$
begin
  insert into cet.attendance_records (session_id, learner_id, present, check_in_at, marked_by, marked_at)
  values (p_session_id, p_learner_id, true, now(), p_marked_by, now())
  on conflict (session_id, learner_id)
  do update set
    present     = true,
    check_in_at = coalesce(cet.attendance_records.check_in_at, now()),
    marked_by   = excluded.marked_by,
    marked_at   = now();
end;
$$;

create or replace function public.cet_check_out(p_session_id uuid, p_learner_id uuid, p_marked_by uuid default null)
returns void
language plpgsql set search_path = public, cet
as $$
begin
  update cet.attendance_records
  set present = true, check_out_at = now(), marked_by = p_marked_by, marked_at = now()
  where session_id = p_session_id and learner_id = p_learner_id;
end;
$$;

-- ── 12. Public RPC bridge — learner self-registration & enrollments ──────────

create or replace function public.cet_self_register_learner(
  p_full_name text default null,
  p_email     text default null,
  p_phone     text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, cet
as $$
#variable_conflict use_column
declare
  v_user_id      uuid    := auth.uid();
  v_public_role  text;
  v_learner_id   uuid;
  v_program_id   uuid;
  v_display_name text;
  v_email        text;
  v_phone        text;
begin
  if v_user_id is null then return null; end if;

  select role into v_public_role from public.users where id = v_user_id;
  if coalesce(v_public_role, 'user') <> 'user' then return null; end if;

  v_display_name := coalesce(nullif(trim(p_full_name), ''), 'Learner');
  v_email        := nullif(trim(coalesce(p_email, '')), '');
  v_phone        := nullif(trim(coalesce(p_phone, '')), '');

  insert into cet.learners (user_id, learner_code, full_name, email, phone, status, progress)
  values (
    v_user_id,
    'L-' || upper(substr(replace(v_user_id::text, '-', ''), 1, 8)),
    v_display_name, v_email, v_phone, 'Active', 0
  )
  on conflict (user_id) do update set
    full_name  = coalesce(excluded.full_name,  cet.learners.full_name),
    email      = coalesce(excluded.email,      cet.learners.email),
    phone      = coalesce(excluded.phone,      cet.learners.phone),
    updated_at = now()
  returning id into v_learner_id;

  select p.id into v_program_id from cet.programs p where p.is_active = true order by p.created_at asc limit 1;

  if v_program_id is null then
    insert into cet.programs (title, saqa_id, nqf_level, total_credits, provider, is_active)
    values ('FET Certificate: IT Systems Development', '78965', 4, 131, 'Data Science Academy', true)
    on conflict (saqa_id) do update set is_active = true, updated_at = now()
    returning id into v_program_id;
  end if;

  insert into cet.enrollments (learner_id, program_id, status)
  values (v_learner_id, v_program_id, 'Active')
  on conflict (learner_id, program_id) do nothing;

  return v_learner_id;
end;
$$;

-- Backfill: enrol all existing active learners into the default program (idempotent)
with ensure_program as (
  insert into cet.programs (title, saqa_id, nqf_level, total_credits, provider, is_active)
  values ('FET Certificate: IT Systems Development', '78965', 4, 131, 'Data Science Academy', true)
  on conflict (saqa_id) do update set is_active = true, updated_at = now()
  returning id
),
chosen as (
  select id from ensure_program
  union all
  select id from cet.programs where is_active = true order by created_at asc limit 1
  limit 1
)
insert into cet.enrollments (learner_id, program_id, status)
select l.id, c.id, 'Active'
from cet.learners l
cross join chosen c
left join cet.enrollments e on e.learner_id = l.id and e.program_id = c.id
where l.status = 'Active' and e.id is null;

-- ── 13. Public RPC bridge — profile (v1 + v2) ───────────────────────────────

create or replace function public.cet_get_my_profile()
returns table (id uuid, username text, display_name text, bio text, avatar_url text, location text, website text, role text, reputation integer, created_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = public
as $$
  select u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation, u.created_at, u.updated_at
  from public.users u
  where u.id = auth.uid();
$$;

create or replace function public.cet_get_my_profile_v2()
returns table (id uuid, username text, display_name text, bio text, avatar_url text, location text, website text, role text, reputation integer, phone text, created_at timestamptz, updated_at timestamptz)
language sql stable security definer set search_path = public, cet
as $$
  select u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation, l.phone, u.created_at, u.updated_at
  from public.users u
  left join cet.learners l on l.user_id = u.id
  where u.id = auth.uid();
$$;

create or replace function public.cet_update_my_profile_v2(
  p_username     text,
  p_display_name text,
  p_bio          text,
  p_avatar_url   text,
  p_location     text,
  p_website      text,
  p_phone        text default null
)
returns table (id uuid, username text, display_name text, bio text, avatar_url text, location text, website text, role text, reputation integer, phone text, created_at timestamptz, updated_at timestamptz)
language plpgsql
security definer
set search_path = public, cet
as $$
#variable_conflict use_column
declare
  v_user_id       uuid := auth.uid();
  v_username      text;
  v_email         text;
  v_existing_role text;
  v_phone         text;
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  v_username := nullif(trim(coalesce(p_username, '')), '');
  if v_username is null then
    select split_part(au.email, '@', 1) into v_email from auth.users au where au.id = v_user_id;
    v_username := lower(coalesce(v_email, 'user')) || '_' || substr(replace(v_user_id::text, '-', ''), 1, 6);
  end if;

  select u.role into v_existing_role from public.users u where u.id = v_user_id;
  v_phone := nullif(trim(coalesce(p_phone, '')), '');

  insert into public.users (id, username, display_name, bio, avatar_url, location, website, role, reputation, app_metadata, created_at, updated_at)
  values (v_user_id, v_username, nullif(trim(coalesce(p_display_name,'')),  ''), nullif(trim(coalesce(p_bio,'')), ''), nullif(trim(coalesce(p_avatar_url,'')),''), nullif(trim(coalesce(p_location,'')), ''), nullif(trim(coalesce(p_website,'')),''), coalesce(v_existing_role,'user'), 0, '{}'::jsonb, now(), now())
  on conflict on constraint users_pkey
  do update set username = excluded.username, display_name = excluded.display_name, bio = excluded.bio, avatar_url = excluded.avatar_url, location = excluded.location, website = excluded.website, updated_at = now();

  update cet.learners
  set full_name = coalesce(nullif(trim(coalesce(p_display_name,'')), ''), cet.learners.full_name), phone = coalesce(v_phone, cet.learners.phone), updated_at = now()
  where user_id = v_user_id;

  return query
  select u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation, l.phone, u.created_at, u.updated_at
  from public.users u
  left join cet.learners l on l.user_id = u.id
  where u.id = v_user_id;
end;
$$;

-- ── 14. Public RPC bridge — learner progress ────────────────────────────────

create or replace function public.cet_get_all_module_progress()
returns table (
  module_unit_standard_id text, guide_completed boolean, quiz_passed boolean,
  assessment_unlocked boolean, submission_path text, submission_uploaded_at timestamptz,
  assessment_submitted boolean, assessment_submitted_at timestamptz, updated_at timestamptz
)
language sql stable security definer set search_path = public, cet
as $$
  select lp.module_unit_standard_id, lp.guide_completed, lp.quiz_passed, lp.assessment_unlocked,
         lp.submission_path, lp.submission_uploaded_at, lp.assessment_submitted, lp.assessment_submitted_at, lp.updated_at
  from cet.learner_progress lp
  where lp.user_id = auth.uid();
$$;

create or replace function public.cet_upsert_module_progress(
  p_unit_std_id             text,
  p_guide_completed         boolean     default null,
  p_quiz_passed             boolean     default null,
  p_assessment_unlocked     boolean     default null,
  p_submission_path         text        default null,
  p_submission_uploaded_at  timestamptz default null,
  p_assessment_submitted    boolean     default null,
  p_assessment_submitted_at timestamptz default null
)
returns void
language plpgsql security definer set search_path = public, cet
as $$
declare v_user_id uuid := auth.uid();
begin
  if v_user_id is null then raise exception 'Not authenticated'; end if;

  insert into cet.learner_progress (user_id, module_unit_standard_id, guide_completed, quiz_passed, assessment_unlocked, submission_path, submission_uploaded_at, assessment_submitted, assessment_submitted_at)
  values (v_user_id, p_unit_std_id, coalesce(p_guide_completed,false), coalesce(p_quiz_passed,false), coalesce(p_assessment_unlocked,false), p_submission_path, p_submission_uploaded_at, coalesce(p_assessment_submitted,false), p_assessment_submitted_at)
  on conflict (user_id, module_unit_standard_id) do update set
    guide_completed         = case when p_guide_completed         is not null then p_guide_completed         else cet.learner_progress.guide_completed end,
    quiz_passed             = case when p_quiz_passed             is not null then p_quiz_passed             else cet.learner_progress.quiz_passed end,
    assessment_unlocked     = case when p_assessment_unlocked     is not null then p_assessment_unlocked     else cet.learner_progress.assessment_unlocked end,
    submission_path         = case when p_submission_path         is not null then p_submission_path         else cet.learner_progress.submission_path end,
    submission_uploaded_at  = case when p_submission_uploaded_at  is not null then p_submission_uploaded_at  else cet.learner_progress.submission_uploaded_at end,
    assessment_submitted    = case when p_assessment_submitted    is not null then p_assessment_submitted    else cet.learner_progress.assessment_submitted end,
    assessment_submitted_at = case when p_assessment_submitted_at is not null then p_assessment_submitted_at else cet.learner_progress.assessment_submitted_at end,
    updated_at              = now();
end;
$$;

-- ── 15. Public RPC bridge — module content flows ────────────────────────────

create or replace function public.cet_get_module_flow(p_unit_std_id text)
returns jsonb
language sql stable security definer set search_path = public, cet
as $$
  select flow from cet.module_content_flows where unit_standard_id = p_unit_std_id limit 1;
$$;

create or replace function public.cet_upsert_module_flow(p_unit_std_id text, p_flow jsonb)
returns void
language plpgsql security definer set search_path = public, cet
as $$
declare v_role cet.user_role := cet.get_my_role();
begin
  if v_role not in ('admin','lecturer') then raise exception 'Only admins and lecturers can update module flows'; end if;
  insert into cet.module_content_flows (unit_standard_id, flow, updated_by)
  values (p_unit_std_id, p_flow, auth.uid())
  on conflict (unit_standard_id) do update set flow = excluded.flow, updated_by = excluded.updated_by, updated_at = now();
end;
$$;

-- ── 16. Public RPC bridge — announcements ───────────────────────────────────

create or replace function public.cet_get_announcements()
returns table (id uuid, title text, message text, audience text, pinned boolean, author text, created_at timestamptz)
language sql stable security definer set search_path = public, cet
as $$
  select id, title, message, audience, pinned, author, created_at
  from cet.announcements
  order by pinned desc, created_at desc;
$$;

create or replace function public.cet_post_announcement(p_title text, p_message text, p_audience text default 'All')
returns uuid
language plpgsql security definer set search_path = public, cet
as $$
declare v_id uuid; v_role text;
begin
  select role into v_role from public.users where id = auth.uid();
  if v_role not in ('admin','moderator') then raise exception 'Permission denied'; end if;
  insert into cet.announcements (title, message, audience) values (p_title, p_message, p_audience) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.cet_pin_announcement(p_id uuid, p_pinned boolean)
returns void
language plpgsql security definer set search_path = public, cet
as $$
declare v_role text;
begin
  select role into v_role from public.users where id = auth.uid();
  if v_role not in ('admin','moderator') then raise exception 'Permission denied'; end if;
  update cet.announcements set pinned = p_pinned where id = p_id;
end;
$$;

create or replace function public.cet_delete_announcement(p_id uuid)
returns void
language plpgsql security definer set search_path = public, cet
as $$
declare v_role text;
begin
  select role into v_role from public.users where id = auth.uid();
  if v_role not in ('admin','moderator') then raise exception 'Permission denied'; end if;
  delete from cet.announcements where id = p_id;
end;
$$;

-- ── 17. Public RPC bridge — direct messaging ────────────────────────────────

-- Returns all active learners (excluding caller) for the messaging recipient picker
create or replace function public.cet_list_learners_for_messaging()
returns table (id uuid, user_id uuid, full_name text, learner_code text)
language sql stable security definer set search_path = public, cet
as $$
  select l.id, l.user_id, l.full_name, l.learner_code
  from cet.learners l
  join cet.enrollments e on e.learner_id = l.id
  where l.status = 'Active' and e.status = 'Active'
    and l.user_id is not null
    and l.user_id <> auth.uid()
  order by l.full_name
  limit 50;
$$;

-- Send (creates conversation if needed, inserts message, returns conversation_id)
create or replace function public.cet_send_message(p_recipient_id uuid, p_body text)
returns uuid
language plpgsql security definer set search_path = public, cet
as $$
declare
  v_sender  uuid := auth.uid();
  v_conv_id uuid;
begin
  if v_sender is null then raise exception 'Not authenticated'; end if;
  if trim(coalesce(p_body,'')) = '' then raise exception 'Message body cannot be empty'; end if;
  if p_recipient_id = v_sender then raise exception 'Cannot send message to yourself'; end if;

  select id into v_conv_id
  from cet.conversations
  where (participant_a = v_sender and participant_b = p_recipient_id)
     or (participant_a = p_recipient_id and participant_b = v_sender)
  limit 1;

  if v_conv_id is null then
    insert into cet.conversations (participant_a, participant_b)
    values (v_sender, p_recipient_id)
    returning id into v_conv_id;
  end if;

  insert into cet.messages (conversation_id, sender_id, body) values (v_conv_id, v_sender, trim(p_body));
  update cet.conversations set updated_at = now() where id = v_conv_id;
  return v_conv_id;
end;
$$;

-- List all conversations for the caller with last message + unread count
create or replace function public.cet_get_my_conversations()
returns table (
  conversation_id uuid, other_user_id uuid, other_name text, other_code text,
  other_role text, last_body text, last_sent_at timestamptz, unread_count bigint
)
language sql stable security definer set search_path = public, cet
as $$
  with my_convs as (
    select c.id as conv_id,
           case when c.participant_a = auth.uid() then c.participant_b else c.participant_a end as other_id
    from cet.conversations c
    where c.participant_a = auth.uid() or c.participant_b = auth.uid()
  ),
  last_msg as (
    select distinct on (m.conversation_id)
      m.conversation_id, m.body, m.sent_at
    from cet.messages m
    where m.conversation_id in (select conv_id from my_convs)
    order by m.conversation_id, m.sent_at desc
  ),
  unread as (
    select m.conversation_id, count(*) as cnt
    from cet.messages m
    where m.conversation_id in (select conv_id from my_convs)
      and m.sender_id <> auth.uid() and m.read_at is null
    group by m.conversation_id
  )
  select mc.conv_id, mc.other_id,
         coalesce(u.display_name, l.full_name, 'Unknown') as other_name,
         l.learner_code as other_code,
         coalesce(u.role, 'user')::text as other_role,
         lm.body as last_body,
         lm.sent_at as last_sent_at,
         coalesce(ur.cnt, 0) as unread_count
  from my_convs mc
  left join public.users u   on u.id = mc.other_id
  left join cet.learners l   on l.user_id = mc.other_id
  left join last_msg lm      on lm.conversation_id = mc.conv_id
  left join unread ur        on ur.conversation_id = mc.conv_id
  order by lm.sent_at desc nulls last;
$$;

-- Fetch messages for a conversation (caller must be a participant)
create or replace function public.cet_get_conversation_messages(p_conversation_id uuid)
returns table (id uuid, sender_id uuid, body text, sent_at timestamptz, read_at timestamptz)
language sql stable security definer set search_path = public, cet
as $$
  select m.id, m.sender_id, m.body, m.sent_at, m.read_at
  from cet.messages m
  join cet.conversations c on c.id = m.conversation_id
  where m.conversation_id = p_conversation_id
    and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
  order by m.sent_at asc;
$$;

-- Mark all received unread messages in a conversation as read
create or replace function public.cet_mark_conversation_read(p_conversation_id uuid)
returns void
language plpgsql security definer set search_path = public, cet
as $$
declare v_uid uuid := auth.uid();
begin
  if not exists (select 1 from cet.conversations where id = p_conversation_id and (participant_a = v_uid or participant_b = v_uid)) then
    raise exception 'Access denied';
  end if;
  update cet.messages set read_at = now()
  where conversation_id = p_conversation_id and sender_id <> v_uid and read_at is null;
end;
$$;

-- Return the facilitator/admin user_id (for learners to initiate a conversation)
create or replace function public.cet_get_facilitator_user_id()
returns uuid
language sql stable security definer set search_path = public, cet
as $$
  select id from public.users
  where role in ('admin','moderator')
    and id <> coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
  order by created_at asc
  limit 1;
$$;

-- ── 18. Function grants ──────────────────────────────────────────────────────

grant execute on function public.cet_enrolled_learners()                                                                         to authenticated;
grant execute on function public.cet_modules()                                                                                   to authenticated;
grant execute on function public.cet_get_or_create_attendance_session(uuid, date, uuid, text)                                    to authenticated;
grant execute on function public.cet_get_attendance_records(uuid)                                                                to authenticated;
grant execute on function public.cet_check_in(uuid, uuid, uuid)                                                                  to authenticated;
grant execute on function public.cet_check_out(uuid, uuid, uuid)                                                                 to authenticated;
grant execute on function public.cet_self_register_learner(text, text, text)                                                     to authenticated;
grant execute on function public.cet_get_my_profile()                                                                           to authenticated;
grant execute on function public.cet_get_my_profile_v2()                                                                        to authenticated;
grant execute on function public.cet_update_my_profile_v2(text, text, text, text, text, text, text)                             to authenticated;
grant execute on function public.cet_get_all_module_progress()                                                                   to authenticated;
grant execute on function public.cet_upsert_module_progress(text, boolean, boolean, boolean, text, timestamptz, boolean, timestamptz) to authenticated;
grant execute on function public.cet_get_module_flow(text)                                                                       to authenticated;
grant execute on function public.cet_upsert_module_flow(text, jsonb)                                                             to authenticated;
grant execute on function public.cet_get_announcements()                                                                         to authenticated;
grant execute on function public.cet_post_announcement(text, text, text)                                                         to authenticated;
grant execute on function public.cet_pin_announcement(uuid, boolean)                                                             to authenticated;
grant execute on function public.cet_delete_announcement(uuid)                                                                   to authenticated;
grant execute on function public.cet_list_learners_for_messaging()                                                               to authenticated;
grant execute on function public.cet_send_message(uuid, text)                                                                    to authenticated;
grant execute on function public.cet_get_my_conversations()                                                                      to authenticated;
grant execute on function public.cet_get_conversation_messages(uuid)                                                             to authenticated;
grant execute on function public.cet_mark_conversation_read(uuid)                                                                to authenticated;
grant execute on function public.cet_get_facilitator_user_id()                                                                   to authenticated;

-- ── 19. Seed data (idempotent) ───────────────────────────────────────────────

insert into cet.announcements (title, message, audience, pinned, author) values
  ('Block 1 Schedule Confirmed',
   'Block 1 training begins 02 March 2026 at CET Venda. All 5 modules (Days 1–5) are confirmed. Facilitator guides and learner workbooks will be distributed via USB on Day 1.',
   'All', true, 'Admin'),
  ('Offline Portal Available',
   'The CET Connect portal is available offline. Connect to the local Wi-Fi hotspot and navigate to http://192.168.1.100:5173 to access all materials without internet.',
   'All', true, 'Admin'),
  ('Assessment Submissions Open',
   'Summative assessment briefs for Block 1 (14924, 14920, 14918, 14927, 14915) are now available in each module''s Assessment tab. Learners must complete the quiz before the assessment unlocks.',
   'Block 1', false, 'Admin'),
  ('Facilitator Resource Pack Updated',
   'Updated Facilitator Guides and Lesson Plan packs for Block 1 are available under each module''s Facilitator Guide tab. Please review session notes before Day 1.',
   'Admin Only', false, 'Admin')
on conflict do nothing;

-- ── End of unified schema ────────────────────────────────────────────────────
