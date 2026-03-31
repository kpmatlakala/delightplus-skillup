import React from 'react';
import { CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizAnswer {
  question_id: number;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

interface QuizReviewModeProps {
  questions: QuizQuestion[];
  savedAnswers: QuizAnswer[];
  score: number;
  onRetakeQuiz: () => void;
}

export function QuizReviewMode({ questions, savedAnswers, score, onRetakeQuiz }: QuizReviewModeProps) {
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  // Create a map of saved answers for easy lookup
  const answerMap = savedAnswers.reduce((acc, answer) => {
    acc[answer.question_id] = answer;
    return acc;
  }, {} as Record<number, QuizAnswer>);

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className={`rounded-lg border p-6 ${passed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          {passed ? (
            <CheckCircle2 className="text-green-600" size={24} />
          ) : (
            <XCircle className="text-orange-600" size={24} />
          )}
          <div>
            <h3 className="font-semibold text-lg">
              Quiz Completed - {percentage}%
            </h3>
            <p className="text-sm text-muted-foreground">
              You scored {score} out of {questions.length} questions correctly
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={onRetakeQuiz}
            variant={passed ? "outline" : "default"}
            size="sm"
            className="gap-2"
          >
            <RotateCcw size={16} />
            {passed ? 'Retake Quiz' : 'Try Again'}
          </Button>
          
          {passed && (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle2 size={16} />
              Assessment Unlocked!
            </div>
          )}
        </div>
      </div>

      {/* Question Review */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Eye size={16} />
          Review Your Answers
        </div>
        
        {questions.map((question) => {
          const savedAnswer = answerMap[question.id];
          const isCorrect = savedAnswer?.is_correct ?? false;
          const selectedAnswer = savedAnswer?.selected_answer ?? '';
          
          return (
            <div key={question.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                ) : (
                  <XCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                )}
                <div className="flex-1">
                  <h4 className="font-medium mb-2">
                    Question {question.id + 1}: {question.question}
                  </h4>
                  
                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const isSelected = selectedAnswer === option;
                      const isCorrectAnswer = option === question.answer;
                      
                      let className = "p-2 rounded border text-sm ";
                      
                      if (isSelected && isCorrectAnswer) {
                        className += "bg-green-100 border-green-300 text-green-800";
                      } else if (isSelected && !isCorrectAnswer) {
                        className += "bg-red-100 border-red-300 text-red-800";
                      } else if (isCorrectAnswer) {
                        className += "bg-green-50 border-green-200 text-green-700";
                      } else {
                        className += "bg-gray-50 border-gray-200 text-gray-600";
                      }
                      
                      return (
                        <div key={option} className={className}>
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="text-xs font-medium">
                                {isCorrectAnswer ? '✓ Your Answer' : '✗ Your Answer'}
                              </span>
                            )}
                            {!isSelected && isCorrectAnswer && (
                              <span className="text-xs font-medium text-green-600">
                                ✓ Correct Answer
                              </span>
                            )}
                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}