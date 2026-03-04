import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface OtpRecord {
  id: string;
  otp_code: string;
  module_id: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
}

export interface LearnerAssessmentStatus {
  learner_id: string;
  full_name: string;
  learner_code: string;
  email: string;
  assessment_submitted: boolean;
  assessment_submitted_at: string | null;
  submission_path: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typed RPC helper (cet_* RPCs are not in generated types)
// ─────────────────────────────────────────────────────────────────────────────

const rpc = supabase as unknown as {
  rpc: (
    fn: string,
    params?: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook — used by admin/moderator only for the control panel section,
//         and by learners for the OTP validation call.
// ─────────────────────────────────────────────────────────────────────────────

export function useAssessmentControl(
  moduleId: string | undefined,
  role: string | null
) {
  const isAdmin = role === "admin" || role === "moderator";

  const [otp, setOtp] = useState<OtpRecord | null>(null);
  const [learnerStatuses, setLearnerStatuses] = useState<LearnerAssessmentStatus[]>([]);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  // ── Fetch active OTP (admin) ───────────────────────────────────────────────
  const fetchOtp = useCallback(async () => {
    if (!moduleId || !isAdmin) return;
    setLoadingOtp(true);
    const { data } = await rpc.rpc("cet_get_active_otp", { p_module_id: moduleId });
    setLoadingOtp(false);
    setOtp((data as OtpRecord | null) ?? null);
  }, [moduleId, isAdmin]);

  // ── Fetch learner submission statuses (admin) ──────────────────────────────
  const fetchStatuses = useCallback(async () => {
    if (!moduleId || !isAdmin) return;
    setLoadingStatuses(true);
    const { data } = await rpc.rpc("cet_get_module_assessment_status", {
      p_module_id: moduleId,
    });
    setLoadingStatuses(false);
    setLearnerStatuses((data as LearnerAssessmentStatus[]) ?? []);
  }, [moduleId, isAdmin]);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return;
    fetchOtp();
    fetchStatuses();
  }, [fetchOtp, fetchStatuses, isAdmin]);

  // ── Generate new OTP ───────────────────────────────────────────────────────
  const generateOtp = useCallback(async () => {
    if (!moduleId) return;
    setGenerating(true);
    const { data } = await rpc.rpc("cet_generate_assessment_otp", {
      p_module_id: moduleId,
    });
    setGenerating(false);
    setOtp((data as OtpRecord | null) ?? null);
  }, [moduleId]);

  // ── Revoke current OTP ────────────────────────────────────────────────────
  const revokeOtp = useCallback(async () => {
    if (!moduleId) return;
    setRevoking(true);
    await rpc.rpc("cet_revoke_assessment_otp", { p_module_id: moduleId });
    setRevoking(false);
    setOtp(null);
  }, [moduleId]);

  // ── Validate OTP (learner) ────────────────────────────────────────────────
  const validateOtp = useCallback(
    async (otpInput: string): Promise<boolean> => {
      if (!moduleId) return false;
      const { data } = await rpc.rpc("cet_validate_assessment_otp", {
        p_module_id: moduleId,
        p_otp: otpInput.trim(),
      });
      return data === true;
    },
    [moduleId]
  );

  return {
    otp,
    learnerStatuses,
    generating,
    revoking,
    loadingStatuses,
    loadingOtp,
    generateOtp,
    revokeOtp,
    validateOtp,
    refreshStatuses: fetchStatuses,
    refreshOtp: fetchOtp,
  };
}
