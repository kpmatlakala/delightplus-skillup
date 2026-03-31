import React from 'react';
import { CheckCircle2, Download, Printer, Mail, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubmissionResult {
  submissionId: string;
  filePath: string;
  fileName: string;
  timestamp: Date;
  moduleId: string;
  userId: string;
  fileSize?: number;
  submissionText?: string;
}

interface SubmissionSuccessProps {
  submission: SubmissionResult;
  onDownload?: () => void;
  onPrint?: () => void;
  onSendReceipt?: () => void;
  downloadUrl?: string;
  showEmailOption?: boolean;
}

export function SubmissionSuccess({
  submission,
  onDownload,
  onPrint,
  onSendReceipt,
  downloadUrl,
  showEmailOption = false
}: SubmissionSuccessProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Africa/Johannesburg'
    }).format(timestamp);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl text-green-700">
          Assessment Submitted Successfully!
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Your assessment has been saved and is ready for review by your facilitator.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Submission Details */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Submission Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">File:</span>
              <span className="truncate">{submission.fileName}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Submitted:</span>
              <span>{formatTimestamp(submission.timestamp)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Module:</span>
              <Badge variant="secondary">{submission.moduleId}</Badge>
            </div>
            
            {submission.fileSize && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Size:</span>
                <span>{formatFileSize(submission.fileSize)}</span>
              </div>
            )}
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">Submission ID:</span>
              <code className="bg-background px-2 py-1 rounded text-xs">
                {submission.submissionId}
              </code>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {(onDownload || downloadUrl) && (
            <Button 
              onClick={onDownload || (() => downloadUrl && window.open(downloadUrl, '_blank'))}
              className="flex-1"
              variant="default"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Submission
            </Button>
          )}
          
          {onPrint && (
            <Button 
              onClick={onPrint}
              variant="outline"
              className="flex-1"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Copy
            </Button>
          )}
          
          {showEmailOption && onSendReceipt && (
            <Button 
              onClick={onSendReceipt}
              variant="outline"
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your facilitator will review your submission</li>
            <li>• You'll receive feedback within 5-7 business days</li>
            <li>• Keep your submission ID for reference</li>
            <li>• You can download your submission anytime from your progress page</li>
          </ul>
        </div>

        {/* Support Information */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Need help? Contact your facilitator or email{' '}
            <a 
              href="mailto:support@cetconnect.ac.za" 
              className="text-primary hover:underline"
            >
              support@cetconnect.ac.za
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubmissionSuccess;