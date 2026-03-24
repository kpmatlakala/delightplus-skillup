// hooks/useModuleProgress.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProgressEntry {
  module_unit_standard_id: string;
  guide_completed: boolean;
  quiz_passed: boolean;
  assessment_unlocked: boolean;
  submission_path: string | null;
  submission_uploaded_at: string | null;
  assessment_submitted: boolean;
  assessment_submitted_at: string | null;
}

export function useModuleProgress() {
  const [progressMap, setProgressMap] = useState<Record<string, ProgressEntry>>({});
  const [loading, setLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    try {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny.rpc("cet_get_all_module_progress");
      
      if (error) {
        console.error("Error loading module progress:", error);
        return;
      }
      
      const map: Record<string, ProgressEntry> = {};
      if (Array.isArray(data)) {
        data.forEach((item: ProgressEntry) => {
          map[item.module_unit_standard_id] = item;
        });
      }
      setProgressMap(map);
    } catch (err) {
      console.error("Error in loadProgress:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (
    moduleId: string,
    updates: Partial<Omit<ProgressEntry, 'module_unit_standard_id'>>
  ) => {
    try {
      const supabaseAny = supabase as any;
      const { error } = await supabaseAny.rpc("cet_upsert_module_progress", {
        p_unit_std_id: moduleId,
        p_guide_completed: updates.guide_completed,
        p_quiz_passed: updates.quiz_passed,
        p_assessment_unlocked: updates.assessment_unlocked,
        p_submission_path: updates.submission_path,
        p_submission_uploaded_at: updates.submission_uploaded_at,
        p_assessment_submitted: updates.assessment_submitted,
        p_assessment_submitted_at: updates.assessment_submitted_at,
      });
      
      if (error) {
        console.error("Error updating module progress:", error);
        return false;
      }
      
      // Refresh the progress map
      await loadProgress();
      return true;
    } catch (err) {
      console.error("Error in updateProgress:", err);
      return false;
    }
  }, [loadProgress]);

  const clearMyModuleProgress = useCallback(async (moduleId: string) => {
    // Clear all progress for a module
    return updateProgress(moduleId, {
      guide_completed: false,
      quiz_passed: false,
      assessment_unlocked: false,
      submission_path: null,
      submission_uploaded_at: null,
      assessment_submitted: false,
      assessment_submitted_at: null,
    });
  }, [updateProgress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progressMap,
    loading,
    updateProgress,
    clearMyModuleProgress,
  };
}