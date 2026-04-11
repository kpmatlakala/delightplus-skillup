import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { AssessmentForm, AssessmentPayload } from "@/components/AssessmentForm";
import { UploadError, useUploadError } from "@/components/ui/upload-error";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { useAssessmentStatus } from "@/hooks/useAssessmentStatus";
import { useToast } from "@/hooks/use-toast";
import { modules } from "@/data/courseData";
import { moduleDownloadsById } from "@/data/moduleDownloads";
import { fileUploadService } from "@/services/fileUploadService";

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { progressMap, updateProgress } = useModuleProgress();
  const { toast } = useToast();
  const { error: uploadError, showError, dismiss: dismissError } = useUploadError();

  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "complete" | "review">("overview");

  const module = modules.find(m => m.id === id);
  const progress = progressMap[id || ""];
  const downloads = moduleDownloadsById[id || ""] || [];
  const { status: assessmentStatus, loading: statusLoading, refreshStatus } = useAssessmentStatus(id || "");
  
  // Find assessment download link
  const assessmentDownload = downloads.find(d => 
    d.label.toLowerCase().includes("summative assessment") ||
    d.label.toLowerCase().includes("practical assessment")
  );

  // Assessment status - use the new hook data if available, fallback to progress
  const quizUnlocked = Boolean(progress?.quiz_completed || progress?.quiz_passed || progress?.assessment_unlocked);
  const isSubmitted = Boolean(assessmentStatus?.assessment_submitted || progress?.assessment_submitted);
  const hasGrade = assessmentStatus?.assessment_grade != null || progress?.assessment_grade != null;
  const submissionPath = assessmentStatus?.submission_path ?? progress?.submission_path ?? null;
  const assessmentGrade = assessmentStatus?.assessment_grade ?? progress?.assessment_grade ?? null;
  const assessmentFeedback = assessmentStatus?.assessment_feedback ?? progress?.assessment_feedback ?? null;

  useEffect(() => {
    if (!module) {
      navigate('/learner');
      return;
    }

    // Check if assessment is unlocked (quiz completed/passed)
    if (role === 'learner' && !quizUnlocked) {
      toast({
        title: "Assessment Locked",
        description: "Please complete the quiz first to unlock the assessment.",
        variant: "destructive"
      });
      navigate(`/learner/modules/${id}`);
      return;
    }

    // Set initial tab based on submission status
    if (isSubmitted) {
      setActiveTab("review");
    } else {
      setActiveTab("overview");
    }
  }, [module, progress, role, id, navigate, toast, isSubmitted]);

  const handleAssessmentSubmit = async (payload: AssessmentPayload) => {
    if (!id || !user) return;
    
    setIsSubmitting(true);
    dismissError();

    try {
      const result = await fileUploadService.submitAssessment(
        payload.submissionText,
        id,
        user.id
      );

      if (!result.success) {
        if (result.errorResponse) {
          showError(result.errorResponse);
        }
        setIsSubmitting(false);
        return;
      }

      await updateProgress(id, {
        assessment_submitted: true,
        submission_path: result.filePath,
        submission_uploaded_at: new Date().toISOString(),
      });

      toast({
        title: "Assessment Submitted Successfully",
        description: "Your assessment has been submitted for review. You can view your submission in the Review tab.",
      });
      
      // Refresh the assessment status
      await refreshStatus();
      setActiveTab("review");
    } catch (error) {
      console.error('Assessment submission error:', error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (idx: number, value: string) => {
    setAssessmentAnswers(prev => ({ ...prev, [idx]: value }));
  };

  if (!module) {
    return (
      <AppLayout title="Assessment Not Found" subtitle="">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Assessment not found.</p>
          <Button asChild className="mt-4">
            <Link to="/learner">Return to Portal</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title={`${module.title} - Assessment`} 
      subtitle={`${module.code} • Block ${module.block} • ${module.credits} credits`}
    >
      <div className="space-y-6">
        {/* Header with back navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/learner/modules/${id}`)}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back to Module
          </Button>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-primary" />
              <div>
                <h1 className="text-xl font-bold">Summative Assessment</h1>
                <p className="text-sm text-muted-foreground">
                  Complete your assessment and submit for review
                </p>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div>
            {isSubmitted ? (
              hasGrade ? (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 size={12} />
                  Graded ({assessmentGrade}%)
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <Clock size={12} />
                  Under Review
                </Badge>
              )
            ) : (
              <Badge variant="outline" className="gap-1">
                <AlertCircle size={12} />
                Not Submitted
              </Badge>
            )}
          </div>
        </div>

        {/* Upload error display */}
        {uploadError && (
          <UploadError
            error={uploadError}
            onRetry={() => {
              dismissError();
              // Retry logic would go here
            }}
            onDismiss={dismissError}
          />
        )}

        {/* Main content tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complete" disabled={isSubmitted}>
              Complete Assessment
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!isSubmitted}>
              Review Submission
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} />
                  Assessment Information
                </CardTitle>
                <CardDescription>
                  Choose how you'd like to complete your summative assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assessment options */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* In-app completion */}
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText size={16} className="text-primary" />
                        Complete Online
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Complete your assessment directly in the browser
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-600" />
                          Auto-save as you work
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-600" />
                          Instant submission
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-600" />
                          No file management needed
                        </li>
                      </ul>
                      <Button 
                        className="w-full" 
                        onClick={() => setActiveTab("complete")}
                        disabled={isSubmitted}
                      >
                        {isSubmitted ? "Already Submitted" : "Start Assessment"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Download option */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Download size={16} />
                        Download & Upload
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Download PDF, complete offline, then upload
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-600" />
                          Work offline
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-600" />
                          Print if needed
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-600" />
                          Use familiar tools
                        </li>
                      </ul>
                      {assessmentDownload ? (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          asChild
                        >
                          <a href={assessmentDownload.href} download>
                            <Download size={14} className="mr-2" />
                            Download Assessment
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Download Not Available
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Assessment details */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Assessment Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Module:</p>
                      <p className="text-muted-foreground">{module.title}</p>
                    </div>
                    <div>
                      <p className="font-medium">Code:</p>
                      <p className="text-muted-foreground">{module.code}</p>
                    </div>
                    <div>
                      <p className="font-medium">Credits:</p>
                      <p className="text-muted-foreground">{module.credits}</p>
                    </div>
                    <div>
                      <p className="font-medium">Type:</p>
                      <p className="text-muted-foreground">
                        {module.type === "Practical" ? "Practical Assessment Task" : "Knowledge Test"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complete Assessment Tab */}
          <TabsContent value="complete" className="space-y-6">
            {!isSubmitted ? (
              <AssessmentForm
                moduleId={id || ""}
                answers={assessmentAnswers}
                onAnswerChange={handleAnswerChange}
                downloadHref={assessmentDownload?.href}
                onRequestSubmit={handleAssessmentSubmit}
                isSubmitting={isSubmitting}
                submitError={uploadError?.userMessage}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Assessment Already Submitted</h3>
                  <p className="text-muted-foreground mb-4">
                    You have already submitted this assessment. You can review your submission in the Review tab.
                  </p>
                  <Button onClick={() => setActiveTab("review")}>
                    View Submission
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Review Submission Tab */}
          <TabsContent value="review" className="space-y-6">
            {isSubmitted ? (
              <div className="space-y-6">
                {/* Submission status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={18} />
                      Submission Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-sm">Submitted:</p>
                        <p className="text-muted-foreground text-sm">
                          {(assessmentStatus?.submitted_at || progress?.submission_uploaded_at)
                            ? new Date(assessmentStatus?.submitted_at || progress?.submission_uploaded_at).toLocaleString()
                            : "Unknown"
                          }
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Status:</p>
                        <div className="flex items-center gap-2">
                          {hasGrade ? (
                            <>
                              <CheckCircle2 size={16} className="text-green-600" />
                              <span className="text-sm">Graded</span>
                            </>
                          ) : (
                            <>
                              <Clock size={16} className="text-yellow-600" />
                              <span className="text-sm">Under Review</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {hasGrade && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Grade:</span>
                          <Badge variant={assessmentGrade >= 50 ? "default" : "destructive"}>
                            {assessmentGrade}%
                          </Badge>
                        </div>
                        {assessmentFeedback && (
                          <div className="mt-3">
                            <p className="font-medium text-sm mb-1">Feedback:</p>
                            <div className="bg-muted p-3 rounded-md text-sm">
                              {assessmentFeedback}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Download submission link */}
                    {submissionPath && (
                      <div className="border-t pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            // Generate download URL for the submission
                            const downloadUrl = await fileUploadService.getDownloadUrl(submissionPath);
                            if (downloadUrl) {
                              window.open(downloadUrl, '_blank');
                            }
                          }}
                          className="gap-2"
                        >
                          <Download size={14} />
                          Download My Submission
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Next steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {hasGrade ? (
                      <div className="space-y-3">
                        <p className="text-sm">
                          Your assessment has been graded. This completes the requirements for this module.
                        </p>
                        <Button asChild>
                          <Link to="/learner">
                            Return to Portal
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm">
                          Your assessment is being reviewed by your facilitator. You will be notified when grading is complete.
                        </p>
                        <div className="flex gap-2">
                          <Button asChild variant="outline">
                            <Link to="/learner">
                              Return to Portal
                            </Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link to="/communications">
                              Check Messages
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Submission Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted this assessment yet. Complete it first to view your submission.
                  </p>
                  <Button onClick={() => setActiveTab("complete")}>
                    Complete Assessment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}