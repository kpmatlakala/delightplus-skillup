import { SessionQuizQuestion } from '@/data/sessionQuizBank';
import { QuizQuestion } from '@/components/Quiz';

/**
 * Convert SessionQuizQuestion format to QuizQuestion format
 */
export function convertSessionQuizToQuizFormat(sessionQuiz: SessionQuizQuestion[]): QuizQuestion[] {
  return sessionQuiz.map(q => {
    // Find the index of the correct answer
    const correctAnswerIndex = q.options.findIndex(option => option === q.answer);
    
    return {
      id: q.id.toString(),
      question: q.question,
      options: q.options,
      correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      explanation: `The correct answer is: ${q.answer}`
    };
  });
}

/**
 * Generate a simple quiz from module objectives if no quiz bank exists
 */
export function generateFallbackQuiz(moduleTitle: string, objectives: string[]): QuizQuestion[] {
  if (!objectives || objectives.length === 0) {
    return [];
  }

  // Create simple questions based on objectives
  const questions: QuizQuestion[] = objectives.slice(0, 3).map((objective, index) => ({
    id: `fallback-${index + 1}`,
    question: `Which of the following best describes the objective: "${objective}"?`,
    options: [
      "This is a primary learning objective for this module",
      "This is not relevant to this module",
      "This is only for advanced learners",
      "This is optional content"
    ],
    correctAnswer: 0,
    explanation: "This is indeed a primary learning objective for this module."
  }));

  return questions;
}