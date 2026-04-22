import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AssessmentSubmission {
  id: string;
  submission_content: string;
  submission_path: string | null;
  file_name: string | null;
  file_size: number | null;
  learner_info: any;
  assessment_answers: any;
  submitted_at: string;
  assessment_grade: number | null;
  assessment_feedback: string | null;
  graded_at: string | null;
}

export function useAssessmentSubmissions(moduleId: string) {
  const { user } = useAuth();
  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSubmittedAssessment, setHasSubmittedAssessment] = useState(false);

  // Load saved assessment submission when component mounts
  useEffect(() => {
    if (!user || !moduleId) return;
    loadAssessmentSubmission();
  }, [user, moduleId]);

  const loadAssessmentSubmission = useCallback(async () => {
    if (!user || !moduleId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_assessment_submission', {
        p_module_id: moduleId
      });

      if (error) {
        console.error('Error loading assessment submission:', error);
        return;
      }

      if (data && data.length > 0) {
        const submissionData = data[0];
        setSubmission({
          id: submissionData.id,
          submission_content: submissionData.submission_content,
          submission_path: submissionData.submission_path,
          file_name: submissionData.file_name,
          file_size: submissionData.file_size,
          learner_info: submissionData.learner_info,
          assessment_answers: submissionData.assessment_answers,
          submitted_at: submissionData.submitted_at,
          assessment_grade: submissionData.assessment_grade,
          assessment_feedback: submissionData.assessment_feedback,
          graded_at: submissionData.graded_at
        });
        setHasSubmittedAssessment(true);
      } else {
        setSubmission(null);
        setHasSubmittedAssessment(false);
      }
    } catch (err) {
      console.error('Error loading assessment submission:', err);
    } finally {
      setLoading(false);
    }
  }, [user, moduleId]);

  const saveAssessmentSubmission = useCallback(async (
    submissionContent: string,
    submissionPath?: string,
    fileName?: string,
    fileSize?: number,
    learnerInfo?: any,
    assessmentAnswers?: any
  ): Promise<string | null> => {
    if (!user || !moduleId) return null;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('save_assessment_submission', {
        p_module_id: moduleId,
        p_submission_content: submissionContent,
        p_submission_path: submissionPath || null,
        p_file_name: fileName || null,
        p_file_size: fileSize || null,
        p_learner_info: learnerInfo ? JSON.stringify(learnerInfo) : '{}',
        p_assessment_answers: assessmentAnswers ? JSON.stringify(assessmentAnswers) : '{}'
      });

      if (error) {
        console.error('Error saving assessment submission:', error);
        return null;
      }

      // Reload the submission to get the saved state
      await loadAssessmentSubmission();
      return data; // Returns the submission ID
    } catch (err) {
      console.error('Error saving assessment submission:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, moduleId, loadAssessmentSubmission]);

  const downloadSubmission = useCallback(() => {
    if (!submission || !submission.submission_content) return;

    // Create a downloadable text file
    const blob = new Blob([submission.submission_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = submission.file_name || `assessment-${moduleId}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [submission, moduleId]);

  const printSubmission = useCallback(() => {
    if (!submission || !submission.submission_content) return;

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Assessment Submission - ${moduleId}</title>
            <style>
              body { 
                font-family: 'Times New Roman', serif; 
                line-height: 1.6; 
                margin: 2cm; 
                color: #000;
              }
              pre { 
                white-space: pre-wrap; 
                font-family: 'Times New Roman', serif;
                font-size: 12pt;
              }
              @media print {
                body { margin: 1cm; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="no-print" style="margin-bottom: 20px;">
              <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px;">Print</button>
              <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; margin-left: 10px;">Close</button>
            </div>
            <pre>${submission.submission_content}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, [submission, moduleId]);

  const getSubmissionStatus = useCallback(() => {
    if (!submission) return 'not_submitted';
    if (submission.assessment_grade !== null) return 'graded';
    return 'submitted';
  }, [submission]);

  return {
    submission,
    loading,
    hasSubmittedAssessment,
    saveAssessmentSubmission,
    loadAssessmentSubmission,
    downloadSubmission,
    printSubmission,
    getSubmissionStatus
  };
}