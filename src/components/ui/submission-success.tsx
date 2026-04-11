/**
 * Enhanced Submission Success Components
 * Provides clear confirmation and next steps after assessment submission
 */

import React from 'react';
import { CheckCircle2, Download, FileText, ArrowRight, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface SubmissionResult {
  submissionId: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  moduleId: string;
  userId: string;
  moduleTitle?: string;
}

export interface SubmissionSuccessProps {
  submission: SubmissionResult;
  onDownloadSubmission?: () => void;
  onSendEmailReceipt?: () => Promise<void>;
  onNavigateToPortfolio?: () => void;
  onNavigateToModule?: () => void;
  onNavigateToPortal?: () => void;
  showEmailOption?: boolean;
  showPortfolioOption?: boolean;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  submission,
  onDownloadSubmission,
  onSendEmailReceipt,
  onNavigateToPortfolio,
  onNavigateToModule,
  onNavigateToPortal,
  showEmailOption = true,
  showPortfolioOption = true
}) => {
  const [sendingEmail, setSendingEmail] = React.useState(false);

  const handleSendEmail = async () => {
    if (!onSendEmailReceipt) return;
    
    setSendingEmail(true);
    try {
      await onSendEmailReceipt();
    } catch (error) {
      console.error('Failed to send email receipt:', error);
    } finally {
      setSendingEmail(false);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Johannesburg'
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl text-green-800 dark:text-green-200">
            Assessment Submitted Successfully!
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Your assessment has been saved and submitted for review
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Submission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submission ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-gray-100">{submission.submissionId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submitted</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">{formatTimestamp(submission.timestamp)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Module</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {submission.moduleTitle || submission.moduleId}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">File Name</p>
              <p className="text-sm text-gray-900 dark:text-gray-100">{submission.fileName}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="gap-2">
              <Clock size={12} />
              Under Review
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What's Next?</CardTitle>
          <CardDescription>
            Choose your next action or return to continue your learning journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download Submission */}
            <Button
              variant="outline"
              onClick={onDownloadSubmission}
              className="gap-2 h-auto p-4 flex-col items-start"
              disabled={!onDownloadSubmission}
            >
              <div className="flex items-center gap-2 w-full">
                <Download size={16} />
                <span className="font-medium">Download My Submission</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Save a copy of your submitted assessment
              </span>
            </Button>

            {/* Email Receipt */}
            {showEmailOption && (
              <Button
                variant="outline"
                onClick={handleSendEmail}
                disabled={sendingEmail || !onSendEmailReceipt}
                className="gap-2 h-auto p-4 flex-col items-start"
              >
                <div className="flex items-center gap-2 w-full">
                  <Mail size={16} />
                  <span className="font-medium">
                    {sendingEmail ? 'Sending...' : 'Email Receipt'}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  Get a confirmation email with submission details
                </span>
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="space-y-2">
            {showPortfolioOption && (
              <Button
                onClick={onNavigateToPortfolio}
                className="w-full gap-2"
                disabled={!onNavigateToPortfolio}
              >
                <FileText size={16} />
                Add to Portfolio of Evidence
                <ArrowRight size={16} />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onNavigateToModule}
                disabled={!onNavigateToModule}
                className="gap-2"
              >
                Back to Module
              </Button>
              
              <Button
                variant="outline"
                onClick={onNavigateToPortal}
                disabled={!onNavigateToPortal}
                className="gap-2"
              >
                Return to Portal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Your facilitator will review your submission and provide feedback. 
          You'll be notified when grading is complete. This typically takes 2-3 business days.
        </AlertDescription>
      </Alert>
    </div>
  );
};

/**
 * Compact version for inline success messages
 */
export interface SubmissionSuccessCompactProps {
  submission: SubmissionResult;
  onDownloadSubmission?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const SubmissionSuccessCompact: React.FC<SubmissionSuccessCompactProps> = ({
  submission,
  onDownloadSubmission,
  onNavigateToPortfolio
}) => {
  return (
    <Alert className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium text-green-800 dark:text-green-200">
            Assessment submitted successfully!
          </span>
          <span className="text-sm text-green-700 dark:text-green-300 ml-2">
            Submitted at {submission.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex gap-2 ml-4">
          {onDownloadSubmission && (
            <Button size="sm" variant="outline" onClick={onDownloadSubmission}>
              <Download size={12} className="mr-1" />
              Download
            </Button>
          )}
          
          {onNavigateToPortfolio && (
            <Button size="sm" onClick={onNavigateToPortfolio}>
              <FileText size={12} className="mr-1" />
              Add to Portfolio
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};