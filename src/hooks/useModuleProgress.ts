// hooks/useModuleProgress.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface LearnerProgress {
  user_id: string;
  module_unit_standard_id: string; // Correct column name from unified schema
  guide_completed?: boolean;
  quiz_completed?: boolean;
  quiz_passed?: boolean; // Also exists in schema
  quiz_score?: number;
  quiz_completed_at?: string;
  assessment_unlocked?: boolean;
  assessment_submitted?: boolean;
  assessment_submitted_at?: string | null;
  submission_path?: string | null;
  submission_uploaded_at?: string | null;
  assessment_grade?: number;
  assessment_feedback?: string;
  assessment_graded_at?: string;
  updated_at?: string;
  created_at?: string;
}

const normalizeProgressEntry = (progress: LearnerProgress): LearnerProgress => {
  const submittedAt = progress.assessment_submitted_at ?? progress.submission_uploaded_at ?? null;
  const hasSubmissionEvidence = Boolean(
    progress.assessment_submitted ||
    submittedAt ||
    progress.submission_path
  );

  return {
    ...progress,
    assessment_unlocked: Boolean(progress.assessment_unlocked || hasSubmissionEvidence),
    assessment_submitted: hasSubmissionEvidence,
    assessment_submitted_at: submittedAt,
  };
};

export function useModuleProgress() {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<string, LearnerProgress>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get all progress records for this user directly
      const { data: progressData, error: progressError } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) {
        console.error('Error fetching progress:', progressError);
        return;
      }

      // Convert to progress map using module_unit_standard_id as key
      const map: Record<string, LearnerProgress> = {};
      if (progressData) {
        progressData.forEach((progress) => {
          const normalized = normalizeProgressEntry(progress as LearnerProgress);
          map[normalized.module_unit_standard_id] = normalized;
        });
      }
      
      setProgressMap(map);
    } catch (err) {
      console.error("Error in fetchProgress:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProgress = useCallback(async (
    moduleId: string,
    updates: Partial<LearnerProgress>
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Prepare the update data using user_id and module_unit_standard_id
      const updateData = {
        user_id: user.id,
        module_unit_standard_id: moduleId, // Correct column name
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('Updating progress with data:', updateData);

      // Update or insert progress
      const { data, error } = await supabase
        .from('learner_progress')
        .upsert(updateData, {
          onConflict: 'user_id,module_unit_standard_id' // Correct column name
        })
        .select();

      if (error) {
        console.error('Failed to update progress:', error);
        return false;
      }

      console.log('Progress updated successfully:', data);

      // Update local state immediately
      setProgressMap((prev) => {
        const nextEntry = normalizeProgressEntry({
          ...(prev[moduleId] ?? {
            user_id: user.id,
            module_unit_standard_id: moduleId,
          }),
          ...updateData,
        } as LearnerProgress);

        return {
          ...prev,
          [moduleId]: nextEntry,
        };
      });

      // Refresh progress data from server
      setTimeout(() => {
        fetchProgress();
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  }, [user, fetchProgress]);

  const markAssessmentSubmitted = useCallback(async (
    moduleId: string,
    submittedAt?: string,
    submissionPath?: string | null
  ) => {
    const timestamp = submittedAt ?? new Date().toISOString();

    return updateProgress(moduleId, {
      assessment_unlocked: true,
      assessment_submitted: true,
      assessment_submitted_at: timestamp,
      submission_uploaded_at: timestamp,
      submission_path: submissionPath ?? progressMap[moduleId]?.submission_path ?? null,
    });
  }, [updateProgress, progressMap]);

  const clearMyModuleProgress = useCallback(async (moduleId: string) => {
    // Clear all progress for a module
    return updateProgress(moduleId, {
      guide_completed: false,
      quiz_completed: false,
      quiz_passed: false,
      quiz_score: 0,
      assessment_unlocked: false,
      submission_path: null,
      submission_uploaded_at: null,
      assessment_submitted: false,
      assessment_submitted_at: null,
    });
  }, [updateProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progressMap,
    loading,
    updateProgress,
    markAssessmentSubmitted,
    clearMyModuleProgress,
    fetchProgress,
  };
}