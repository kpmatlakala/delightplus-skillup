-- Migration: Add phone support to profile RPC
-- Date: 2026-03-17

DROP FUNCTION IF EXISTS public.cet_update_my_profile_v2;

CREATE OR REPLACE FUNCTION public.cet_update_my_profile_v2(
  p_display_name text default null,
  p_bio text default null,
  p_avatar_url text default null,
  p_phone text default null
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RETURN;
  END IF;

  UPDATE public.users
  SET display_name = coalesce(nullif(trim(p_display_name), ''), display_name),
      bio = coalesce(nullif(trim(p_bio), ''), bio),
      avatar_url = coalesce(nullif(trim(p_avatar_url), ''), avatar_url),
      phone = coalesce(nullif(trim(p_phone), ''), phone),
      updated_at = now()
  WHERE id = v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cet_update_my_profile_v2(text, text, text, text) TO authenticated;
