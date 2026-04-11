/**
 * Draft Management System for Assessment Submissions
 * Automatically saves and recovers assessment answers using local storage
 */

export interface AssessmentAnswers {
  [questionIndex: number]: string;
}

export interface AssessmentDraft {
  answers: AssessmentAnswers;
  timestamp: number;
  version: string;
  moduleId: string;
  userId: string;
  submissionText?: string;
}

export interface DraftManager {
  saveDraft(moduleId: string, answers: AssessmentAnswers, userId: string): void;
  loadDraft(moduleId: string, userId: string): AssessmentDraft | null;
  clearDraft(moduleId: string, userId: string): void;
  hasDraft(moduleId: string, userId: string): boolean;
  getAllDrafts(userId: string): AssessmentDraft[];
  cleanupOldDrafts(userId: string, maxAgeInDays?: number): void;
}

export class LocalStorageDraftManager implements DraftManager {
  private readonly DRAFT_VERSION = '1.0';
  private readonly MAX_DRAFT_AGE_DAYS = 7; // Default: 7 days
  private readonly STORAGE_PREFIX = 'assessment_draft_';

  /**
   * Generate storage key for a specific module and user
   */
  private getKey(moduleId: string, userId: string): string {
    return `${this.STORAGE_PREFIX}${userId}_${moduleId}`;
  }

  /**
   * Save assessment draft to local storage
   */
  saveDraft(moduleId: string, answers: AssessmentAnswers, userId: string): void {
    try {
      const draft: AssessmentDraft = {
        answers,
        timestamp: Date.now(),
        version: this.DRAFT_VERSION,
        moduleId,
        userId
      };

      const key = this.getKey(moduleId, userId);
      localStorage.setItem(key, JSON.stringify(draft));
      
      console.log(`[DraftManager] Saved draft for module ${moduleId}`);
    } catch (error) {
      console.warn('[DraftManager] Failed to save draft:', error);
    }
  }

  /**
   * Load assessment draft from local storage
   */
  loadDraft(moduleId: string, userId: string): AssessmentDraft | null {
    try {
      const key = this.getKey(moduleId, userId);
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return null;
      }

      const draft: AssessmentDraft = JSON.parse(stored);
      
      // Validate draft structure
      if (!this.isValidDraft(draft)) {
        console.warn('[DraftManager] Invalid draft structure, removing');
        this.clearDraft(moduleId, userId);
        return null;
      }

      // Check if draft is too old
      const ageInDays = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24);
      if (ageInDays > this.MAX_DRAFT_AGE_DAYS) {
        console.log('[DraftManager] Draft too old, removing');
        this.clearDraft(moduleId, userId);
        return null;
      }

      console.log(`[DraftManager] Loaded draft for module ${moduleId}`);
      return draft;
    } catch (error) {
      console.warn('[DraftManager] Failed to load draft:', error);
      return null;
    }
  }

  /**
   * Clear assessment draft from local storage
   */
  clearDraft(moduleId: string, userId: string): void {
    try {
      const key = this.getKey(moduleId, userId);
      localStorage.removeItem(key);
      console.log(`[DraftManager] Cleared draft for module ${moduleId}`);
    } catch (error) {
      console.warn('[DraftManager] Failed to clear draft:', error);
    }
  }

  /**
   * Check if a draft exists for the given module and user
   */
  hasDraft(moduleId: string, userId: string): boolean {
    const draft = this.loadDraft(moduleId, userId);
    return draft !== null;
  }

  /**
   * Get all drafts for a specific user
   */
  getAllDrafts(userId: string): AssessmentDraft[] {
    const drafts: AssessmentDraft[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX) && key.includes(userId)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const draft: AssessmentDraft = JSON.parse(stored);
              if (this.isValidDraft(draft) && draft.userId === userId) {
                drafts.push(draft);
              }
            } catch {
              // Skip invalid drafts
            }
          }
        }
      }
    } catch (error) {
      console.warn('[DraftManager] Failed to get all drafts:', error);
    }

    return drafts.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  }

  /**
   * Clean up old drafts for a user
   */
  cleanupOldDrafts(userId: string, maxAgeInDays: number = this.MAX_DRAFT_AGE_DAYS): void {
    try {
      const cutoffTime = Date.now() - (maxAgeInDays * 24 * 60 * 60 * 1000);
      let cleanedCount = 0;

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX) && key.includes(userId)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const draft: AssessmentDraft = JSON.parse(stored);
              if (draft.timestamp < cutoffTime) {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            } catch {
              // Remove invalid drafts too
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(`[DraftManager] Cleaned up ${cleanedCount} old drafts`);
      }
    } catch (error) {
      console.warn('[DraftManager] Failed to cleanup old drafts:', error);
    }
  }

  /**
   * Validate draft structure
   */
  private isValidDraft(draft: any): draft is AssessmentDraft {
    return (
      draft &&
      typeof draft === 'object' &&
      typeof draft.answers === 'object' &&
      typeof draft.timestamp === 'number' &&
      typeof draft.version === 'string' &&
      typeof draft.moduleId === 'string' &&
      typeof draft.userId === 'string'
    );
  }

  /**
   * Get draft statistics for a user
   */
  getDraftStats(userId: string): { count: number; totalSize: number; oldestDraft?: Date } {
    const drafts = this.getAllDrafts(userId);
    let totalSize = 0;

    drafts.forEach(draft => {
      totalSize += JSON.stringify(draft).length;
    });

    return {
      count: drafts.length,
      totalSize,
      oldestDraft: drafts.length > 0 ? new Date(drafts[drafts.length - 1].timestamp) : undefined
    };
  }
}

// Singleton instance for use across the application
export const draftManager = new LocalStorageDraftManager();