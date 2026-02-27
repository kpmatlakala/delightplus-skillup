import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
export interface ModuleProgressRow {
  module_unit_standard_id: string;
  guide_completed: boolean;
  quiz_passed: boolean;
  assessment_unlocked: boolean;
  submission_path: string | null;
  submission_uploaded_at: string | null;
  assessment_submitted: boolean;
  assessment_submitted_at: string | null;
  updated_at: string;
}

type ProgressMap = Record<string, ModuleProgressRow>;

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------
export function useModuleProgress() {
  const { user, role } = useAuth();
  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(false);
  const fetchedForUser = useRef<string | null>(null);

  // Load all progress rows for the authenticated learner
  useEffect(() => {
    if (!user?.id || role !== "learner") {
      setProgressMap({});
      fetchedForUser.current = null;
      return;
    }

    // Avoid re-fetching on every render for the same user
    if (fetchedForUser.current === user.id) return;
    fetchedForUser.current = user.id;

    setLoading(true);
    supabase
      .rpc("cet_get_all_module_progress")
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) return;
        const map: ProgressMap = {};
        for (const row of data) {
          map[row.module_unit_standard_id] = row as ModuleProgressRow;
        }
        setProgressMap(map);
      });
  }, [user?.id, role]);

  // ------------------------------------------------------------------
  // getProgress — read a single module's row (null if not started)
  // ------------------------------------------------------------------
  const getProgress = useCallback(
    (moduleId: string): ModuleProgressRow | null =>
      progressMap[moduleId] ?? null,
    [progressMap]
  );

  // ------------------------------------------------------------------
  // Internal upsert — apply a partial patch with optimistic update
  // ------------------------------------------------------------------
  const upsert = useCallback(
    async (
      moduleId: string,
      patch: Partial<Omit<ModuleProgressRow, "module_unit_standard_id" | "updated_at">>
    ): Promise<void> => {
      if (!user?.id || role !== "learner") return;

      // Optimistic local update
      setProgressMap((prev) => {
        const existing = prev[moduleId];
        return {
          ...prev,
          [moduleId]: {
            module_unit_standard_id: moduleId,
            guide_completed: false,
            quiz_passed: false,
            assessment_unlocked: false,
            submission_path: null,
            submission_uploaded_at: null,
            assessment_submitted: false,
            assessment_submitted_at: null,
            updated_at: new Date().toISOString(),
            ...existing,
            ...patch,
          },
        };
      });

      // Persist to Supabase (fire-and-forget; errors are silent to avoid
      // blocking the learner — the optimistic state is already correct)
      await supabase.rpc("cet_upsert_module_progress", {
        p_unit_std_id: moduleId,
        p_guide_completed: patch.guide_completed ?? null,
        p_quiz_passed: patch.quiz_passed ?? null,
        p_assessment_unlocked: patch.assessment_unlocked ?? null,
        p_submission_path: patch.submission_path ?? null,
        p_submission_uploaded_at: patch.submission_uploaded_at ?? null,
        p_assessment_submitted: patch.assessment_submitted ?? null,
        p_assessment_submitted_at: patch.assessment_submitted_at ?? null,
      });
    },
    [user?.id, role]
  );

  // ------------------------------------------------------------------
  // Named helpers
  // ------------------------------------------------------------------
  const markGuideCompleted = useCallback(
    (moduleId: string) => upsert(moduleId, { guide_completed: true }),
    [upsert]
  );

  const markQuizPassed = useCallback(
    (moduleId: string) =>
      upsert(moduleId, { quiz_passed: true, assessment_unlocked: true }),
    [upsert]
  );

  const markAssessmentUnlocked = useCallback(
    (moduleId: string) => upsert(moduleId, { assessment_unlocked: true }),
    [upsert]
  );

  const recordSubmission = useCallback(
    (moduleId: string, path: string, uploadedAt: string) =>
      upsert(moduleId, {
        submission_path: path,
        submission_uploaded_at: uploadedAt,
      }),
    [upsert]
  );

  const markAssessmentSubmitted = useCallback(
    (moduleId: string, submittedAt: string) =>
      upsert(moduleId, {
        assessment_submitted: true,
        assessment_submitted_at: submittedAt,
      }),
    [upsert]
  );

  return {
    progressMap,
    loading,
    getProgress,
    markGuideCompleted,
    markQuizPassed,
    markAssessmentUnlocked,
    recordSubmission,
    markAssessmentSubmitted,
  };
}
