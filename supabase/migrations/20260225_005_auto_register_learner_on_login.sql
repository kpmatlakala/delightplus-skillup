create or replace function public.cet_self_register_learner(
  p_full_name text default null,
  p_email text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_user_id uuid := auth.uid();
  v_public_role text;
  v_learner_id uuid;
  v_program_id uuid;
  v_display_name text;
  v_email text;
begin
  if v_user_id is null then
    return null;
  end if;

  select role into v_public_role
  from public.users
  where id = v_user_id;

  if coalesce(v_public_role, 'user') <> 'user' then
    return null;
  end if;

  v_display_name := coalesce(nullif(trim(p_full_name), ''), 'Learner');
  v_email := nullif(trim(coalesce(p_email, '')), '');

  insert into cet.learners (
    user_id,
    learner_code,
    full_name,
    email,
    status,
    progress
  )
  values (
    v_user_id,
    'L-' || upper(substr(replace(v_user_id::text, '-', ''), 1, 8)),
    v_display_name,
    v_email,
    'Active',
    0
  )
  on conflict (user_id)
  do update set
    full_name = coalesce(excluded.full_name, cet.learners.full_name),
    email = coalesce(excluded.email, cet.learners.email),
    updated_at = now()
  returning id into v_learner_id;

  select id into v_program_id
  from cet.programs
  where is_active = true
  order by created_at asc
  limit 1;

  if v_program_id is not null then
    insert into cet.enrollments (learner_id, program_id, status)
    values (v_learner_id, v_program_id, 'Active')
    on conflict (learner_id, program_id) do nothing;
  end if;

  return v_learner_id;
end;
$$;

grant execute on function public.cet_self_register_learner(text, text) to authenticated;
