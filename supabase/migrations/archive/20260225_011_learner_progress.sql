-- ============================================================
-- Migration 011: Learner module progress tracking
-- Tracks per-learner, per-module progress through the
-- Guide → Quiz → Assessment stepper in the learner portal.
-- ============================================================

-- 1. Create the table
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

create trigger set_learner_progress_updated_at
before update on cet.learner_progress
for each row
execute function cet.set_updated_at();

create index idx_cet_learner_progress_user_id
on cet.learner_progress(user_id);

-- 2. RLS
alter table cet.learner_progress enable row level security;

create policy "Learners can read own progress"
on cet.learner_progress for select
using (auth.uid() = user_id);

create policy "Learners can insert own progress"
on cet.learner_progress for insert
with check (auth.uid() = user_id);

create policy "Learners can update own progress"
on cet.learner_progress for update
using  (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Admins and lecturers can read all progress"
on cet.learner_progress for select
using (cet.get_my_role() in ('admin', 'lecturer'));

-- 3. Grants
grant select, insert, update on cet.learner_progress to authenticated;

-- ============================================================
-- 4. Public RPC bridge: fetch all progress for the caller
-- ============================================================
create or replace function public.cet_get_all_module_progress()
returns table (
  module_unit_standard_id   text,
  guide_completed           boolean,
  quiz_passed               boolean,
  assessment_unlocked       boolean,
  submission_path           text,
  submission_uploaded_at    timestamptz,
  assessment_submitted      boolean,
  assessment_submitted_at   timestamptz,
  updated_at                timestamptz
)
language sql
stable
security definer
set search_path = public, cet
as $$
  select
    lp.module_unit_standard_id,
    lp.guide_completed,
    lp.quiz_passed,
    lp.assessment_unlocked,
    lp.submission_path,
    lp.submission_uploaded_at,
    lp.assessment_submitted,
    lp.assessment_submitted_at,
    lp.updated_at
  from cet.learner_progress lp
  where lp.user_id = auth.uid();
$$;

grant execute on function public.cet_get_all_module_progress() to authenticated;

-- ============================================================
-- 5. Public RPC bridge: upsert progress for one module
--    Null arguments are ignored (merge semantics).
-- ============================================================
create or replace function public.cet_upsert_module_progress(
  p_unit_std_id               text,
  p_guide_completed           boolean     default null,
  p_quiz_passed               boolean     default null,
  p_assessment_unlocked       boolean     default null,
  p_submission_path           text        default null,
  p_submission_uploaded_at    timestamptz default null,
  p_assessment_submitted      boolean     default null,
  p_assessment_submitted_at   timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into cet.learner_progress (
    user_id,
    module_unit_standard_id,
    guide_completed,
    quiz_passed,
    assessment_unlocked,
    submission_path,
    submission_uploaded_at,
    assessment_submitted,
    assessment_submitted_at
  )
  values (
    v_user_id,
    p_unit_std_id,
    coalesce(p_guide_completed,         false),
    coalesce(p_quiz_passed,             false),
    coalesce(p_assessment_unlocked,     false),
    p_submission_path,
    p_submission_uploaded_at,
    coalesce(p_assessment_submitted,    false),
    p_assessment_submitted_at
  )
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

grant execute on function public.cet_upsert_module_progress(text, boolean, boolean, boolean, text, timestamptz, boolean, timestamptz) to authenticated;

comment on function public.cet_get_all_module_progress  is 'Returns all module-progress rows for the currently authenticated learner.';
comment on function public.cet_upsert_module_progress   is 'Inserts or merges a progress row for the given unit standard ID. Null args preserve existing values.';
