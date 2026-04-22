/**
 * Mobile-Optimized Assessment Form for Mature Learners
 * Designed specifically for 60+ year old learners using phones
 * Features: Large touch targets, simple navigation, clear typography, voice input support
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Eye, 
  EyeOff,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useDraftManager } from "@/hooks/useDraftManager";
import { useScreenReader } from "@/hooks/useAccessibility";
import { PhoneValidator } from "@/utils/phoneValidation";

export interface MobileAssessmentFormProps {
  moduleId: string;
  answers: Record<number, string>;
  onAnswerChange: (idx: number, value: string) => void;
  onRequestSubmit: (payload: { submissionText: string }) => void;
  isSubmitting?: boolean;
  submitError?: string;
  learnerName?: string;
  learnerPhone?: string;
}

export const MobileAssessmentForm: React.FC<MobileAssessmentFormProps> = ({
  moduleId,
  answers,
  onAnswerChange,
  onRequestSubmit,
  isSubmitting = false,
  submitError,
  learnerName,
  learnerPhone
}) => {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('large');
  const [showInstructions, setShowInstructions] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const { announce, announceSuccess } = useScreenReader();
  
  // Draft management with mobile-optimized settings
  const { saveDraft, hasDraft, loadDraft } = useDraftManager({
    moduleId,
    autoSaveDelay: 1000, // Faster auto-save for mobile
    onDraftSaved: () => {
      setLastSaved(new Date());
      announceSuccess('Your work has been saved automatically');
    },
    onDraftLoaded: (draftAnswers) => {
      Object.entries(draftAnswers).forEach(([idx, value]) => {
        onAnswerChange(Number(idx), value);
      });
      announceSuccess('Your previous work has been restored');
    }
  });

  // Mock assessment data - simplified for mobile
  const assessmentDef = {
    saqa: moduleId,
    unitTitle: `Module ${moduleId} Assessment`,
    activities: [
      { n: 1, question: "What are the main topics you learned in this module?", marks: 10, hint: "Think about the key concepts covered in your study materials." },
      { n: 2, question: "How would you use what you learned in your work or daily life?", marks: 15, hint: "Give specific examples of how you could apply this knowledge." },
      { n: 3, question: "What was the most important thing you learned and why?", marks: 20, hint: "Explain why this particular learning was significant to you." },
      { n: 4, question: "What questions do you still have about this topic?", marks: 15, hint: "It's okay to have questions - this shows you're thinking deeply." },
      { n: 5, question: "How confident do you feel about this topic now?", marks: 10, hint: "Be honest about your confidence level and explain why." }
    ]
  };

  const totalActivities = assessmentDef.activities.length;
  const currentActivityData = assessmentDef.activities[currentActivity];
  const progress = ((currentActivity + 1) / totalActivities) * 100;

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-ZA'; // South African English

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          const currentAnswer = answers[currentActivity] || '';
          const newAnswer = currentAnswer + (currentAnswer ? ' ' : '') + finalTranscript;
          onAnswerChange(currentActivity, newAnswer);
          updateWordCount(newAnswer);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        announce('Voice input stopped. You can try again or continue typing.', 'polite');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [answers, currentActivity, onAnswerChange, announce]);

  // Update word count when answer changes
  useEffect(() => {
    const currentAnswer = answers[currentActivity] || '';
    updateWordCount(currentAnswer);
  }, [answers, currentActivity]);

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      announce('Voice input is not supported on this device. Please use the keyboard to type your answer.', 'assertive');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      announce('Voice input stopped', 'polite');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      announce('Voice input started. Speak your answer clearly.', 'polite');
    }
  };

  const readQuestionAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Activity ${currentActivityData.n}. ${currentActivityData.question}. ${currentActivityData.hint}`
      );
      utterance.rate = 0.8; // Slower speech for better comprehension
      utterance.lang = 'en-ZA';
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerChange = (value: string) => {
    onAnswerChange(currentActivity, value);
    updateWordCount(value);
    
    // Auto-save more frequently on mobile
    saveDraft({ ...answers, [currentActivity]: value }, 'current-user-id');
  };

  const navigateToActivity = (activityIndex: number) => {
    if (activityIndex >= 0 && activityIndex < totalActivities) {
      setCurrentActivity(activityIndex);
      // Auto-save current answer before navigating
      if (answers[currentActivity]) {
        saveDraft(answers, 'current-user-id');
      }
    }
  };

  const handleSubmit = () => {
    // Check for empty answers
    const unansweredActivities = assessmentDef.activities
      .filter((_, idx) => !answers[idx] || answers[idx].trim() === '')
      .map((activity) => activity.n);

    if (unansweredActivities.length > 0) {
      announce(
        `Please answer all activities. You still need to complete: Activity ${unansweredActivities.join(', Activity ')}`,
        'assertive'
      );
      return;
    }

    // Generate submission text
    const submissionText = `
ASSESSMENT SUBMISSION
Module: ${moduleId}
Learner: ${learnerName || 'Unknown'}
Phone: ${learnerPhone || 'Not provided'}
Submitted: ${new Date().toLocaleString('en-ZA')}

${assessmentDef.activities
  .map((activity, idx) => {
    const answer = answers[idx] || '';
    return `
ACTIVITY ${activity.n} (${activity.marks} marks)
Question: ${activity.question}

Answer:
${answer}

Word count: ${answer.trim().split(/\s+/).filter(w => w.length > 0).length} words
`;
  })
  .join('\n---\n')}

END OF SUBMISSION
    `.trim();

    onRequestSubmit({ submissionText });
    announceSuccess('Your assessment has been submitted successfully!');
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'normal': return 'text-base';
      case 'large': return 'text-lg';
      case 'extra-large': return 'text-xl';
      default: return 'text-lg';
    }
  };

  const getButtonSize = () => {
    return fontSize === 'extra-large' ? 'lg' : 'default';
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${getFontSizeClass()}`}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              Assessment
            </h1>
            
            {/* Font size controls */}
            <div className="flex gap-1">
              <Button
                variant={fontSize === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('normal')}
                className="text-xs px-2"
              >
                A
              </Button>
              <Button
                variant={fontSize === 'large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('large')}
                className="text-sm px-2"
              >
                A
              </Button>
              <Button
                variant={fontSize === 'extra-large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('extra-large')}
                className="text-base px-2"
              >
                A
              </Button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>Activity {currentActivity + 1} of {totalActivities}</span>
            {lastSaved && (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-500" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Instructions (collapsible) */}
      {showInstructions && (
        <div className="px-4 py-3 bg-blue-50 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="font-medium text-blue-900 mb-1">How to use this form:</h2>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tap the microphone to speak your answer</li>
                <li>• Your work saves automatically</li>
                <li>• Use the speaker button to hear questions</li>
                <li>• Tap "Next" to move between activities</li>
              </ul>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(false)}
              className="text-blue-600"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Error display */}
      {submitError && (
        <div className="px-4 py-3">
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="text-base">
              {submitError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main content */}
      <div className="px-4 py-4 space-y-4">
        {/* Current activity card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Activity {currentActivityData.n}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {currentActivityData.marks} marks
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={readQuestionAloud}
                  className="p-2"
                  title="Read question aloud"
                >
                  <Volume2 size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Question */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900 leading-relaxed">
                {currentActivityData.question}
              </p>
              {currentActivityData.hint && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  💡 Hint: {currentActivityData.hint}
                </p>
              )}
            </div>

            {/* Answer input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Your Answer:
                </label>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{wordCount} words</span>
                  {wordCount < 50 && (
                    <span className="text-amber-600">(aim for 50+ words)</span>
                  )}
                </div>
              </div>
              
              <Textarea
                ref={textareaRef}
                value={answers[currentActivity] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here, or use the microphone button to speak..."
                className="min-h-[150px] text-base leading-relaxed resize-none"
                style={{ fontSize: fontSize === 'extra-large' ? '1.125rem' : undefined }}
              />

              {/* Voice input controls */}
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleVoiceInput}
                  className="flex items-center gap-2"
                  size={getButtonSize()}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  {isListening ? 'Stop Speaking' : 'Speak Answer'}
                </Button>

                {isListening && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => navigateToActivity(currentActivity - 1)}
            disabled={currentActivity === 0}
            size={getButtonSize()}
            className="flex items-center gap-2 min-w-[100px]"
          >
            <ChevronLeft size={20} />
            Previous
          </Button>

          <div className="flex-1 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                saveDraft(answers, 'current-user-id');
                announceSuccess('Your work has been saved');
              }}
              size={getButtonSize()}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              Save Now
            </Button>
          </div>

          {currentActivity < totalActivities - 1 ? (
            <Button
              onClick={() => navigateToActivity(currentActivity + 1)}
              size={getButtonSize()}
              className="flex items-center gap-2 min-w-[100px]"
            >
              Next
              <ChevronRight size={20} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size={getButtonSize()}
              className="flex items-center gap-2 min-w-[100px] bg-green-600 hover:bg-green-700"
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Submit'}
            </Button>
          )}
        </div>

        {/* Activity overview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">All Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {assessmentDef.activities.map((activity, idx) => (
                <Button
                  key={idx}
                  variant={idx === currentActivity ? "default" : "outline"}
                  size="sm"
                  onClick={() => navigateToActivity(idx)}
                  className="relative h-12 flex flex-col items-center justify-center"
                >
                  <span className="text-sm font-medium">{activity.n}</span>
                  {answers[idx] && answers[idx].trim() && (
                    <CheckCircle2 size={12} className="absolute -top-1 -right-1 text-green-500" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help section */}
        <Card className="shadow-sm bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Need Help?</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  If you're having trouble, you can call your facilitator or save your work and continue later. 
                  Your answers are saved automatically.
                </p>
                {learnerPhone && PhoneValidator.validate(learnerPhone).isValid && (
                  <p className="text-xs text-blue-700 mt-2">
                    Your phone: {PhoneValidator.formatForDisplay(learnerPhone)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom padding for mobile keyboards */}
      <div className="h-20" />
    </div>
  );
};