export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizReport {
  score: number;
  total: number;
  answers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
}