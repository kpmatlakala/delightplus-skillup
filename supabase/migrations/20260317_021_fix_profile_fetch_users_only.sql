-- Migration: Restrict profile fetch to users table only
-- Date: 2026-03-17

DROP FUNCTION IF EXISTS public.cet_get_my_profile_v2;

CREATE OR REPLACE FUNCTION public.cet_get_my_profile_v2()
RETURNS TABLE (
  display_name text,
  bio text,
  avatar_url text,
  phone text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  RETURN QUERY
    SELECT display_name, bio, avatar_url, phone
    FROM public.users
    WHERE id = v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cet_get_my_profile_v2() TO authenticated;
