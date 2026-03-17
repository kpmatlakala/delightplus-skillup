-- Migration: Fix profile RPC phone column error
-- Date: 2026-03-17

DROP FUNCTION IF EXISTS public.cet_update_my_profile_v2;

CREATE OR REPLACE FUNCTION public.cet_update_my_profile_v2(
  p_username     text,
  p_display_name text,
  p_bio          text,
  p_avatar_url   text,
  p_location     text,
  p_website      text,
  p_phone        text default null,
  p_id_number    text default null,
  p_department   text default null,
  p_school       text default null
)
RETURNS TABLE (
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
  id_number text,
  department text,
  school text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, cet
AS $$
#variable_conflict use_column
DECLARE
  v_user_id       uuid := auth.uid();
  v_username      text;
  v_email         text;
  v_existing_role text;
  v_phone         text;
  v_id_number     text;
  v_department    text;
  v_school        text;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  v_username := nullif(trim(coalesce(p_username, '')), '');
  IF v_username IS NULL THEN
    SELECT split_part(au.email, '@', 1) INTO v_email FROM auth.users au WHERE au.id = v_user_id;
    v_username := lower(coalesce(v_email, 'user')) || '_' || substr(replace(v_user_id::text, '-', ''), 1, 6);
  END IF;

  SELECT u.role INTO v_existing_role FROM public.users u WHERE u.id = v_user_id;
  v_phone := nullif(trim(coalesce(p_phone, '')), '');
  v_id_number := nullif(trim(coalesce(p_id_number, '')), '');
  v_department := nullif(trim(coalesce(p_department, '')), '');
  v_school := nullif(trim(coalesce(p_school, '')), '');

  -- Update public.users
  UPDATE public.users
  SET username = v_username,
      display_name = nullif(trim(coalesce(p_display_name,'')),  ''),
      bio = nullif(trim(coalesce(p_bio,'')), ''),
      avatar_url = nullif(trim(coalesce(p_avatar_url,'')),''),
      location = nullif(trim(coalesce(p_location,'')), ''),
      website = nullif(trim(coalesce(p_website,'')),''),
      id_number = v_id_number,
      department = v_department,
      school = v_school,
      updated_at = now()
  WHERE id = v_user_id;

  -- Update cet.learners
  UPDATE cet.learners
  SET full_name = coalesce(nullif(trim(coalesce(p_display_name,'')), ''), cet.learners.full_name),
      phone = coalesce(v_phone, cet.learners.phone),
      id_number = coalesce(v_id_number, cet.learners.id_number),
      department = coalesce(v_department, cet.learners.department),
      school = coalesce(v_school, cet.learners.school),
      updated_at = now()
  WHERE user_id = v_user_id;

  RETURN QUERY
  SELECT u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation,
         l.phone, u.id_number, u.department, u.school, u.created_at, u.updated_at
  FROM public.users u
  LEFT JOIN cet.learners l ON l.user_id = u.id
  WHERE u.id = v_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.cet_update_my_profile_v2(text, text, text, text, text, text, text, text, text, text) TO authenticated;
