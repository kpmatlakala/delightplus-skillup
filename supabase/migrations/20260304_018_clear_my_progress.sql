-- ──────────────────────────────────────────────────────────────────────────────
-- Migration 018 — Self-service progress reset (developer / retest)
-- Allows any authenticated user to delete their OWN progress row(s).
-- Used by the dev-mode "Clear Progress" button on the Learning Path.
-- Admins can still use cet_admin_clear_learner_progress for other users.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── RPC: cet_clear_my_module_progress ────────────────────────────────────────
-- Deletes the calling user's learner_progress row for a specific module.
-- No role check — intentionally self-service so learners can retest.

CREATE OR REPLACE FUNCTION public.cet_clear_my_module_progress(p_module_id text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, cet
AS $$
BEGIN
  DELETE FROM cet.learner_progress
  WHERE user_id = auth.uid()
    AND module_unit_standard_id = p_module_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cet_clear_my_module_progress(text) TO authenticated;
