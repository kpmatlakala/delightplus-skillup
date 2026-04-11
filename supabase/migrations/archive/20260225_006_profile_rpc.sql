create or replace function public.cet_get_my_profile()
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
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
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
    u.created_at,
    u.updated_at
  from public.users u
  where u.id = auth.uid();
$$;

create or replace function public.cet_update_my_profile(
  p_username text,
  p_display_name text default null,
  p_bio text default null,
  p_avatar_url text default null,
  p_location text default null,
  p_website text default null
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
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_username text;
  v_email text;
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
    'user',
    0,
    '{}'::jsonb,
    now(),
    now()
  )
  on conflict (id)
  do update set
    username = excluded.username,
    display_name = excluded.display_name,
    bio = excluded.bio,
    avatar_url = excluded.avatar_url,
    location = excluded.location,
    website = excluded.website,
    updated_at = now();

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
    u.created_at,
    u.updated_at
  from public.users u
  where u.id = v_user_id;
end;
$$;

grant execute on function public.cet_get_my_profile() to authenticated;
grant execute on function public.cet_update_my_profile(text, text, text, text, text, text) to authenticated;
