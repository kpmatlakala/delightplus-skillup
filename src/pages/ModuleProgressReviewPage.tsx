import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useModuleProgress } from '@/hooks/useModuleProgress';
import { useAssessmentStatus } from '@/hooks/useAssessmentStatus';
import { modules } from '@/data/courseData';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Award, 
  ArrowLeft, 
  Play,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

export default function ModuleProgressReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progressMap } = useModuleProgress();
  const { status: assessmentStatus } = useAssessmentStatus(id || '');
  
  const module = modules.find(m => m.id === id);
  const progress = id ? progressMap[id] : null;
  const hasSummativeRequirement = Boolean(module && module.block !== 3);
  const quizCompleted = Boolean(progress?.quiz_completed || progress?.quiz_passed || (hasSummativeRequirement && progress?.assessment_unlocked));
  const quizPassed = Boolean(progress?.quiz_passed || (hasSummativeRequirement && progress?.assessment_unlocked) || ((progress?.quiz_score ?? 0) >= 70 && progress?.quiz_score != null));
  const usesWorkbookEvidence = Boolean(module && (module.block === 1 || module.block === 2));
  const guideOrWorkbookLabel = usesWorkbookEvidence ? 'Learner Workbook' : 'Learner Guide';

  if (!module || !id) {
    return (
      <AppLayout title="Module Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Module not found.</p>
          <Button onClick={() => navigate('/learner')} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Portal
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (!progress) {
    return (
      <AppLayout title={`${module.title} - Progress`}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No progress found for this module.</p>
          <Button onClick={() => navigate(`/learner/modules/${id}`)} variant="outline">
            Start Module
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getProgressPercentage = () => {
    let completed = 0;
    let total = hasSummativeRequirement ? 3 : 2; // Workbook/Guide, Quiz, (+ optional Summative)
    
    if (progress.guide_completed) completed++;
    if (quizCompleted) completed++;
    if (hasSummativeRequirement && progress.assessment_submitted) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getNextAction = () => {
    if (!progress.guide_completed) {
      return {
        action: usesWorkbookEvidence ? 'Continue Workbook' : 'Continue Guide',
        description: usesWorkbookEvidence
          ? 'Complete the learner workbook to unlock the quiz'
          : 'Complete the learner guide to unlock the quiz',
        path: `/learner/modules/${id}`,
        icon: FileText,
        variant: 'default' as const
      };
    }
    
    if (!quizCompleted) {
      return {
        action: 'Take Quiz',
        description: hasSummativeRequirement ? 'Complete the knowledge check to unlock summative assessment' : 'Complete the knowledge check to finish this module evidence',
        path: `/learner/modules/${id}`,
        icon: Play,
        variant: 'default' as const
      };
    }

    if (!hasSummativeRequirement) {
      return {
        action: 'Review Module',
        description: 'Workbook and quiz evidence are complete for this module',
        path: `/learner/modules/${id}`,
        icon: Eye,
        variant: 'outline' as const
      };
    }
    
    if (quizCompleted && !progress.assessment_unlocked) {
      return {
        action: 'Retake Quiz',
        description: `You scored ${progress.quiz_score ?? 0}%. Need 70% to unlock assessment.`,
        path: `/learner/modules/${id}`,
        icon: RefreshCw,
        variant: 'outline' as const
      };
    }
    
    if (progress.assessment_unlocked && !progress.assessment_submitted) {
      return {
        action: 'Submit Assessment',
        description: 'Complete your summative assessment evidence',
        path: `/learner/assessment/${id}`,
        icon: FileText,
        variant: 'default' as const
      };
    }
    
    return {
      action: 'Review Module',
      description: 'All components completed - review your work',
      path: `/learner/modules/${id}`,
      icon: Eye,
      variant: 'outline' as const
    };
  };

  const nextAction = getNextAction();
  const progressPercentage = getProgressPercentage();

  return (
    <AppLayout title={`${module.title} - Progress Review`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/learner')} 
            variant="ghost" 
            size="sm"
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back to Portal
          </Button>
        </div>

        {/* Module Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {module.code} • Block {module.block} • {module.credits} Credits
                </p>
              </div>
              <Badge variant={progressPercentage === 100 ? 'default' : 'secondary'}>
                {progressPercentage}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => navigate(nextAction.path)}
                  variant={nextAction.variant}
                  className="gap-2"
                >
                  <nextAction.icon size={16} />
                  {nextAction.action}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {nextAction.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Details */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Workbook/Guide Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {progress.guide_completed ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <Clock size={20} className="text-muted-foreground" />
                )}
                {guideOrWorkbookLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Badge variant={progress.guide_completed ? 'default' : 'secondary'}>
                  {progress.guide_completed ? 'Completed' : 'Not Started'}
                </Badge>
                
                {progress.guide_completed ? (
                  <div className="text-sm text-muted-foreground">
                    <p>✓ {usesWorkbookEvidence ? 'Workbook evidence logged' : 'All guide sessions completed'}</p>
                    <p>✓ Ready for quiz</p>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>{usesWorkbookEvidence ? 'Complete workbook activities' : 'Complete all guide sessions'}</p>
                    <p>{usesWorkbookEvidence ? 'Log workbook evidence for this module' : 'Review learning objectives'}</p>
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate(`/learner/modules/${id}`)}
                  className="w-full gap-2"
                >
                  <FileText size={14} />
                  {progress.guide_completed
                    ? (usesWorkbookEvidence ? 'Review Workbook' : 'Review Guide')
                    : (usesWorkbookEvidence ? 'Start Workbook' : 'Start Guide')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {quizCompleted ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : progress.guide_completed ? (
                  <Clock size={20} className="text-blue-600" />
                ) : (
                  <Clock size={20} className="text-muted-foreground" />
                )}
                Knowledge Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quizCompleted ? (
                  <>
                    <Badge variant={quizPassed ? 'default' : 'destructive'}>
                      {progress.quiz_score != null ? `${progress.quiz_score}% - ${quizPassed ? 'Passed' : 'Failed'}` : (quizPassed ? 'Passed' : 'Needs Retry')}
                    </Badge>
                    
                    <div className="text-sm text-muted-foreground">
                      {progress.quiz_completed_at && (
                        <p>Completed: {new Date(progress.quiz_completed_at).toLocaleDateString()}</p>
                      )}
                      {quizPassed ? (
                        <p>✓ Assessment unlocked</p>
                      ) : (
                        <p>Need 70% to unlock assessment</p>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant={quizPassed ? 'outline' : 'default'}
                      onClick={() => navigate(`/learner/modules/${id}`)}
                      className="w-full gap-2"
                      disabled={!progress.guide_completed}
                    >
                      {quizPassed ? (
                        <>
                          <Eye size={14} />
                          Review Quiz
                        </>
                      ) : (
                        <>
                          <RefreshCw size={14} />
                          Retake Quiz
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="secondary">
                      {progress.guide_completed ? 'Ready' : 'Locked'}
                    </Badge>
                    
                    <div className="text-sm text-muted-foreground">
                      {progress.guide_completed ? (
                        <p>Take the knowledge check</p>
                      ) : (
                        <p>Complete guide first</p>
                      )}
                      <p>Need 70% to unlock assessment</p>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => navigate(`/learner/modules/${id}`)}
                      className="w-full gap-2"
                      disabled={!progress.guide_completed}
                    >
                      <Play size={14} />
                      Take Quiz
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {hasSummativeRequirement ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {progress.assessment_submitted ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : progress.assessment_unlocked ? (
                    <Clock size={20} className="text-blue-600" />
                  ) : (
                    <Clock size={20} className="text-muted-foreground" />
                  )}
                  Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progress.assessment_submitted ? (
                    <>
                      <Badge variant="default">Submitted</Badge>

                      <div className="text-sm text-muted-foreground">
                        {progress.submission_uploaded_at && (
                          <p>Submitted: {new Date(progress.submission_uploaded_at).toLocaleDateString()}</p>
                        )}
                        {assessmentStatus?.assessment_grade ? (
                          <p>Grade: {assessmentStatus.assessment_grade}%</p>
                        ) : (
                          <p>Awaiting grading</p>
                        )}
                      </div>

                      {progress.submission_path && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Create download link for submitted file
                            const link = document.createElement('a');
                            link.href = `https://ebzsvbbmahvqlshydkxg.supabase.co/storage/v1/object/public/assessment-submissions/${progress.submission_path}`;
                            link.download = `${module.code}_assessment.txt`;
                            link.click();
                          }}
                          className="w-full gap-2"
                        >
                          <Download size={14} />
                          Download Submission
                        </Button>
                      )}
                    </>
                  ) : progress.assessment_unlocked ? (
                    <>
                      <Badge variant="default">Ready</Badge>

                      <div className="text-sm text-muted-foreground">
                        <p>Quiz passed - assessment unlocked</p>
                        <p>Submit your summative assessment</p>
                      </div>

                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => navigate(`/learner/assessment/${id}`)}
                        className="w-full gap-2"
                      >
                        <FileText size={14} />
                        Submit Assessment
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">Locked</Badge>

                      <div className="text-sm text-muted-foreground">
                        <p>Pass quiz to unlock</p>
                        <p>Need 70% quiz score</p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="w-full gap-2"
                      >
                        <FileText size={14} />
                        Assessment Locked
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  Summative Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant="secondary">Not Required</Badge>
                  <div className="text-sm text-muted-foreground">
                    <p>Block 3 evidence uses workbook and quiz only.</p>
                    <p>No summative submission is required for this block.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completion Status */}
        {progressPercentage === 100 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Award size={24} />
                  <h3 className="text-lg font-semibold">Module Completed!</h3>
                </div>
                <p className="text-green-600">
                  Congratulations! You have successfully completed the required evidence for {module.title}: {usesWorkbookEvidence ? 'workbook' : 'guide'}, quiz, and summative assessment.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => navigate('/learner')}
                    variant="outline"
                  >
                    Back to Portal
                  </Button>
                  <Button 
                    onClick={() => navigate('/poe')}
                    className="gap-2"
                  >
                    <Award size={16} />
                    Add to Portfolio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}