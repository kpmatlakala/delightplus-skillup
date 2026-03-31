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
  submission_path?: string;
  submission_uploaded_at?: string;
  assessment_grade?: number;
  assessment_feedback?: string;
  assessment_graded_at?: string;
  updated_at?: string;
  created_at?: string;
}

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
          map[progress.module_unit_standard_id] = progress;
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
      setProgressMap(prev => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          ...updates
        }
      }));

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
    });
  }, [updateProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progressMap,
    loading,
    updateProgress,
    clearMyModuleProgress,
    fetchProgress,
  };
}