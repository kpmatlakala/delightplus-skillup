export type SessionQuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

export const sessionQuizBankByModule: Record<string, SessionQuizQuestion[]> = {};
