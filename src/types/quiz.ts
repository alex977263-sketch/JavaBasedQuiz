export type Role = 'ROLE_ADMIN' | 'ROLE_CREATOR' | 'ROLE_PARTICIPANT';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  avatarUrl?: string;
  collegeOrCompany?: string;
  isEnabled: boolean;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ApprovalStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

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
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  createdByUserId: number;
  createdByName: string;
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

export interface CreatorReviewFeedback {
  id: number;
  attemptId: number;
  creatorId: number;
  creatorName: string;
  feedbackNotes: string;
  gradeTag: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK';
  awardedAt: string;
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
  creatorFeedback?: CreatorReviewFeedback;
}

export interface ParticipantCreatorInteraction {
  id: number;
  participantId: number;
  participantName: string;
  participantEmail: string;
  creatorId?: number;
  creatorName?: string;
  quizId: number;
  quizTitle: string;
  subject: string;
  message: string;
  reply?: string;
  repliedAt?: string;
  repliedByName?: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
}

export interface QuizReminder {
  id: number;
  participantId: number;
  quizId: number;
  quizTitle: string;
  reminderDateTime: string;
  note?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface SystemSettings {
  platformTitle: string;
  defaultDurationMinutes: number;
  defaultPassingPercentage: number;
  autoApproveQuizzes: boolean;
  allowParticipantInteractions: boolean;
  registrationOpen: boolean;
  maintenanceMode: boolean;
  systemAnnouncement: string;
}

export interface SystemAlert {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  timestamp: string;
  isRead?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  userEmail: string;
  quizzesAttempted: number;
  quizzesPassed: number;
  totalPoints: number;
  averagePercentage: number;
  badge: string;
}

export interface StudentStats {
  quizzesAttempted: number;
  quizzesPassed: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpentSeconds: number;
  categoryProficiency: Record<string, { attempted: number; avgPercentage: number }>;
}
