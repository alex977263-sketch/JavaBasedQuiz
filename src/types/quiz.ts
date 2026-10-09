export type Role = 'ROLE_STUDENT' | 'ROLE_ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  avatarUrl?: string;
  collegeOrCompany?: string;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface QuestionOption {
  id: number;
  optionKey: 'A' | 'B' | 'C' | 'D';
  optionText: string;
}

export interface Question {
  id: number;
  quizId: number;
  questionNumber: number;
  questionText: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: QuestionOption[];
  correctOptionKey: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  points: number;
  difficulty?: Difficulty;
}

export interface Quiz {
  id: number;
  title: string;
  slug: string;
  description: string;
  categoryId: number;
  categoryName: string;
  difficulty: Difficulty;
  durationMinutes: number;
  passingPercentage: number;
  isActive: boolean;
  questionsCount: number;
  totalMarks: number;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface SubmittedAnswerItem {
  questionId: number;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D' | null;
  isFlaggedForReview?: boolean;
}

export interface QuestionResultReview {
  questionId: number;
  questionNumber: number;
  questionText: string;
  codeSnippet?: string;
  options: QuestionOption[];
  studentSelectedKey: 'A' | 'B' | 'C' | 'D' | null;
  correctOptionKey: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  isUnanswered: boolean;
  explanation: string;
  pointsAwarded: number;
  maxPoints: number;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  quizTitle: string;
  categoryName: string;
  difficulty: Difficulty;
  userId: number;
  userName: string;
  userEmail: string;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;
  totalQuestions: number;
  correctAnswersCount: number;
  incorrectAnswersCount: number;
  unansweredCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  passingPercentage: number;
  reviews: QuestionResultReview[];
}

export interface StudentStats {
  quizzesAttempted: number;
  quizzesPassed: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpentSeconds: number;
  categoryProficiency: Record<string, { attempted: number; avgPercentage: number }>;
}
