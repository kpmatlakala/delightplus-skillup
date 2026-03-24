-- Fix cet_self_register_learner signature to include p_phone
-- and keep compatibility with frontend call shape.

drop function if exists public.cet_self_register_learner(text, text);
drop function if exists public.cet_self_register_learner(text, text, text);

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
declare
  v_user_id uuid := auth.uid();
  v_learner_id uuid;
  v_program_id uuid;
  v_display_name text;
  v_email text;
begin
  if v_user_id is null then
    return null;
  end if;

  v_display_name := coalesce(
    nullif(trim(coalesce(p_full_name, '')), ''),
    split_part(coalesce(p_email, ''), '@', 1),
    'Learner'
  );
  v_email := nullif(trim(coalesce(p_email, '')), '');

  insert into cet.learners (
    user_id,
    learner_code,
    full_name,
    display_name,
    email,
    phone,
    role,
    status,
    progress
  )
  values (
    v_user_id,
    'L-' || upper(substr(replace(v_user_id::text, '-', ''), 1, 7)),
    v_display_name,
    v_display_name,
    v_email,
    p_phone,
    'learner',
    'Active',
    0
  )
  on conflict (user_id)
  do update set
    full_name = coalesce(excluded.full_name, cet.learners.full_name),
    display_name = coalesce(excluded.display_name, cet.learners.display_name),
    email = coalesce(excluded.email, cet.learners.email),
    phone = coalesce(excluded.phone, cet.learners.phone),
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

grant execute on function public.cet_self_register_learner(text, text, text) to authenticated;

-- Keep auth user trigger aligned with phone metadata usage.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, cet
as $$
begin
  insert into cet.learners (
    user_id,
    full_name,
    display_name,
    email,
    phone,
    learner_code,
    role,
    status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', new.raw_user_meta_data->>'phone_number'),
    'L-' || upper(substr(replace(new.id::text, '-', ''), 1, 7)),
    coalesce(new.raw_user_meta_data->>'role', 'learner'),
    'Active'
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
