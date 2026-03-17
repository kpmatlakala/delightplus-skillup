-- Migration: Recreate cet_self_register_learner as a no-op for unified users schema
-- Date: 2026-03-17

DROP FUNCTION IF EXISTS public.cet_self_register_learner;

CREATE OR REPLACE FUNCTION public.cet_self_register_learner(
  p_full_name text default null,
  p_email text default null,
  p_phone text default null
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  -- No-op: all learner data is now in public.users
  -- Optionally update display_name, phone, etc. if needed
  IF v_user_id IS NULL THEN RETURN NULL; END IF;

  UPDATE public.users
  SET display_name = coalesce(nullif(trim(p_full_name), ''), display_name),
      phone = coalesce(nullif(trim(p_phone), ''), phone),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cet_self_register_learner(text, text, text) TO authenticated;
