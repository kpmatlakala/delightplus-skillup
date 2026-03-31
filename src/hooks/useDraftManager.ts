/**
 * React Hook for Assessment Draft Management
 * Provides auto-save functionality and draft recovery
 */

import { useEffect, useCallback, useState } from 'react';
import { draftManager, AssessmentAnswers } from '@/services/draftManager';
import { useAuth } from '@/hooks/useAuth';

export interface UseDraftManagerOptions {
  moduleId: string;
  autoSaveDelay?: number; // Delay in milliseconds before auto-saving
  onDraftLoaded?: (answers: AssessmentAnswers) => void;
  onDraftSaved?: () => void;
  onDraftCleared?: () => void;
}

export interface UseDraftManagerReturn {
  hasDraft: boolean;
  isDraftLoading: boolean;
  lastSaved: Date | null;
  saveDraft: (answers: AssessmentAnswers) => void;
  loadDraft: () => AssessmentAnswers | null;
  clearDraft: () => void;
  draftAge: number | null; // Age in minutes
}

export const useDraftManager = (options: UseDraftManagerOptions): UseDraftManagerReturn => {
  const { user } = useAuth();
  const { moduleId, autoSaveDelay = 2000, onDraftLoaded, onDraftSaved, onDraftCleared } = options;

  const [hasDraft, setHasDraft] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftAge, setDraftAge] = useState<number | null>(null);

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  /**
   * Check if draft exists and update state
   */
  const checkDraftExists = useCallback(() => {
    if (!user?.id) return;

    const exists = draftManager.hasDraft(moduleId, user.id);
    setHasDraft(exists);

    if (exists) {
      const draft = draftManager.loadDraft(moduleId, user.id);
      if (draft) {
        const ageInMinutes = (Date.now() - draft.timestamp) / (1000 * 60);
        setDraftAge(ageInMinutes);
        setLastSaved(new Date(draft.timestamp));
      }
    } else {
      setDraftAge(null);
      setLastSaved(null);
    }

    setIsDraftLoading(false);
  }, [moduleId, user?.id]);

  /**
   * Save draft to local storage
   */
  const saveDraft = useCallback((answers: AssessmentAnswers) => {
    if (!user?.id) return;

    // Clear existing auto-save timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new auto-save timer
    const timer = setTimeout(() => {
      draftManager.saveDraft(moduleId, answers, user.id);
      setLastSaved(new Date());
      setHasDraft(true);
      setDraftAge(0);
      onDraftSaved?.();
    }, autoSaveDelay);

    setAutoSaveTimer(timer);
  }, [user?.id, moduleId, autoSaveDelay, autoSaveTimer, onDraftSaved]);

  /**
   * Load draft from local storage
   */
  const loadDraft = useCallback((): AssessmentAnswers | null => {
    if (!user?.id) return null;

    const draft = draftManager.loadDraft(moduleId, user.id);
    if (draft) {
      onDraftLoaded?.(draft.answers);
      return draft.answers;
    }
    return null;
  }, [user?.id, moduleId, onDraftLoaded]);

  /**
   * Clear draft from local storage
   */
  const clearDraft = useCallback(() => {
    if (!user?.id) return;

    // Clear auto-save timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }

    draftManager.clearDraft(moduleId, user.id);
    setHasDraft(false);
    setLastSaved(null);
    setDraftAge(null);
    onDraftCleared?.();
  }, [user?.id, moduleId, autoSaveTimer, onDraftCleared]);

  /**
   * Initialize draft checking on mount
   */
  useEffect(() => {
    checkDraftExists();
  }, [checkDraftExists]);

  /**
   * Cleanup auto-save timer on unmount
   */
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  /**
   * Update draft age every minute
   */
  useEffect(() => {
    if (!hasDraft || !lastSaved) return;

    const interval = setInterval(() => {
      const ageInMinutes = (Date.now() - lastSaved.getTime()) / (1000 * 60);
      setDraftAge(ageInMinutes);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hasDraft, lastSaved]);

  return {
    hasDraft,
    isDraftLoading,
    lastSaved,
    saveDraft,
    loadDraft,
    clearDraft,
    draftAge
  };
};