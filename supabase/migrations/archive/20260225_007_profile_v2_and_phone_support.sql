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

create or replace function public.cet_get_my_profile_v2()
returns table (
  id uuid,
  username text,
  display_name text,
  bio text,
  avatar_url text,
  location text,
  website text,
  role text,
  reputation integer,
  phone text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public, cet
as $$
  select
    u.id,
    u.username::text,
    u.display_name::text,
    u.bio,
    u.avatar_url,
    u.location::text,
    u.website::text,
    u.role::text,
    u.reputation,
    l.phone,
    u.created_at,
    u.updated_at
  from public.users u
  left join cet.learners l on l.user_id = u.id
  where u.id = auth.uid();
$$;

create or replace function public.cet_update_my_profile_v2(
  p_username text,
  p_display_name text,
  p_bio text,
  p_avatar_url text,
  p_location text,
  p_website text,
  p_phone text default null
)
returns table (
  id uuid,
  username text,
  display_name text,
  bio text,
  avatar_url text,
  location text,
  website text,
  role text,
  reputation integer,
  phone text,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, cet
as $$
declare
  v_user_id uuid := auth.uid();
  v_username text;
  v_email text;
  v_existing_role text;
  v_phone text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  v_username := nullif(trim(coalesce(p_username, '')), '');

  if v_username is null then
    select split_part(email, '@', 1) into v_email
    from auth.users
    where id = v_user_id;

    v_username := lower(coalesce(v_email, 'user')) || '_' || substr(replace(v_user_id::text, '-', ''), 1, 6);
  end if;

  select u.role into v_existing_role
  from public.users u
  where u.id = v_user_id;
  v_phone := nullif(trim(coalesce(p_phone, '')), '');

  insert into public.users (
    id,
    username,
    display_name,
    bio,
    avatar_url,
    location,
    website,
    role,
    reputation,
    app_metadata,
    created_at,
    updated_at
  )
  values (
    v_user_id,
    v_username,
    nullif(trim(coalesce(p_display_name, '')), ''),
    nullif(trim(coalesce(p_bio, '')), ''),
    nullif(trim(coalesce(p_avatar_url, '')), ''),
    nullif(trim(coalesce(p_location, '')), ''),
    nullif(trim(coalesce(p_website, '')), ''),
    coalesce(v_existing_role, 'user'),
    0,
    '{}'::jsonb,
    now(),
    now()
  )
  on conflict on constraint users_pkey
  do update set
    username = excluded.username,
    display_name = excluded.display_name,
    bio = excluded.bio,
    avatar_url = excluded.avatar_url,
    location = excluded.location,
    website = excluded.website,
    updated_at = now();

  update cet.learners
  set
    full_name = coalesce(nullif(trim(coalesce(p_display_name, '')), ''), cet.learners.full_name),
    phone = coalesce(v_phone, cet.learners.phone),
    updated_at = now()
  where user_id = v_user_id;

  return query
  select
    u.id,
    u.username::text,
    u.display_name::text,
    u.bio,
    u.avatar_url,
    u.location::text,
    u.website::text,
    u.role::text,
    u.reputation,
    l.phone,
    u.created_at,
    u.updated_at
  from public.users u
  left join cet.learners l on l.user_id = u.id
  where u.id = v_user_id;
end;
$$;

grant execute on function public.cet_self_register_learner(text, text, text) to authenticated;
grant execute on function public.cet_get_my_profile_v2() to authenticated;
grant execute on function public.cet_update_my_profile_v2(text, text, text, text, text, text, text) to authenticated;
