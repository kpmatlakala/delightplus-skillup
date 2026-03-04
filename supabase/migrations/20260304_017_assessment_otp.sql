-- ──────────────────────────────────────────────────────────────────────────────
-- Migration 017 — Assessment OTP + Learner Status Panel
-- Adds per-module OTP gate for assessment day access.
-- Admin generates a 6-digit OTP; learners must enter it before the form shows.
-- Also adds an RPC so admin can see who has submitted for each module.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── Table ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS cet.assessment_otp (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   text        NOT NULL,
  otp_code    text        NOT NULL,
  created_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true
);

ALTER TABLE cet.assessment_otp ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin manages otps"   ON cet.assessment_otp;
DROP POLICY IF EXISTS "Learner cannot read"  ON cet.assessment_otp;

CREATE POLICY "Admin manages otps"
  ON cet.assessment_otp FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'moderator')
  );

-- ── RPC: cet_generate_assessment_otp ─────────────────────────────────────────
-- Admin only. Deactivates any existing OTP for the module and inserts a fresh
-- 6-digit OTP that expires after 8 hours (covers a full assessment day).

CREATE OR REPLACE FUNCTION public.cet_generate_assessment_otp(p_module_id text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, cet
AS $$
DECLARE
  v_otp    text;
  v_record jsonb;
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Deactivate previous OTPs for this module
  UPDATE cet.assessment_otp
    SET is_active = false
    WHERE module_id = p_module_id AND is_active = true;

  -- Generate zero-padded 6-digit OTP
  v_otp := lpad(floor(random() * 1000000)::text, 6, '0');

  INSERT INTO cet.assessment_otp (module_id, otp_code, created_by, expires_at)
  VALUES (p_module_id, v_otp, auth.uid(), now() + interval '8 hours')
  RETURNING jsonb_build_object(
    'id',         id,
    'otp_code',   otp_code,
    'module_id',  module_id,
    'created_at', created_at,
    'expires_at', expires_at,
    'is_active',  is_active
  ) INTO v_record;

  RETURN v_record;
END;
$$;

-- ── RPC: cet_get_active_otp ───────────────────────────────────────────────────
-- Admin only. Returns the current active, non-expired OTP for a module, or null.

CREATE OR REPLACE FUNCTION public.cet_get_active_otp(p_module_id text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, cet
AS $$
DECLARE
  v_record jsonb;
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'id',         id,
    'otp_code',   otp_code,
    'module_id',  module_id,
    'created_at', created_at,
    'expires_at', expires_at,
    'is_active',  is_active
  )
  INTO v_record
  FROM cet.assessment_otp
  WHERE module_id = p_module_id
    AND is_active = true
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN v_record;
END;
$$;

-- ── RPC: cet_revoke_assessment_otp ───────────────────────────────────────────
-- Admin only. Deactivates the current OTP for the module.

CREATE OR REPLACE FUNCTION public.cet_revoke_assessment_otp(p_module_id text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, cet
AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE cet.assessment_otp
    SET is_active = false
    WHERE module_id = p_module_id AND is_active = true;
END;
$$;

-- ── RPC: cet_validate_assessment_otp ─────────────────────────────────────────
-- Callable by any authenticated user. Returns true if the supplied OTP is
-- valid (active + not expired) for the given module.

CREATE OR REPLACE FUNCTION public.cet_validate_assessment_otp(
  p_module_id text,
  p_otp       text
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, cet
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM cet.assessment_otp
    WHERE module_id = p_module_id
      AND otp_code  = p_otp
      AND is_active = true
      AND expires_at > now()
  );
END;
$$;

-- ── RPC: cet_get_module_assessment_status ────────────────────────────────────
-- Admin only. Returns every enrolled learner with their assessment submission
-- status for the given module. Learners who have not started appear with
-- assessment_submitted = false.

CREATE OR REPLACE FUNCTION public.cet_get_module_assessment_status(p_module_id text)
RETURNS TABLE (
  learner_id              uuid,
  full_name               text,
  learner_code            text,
  email                   text,
  assessment_submitted    boolean,
  assessment_submitted_at timestamptz,
  submission_path         text
)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, cet
AS $$
BEGIN
  IF (auth.jwt() -> 'user_metadata' ->> 'role') NOT IN ('admin', 'moderator') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    l.user_id                                     AS learner_id,
    l.full_name,
    l.learner_code,
    l.email,
    COALESCE(lp.assessment_submitted, false)       AS assessment_submitted,
    lp.assessment_submitted_at,
    lp.submission_path
  FROM cet.learners l
  LEFT JOIN cet.learner_progress lp
         ON lp.user_id = l.user_id
        AND lp.module_unit_standard_id = p_module_id
  ORDER BY l.full_name;
END;
$$;
