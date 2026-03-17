-- Migration: Fix cet_get_my_profile_v2 to use only public.users and return all profile fields
-- Date: 2026-03-17

DROP FUNCTION IF EXISTS public.cet_get_my_profile_v2;

CREATE OR REPLACE FUNCTION public.cet_get_my_profile_v2()
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
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT u.id, u.username::text, u.display_name::text, u.bio, u.avatar_url, u.location::text, u.website::text, u.role::text, u.reputation,
         u.phone, u.id_number, u.department, u.school, u.created_at, u.updated_at
  FROM public.users u
  WHERE u.id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.cet_get_my_profile_v2() TO authenticated;
