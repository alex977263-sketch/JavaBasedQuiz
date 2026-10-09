import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Role,
  Quiz,
  Category,
  QuizAttempt,
  QuestionResultReview,
  StudentStats,
  Question,
  Difficulty,
  ApprovalStatus,
  SystemSettings,
  SystemAlert,
  ParticipantCreatorInteraction,
  QuizReminder,
  LeaderboardEntry,
  CreatorReviewFeedback,
} from '../types/quiz';
import { INITIAL_CATEGORIES, INITIAL_QUIZZES } from '../data/sampleQuizzes';

export const DEMO_ADMIN: User = {
  id: 1,
  username: 'admin',
  email: 'admin@javaquiz.com',
  fullName: 'Administrator',
  role: 'ROLE_ADMIN',
  createdAt: '2026-01-01T08:00:00Z',
  collegeOrCompany: 'Faculty of Software Systems',
  isEnabled: true,
};

export const DEMO_CREATOR: User = {
  id: 2,
  username: 'creator',
  email: 'creator@javaquiz.com',
  fullName: 'Prof. James Gosling',
  role: 'ROLE_CREATOR',
  createdAt: '2026-01-10T09:30:00Z',
  collegeOrCompany: 'Java Curriculum Lead',
  isEnabled: true,
};

export const DEMO_PARTICIPANT: User = {
  id: 3,
  username: 'participant',
  email: 'participant@javaquiz.com',
  fullName: 'Rahul Sharma',
  role: 'ROLE_PARTICIPANT',
  createdAt: '2026-02-01T11:00:00Z',
  collegeOrCompany: 'Computer Science & Engineering',
  isEnabled: true,
};

export const INITIAL_USERS: User[] = [
  DEMO_ADMIN,
  DEMO_CREATOR,
  DEMO_PARTICIPANT,
  {
    id: 4,
    username: 'anita_creator',
    email: 'anita@javaquiz.com',
    fullName: 'Dr. Anita Borg',
    role: 'ROLE_CREATOR',
    createdAt: '2026-01-15T14:20:00Z',
    collegeOrCompany: 'Systems & OS Department',
    isEnabled: true,
  },
  {
    id: 5,
    username: 'priya_student',
    email: 'priya@javaquiz.com',
    fullName: 'Priya Patel',
    role: 'ROLE_PARTICIPANT',
    createdAt: '2026-02-10T16:00:00Z',
    collegeOrCompany: 'Software Technology Institute',
    isEnabled: true,
  },
  {
    id: 6,
    username: 'david_student',
    email: 'david@javaquiz.com',
    fullName: 'David Kim',
    role: 'ROLE_PARTICIPANT',
    createdAt: '2026-02-14T10:15:00Z',
    collegeOrCompany: 'Applied Computing College',
    isEnabled: true,
  },
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  platformTitle: 'Java-Based Online Quiz Platform',
  defaultDurationMinutes: 15,
  defaultPassingPercentage: 70,
  autoApproveQuizzes: false,
  allowParticipantInteractions: true,
  registrationOpen: true,
  maintenanceMode: false,
  systemAnnouncement: 'Welcome to JavaQuiz Platform! Timed quizzes and performance reports are active.',
};

export const INITIAL_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: 1,
    title: 'New Quiz Submission Pending Approval',
    message: 'Quiz "Operating Systems: Threads, Scheduling & Paging" by Prof. James Gosling requires review.',
    type: 'INFO',
    timestamp: '2026-03-08T09:00:00Z',
    isRead: false,
  },
  {
    id: 2,
    title: 'Scheduled Maintenance Notice',
    message: 'Weekly database backup and index optimization will occur this Sunday from 02:00 to 02:30 AM UTC.',
    type: 'WARNING',
    timestamp: '2026-03-07T14:30:00Z',
    isRead: false,
  },
];

export const INITIAL_INTERACTIONS: ParticipantCreatorInteraction[] = [
  {
    id: 1,
    participantId: 3,
    participantName: 'Rahul Sharma',
    participantEmail: 'participant@javaquiz.com',
    creatorId: 2,
    creatorName: 'Prof. James Gosling',
    quizId: 1,
    quizTitle: 'Java Core: Variables, Data Types & Control Flow',
    subject: 'Question 2 Operator Precedence Clarification',
    message: 'Could you explain why ++a evaluated to 7 after post-incrementing earlier in the expression?',
    reply: 'Great question Rahul! The expression evaluates left-to-right. First a++ uses the initial 5 (then a becomes 6). Then ++a immediately increments 6 to 7 before evaluating, resulting in 5 + 7 = 12.',
    repliedAt: '2026-03-05T15:20:00Z',
    repliedByName: 'Prof. James Gosling',
    status: 'RESOLVED',
    createdAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 2,
    participantId: 3,
    participantName: 'Rahul Sharma',
    participantEmail: 'participant@javaquiz.com',
    creatorId: 2,
    creatorName: 'Prof. James Gosling',
    quizId: 3,
    quizTitle: 'Java Collections Framework & Generics',
    subject: 'PECS Rule with generic wildcards in Collections',
    message: 'Can you recommend additional practice problems for <? super T> vs <? extends T> producer-consumer patterns?',
    status: 'OPEN',
    createdAt: '2026-03-08T08:15:00Z',
  },
];

export const INITIAL_REMINDERS: QuizReminder[] = [
  {
    id: 1,
    participantId: 3,
    quizId: 2,
    quizTitle: 'Object-Oriented Programming (OOP) in Java',
    reminderDateTime: '2026-03-12T18:00',
    note: 'Review constructor chaining and method overriding before attempting',
    isCompleted: false,
    createdAt: '2026-03-07T10:00:00Z',
  },
];

interface ActiveExamState {
  quiz: Quiz;
  shuffledQuestions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  flaggedQuestionIds: number[];
  startedAt: string;
  timeRemainingSeconds: number;
  totalDurationSeconds: number;
}

interface QuizContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  loginAsRole: (role: Role) => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoCreator: () => void;
  loginAsDemoParticipant: () => void;
  logout: () => void;
  registerUser: (fullName: string, email: string, role: Role) => void;

  // Admin user management
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: number, data: Partial<User>) => void;
  deleteUser: (id: number) => void;
  toggleUserStatus: (id: number) => void;

  // Quizzes & Approvals
  categories: Category[];
  quizzes: Quiz[];
  activeExam: ActiveExamState | null;
  lastAttemptResult: QuizAttempt | null;
  attemptsHistory: QuizAttempt[];

  approveQuiz: (quizId: number) => void;
  rejectQuiz: (quizId: number, reason: string) => void;

  // Exam actions
  startQuiz: (quizId: number, shuffle?: boolean) => void;
  selectAnswer: (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D' | null) => void;
  toggleFlagQuestion: (questionId: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitExam: () => QuizAttempt;
  cancelExam: () => void;
  setLastAttemptResult: (result: QuizAttempt | null) => void;

  // Quiz Creator actions
  createQuiz: (quizData: Partial<Quiz>) => Quiz;
  updateQuiz: (id: number, quizData: Partial<Quiz>) => void;
  deleteQuiz: (id: number) => void;
  toggleQuizStatus: (id: number) => void;
  addQuestionToQuiz: (quizId: number, question: Omit<Question, 'id' | 'quizId' | 'questionNumber'>) => void;
  deleteQuestion: (quizId: number, questionId: number) => void;
  gradeAttempt: (attemptId: number, feedbackNotes: string, gradeTag: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK') => void;

  // Interactions (Creator <-> Participant)
  interactions: ParticipantCreatorInteraction[];
  sendInteraction: (quizId: number, subject: string, message: string) => void;
  replyToInteraction: (interactionId: number, replyText: string) => void;

  // Reminders
  reminders: QuizReminder[];
  addQuizReminder: (quizId: number, reminderDateTime: string, note?: string) => void;
  deleteQuizReminder: (reminderId: number) => void;
  toggleQuizReminderCompleted: (reminderId: number) => void;

  // System Settings & Alerts
  systemSettings: SystemSettings;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  systemAlerts: SystemAlert[];
  addSystemAlert: (title: string, message: string, type: 'INFO' | 'WARNING' | 'CRITICAL') => void;
  dismissSystemAlert: (id: number) => void;

  // Leaderboard & Analytics
  leaderboard: LeaderboardEntry[];
  studentStats: StudentStats;
  resetDemoData: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'javaquiz_guvi_user_v4',
  USERS: 'javaquiz_guvi_users_v4',
  QUIZZES: 'javaquiz_guvi_quizzes_v4',
  ATTEMPTS: 'javaquiz_guvi_attempts_v4',
  SETTINGS: 'javaquiz_guvi_settings_v4',
  ALERTS: 'javaquiz_guvi_alerts_v4',
  INTERACTIONS: 'javaquiz_guvi_interactions_v4',
  REMINDERS: 'javaquiz_guvi_reminders_v4',
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state - defaults to Administrator
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEMO_ADMIN;
    } catch {
      return DEMO_ADMIN;
    }
  });

  // User accounts list
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Quizzes state
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  // Categories
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Attempts history
  const [attemptsHistory, setAttemptsHistory] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
    } catch {
      return INITIAL_SYSTEM_SETTINGS;
    }
  });

  // System Alerts
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_ALERTS;
    } catch {
      return INITIAL_SYSTEM_ALERTS;
    }
  });

  // Interactions between Participant and Creator
  const [interactions, setInteractions] = useState<ParticipantCreatorInteraction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_INTERACTIONS;
    } catch {
      return INITIAL_INTERACTIONS;
    }
  });

  // Participant Reminders
  const [reminders, setReminders] = useState<QuizReminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  // Active exam state
  const [activeExam, setActiveExam] = useState<ActiveExamState | null>(null);
  const [lastAttemptResult, setLastAttemptResult] = useState<QuizAttempt | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attemptsHistory));
  }, [attemptsHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(systemAlerts));
  }, [systemAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
  }, [interactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  // Exam timer loop
  useEffect(() => {
    if (!activeExam) return;

    const interval = setInterval(() => {
      setActiveExam((prev) => {
        if (!prev) return null;
        if (prev.timeRemainingSeconds <= 1) {
          return { ...prev, timeRemainingSeconds: 0 };
        }
        return {
          ...prev,
          timeRemainingSeconds: prev.timeRemainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeExam]);

  // Auto-submit on timer expiry
  useEffect(() => {
    if (activeExam && activeExam.timeRemainingSeconds === 0) {
      submitExam();
    }
  }, [activeExam?.timeRemainingSeconds]);

  // Role switching
  const loginAsRole = (role: Role) => {
    if (role === 'ROLE_ADMIN') setCurrentUser(DEMO_ADMIN);
    else if (role === 'ROLE_CREATOR') setCurrentUser(DEMO_CREATOR);
    else setCurrentUser(DEMO_PARTICIPANT);
  };

  const loginAsDemoAdmin = () => setCurrentUser(DEMO_ADMIN);
  const loginAsDemoCreator = () => setCurrentUser(DEMO_CREATOR);
  const loginAsDemoParticipant = () => setCurrentUser(DEMO_PARTICIPANT);
  const logout = () => setCurrentUser(null);

  const registerUser = (fullName: string, email: string, role: Role) => {
    const newUser: User = {
      id: Date.now(),
      username: email.split('@')[0],
      email,
      fullName,
      role,
      createdAt: new Date().toISOString(),
      collegeOrCompany: role === 'ROLE_ADMIN' ? 'Administrator' : role === 'ROLE_CREATOR' ? 'Quiz Creator' : 'Student Participant',
      isEnabled: true,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  // User Management
  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: number, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleUserStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isEnabled: !u.isEnabled } : u))
    );
  };

  // Quiz Approval Management (Admin)
  const approveQuiz = (quizId: number) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? {
              ...q,
              approvalStatus: 'APPROVED',
              isActive: true,
              rejectionReason: undefined,
              updatedAt: new Date().toISOString(),
            }
          : q
      )
    );
    // Add positive system alert
    addSystemAlert(
      'Quiz Content Approved',
      `Quiz ID #${quizId} has been approved and published to participants.`,
      'INFO'
    );
  };

  const rejectQuiz = (quizId: number, reason: string) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? {
              ...q,
              approvalStatus: 'REJECTED',
              isActive: false,
              rejectionReason: reason || 'Content does not meet syllabus guidelines.',
              updatedAt: new Date().toISOString(),
            }
          : q
      )
    );
    addSystemAlert(
      'Quiz Content Rejected',
      `Quiz ID #${quizId} was rejected with feedback: "${reason}".`,
      'WARNING'
    );
  };

  // Exam actions
  const startQuiz = (quizId: number, shuffle = false) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz || !quiz.isActive) return;

    let questionsToUse = [...quiz.questions];
    if (shuffle) {
      questionsToUse = questionsToUse.sort(() => Math.random() - 0.5);
    }

    const totalDurationSeconds = quiz.durationMinutes * 60;

    setActiveExam({
      quiz,
      shuffledQuestions: questionsToUse,
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestionIds: [],
      startedAt: new Date().toISOString(),
      timeRemainingSeconds: totalDurationSeconds,
      totalDurationSeconds,
    });
  };

  const selectAnswer = (questionId: number, optionKey: 'A' | 'B' | 'C' | 'D' | null) => {
    if (!activeExam) return;
    setActiveExam((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: optionKey,
        },
      };
    });
  };

  const toggleFlagQuestion = (questionId: number) => {
    if (!activeExam) return;
    setActiveExam((prev) => {
      if (!prev) return null;
      const isFlagged = prev.flaggedQuestionIds.includes(questionId);
      const newFlags = isFlagged
        ? prev.flaggedQuestionIds.filter((id) => id !== questionId)
        : [...prev.flaggedQuestionIds, questionId];
      return {
        ...prev,
        flaggedQuestionIds: newFlags,
      };
    });
  };

  const goToQuestion = (index: number) => {
    if (!activeExam) return;
    if (index >= 0 && index < activeExam.shuffledQuestions.length) {
      setActiveExam((prev) => (prev ? { ...prev, currentQuestionIndex: index } : null));
    }
  };

  const nextQuestion = () => {
    if (!activeExam) return;
    if (activeExam.currentQuestionIndex < activeExam.shuffledQuestions.length - 1) {
      goToQuestion(activeExam.currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (!activeExam) return;
    if (activeExam.currentQuestionIndex > 0) {
      goToQuestion(activeExam.currentQuestionIndex - 1);
    }
  };

  const cancelExam = () => {
    setActiveExam(null);
  };

  const submitExam = (): QuizAttempt => {
    if (!activeExam) throw new Error('No active exam');

    const { quiz, shuffledQuestions, answers, startedAt, totalDurationSeconds, timeRemainingSeconds } = activeExam;
    const timeTakenSeconds = Math.max(1, totalDurationSeconds - timeRemainingSeconds);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalScore = 0;
    let maxScore = 0;

    const reviews: QuestionResultReview[] = shuffledQuestions.map((q, idx) => {
      const selected = answers[q.id] || null;
      const isUnanswered = selected === null;
      const isCorrect = !isUnanswered && selected === q.correctOptionKey;
      const awardedPoints = isCorrect ? q.points : 0;

      maxScore += q.points;
      if (isCorrect) {
        correctCount++;
        totalScore += awardedPoints;
      } else if (isUnanswered) {
        unansweredCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        questionNumber: idx + 1,
        questionText: q.questionText,
        codeSnippet: q.codeSnippet,
        options: q.options,
        studentSelectedKey: selected,
        correctOptionKey: q.correctOptionKey,
        isCorrect,
        isUnanswered,
        explanation: q.explanation,
        pointsAwarded: awardedPoints,
        maxPoints: q.points,
      };
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100 * 10) / 10 : 0;
    const isPassed = percentage >= quiz.passingPercentage;

    const newAttempt: QuizAttempt = {
      id: Date.now(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      categoryName: quiz.categoryName,
      difficulty: quiz.difficulty,
      userId: currentUser?.id || 3,
      userName: currentUser?.fullName || 'Participant Rahul',
      userEmail: currentUser?.email || 'participant@javaquiz.com',
      startedAt,
      submittedAt: new Date().toISOString(),
      timeTakenSeconds,
      totalQuestions: shuffledQuestions.length,
      correctAnswersCount: correctCount,
      incorrectAnswersCount: incorrectCount,
      unansweredCount,
      score: totalScore,
      maxScore,
      percentage,
      isPassed,
      passingPercentage: quiz.passingPercentage,
      reviews,
    };

    setAttemptsHistory((prev) => [newAttempt, ...prev]);
    setLastAttemptResult(newAttempt);
    setActiveExam(null);

    return newAttempt;
  };

  // Quiz Creator CRUD
  const createQuiz = (data: Partial<Quiz>): Quiz => {
    const category = categories.find((c) => c.id === data.categoryId) || categories[0];
    const willAutoApprove = systemSettings.autoApproveQuizzes || currentUser?.role === 'ROLE_ADMIN';

    const newQuiz: Quiz = {
      id: Date.now(),
      title: data.title || 'Untitled Java Assessment',
      slug: (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: data.description || '',
      categoryId: category.id,
      categoryName: category.name,
      difficulty: data.difficulty || 'MEDIUM',
      durationMinutes: data.durationMinutes || systemSettings.defaultDurationMinutes,
      passingPercentage: data.passingPercentage || systemSettings.defaultPassingPercentage,
      isActive: willAutoApprove,
      approvalStatus: willAutoApprove ? 'APPROVED' : 'PENDING',
      createdByUserId: currentUser?.id || 2,
      createdByName: currentUser?.fullName || 'Prof. James Gosling',
      questionsCount: data.questions?.length || 0,
      totalMarks: data.questions?.reduce((acc, q) => acc + q.points, 0) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: data.questions || [],
    };

    setQuizzes((prev) => [newQuiz, ...prev]);

    if (!willAutoApprove) {
      addSystemAlert(
        'New Quiz Pending Approval',
        `Quiz "${newQuiz.title}" by ${newQuiz.createdByName} is awaiting admin approval.`,
        'INFO'
      );
    }

    return newQuiz;
  };

  const updateQuiz = (id: number, data: Partial<Quiz>) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = {
            ...q,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          if (data.categoryId) {
            const cat = categories.find((c) => c.id === data.categoryId);
            if (cat) updated.categoryName = cat.name;
          }
          if (updated.questions) {
            updated.questionsCount = updated.questions.length;
            updated.totalMarks = updated.questions.reduce((sum, item) => sum + item.points, 0);
          }
          return updated;
        }
        return q;
      })
    );
  };

  const deleteQuiz = (id: number) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const toggleQuizStatus = (id: number) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive, updatedAt: new Date().toISOString() } : q))
    );
  };

  const addQuestionToQuiz = (quizId: number, qData: Omit<Question, 'id' | 'quizId' | 'questionNumber'>) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === quizId) {
          const nextQuestionNum = q.questions.length + 1;
          const newQuestion: Question = {
            ...qData,
            id: Date.now(),
            quizId,
            questionNumber: nextQuestionNum,
          };
          const newQuestions = [...q.questions, newQuestion];
          return {
            ...q,
            questions: newQuestions,
            questionsCount: newQuestions.length,
            totalMarks: newQuestions.reduce((acc, curr) => acc + curr.points, 0),
            updatedAt: new Date().toISOString(),
          };
        }
        return q;
      })
    );
  };

  const deleteQuestion = (quizId: number, questionId: number) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === quizId) {
          const filtered = q.questions.filter((item) => item.id !== questionId);
          const renumbered = filtered.map((item, idx) => ({ ...item, questionNumber: idx + 1 }));
          return {
            ...q,
            questions: renumbered,
            questionsCount: renumbered.length,
            totalMarks: renumbered.reduce((acc, curr) => acc + curr.points, 0),
            updatedAt: new Date().toISOString(),
          };
        }
        return q;
      })
    );
  };

  // Creator grading & feedback
  const gradeAttempt = (
    attemptId: number,
    feedbackNotes: string,
    gradeTag: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK'
  ) => {
    const feedback: CreatorReviewFeedback = {
      id: Date.now(),
      attemptId,
      creatorId: currentUser?.id || 2,
      creatorName: currentUser?.fullName || 'Prof. James Gosling',
      feedbackNotes,
      gradeTag,
      awardedAt: new Date().toISOString(),
    };

    setAttemptsHistory((prev) =>
      prev.map((a) => (a.id === attemptId ? { ...a, creatorFeedback: feedback } : a))
    );

    if (lastAttemptResult?.id === attemptId) {
      setLastAttemptResult((prev) => (prev ? { ...prev, creatorFeedback: feedback } : null));
    }
  };

  // Interactions between Participant and Creator
  const sendInteraction = (quizId: number, subject: string, message: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    const newInteraction: ParticipantCreatorInteraction = {
      id: Date.now(),
      participantId: currentUser?.id || 3,
      participantName: currentUser?.fullName || 'Rahul Sharma',
      participantEmail: currentUser?.email || 'participant@javaquiz.com',
      creatorId: quiz?.createdByUserId || 2,
      creatorName: quiz?.createdByName || 'Prof. James Gosling',
      quizId,
      quizTitle: quiz?.title || 'General Quiz Inquiry',
      subject,
      message,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    setInteractions((prev) => [newInteraction, ...prev]);
  };

  const replyToInteraction = (interactionId: number, replyText: string) => {
    setInteractions((prev) =>
      prev.map((item) =>
        item.id === interactionId
          ? {
              ...item,
              reply: replyText,
              repliedAt: new Date().toISOString(),
              repliedByName: currentUser?.fullName || 'Prof. James Gosling',
              status: 'RESOLVED',
            }
          : item
      )
    );
  };

  // Reminders
  const addQuizReminder = (quizId: number, reminderDateTime: string, note?: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    const newReminder: QuizReminder = {
      id: Date.now(),
      participantId: currentUser?.id || 3,
      quizId,
      quizTitle: quiz?.title || 'Java Assessment',
      reminderDateTime,
      note,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const deleteQuizReminder = (reminderId: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };

  const toggleQuizReminderCompleted = (reminderId: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  // System Settings & Alerts
  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addSystemAlert = (title: string, message: string, type: 'INFO' | 'WARNING' | 'CRITICAL') => {
    const newAlert: SystemAlert = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setSystemAlerts((prev) => [newAlert, ...prev]);
  };

  const dismissSystemAlert = (id: number) => {
    setSystemAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Leaderboard Computation
  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    const participantList = users.filter((u) => u.role === 'ROLE_PARTICIPANT');

    const entries: LeaderboardEntry[] = participantList.map((user) => {
      const userAttempts = attemptsHistory.filter((a) => a.userId === user.id);
      const attempted = userAttempts.length;
      const passed = userAttempts.filter((a) => a.isPassed).length;
      const totalPoints = userAttempts.reduce((sum, a) => sum + a.score, 0);
      const avgPercentage = attempted > 0 ? Math.round((userAttempts.reduce((s, a) => s + a.percentage, 0) / attempted) * 10) / 10 : 0;

      let badge = 'Novice Explorer';
      if (avgPercentage >= 90 && attempted >= 3) badge = 'Master Java Architect';
      else if (avgPercentage >= 75) badge = 'Advanced Developer';
      else if (attempted >= 1) badge = 'Rising Programmer';

      return {
        rank: 1,
        userId: user.id,
        userName: user.fullName,
        userEmail: user.email,
        quizzesAttempted: attempted,
        quizzesPassed: passed,
        totalPoints,
        averagePercentage: avgPercentage,
        badge,
      };
    });

    // Add sample participants if few entries exist to ensure a rich competitive leaderboard
    if (entries.length < 5) {
      entries.push(
        {
          rank: 1,
          userId: 101,
          userName: 'Vikram Mehta',
          userEmail: 'vikram@university.edu',
          quizzesAttempted: 5,
          quizzesPassed: 5,
          totalPoints: 480,
          averagePercentage: 96.0,
          badge: 'Master Java Architect',
        },
        {
          rank: 2,
          userId: 102,
          userName: 'Sneha Reddy',
          userEmail: 'sneha@engineering.ac.in',
          quizzesAttempted: 4,
          quizzesPassed: 4,
          totalPoints: 370,
          averagePercentage: 92.5,
          badge: 'Master Java Architect',
        },
        {
          rank: 3,
          userId: 103,
          userName: 'Arjun Das',
          userEmail: 'arjun@techschool.org',
          quizzesAttempted: 4,
          quizzesPassed: 3,
          totalPoints: 340,
          averagePercentage: 85.0,
          badge: 'Advanced Developer',
        }
      );
    }

    // Sort by total points and average score
    entries.sort((a, b) => b.totalPoints - a.totalPoints || b.averagePercentage - a.averagePercentage);

    // Assign ranking numbers
    return entries.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [users, attemptsHistory]);

  // Student stats computation
  const studentStats: StudentStats = useMemo(() => {
    const userAttempts = attemptsHistory.filter(
      (a) => currentUser && a.userId === currentUser.id
    );

    if (userAttempts.length === 0) {
      return {
        quizzesAttempted: 0,
        quizzesPassed: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpentSeconds: 0,
        categoryProficiency: {},
      };
    }

    const totalScorePct = userAttempts.reduce((acc, a) => acc + a.percentage, 0);
    const best = Math.max(...userAttempts.map((a) => a.percentage));
    const passed = userAttempts.filter((a) => a.isPassed).length;
    const totalTime = userAttempts.reduce((acc, a) => acc + a.timeTakenSeconds, 0);

    const categoryProficiency: Record<string, { attempted: number; avgPercentage: number }> = {};
    userAttempts.forEach((a) => {
      if (!categoryProficiency[a.categoryName]) {
        categoryProficiency[a.categoryName] = { attempted: 0, avgPercentage: 0 };
      }
      categoryProficiency[a.categoryName].attempted++;
    });

    Object.keys(categoryProficiency).forEach((cat) => {
      const catAttempts = userAttempts.filter((a) => a.categoryName === cat);
      const catAvg = catAttempts.reduce((s, a) => s + a.percentage, 0) / catAttempts.length;
      categoryProficiency[cat].avgPercentage = Math.round(catAvg);
    });

    return {
      quizzesAttempted: userAttempts.length,
      quizzesPassed: passed,
      averageScore: Math.round((totalScorePct / userAttempts.length) * 10) / 10,
      bestScore: Math.round(best * 10) / 10,
      totalTimeSpentSeconds: totalTime,
      categoryProficiency,
    };
  }, [attemptsHistory, currentUser]);

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.INTERACTIONS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    setQuizzes(INITIAL_QUIZZES);
    setUsers(INITIAL_USERS);
    setAttemptsHistory([]);
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    setSystemAlerts(INITIAL_SYSTEM_ALERTS);
    setInteractions(INITIAL_INTERACTIONS);
    setReminders(INITIAL_REMINDERS);
    setCurrentUser(DEMO_ADMIN);
  };

  return (
    <QuizContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        loginAsRole,
        loginAsDemoAdmin,
        loginAsDemoCreator,
        loginAsDemoParticipant,
        logout,
        registerUser,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        categories,
        quizzes,
        activeExam,
        lastAttemptResult,
        attemptsHistory,
        approveQuiz,
        rejectQuiz,
        startQuiz,
        selectAnswer,
        toggleFlagQuestion,
        goToQuestion,
        nextQuestion,
        prevQuestion,
        submitExam,
        cancelExam,
        setLastAttemptResult,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        toggleQuizStatus,
        addQuestionToQuiz,
        deleteQuestion,
        gradeAttempt,
        interactions,
        sendInteraction,
        replyToInteraction,
        reminders,
        addQuizReminder,
        deleteQuizReminder,
        toggleQuizReminderCompleted,
        systemSettings,
        updateSystemSettings,
        systemAlerts,
        addSystemAlert,
        dismissSystemAlert,
        leaderboard,
        studentStats,
        resetDemoData,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
