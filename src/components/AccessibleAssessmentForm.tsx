/**
 * Accessibility-Enhanced Assessment Form
 * Provides full keyboard navigation, screen reader support, and ARIA compliance
 */

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Clock, Download, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  useFocusManagement, 
  useScreenReader, 
  useKeyboardShortcuts,
  useAriaAttributes,
  useReducedMotion 
} from "@/hooks/useAccessibility";
import { useDraftManager } from "@/hooks/useDraftManager";
import { useAssessmentNavigationGuard } from "@/hooks/useNavigationGuard";

export interface AccessibleAssessmentFormProps {
  moduleId: string;
  answers: Record<number, string>;
  onAnswerChange: (idx: number, value: string) => void;
  onRequestSubmit: (payload: { submissionText: string }) => void;
  isSubmitting?: boolean;
  submitError?: string;
  downloadHref?: string;
  learnerName?: string;
  showTimer?: boolean;
  timeLimit?: number; // in minutes
}

export const AccessibleAssessmentForm: React.FC<AccessibleAssessmentFormProps> = ({
  moduleId,
  answers,
  onAnswerChange,
  onRequestSubmit,
  isSubmitting = false,
  submitError,
  downloadHref,
  learnerName,
  showTimer = false,
  timeLimit
}) => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const currentTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Accessibility hooks
  const { setupKeyboardNavigation, focusFirst } = useFocusManagement();
  const { announce, announceError, announceSuccess } = useScreenReader();
  const { setAriaAttributes } = useAriaAttributes();
  const { getAnimationDuration } = useReducedMotion();
  
  // Draft management
  const { saveDraft, loadDraft, hasDraft, clearDraft } = useDraftManager({
    moduleId,
    onDraftLoaded: (draftAnswers) => {
      Object.entries(draftAnswers).forEach(([idx, value]) => {
        onAnswerChange(Number(idx), value);
      });
      announceSuccess('Previous draft loaded successfully');
    },
    onDraftSaved: () => {
      setHasUnsavedChanges(false);
    }
  });
  
  // Navigation protection
  useAssessmentNavigationGuard(hasUnsavedChanges, async () => {
    if (hasUnsavedChanges) {
      saveDraft(answers, 'current-user-id'); // TODO: Get actual user ID
      return true;
    }
    return true;
  });

  // Mock assessment definition for demo
  const assessmentDef = {
    saqa: moduleId,
    unitTitle: `Assessment for Module ${moduleId}`,
    activities: [
      { n: 1, question: "Describe the key concepts covered in this module.", marks: 10 },
      { n: 2, question: "Explain how you would apply these concepts in practice.", marks: 15 },
      { n: 3, question: "Analyze a real-world scenario using the module content.", marks: 20 },
      { n: 4, question: "Evaluate the effectiveness of the approaches discussed.", marks: 15 },
      { n: 5, question: "Synthesize your learning into actionable recommendations.", marks: 10 }
    ]
  };

  const totalActivities = assessmentDef.activities.length;
  const currentActivityData = assessmentDef.activities[currentActivity];

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+s': () => {
      saveDraft(answers, 'current-user-id');
      announceSuccess('Draft saved');
    },
    'ctrl+enter': () => {
      if (!isSubmitting) {
        handleSubmit();
      }
    },
    'alt+arrowleft': () => {
      if (currentActivity > 0) {
        navigateToActivity(currentActivity - 1);
      }
    },
    'alt+arrowright': () => {
      if (currentActivity < totalActivities - 1) {
        navigateToActivity(currentActivity + 1);
      }
    }
  });

  // Timer effect
  useEffect(() => {
    if (!showTimer || !timeRemaining) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev > 0) {
          const newTime = prev - 1;
          
          // Announce time warnings
          if (newTime === 300) { // 5 minutes
            announce('5 minutes remaining', 'assertive');
          } else if (newTime === 60) { // 1 minute
            announce('1 minute remaining', 'assertive');
          } else if (newTime === 0) {
            announce('Time is up! Please submit your assessment.', 'assertive');
          }
          
          return newTime;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimer, timeRemaining, announce]);

  // Set up keyboard navigation when component mounts
  useEffect(() => {
    if (formRef.current) {
      const cleanup = setupKeyboardNavigation(formRef.current);
      return cleanup;
    }
  }, [setupKeyboardNavigation]);

  // Focus management when activity changes
  useEffect(() => {
    if (currentTextareaRef.current) {
      currentTextareaRef.current.focus();
      announce(`Activity ${currentActivity + 1} of ${totalActivities}: ${currentActivityData.question}`);
    }
  }, [currentActivity, announce, currentActivityData, totalActivities]);

  const navigateToActivity = (activityIndex: number) => {
    if (activityIndex >= 0 && activityIndex < totalActivities) {
      setCurrentActivity(activityIndex);
    }
  };

  const handleAnswerChange = (value: string) => {
    onAnswerChange(currentActivity, value);
    setHasUnsavedChanges(true);
    
    // Auto-save draft after 2 seconds of inactivity
    const timeoutId = setTimeout(() => {
      saveDraft({ ...answers, [currentActivity]: value }, 'current-user-id');
    }, 2000);

    return () => clearTimeout(timeoutId);
  };

  const handleSubmit = () => {
    // Validate all required fields
    const unansweredActivities = assessmentDef.activities
      .filter((_, idx) => !answers[idx] || answers[idx].trim() === '')
      .map((activity, idx) => idx + 1);

    if (unansweredActivities.length > 0) {
      announceError(
        'Form validation',
        `Please answer all activities. Missing: ${unansweredActivities.join(', ')}`
      );
      return;
    }

    // Generate submission text
    const submissionText = assessmentDef.activities
      .map((activity, idx) => {
        const answer = answers[idx] || '';
        return `Activity ${activity.n}: ${activity.question}\n\nAnswer:\n${answer}\n\n---\n`;
      })
      .join('\n');

    onRequestSubmit({ submissionText });
    clearDraft();
    announceSuccess('Assessment submitted successfully');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (!timeRemaining) return 'text-gray-600';
    if (timeRemaining <= 300) return 'text-red-600'; // 5 minutes
    if (timeRemaining <= 900) return 'text-yellow-600'; // 15 minutes
    return 'text-green-600';
  };

  return (
    <div className="space-y-6" role="main" aria-label="Assessment Form">
      {/* Screen reader instructions */}
      <div className="sr-only">
        <h1>Assessment Form for {assessmentDef.unitTitle}</h1>
        <p>
          Use arrow keys to navigate between form elements. 
          Press Ctrl+S to save draft, Ctrl+Enter to submit.
          Use Alt+Left/Right arrows to navigate between activities.
        </p>
      </div>

      {/* Header with timer and progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                {assessmentDef.unitTitle}
              </CardTitle>
              <CardDescription>
                Activity {currentActivity + 1} of {totalActivities}
                {learnerName && ` • ${learnerName}`}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Draft indicator */}
              {hasDraft && (
                <Badge variant="outline" className="gap-1">
                  <Save size={12} />
                  Draft Available
                </Badge>
              )}
              
              {/* Timer */}
              {showTimer && timeRemaining !== null && (
                <div 
                  className={`flex items-center gap-2 ${getTimeColor()}`}
                  role="timer"
                  aria-live="polite"
                  aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
                >
                  <Clock size={16} />
                  <span className="font-mono font-medium">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentActivity + 1) / totalActivities) * 100}%` }}
              role="progressbar"
              aria-valuenow={currentActivity + 1}
              aria-valuemin={1}
              aria-valuemax={totalActivities}
              aria-label={`Progress: ${currentActivity + 1} of ${totalActivities} activities completed`}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Error display */}
      {submitError && (
        <Alert variant="destructive" role="alert">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Main form */}
      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Activity {currentActivityData.n}
                <span className="sr-only"> of {totalActivities}</span>
              </span>
              <Badge variant="secondary">
                {currentActivityData.marks} marks
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Question */}
            <div>
              <label 
                htmlFor={`activity-${currentActivity}`}
                className="block text-sm font-medium mb-2"
              >
                {currentActivityData.question}
              </label>
              
              <Textarea
                id={`activity-${currentActivity}`}
                ref={currentTextareaRef}
                value={answers[currentActivity] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Enter your answer here..."
                className="min-h-[200px] resize-y"
                aria-describedby={`activity-${currentActivity}-help`}
                aria-required="true"
              />
              
              <div 
                id={`activity-${currentActivity}-help`}
                className="text-xs text-muted-foreground mt-1"
              >
                This activity is worth {currentActivityData.marks} marks. 
                Your answer will be automatically saved as you type.
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigateToActivity(currentActivity - 1)}
                disabled={currentActivity === 0}
                className="gap-2"
                aria-label="Go to previous activity"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex gap-2">
                {/* Download button */}
                {downloadHref && (
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="gap-2"
                  >
                    <a 
                      href={downloadHref} 
                      download
                      aria-label="Download assessment PDF"
                    >
                      <Download size={16} />
                      Download PDF
                    </a>
                  </Button>
                )}

                {/* Save draft button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    saveDraft(answers, 'current-user-id');
                    announceSuccess('Draft saved');
                  }}
                  className="gap-2"
                  aria-label="Save current progress as draft"
                >
                  <Save size={16} />
                  Save Draft
                </Button>
              </div>

              {currentActivity < totalActivities - 1 ? (
                <Button
                  type="button"
                  onClick={() => navigateToActivity(currentActivity + 1)}
                  className="gap-2"
                  aria-label="Go to next activity"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                  aria-label="Submit complete assessment"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Activity navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="grid grid-cols-5 gap-2"
            role="tablist"
            aria-label="Activity navigation"
          >
            {assessmentDef.activities.map((activity, idx) => (
              <Button
                key={idx}
                type="button"
                variant={idx === currentActivity ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToActivity(idx)}
                className="relative"
                role="tab"
                aria-selected={idx === currentActivity}
                aria-controls={`activity-${idx}`}
                aria-label={`Go to activity ${idx + 1}: ${activity.question.substring(0, 50)}...`}
              >
                {activity.n}
                {answers[idx] && (
                  <div 
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                    aria-label="Activity completed"
                  />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyboard shortcuts help */}
      <details className="text-sm text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">
          Keyboard Shortcuts
        </summary>
        <div className="mt-2 space-y-1 pl-4">
          <p><kbd className="px-1 py-0.5 bg-muted rounded">Ctrl+S</kbd> Save draft</p>
          <p><kbd className="px-1 py-0.5 bg-muted rounded">Ctrl+Enter</kbd> Submit assessment</p>
          <p><kbd className="px-1 py-0.5 bg-muted rounded">Alt+←/→</kbd> Navigate activities</p>
          <p><kbd className="px-1 py-0.5 bg-muted rounded">Tab</kbd> Navigate form elements</p>
        </div>
      </details>
    </div>
  );
};