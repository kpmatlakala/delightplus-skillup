import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  onClose: () => void;
  title?: string;
}

export const Quiz: React.FC<QuizProps> = ({ 
  questions, 
  onComplete, 
  onClose, 
  title = "Module Quiz" 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const hasAnsweredCurrent = answers[currentQuestion?.id] !== undefined;
  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    
    setQuizCompleted(true);
    onComplete(correctAnswers, questions.length);
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const calculateScore = () => {
    const correctAnswers = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / questions.length) * 100);
  };

  const getQuestionResult = (question: QuizQuestion) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    return { isCorrect, userAnswer };
  };

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>No Quiz Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            No quiz questions are available for this module.
          </p>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {passed ? (
              <CheckCircle2 className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {score}%
            </div>
            <p className="text-muted-foreground">
              You scored {questions.filter(q => answers[q.id] === q.correctAnswer).length} out of {questions.length} questions correctly
            </p>
            <div className={`mt-4 p-4 rounded-lg ${
              passed 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {passed ? (
                <p className="font-medium">
                  🎉 Congratulations! You passed the quiz and can now proceed to the assessment.
                </p>
              ) : (
                <p className="font-medium">
                  You need 70% or higher to unlock the assessment. Please review the material and try again.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Question Review:</h3>
            {questions.map((question, index) => {
              const result = getQuestionResult(question);
              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {result.isCorrect ? (
                      <CheckCircle2 className="text-green-600 mt-1" size={20} />
                    ) : (
                      <XCircle className="text-red-600 mt-1" size={20} />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">Your answer:</span>{' '}
                          <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {question.options[result.userAnswer]}
                          </span>
                        </p>
                        {!result.isCorrect && (
                          <p>
                            <span className="font-medium">Correct answer:</span>{' '}
                            <span className="text-green-600">
                              {question.options[question.correctAnswer]}
                            </span>
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-muted-foreground mt-2">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            {!passed && (
              <Button onClick={handleRetakeQuiz} variant="outline" className="gap-2">
                <RotateCcw size={16} />
                Retake Quiz
              </Button>
            )}
            <Button 
              onClick={quizCompleted ? onClose : handleSubmitQuiz}
              className={passed ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {quizCompleted ? 'Close' : 'Submit Results'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm">
            ✕
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion.question}
          </h3>
          
          <RadioGroup
            value={answers[currentQuestion.id]?.toString() || ''}
            onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {allQuestionsAnswered ? (
              <span className="text-green-600 font-medium">All questions answered</span>
            ) : (
              <span>
                {Object.keys(answers).length} of {questions.length} answered
              </span>
            )}
          </div>

          <Button
            onClick={isLastQuestion ? () => setShowResults(true) : handleNext}
            disabled={!hasAnsweredCurrent}
            className="gap-2"
          >
            {isLastQuestion ? 'Review Answers' : 'Next'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};