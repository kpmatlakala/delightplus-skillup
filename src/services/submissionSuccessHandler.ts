import { supabase } from '@/integrations/supabase/client';

export interface SubmissionResult {
  submissionId: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  moduleId: string;
  userId: string;
  fileSize?: number;
  submissionText?: string;
}

export interface EmailReceiptData {
  userEmail: string;
  userName: string;
  submission: SubmissionResult;
  moduleTitle?: string;
}

export class SubmissionSuccessHandler {
  /**
   * Generate a secure download link for a submitted file
   */
  static async generateDownloadLink(filePath: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from('assessment-submissions')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) {
        console.error('Error generating download link:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error generating download link:', error);
      return null;
    }
  }

  /**
   * Create a printable version of the submission
   */
  static generatePrintableContent(submission: SubmissionResult): string {
    const timestamp = new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Africa/Johannesburg'
    }).format(submission.timestamp);

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Assessment Submission - ${submission.fileName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .details { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .label { font-weight: bold; }
        .content { white-space: pre-wrap; border: 1px solid #ddd; padding: 20px; border-radius: 4px; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        @media print {
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Assessment Submission</h1>
        <h2>CET Connect Portal</h2>
    </div>
    
    <div class="details">
        <div class="detail-row">
            <span class="label">Submission ID:</span>
            <span>${submission.submissionId}</span>
        </div>
        <div class="detail-row">
            <span class="label">Module:</span>
            <span>${submission.moduleId}</span>
        </div>
        <div class="detail-row">
            <span class="label">File Name:</span>
            <span>${submission.fileName}</span>
        </div>
        <div class="detail-row">
            <span class="label">Submitted:</span>
            <span>${timestamp}</span>
        </div>
        ${submission.fileSize ? `
        <div class="detail-row">
            <span class="label">File Size:</span>
            <span>${(submission.fileSize / 1024).toFixed(1)} KB</span>
        </div>
        ` : ''}
    </div>
    
    ${submission.submissionText ? `
    <div>
        <h3>Submission Content:</h3>
        <div class="content">${submission.submissionText}</div>
    </div>
    ` : ''}
    
    <div class="footer">
        <p>This document was generated on ${new Date().toLocaleString('en-ZA')} from the CET Connect Portal.</p>
        <p>For verification, contact support@cetconnect.ac.za with the Submission ID above.</p>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * Open print dialog with submission content
   */
  static printSubmission(submission: SubmissionResult): void {
    const printContent = this.generatePrintableContent(submission);
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      console.error('Unable to open print window. Please check popup blockers.');
    }
  }

  /**
   * Send email receipt (placeholder - would integrate with email service)
   */
  static async sendEmailReceipt(receiptData: EmailReceiptData): Promise<boolean> {
    try {
      // This would integrate with an email service like SendGrid, AWS SES, etc.
      // For now, we'll just log the action and return success
      console.log('Email receipt requested:', {
        to: receiptData.userEmail,
        subject: `Assessment Submission Confirmation - ${receiptData.submission.moduleId}`,
        submissionId: receiptData.submission.submissionId,
        timestamp: receiptData.submission.timestamp
      });

      // In a real implementation, you would:
      // 1. Call your email service API
      // 2. Use a template for the email content
      // 3. Include submission details and download link
      // 4. Handle email delivery errors

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending email receipt:', error);
      return false;
    }
  }

  /**
   * Track submission status and create audit log entry
   */
  static async logSubmissionSuccess(submission: SubmissionResult): Promise<void> {
    try {
      // This would log to your audit system
      console.log('Submission success logged:', {
        submissionId: submission.submissionId,
        userId: submission.userId,
        moduleId: submission.moduleId,
        timestamp: submission.timestamp,
        status: 'success'
      });

      // In a real implementation, you might:
      // 1. Insert into audit table
      // 2. Send metrics to monitoring system
      // 3. Update submission status
      // 4. Trigger notifications
    } catch (error) {
      console.error('Error logging submission success:', error);
    }
  }

  /**
   * Get submission status and metadata
   */
  static async getSubmissionStatus(submissionId: string): Promise<{
    status: 'submitted' | 'reviewed' | 'graded' | 'returned';
    lastUpdated: Date;
    reviewerNotes?: string;
    grade?: number;
  } | null> {
    try {
      // This would query your database for submission status
      // For now, return a mock status
      return {
        status: 'submitted',
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error('Error getting submission status:', error);
      return null;
    }
  }
}

export default SubmissionSuccessHandler;