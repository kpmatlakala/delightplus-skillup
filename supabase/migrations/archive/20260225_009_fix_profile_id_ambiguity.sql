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
#variable_conflict use_column
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
    select split_part(au.email, '@', 1) into v_email
    from auth.users au
    where au.id = v_user_id;

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
