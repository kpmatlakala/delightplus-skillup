/**
 * Submission Service
 * Handles post-submission actions like email receipts and download links
 */

import { supabase } from '@/integrations/supabase/client';
import { fileUploadService } from './fileUploadService';

export interface SubmissionResult {
  submissionId: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  moduleId: string;
  userId: string;
  moduleTitle?: string;
}

export interface EmailReceiptData {
  userEmail: string;
  userName: string;
  submission: SubmissionResult;
  moduleTitle: string;
}

export class SubmissionService {
  /**
   * Generate download URL for submitted assessment
   */
  async generateDownloadLink(filePath: string): Promise<string | null> {
    try {
      return await fileUploadService.getDownloadUrl(filePath);
    } catch (error) {
      console.error('Failed to generate download link:', error);
      return null;
    }
  }

  /**
   * Send email receipt for assessment submission
   * Note: This would typically integrate with an email service like SendGrid, Resend, etc.
   */
  async sendEmailReceipt(receiptData: EmailReceiptData): Promise<boolean> {
    try {
      // For now, we'll create a database record of the email request
      // In a production system, this would trigger an actual email send
      const { error } = await supabase
        .from('email_receipts')
        .insert({
          user_email: receiptData.userEmail,
          user_name: receiptData.userName,
          submission_id: receiptData.submission.submissionId,
          module_id: receiptData.submission.moduleId,
          module_title: receiptData.moduleTitle,
          file_path: receiptData.submission.filePath,
          sent_at: new Date().toISOString(),
          status: 'pending'
        });

      if (error) {
        console.error('Failed to create email receipt record:', error);
        return false;
      }

      // TODO: Integrate with actual email service
      console.log('[SubmissionService] Email receipt requested for:', receiptData.userEmail);
      
      return true;
    } catch (error) {
      console.error('Failed to send email receipt:', error);
      return false;
    }
  }

  /**
   * Get submission status and details
   */
  async getSubmissionStatus(submissionId: string, userId: string): Promise<{
    status: 'submitted' | 'under_review' | 'graded';
    grade?: number;
    feedback?: string;
    submittedAt: Date;
    gradedAt?: Date;
  } | null> {
    try {
      // First try to get from assessment_submissions table (if it exists)
      const { data: submissionData, error: submissionError } = await supabase
        .from('assessment_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (submissionData && !submissionError) {
        return {
          status: submissionData.grade != null ? 'graded' : 'under_review',
          grade: submissionData.grade,
          feedback: submissionData.feedback,
          submittedAt: new Date(submissionData.submitted_at),
          gradedAt: submissionData.graded_at ? new Date(submissionData.graded_at) : undefined
        };
      }

      // Fallback to learner_progress table
      const { data: progressData, error: progressError } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('assessment_submitted', true)
        .order('submission_uploaded_at', { ascending: false })
        .limit(1)
        .single();

      if (progressData && !progressError) {
        return {
          status: progressData.assessment_grade != null ? 'graded' : 'under_review',
          grade: progressData.assessment_grade,
          feedback: progressData.assessment_feedback,
          submittedAt: new Date(progressData.submission_uploaded_at),
          gradedAt: progressData.assessment_graded_at ? new Date(progressData.assessment_graded_at) : undefined
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get submission status:', error);
      return null;
    }
  }

  /**
   * Create submission result object
   */
  createSubmissionResult(
    submissionId: string,
    filePath: string,
    fileName: string,
    moduleId: string,
    userId: string,
    moduleTitle?: string
  ): SubmissionResult {
    return {
      submissionId,
      filePath,
      fileName,
      timestamp: new Date(),
      moduleId,
      userId,
      moduleTitle
    };
  }

  /**
   * Log submission for audit trail
   */
  async logSubmission(submission: SubmissionResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('submission_audit_log')
        .insert({
          submission_id: submission.submissionId,
          user_id: submission.userId,
          module_id: submission.moduleId,
          file_path: submission.filePath,
          file_name: submission.fileName,
          submitted_at: submission.timestamp.toISOString(),
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent,
          status: 'submitted'
        });

      if (error) {
        console.warn('Failed to log submission to audit trail:', error);
      }
    } catch (error) {
      console.warn('Failed to log submission to audit trail:', error);
    }
  }

  /**
   * Get client IP address (best effort)
   */
  private async getClientIP(): Promise<string | null> {
    try {
      // This is a simple approach - in production you might want to use a more reliable service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || null;
    } catch {
      return null;
    }
  }

  /**
   * Check if file exists in storage
   */
  async verifySubmissionFile(filePath: string): Promise<boolean> {
    try {
      return await fileUploadService.fileExists(filePath);
    } catch (error) {
      console.error('Failed to verify submission file:', error);
      return false;
    }
  }

  /**
   * Get submission statistics for a user
   */
  async getSubmissionStats(userId: string): Promise<{
    totalSubmissions: number;
    gradedSubmissions: number;
    averageGrade: number | null;
    lastSubmission: Date | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('learner_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('assessment_submitted', true);

      if (error || !data) {
        return {
          totalSubmissions: 0,
          gradedSubmissions: 0,
          averageGrade: null,
          lastSubmission: null
        };
      }

      const totalSubmissions = data.length;
      const gradedItems = data.filter(item => item.assessment_grade != null);
      const gradedSubmissions = gradedItems.length;
      const grades = gradedItems.map(item => Number(item.assessment_grade));
      const averageGrade = grades.length > 0 ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length : null;
      const lastSubmission = data.length > 0 
        ? new Date(Math.max(...data.map(item => new Date(item.submission_uploaded_at).getTime())))
        : null;

      return {
        totalSubmissions,
        gradedSubmissions,
        averageGrade,
        lastSubmission
      };
    } catch (error) {
      console.error('Failed to get submission stats:', error);
      return {
        totalSubmissions: 0,
        gradedSubmissions: 0,
        averageGrade: null,
        lastSubmission: null
      };
    }
  }
}

// Singleton instance for use across the application
export const submissionService = new SubmissionService();