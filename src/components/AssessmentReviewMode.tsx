import React from 'react';
import { Download, Printer, FileText, CheckCircle2, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AssessmentSubmission {
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

interface AssessmentReviewModeProps {
  submission: AssessmentSubmission;
  onDownload: () => void;
  onPrint: () => void;
}

export function AssessmentReviewMode({ submission, onDownload, onPrint }: AssessmentReviewModeProps) {
  const submittedDate = new Date(submission.submitted_at).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const gradedDate = submission.graded_at 
    ? new Date(submission.graded_at).toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  const getGradeStatus = () => {
    if (submission.assessment_grade === null) return 'pending';
    if (submission.assessment_grade >= 70) return 'passed';
    if (submission.assessment_grade >= 50) return 'conditional';
    return 'failed';
  };

  const gradeStatus = getGradeStatus();

  return (
    <div className="space-y-6">
      {/* Submission Status */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="text-green-600" size={24} />
          <div>
            <h3 className="font-semibold text-lg">Assessment Submitted</h3>
            <p className="text-sm text-muted-foreground">
              Submitted on {submittedDate}
            </p>
          </div>
        </div>

        {/* Grade Status */}
        <div className="flex items-center gap-4 mb-4">
          {submission.assessment_grade !== null ? (
            <div className="flex items-center gap-2">
              <Award className={`${
                gradeStatus === 'passed' ? 'text-green-600' : 
                gradeStatus === 'conditional' ? 'text-orange-600' : 'text-red-600'
              }`} size={20} />
              <span className="font-medium">
                Grade: {submission.assessment_grade}%
              </span>
              <Badge variant={
                gradeStatus === 'passed' ? 'default' : 
                gradeStatus === 'conditional' ? 'secondary' : 'destructive'
              }>
                {gradeStatus === 'passed' ? 'Passed' : 
                 gradeStatus === 'conditional' ? 'Conditional Pass' : 'Failed'}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-orange-600">
              <Clock size={20} />
              <span className="font-medium">Awaiting Grade</span>
              <Badge variant="outline">Pending Review</Badge>
            </div>
          )}
        </div>

        {/* Feedback */}
        {submission.assessment_feedback && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Facilitator Feedback</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {submission.assessment_feedback}
            </p>
            {gradedDate && (
              <p className="text-xs text-muted-foreground mt-2">
                Graded on {gradedDate}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onDownload} variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            Download Submission
          </Button>
          
          <Button onClick={onPrint} variant="outline" size="sm" className="gap-2">
            <Printer size={16} />
            Print Submission
          </Button>
        </div>
      </div>

      {/* File Information */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="text-muted-foreground" size={20} />
          <h4 className="font-medium">Submission Details</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">File Name:</span>
            <p className="font-medium">{submission.file_name || 'assessment-submission.txt'}</p>
          </div>
          
          <div>
            <span className="text-muted-foreground">File Size:</span>
            <p className="font-medium">
              {submission.file_size 
                ? `${(submission.file_size / 1024).toFixed(1)} KB`
                : 'N/A'
              }
            </p>
          </div>
          
          <div>
            <span className="text-muted-foreground">Submission ID:</span>
            <p className="font-medium font-mono text-xs">{submission.id}</p>
          </div>
          
          <div>
            <span className="text-muted-foreground">Status:</span>
            <p className="font-medium">
              {submission.assessment_grade !== null ? 'Graded' : 'Under Review'}
            </p>
          </div>
        </div>
      </div>

      {/* Preview (first 500 characters) */}
      <div className="rounded-lg border bg-card p-4">
        <h4 className="font-medium mb-3">Submission Preview</h4>
        <div className="bg-muted/30 rounded p-3 font-mono text-sm max-h-40 overflow-y-auto">
          <pre className="whitespace-pre-wrap">
            {submission.submission_content.substring(0, 500)}
            {submission.submission_content.length > 500 && '\n\n... (truncated)'}
          </pre>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Use the download or print buttons above to view the complete submission.
        </p>
      </div>
    </div>
  );
}