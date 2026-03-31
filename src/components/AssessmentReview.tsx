import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Calendar, User, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SubmissionSuccessHandler } from '@/services/submissionSuccessHandler';

interface AssessmentSubmission {
  id: string;
  submission_text: string;
  file_path?: string;
  file_name: string;
  file_size: number;
  submitted_at: string;
  module_id: string;
  user_id: string;
}

interface AssessmentReviewProps {
  moduleId: string;
  userId: string;
  submissionPath?: string;
  onClose?: () => void;
}

export function AssessmentReview({ 
  moduleId, 
  userId, 
  submissionPath,
  onClose 
}: AssessmentReviewProps) {
  const [submission, setSubmission] = useState<AssessmentSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadSubmission();
  }, [moduleId, userId, submissionPath]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get submission from database (handle missing table gracefully)
      let dbSubmission = null;
      try {
        const { data, error: dbError } = await supabase
          .from('assessment_submissions')
          .select('*')
          .eq('module_id', moduleId)
          .eq('user_id', userId)
          .order('submitted_at', { ascending: false })
          .limit(1)
          .single();

        if (dbError && dbError.code !== 'PGRST116' && dbError.code !== 'PGRST205') {
          console.error('Database error:', dbError);
        } else if (data) {
          dbSubmission = data;
        }
      } catch (dbErr) {
        console.log('Database table not available, falling back to storage:', dbErr);
      }

      if (dbSubmission) {
        setSubmission(dbSubmission);
        
        // If we have submission text in DB, use it
        if (dbSubmission.submission_text) {
          setSubmissionText(dbSubmission.submission_text);
        } else if (dbSubmission.file_path || submissionPath) {
          // Otherwise, try to load from storage
          await loadFromStorage(dbSubmission.file_path || submissionPath!);
        }
      } else if (submissionPath) {
        // Fallback: load directly from storage if no DB record
        await loadFromStorage(submissionPath);
      } else {
        // Try to find the file in storage by constructing the expected path
        await tryFindInStorage();
      }
    } catch (err) {
      console.error('Error loading submission:', err);
      setError('Failed to load assessment submission.');
    } finally {
      setLoading(false);
    }
  };

  const tryFindInStorage = async () => {
    try {
      // List files in the user's assessment folder
      const { data: files, error } = await supabase.storage
        .from('assessment-submissions')
        .list(`learner-${userId}/assessments/${moduleId}`, {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Storage list error:', error);
        setError('No submission found for this module.');
        return;
      }

      if (files && files.length > 0) {
        // Use the most recent file
        const latestFile = files[0];
        const filePath = `learner-${userId}/assessments/${moduleId}/${latestFile.name}`;
        await loadFromStorage(filePath);
      } else {
        setError('No submission found for this module.');
      }
    } catch (err) {
      console.error('Error finding files in storage:', err);
      setError('Failed to locate submission files.');
    }
  };

  const loadFromStorage = async (filePath: string) => {
    try {
      // Download the file content from storage
      const { data, error } = await supabase.storage
        .from('assessment-submissions')
        .download(filePath);

      if (error) {
        console.error('Storage error:', error);
        setError('Failed to load submission from storage.');
        return;
      }

      // Convert blob to text
      const text = await data.text();
      setSubmissionText(text);

      // If no DB submission, create a minimal one for display
      if (!submission) {
        setSubmission({
          id: 'storage-only',
          submission_text: text,
          file_path: filePath,
          file_name: filePath.split('/').pop() || 'assessment.txt',
          file_size: data.size,
          submitted_at: new Date().toISOString(),
          module_id: moduleId,
          user_id: userId
        });
      }
    } catch (err) {
      console.error('Error loading from storage:', err);
      setError('Failed to parse submission file.');
    }
  };

  const handleDownload = async () => {
    if (!submission) return;

    try {
      if (submission.file_path) {
        // Generate signed URL for download
        const downloadUrl = await SubmissionSuccessHandler.generateDownloadLink(submission.file_path);
        if (downloadUrl) {
          window.open(downloadUrl, '_blank');
        } else {
          throw new Error('Failed to generate download link');
        }
      } else {
        // Create downloadable blob from text
        const blob = new Blob([submissionText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = submission.file_name || `assessment-${moduleId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: "Download Error",
        description: "Failed to download submission. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrint = () => {
    if (!submission) return;

    const submissionResult = {
      submissionId: submission.id,
      filePath: submission.file_path || '',
      fileName: submission.file_name,
      timestamp: new Date(submission.submitted_at),
      moduleId: submission.module_id,
      userId: submission.user_id,
      fileSize: submission.file_size,
      submissionText: submissionText
    };

    SubmissionSuccessHandler.printSubmission(submissionResult);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Africa/Johannesburg'
    }).format(new Date(timestamp));
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Loading assessment submission...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error Loading Submission</span>
            </div>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={loadSubmission} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!submission) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No assessment submission found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment Submission Review
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Module {submission.module_id}
            </p>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Submission Metadata */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Submission Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Submitted:</span>
              <span>{formatTimestamp(submission.submitted_at)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">File:</span>
              <span className="truncate">{submission.file_name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Module:</span>
              <Badge variant="secondary">{submission.module_id}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Size:</span>
              <span>{formatFileSize(submission.file_size)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Submission
          </Button>
          
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print Copy
          </Button>
        </div>

        {/* Submission Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Submission Content
          </h3>
          
          <div className="bg-background border rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
              {submissionText || 'No content available'}
            </pre>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground border-t pt-4">
          <p>
            This is a read-only view of your submitted assessment. 
            For questions about grading or feedback, contact your facilitator.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AssessmentReview;