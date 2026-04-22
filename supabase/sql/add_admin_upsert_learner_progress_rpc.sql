-- Admin helper RPC for assessor capture saves.
-- Run this in Supabase SQL Editor (target project: ebzsvbbmahvqlshydkxg).

-- Remove legacy overload (without grading fields) to prevent ambiguous/incorrect resolution.
drop function if exists public.cet_admin_upsert_learner_progress(
  uuid,
  text,
  boolean,
  boolean,
  text,
  timestamptz
);

-- Ensure columns exist with correct types without dropping existing data.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'cet'
      and table_name = 'learner_progress'
      and column_name = 'assessment_grade'
  ) then
    execute 'alter table cet.learner_progress alter column assessment_grade type numeric(5,2) using assessment_grade::numeric(5,2)';
  else
    execute 'alter table cet.learner_progress add column assessment_grade numeric(5,2)';
  end if;
end
$$;

alter table cet.learner_progress
  add column if not exists assessment_feedback text,
  add column if not exists assessment_graded_at timestamptz,
  add column if not exists assessment_answers jsonb;

drop function if exists public.cet_learner_submit_assessment(
  text,
  text,
  timestamptz,
  jsonb
);

create or replace function public.cet_learner_submit_assessment(
  p_module_unit_standard_id text,
  p_submission_path text default null,
  p_submission_uploaded_at timestamptz default null,
  p_assessment_answers jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role text;
  v_now timestamptz := coalesce(p_submission_uploaded_at, now());
begin
  if auth.uid() is null then
    raise exception 'User must be authenticated';
  end if;

  select u.role::text into v_role
  from public.users u
  where u.id = auth.uid();

  if v_role is null or v_role <> 'user' then
    raise exception 'Only learners can submit their own assessments';
  end if;

  insert into cet.learner_progress (
    user_id,
    module_unit_standard_id,
    assessment_unlocked,
    assessment_submitted,
    assessment_submitted_at,
    submission_path,
    submission_uploaded_at,
    assessment_answers,
    updated_at
  )
  values (
    auth.uid(),
    p_module_unit_standard_id,
    true,
    true,
    v_now,
    p_submission_path,
    v_now,
    coalesce(p_assessment_answers, '{}'::jsonb) || jsonb_build_object(
      'submission_meta',
      jsonb_build_object(
        'submitted_by', 'learner',
        'submitted_at', v_now
      )
    ),
    now()
  )
  on conflict (user_id, module_unit_standard_id)
  do update set
    assessment_unlocked = true,
    assessment_submitted = true,
    assessment_submitted_at = v_now,
    submission_path = coalesce(excluded.submission_path, cet.learner_progress.submission_path),
    submission_uploaded_at = coalesce(excluded.submission_uploaded_at, cet.learner_progress.submission_uploaded_at),
    assessment_answers = coalesce(cet.learner_progress.assessment_answers, '{}'::jsonb)
      || coalesce(excluded.assessment_answers, '{}'::jsonb)
      || jsonb_build_object(
        'submission_meta',
        jsonb_build_object(
          'submitted_by', 'learner',
          'submitted_at', v_now
        )
      ),
    updated_at = now();
end;
$$;

grant execute on function public.cet_learner_submit_assessment(
  text,
  text,
  timestamptz,
  jsonb
) to authenticated;

create or replace function public.cet_admin_upsert_learner_progress(
  p_user_id uuid,
  p_module_unit_standard_id text,
  p_assessment_unlocked boolean default true,
  p_assessment_submitted boolean default true,
  p_submission_path text default null,
  p_submission_uploaded_at timestamptz default null,
  p_assessment_grade numeric default null,
  p_assessment_feedback text default null,
  p_assessment_graded_at timestamptz default null,
  p_assessment_answers jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role text;
begin
  select u.role::text into v_role
  from public.users u
  where u.id = auth.uid();

  if v_role is null or v_role not in ('admin', 'moderator') then
    raise exception 'Only admin/moderator can upsert learner progress for other users';
  end if;

  insert into cet.learner_progress (
    user_id,
    module_unit_standard_id,
    assessment_unlocked,
    assessment_submitted,
    submission_path,
    submission_uploaded_at,
    assessment_grade,
    assessment_feedback,
    assessment_graded_at,
    assessment_answers,
    updated_at
  )
  values (
    p_user_id,
    p_module_unit_standard_id,
    coalesce(p_assessment_unlocked, true),
    coalesce(p_assessment_submitted, true),
    p_submission_path,
    p_submission_uploaded_at,
    p_assessment_grade,
    p_assessment_feedback,
    p_assessment_graded_at,
    p_assessment_answers,
    now()
  )
  on conflict (user_id, module_unit_standard_id)
  do update set
    assessment_unlocked = coalesce(excluded.assessment_unlocked, cet.learner_progress.assessment_unlocked),
    assessment_submitted = coalesce(excluded.assessment_submitted, cet.learner_progress.assessment_submitted),
    submission_path = coalesce(excluded.submission_path, cet.learner_progress.submission_path),
    submission_uploaded_at = coalesce(excluded.submission_uploaded_at, cet.learner_progress.submission_uploaded_at),
    assessment_grade = coalesce(excluded.assessment_grade, cet.learner_progress.assessment_grade),
    assessment_feedback = coalesce(excluded.assessment_feedback, cet.learner_progress.assessment_feedback),
    assessment_graded_at = coalesce(excluded.assessment_graded_at, cet.learner_progress.assessment_graded_at),
    assessment_answers = coalesce(excluded.assessment_answers, cet.learner_progress.assessment_answers),
    updated_at = now();
end;
$$;

grant execute on function public.cet_admin_upsert_learner_progress(
  uuid,
  text,
  boolean,
  boolean,
  text,
  timestamptz,
  numeric,
  text,
  timestamptz,
  jsonb
) to authenticated;

create or replace function public.cet_admin_get_learner_progress_capture(
  p_user_id uuid,
  p_module_unit_standard_id text
)
returns table (
  user_id uuid,
  module_unit_standard_id text,
  assessment_grade numeric,
  assessment_feedback text,
  assessment_graded_at timestamptz,
  assessment_answers jsonb,
  submission_path text,
  submission_uploaded_at timestamptz,
  assessment_submitted boolean
)
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role text;
begin
  select u.role::text into v_role
  from public.users u
  where u.id = auth.uid();

  if v_role is null or v_role not in ('admin', 'moderator') then
    raise exception 'Only admin/moderator can read learner progress captures for other users';
  end if;

  return query
  select
    lp.user_id,
    lp.module_unit_standard_id,
    (lp.assessment_grade)::numeric(5,2),
    lp.assessment_feedback,
    lp.assessment_graded_at,
    lp.assessment_answers,
    lp.submission_path,
    lp.submission_uploaded_at,
    lp.assessment_submitted
  from cet.learner_progress lp
  where lp.user_id = p_user_id
    and lp.module_unit_standard_id = p_module_unit_standard_id
  limit 1;
end;
$$;

grant execute on function public.cet_admin_get_learner_progress_capture(
  uuid,
  text
) to authenticated;

create or replace function public.cet_admin_get_module_capture_totals(
  p_module_unit_standard_id text
)
returns table (
  user_id uuid,
  assessment_grade numeric
)
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_role text;
begin
  select u.role::text into v_role
  from public.users u
  where u.id = auth.uid();

  if v_role is null or v_role not in ('admin', 'moderator') then
    raise exception 'Only admin/moderator can read module capture totals';
  end if;

  return query
  select lp.user_id, (lp.assessment_grade)::numeric(5,2)
  from cet.learner_progress lp
  where lp.module_unit_standard_id = p_module_unit_standard_id;
end;
$$;

grant execute on function public.cet_admin_get_module_capture_totals(
  text
) to authenticated;
