create or replace function public.cet_self_register_learner(
  p_full_name text default null,
  p_email text default null,
  p_phone text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, cet
as $$
#variable_conflict use_column
declare
  v_user_id uuid := auth.uid();
  v_public_role text;
  v_learner_id uuid;
  v_program_id uuid;
  v_display_name text;
  v_email text;
  v_phone text;
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
  v_phone := nullif(trim(coalesce(p_phone, '')), '');

  insert into cet.learners (
    user_id,
    learner_code,
    full_name,
    email,
    phone,
    status,
    progress
  )
  values (
    v_user_id,
    'L-' || upper(substr(replace(v_user_id::text, '-', ''), 1, 8)),
    v_display_name,
    v_email,
    v_phone,
    'Active',
    0
  )
  on conflict (user_id)
  do update set
    full_name = coalesce(excluded.full_name, cet.learners.full_name),
    email = coalesce(excluded.email, cet.learners.email),
    phone = coalesce(excluded.phone, cet.learners.phone),
    updated_at = now()
  returning id into v_learner_id;

  select p.id into v_program_id
  from cet.programs p
  where p.is_active = true
  order by p.created_at asc
  limit 1;

  if v_program_id is null then
    insert into cet.programs (title, saqa_id, nqf_level, total_credits, provider, is_active)
    values (
      'FET Certificate: IT Systems Development',
      '78965',
      4,
      131,
      'Data Science Academy',
      true
    )
    on conflict (saqa_id)
    do update set
      is_active = true,
      updated_at = now()
    returning id into v_program_id;
  end if;

  insert into cet.enrollments (learner_id, program_id, status)
  values (v_learner_id, v_program_id, 'Active')
  on conflict (learner_id, program_id) do nothing;

  return v_learner_id;
end;
$$;

grant execute on function public.cet_self_register_learner(text, text, text) to authenticated;

with first_active_program as (
  select p.id
  from cet.programs p
  where p.is_active = true
  order by p.created_at asc
  limit 1
),
ensure_default_program as (
  insert into cet.programs (title, saqa_id, nqf_level, total_credits, provider, is_active)
  select
    'FET Certificate: IT Systems Development',
    '78965',
    4,
    131,
    'Data Science Academy',
    true
  where not exists (select 1 from first_active_program)
  on conflict (saqa_id)
  do update set
    is_active = true,
    updated_at = now()
  returning id
),
chosen_program as (
  select id from first_active_program
  union all
  select id from ensure_default_program
  limit 1
)
insert into cet.enrollments (learner_id, program_id, status)
select l.id, cp.id, 'Active'
from cet.learners l
cross join chosen_program cp
left join cet.enrollments e
  on e.learner_id = l.id
 and e.program_id = cp.id
where l.status = 'Active'
  and e.id is null;