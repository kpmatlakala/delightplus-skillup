import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AssessmentStatus {
  module_unit_standard_id: string;
  assessment_submitted: boolean;
  submission_path: string | null;
  submitted_at: string | null;
  assessment_grade: number | null;
  assessment_feedback: string | null;
  graded_at: string | null;
}

export interface AssessmentSubmission {
  user_id: string;
  learner_name: string;
  module_unit_standard_id: string;
  submission_path: string;
  submitted_at: string;
  assessment_grade: number | null;
  assessment_feedback: string | null;
  graded_at: string | null;
  graded_by: string | null;
  grader_name: string | null;
}

export function useAssessmentStatus(unitStdId: string) {
  const { user } = useAuth();
  const [status, setStatus] = useState<AssessmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !unitStdId) {
      setLoading(false);
      return;
    }

    const fetchAssessmentStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get assessment status from learner_progress table using user_id directly
        const { data: progressData, error: progressError } = await supabase
          .from('learner_progress')
          .select(`
            module_unit_standard_id,
            assessment_submitted,
            submission_path,
            submission_uploaded_at
          `)
          .eq('user_id', user.id)
          .eq('module_unit_standard_id', unitStdId)
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError;
        }

        if (progressData) {
          setStatus({
            module_unit_standard_id: progressData.module_unit_standard_id,
            assessment_submitted: progressData.assessment_submitted || false,
            submission_path: progressData.submission_path,
            submitted_at: progressData.submission_uploaded_at,
            assessment_grade: null, // Not available in current schema
            assessment_feedback: null, // Not available in current schema
            graded_at: null // Not available in current schema
          });
        } else {
          // No progress record yet
          setStatus({
            module_unit_standard_id: unitStdId,
            assessment_submitted: false,
            submission_path: null,
            submitted_at: null,
            assessment_grade: null,
            assessment_feedback: null,
            graded_at: null
          });
        }
      } catch (err) {
        console.error('Error fetching assessment status:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch assessment status');
        
        // Fallback to default status
        setStatus({
          module_unit_standard_id: unitStdId,
          assessment_submitted: false,
          submission_path: null,
          submitted_at: null,
          assessment_grade: null,
          assessment_feedback: null,
          graded_at: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentStatus();
  }, [user, unitStdId]);

  const refreshStatus = async () => {
    if (!user || !unitStdId) return;

    try {
      // Get updated status using user_id directly
      const { data: progressData, error: progressError } = await supabase
        .from('learner_progress')
        .select(`
          module_unit_standard_id,
          assessment_submitted,
          submission_path,
          submission_uploaded_at
        `)
        .eq('user_id', user.id)
        .eq('module_unit_standard_id', unitStdId)
        .single();

      if (progressData) {
        setStatus({
          module_unit_standard_id: progressData.module_unit_standard_id,
          assessment_submitted: progressData.assessment_submitted || false,
          submission_path: progressData.submission_path,
          submitted_at: progressData.submission_uploaded_at,
          assessment_grade: null, // Not available in current schema
          assessment_feedback: null, // Not available in current schema
          graded_at: null // Not available in current schema
        });
      }
    } catch (err) {
      console.error('Error refreshing assessment status:', err);
    }
  };

  return {
    status,
    loading,
    error,
    refreshStatus
  };
}

export function useAssessmentSubmissions(unitStdId?: string) {
  const { role } = useAuth();
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role !== 'admin' && role !== 'lecturer') {
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query learner_progress table directly using user_id
        let query = supabase
          .from('learner_progress')
          .select(`
            user_id,
            module_unit_standard_id,
            submission_path,
            submission_uploaded_at
          `)
          .eq('assessment_submitted', true)
          .not('submission_path', 'is', null);

        if (unitStdId) {
          query = query.eq('module_unit_standard_id', unitStdId);
        }

        const { data, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        // Transform the data to match the expected format
        const transformedSubmissions: AssessmentSubmission[] = (data || []).map(item => ({
          user_id: item.user_id,
          learner_name: 'Learner', // We don't have name in progress table
          module_unit_standard_id: item.module_unit_standard_id,
          submission_path: item.submission_path || '',
          submitted_at: item.submission_uploaded_at || '',
          assessment_grade: null, // Not available in current schema
          assessment_feedback: null, // Not available in current schema
          graded_at: null, // Not available in current schema
          graded_by: null, // Not available in current schema
          grader_name: null // Not available in current schema
        }));

        setSubmissions(transformedSubmissions);
      } catch (err) {
        console.error('Error fetching assessment submissions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [role, unitStdId]);

  const gradeAssessment = async (
    userId: string,
    unitStdId: string,
    grade: number,
    feedback?: string
  ): Promise<boolean> => {
    try {
      // Note: grading functionality not available with current schema
      // The learner_progress table doesn't have assessment_grade, assessment_feedback, assessment_graded_at columns
      console.warn('Grading functionality not available - missing columns in learner_progress table');
      return false;
    } catch (err) {
      console.error('Error grading assessment:', err);
      throw err;
    }
  };

  const refreshSubmissions = async () => {
    if (role !== 'admin' && role !== 'lecturer') return;

    try {
      let query = supabase
        .from('learner_progress')
        .select(`
          user_id,
          module_unit_standard_id,
          submission_path,
          submission_uploaded_at
        `)
        .eq('assessment_submitted', true)
        .not('submission_path', 'is', null);

      if (unitStdId) {
        query = query.eq('module_unit_standard_id', unitStdId);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      const transformedSubmissions: AssessmentSubmission[] = (data || []).map(item => ({
        user_id: item.user_id,
        learner_name: 'Learner',
        module_unit_standard_id: item.module_unit_standard_id,
        submission_path: item.submission_path || '',
        submitted_at: item.submission_uploaded_at || '',
        assessment_grade: null, // Not available in current schema
        assessment_feedback: null, // Not available in current schema
        graded_at: null, // Not available in current schema
        graded_by: null,
        grader_name: null
      }));

      setSubmissions(transformedSubmissions);
    } catch (err) {
      console.error('Error refreshing submissions:', err);
    }
  };

  return {
    submissions,
    loading,
    error,
    gradeAssessment,
    refreshSubmissions
  };
}