/**
 * Mobile Assessment Page
 * Optimized for mature learners (60+) using mobile devices
 * Features: Large touch targets, voice input, auto-save, simple navigation
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Phone, 
  MessageCircle, 
  CheckCircle2,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { MobileLayout, MobileCard, MobileButton } from '@/components/MobileLayout';
import { MobileAssessmentForm } from '@/components/MobileAssessmentForm';
import { SubmissionSuccess } from '@/components/ui/submission-success';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useModuleProgress } from '@/hooks/useModuleProgress';
import { useMobileDetection, useOfflineSupport } from '@/hooks/useMobileOptimization';
import { fileUploadService } from '@/services/fileUploadService';
import { submissionService } from '@/services/submissionService';
import { modules } from '@/data/courseData';

export default function MobileAssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progressMap, updateProgress } = useModuleProgress();
  const { isMobile } = useMobileDetection();
  const { isOnline } = useOfflineSupport();

  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);

  const module = modules.find(m => m.id === id);
  const progress = progressMap[id || ""];
  const isAlreadySubmitted = progress?.assessment_submitted || false;
  const hasAssessmentAccess = Boolean(progress?.quiz_completed || progress?.quiz_passed || progress?.assessment_unlocked);

  // Show offline warning after 5 seconds if offline
  useEffect(() => {
    if (!isOnline) {
      const timer = setTimeout(() => {
        setShowOfflineWarning(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowOfflineWarning(false);
    }
  }, [isOnline]);

  // Redirect if not mobile or module not found
  useEffect(() => {
    if (!module) {
      navigate('/learner');
      return;
    }

    // If not on mobile, redirect to desktop version
    if (!isMobile) {
      navigate(`/learner/assessment/${id}`);
      return;
    }

    // Check if assessment is unlocked
    if (!hasAssessmentAccess) {
      navigate(`/learner/modules/${id}`);
      return;
    }
  }, [module, isMobile, progress, id, navigate]);

  const handleAnswerChange = (idx: number, value: string) => {
    setAssessmentAnswers(prev => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = async (payload: { submissionText: string }) => {
    if (!id || !user) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if online for submission
      if (!isOnline) {
        throw new Error('You need an internet connection to submit your assessment. Please connect to WiFi or mobile data and try again.');
      }

      // Use the file upload service
      const result = await fileUploadService.submitAssessment(
        payload.submissionText,
        id,
        user.id
      );

      if (!result.success) {
        throw new Error(result.errorResponse?.userMessage || result.error?.message || 'Failed to submit assessment');
      }

      // Update progress
      await updateProgress(id, {
        assessment_submitted: true,
        submission_path: result.filePath,
        submission_uploaded_at: new Date().toISOString(),
      });

      // Create submission result for success display
      const submission = submissionService.createSubmissionResult(
        result.submissionId || `temp_${Date.now()}`,
        result.filePath || '',
        result.fileName || '',
        id,
        user.id,
        module?.title
      );

      setSubmissionResult(submission);
      setIsSubmitted(true);

      // Log submission for audit
      await submissionService.logSubmission(submission);

    } catch (error: any) {
      console.error('[Mobile Assessment] Submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting your assessment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadSubmission = async () => {
    if (!submissionResult?.filePath) return;
    
    try {
      const downloadUrl = await submissionService.generateDownloadLink(submissionResult.filePath);
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to download submission:', error);
    }
  };

  const handleSendEmailReceipt = async () => {
    if (!submissionResult || !user?.email) return;

    try {
      await submissionService.sendEmailReceipt({
        userEmail: user.email,
        userName: user.user_metadata?.full_name || 'Learner',
        submission: submissionResult,
        moduleTitle: module?.title || `Module ${id}`
      });
    } catch (error) {
      console.error('Failed to send email receipt:', error);
    }
  };

  const handleCallFacilitator = () => {
    const facilitatorPhone = '+27123456789'; // Replace with actual facilitator phone
    const confirmCall = window.confirm(
      `Do you want to call your facilitator for help?\n\nThis will dial: ${facilitatorPhone}`
    );
    
    if (confirmCall) {
      window.location.href = `tel:${facilitatorPhone}`;
    }
  };

  const handleWhatsAppHelp = () => {
    const facilitatorWhatsApp = '+27123456789'; // Replace with actual WhatsApp number
    const message = encodeURIComponent(
      `Hi, I need help with my assessment for ${module?.title || `Module ${id}`}. Can you please assist me?`
    );
    
    window.open(`https://wa.me/${facilitatorWhatsApp.replace('+', '')}?text=${message}`, '_blank');
  };

  if (!module || !isMobile) {
    return (
      <MobileLayout title="Loading...">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p>Loading assessment...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Show submission success
  if (isSubmitted && submissionResult) {
    return (
      <MobileLayout 
        title="Assessment Submitted!"
        showBackButton={true}
        onBack={() => navigate('/learner')}
      >
        <div className="p-4">
          <SubmissionSuccess
            submission={submissionResult}
            onDownloadSubmission={handleDownloadSubmission}
            onSendEmailReceipt={handleSendEmailReceipt}
            onNavigateToPortfolio={() => navigate('/poe')}
            onNavigateToModule={() => navigate(`/learner/modules/${id}`)}
            onNavigateToPortal={() => navigate('/learner')}
            showEmailOption={true}
            showPortfolioOption={true}
          />
        </div>
      </MobileLayout>
    );
  }

  // Show already submitted message
  if (isAlreadySubmitted) {
    return (
      <MobileLayout 
        title="Assessment"
        showBackButton={true}
        onBack={() => navigate(`/learner/modules/${id}`)}
        helpPhoneNumber="+27123456789"
      >
        <div className="p-4 space-y-4">
          <MobileCard title="Assessment Already Submitted" className="text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
            <p className="text-lg mb-4">
              You have already submitted your assessment for {module.title}.
            </p>
            <p className="text-gray-600 mb-6">
              Your facilitator will review your work and provide feedback soon.
            </p>
            
            <div className="space-y-3">
              <MobileButton
                onClick={() => navigate(`/learner/modules/${id}`)}
                variant="primary"
                size="large"
                fullWidth
              >
                Back to Module
              </MobileButton>
              
              <MobileButton
                onClick={() => navigate('/learner')}
                variant="outline"
                size="large"
                fullWidth
              >
                Return to Portal
              </MobileButton>
            </div>
          </MobileCard>

          {/* Help options */}
          <MobileCard title="Need Help?">
            <div className="space-y-3">
              <MobileButton
                onClick={handleCallFacilitator}
                variant="outline"
                size="large"
                fullWidth
                icon={<Phone size={20} />}
              >
                Call Facilitator
              </MobileButton>
              
              <MobileButton
                onClick={handleWhatsAppHelp}
                variant="outline"
                size="large"
                fullWidth
                icon={<MessageCircle size={20} />}
              >
                WhatsApp Help
              </MobileButton>
            </div>
          </MobileCard>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout 
      title={`${module.title} Assessment`}
      showBackButton={true}
      onBack={() => navigate(`/learner/modules/${id}`)}
      helpPhoneNumber="+27123456789"
    >
      {/* Offline warning */}
      {showOfflineWarning && (
        <Alert className="mx-4 mt-4 border-amber-200 bg-amber-50">
          <WifiOff className="h-5 w-5" />
          <AlertDescription className="text-base">
            You're working offline. Your answers are being saved locally. 
            Connect to the internet when you're ready to submit.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection status */}
      <div className="px-4 py-2 bg-white border-b">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi size={16} className="text-green-600" />
                <span className="text-green-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={16} className="text-red-600" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>
          
          <div className="text-gray-600">
            {module.code} • {module.credits} credits
          </div>
        </div>
      </div>

      {/* Assessment form */}
      <MobileAssessmentForm
        moduleId={id}
        answers={assessmentAnswers}
        onAnswerChange={handleAnswerChange}
        onRequestSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        learnerName={user?.user_metadata?.full_name}
        learnerPhone={user?.user_metadata?.phone}
      />

      {/* Help section - always visible at bottom */}
      <div className="p-4 bg-blue-50 border-t">
        <MobileCard title="Need Help?" padding="small">
          <div className="grid grid-cols-2 gap-3">
            <MobileButton
              onClick={handleCallFacilitator}
              variant="outline"
              size="medium"
              icon={<Phone size={18} />}
            >
              Call
            </MobileButton>
            
            <MobileButton
              onClick={handleWhatsAppHelp}
              variant="outline"
              size="medium"
              icon={<MessageCircle size={18} />}
            >
              WhatsApp
            </MobileButton>
          </div>
          
          <p className="text-xs text-gray-600 mt-2 text-center">
            Your facilitator is here to help if you have questions
          </p>
        </MobileCard>
      </div>
    </MobileLayout>
  );
}