import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface QuizAnswer {
  question_id: number;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export function useQuizAnswers(moduleId: string) {
  const { user } = useAuth();
  const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
  const [quizResults, setQuizResults] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  // Load saved quiz answers when component mounts
  useEffect(() => {
    if (!user || !moduleId) return;
    loadQuizAnswers();
  }, [user, moduleId]);

  const loadQuizAnswers = useCallback(async () => {
    if (!user || !moduleId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_quiz_answers', {
        p_module_id: moduleId
      });

      if (error) {
        console.error('Error loading quiz answers:', error);
        return;
      }

      if (data && data.length > 0) {
        // Convert to answers format for form population
        const answers: Record<number, string> = {};
        const results: QuizAnswer[] = [];
        
        data.forEach((item: any) => {
          answers[item.question_id] = item.selected_answer;
          results.push({
            question_id: item.question_id,
            selected_answer: item.selected_answer,
            correct_answer: item.correct_answer,
            is_correct: item.is_correct
          });
        });

        setSavedAnswers(answers);
        setQuizResults(results);
        setHasCompletedQuiz(true);
      }
    } catch (err) {
      console.error('Error loading quiz answers:', err);
    } finally {
      setLoading(false);
    }
  }, [user, moduleId]);

  const saveQuizAnswers = useCallback(async (
    answers: Record<number, string>,
    correctAnswers: Record<number, string>,
    score: number,
    total: number
  ): Promise<boolean> => {
    if (!user || !moduleId) return false;

    try {
      setLoading(true);
      
      // Convert answers to JSONB format
      const answersJson = JSON.stringify(answers);
      const correctAnswersJson = JSON.stringify(correctAnswers);

      const { data, error } = await supabase.rpc('save_quiz_answers', {
        p_module_id: moduleId,
        p_answers: answersJson,
        p_correct_answers: correctAnswersJson,
        p_score: score,
        p_total: total
      });

      if (error) {
        console.error('Error saving quiz answers:', error);
        return false;
      }

      // Reload the answers to get the saved state
      await loadQuizAnswers();
      return true;
    } catch (err) {
      console.error('Error saving quiz answers:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, moduleId, loadQuizAnswers]);

  const getAnswersForReview = useCallback(() => {
    return quizResults;
  }, [quizResults]);

  const getQuizScore = useCallback(() => {
    if (quizResults.length === 0) return null;
    const correct = quizResults.filter(r => r.is_correct).length;
    return Math.round((correct / quizResults.length) * 100);
  }, [quizResults]);

  const clearQuizAnswers = useCallback(async (): Promise<boolean> => {
    if (!user || !moduleId) return false;

    try {
      // Clear by saving empty answers
      const success = await saveQuizAnswers({}, {}, 0, 0);
      if (success) {
        setSavedAnswers({});
        setQuizResults([]);
        setHasCompletedQuiz(false);
      }
      return success;
    } catch (err) {
      console.error('Error clearing quiz answers:', err);
      return false;
    }
  }, [user, moduleId, saveQuizAnswers]);

  return {
    savedAnswers,
    quizResults,
    loading,
    hasCompletedQuiz,
    saveQuizAnswers,
    loadQuizAnswers,
    getAnswersForReview,
    getQuizScore,
    clearQuizAnswers
  };
}