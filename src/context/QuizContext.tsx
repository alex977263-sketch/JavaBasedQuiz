import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Quiz,
  Category,
  QuizAttempt,
  QuestionResultReview,
  StudentStats,
  Question,
  Difficulty,
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
};

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
  loginAsDemoAdmin: () => void;
  logout: () => void;
  registerUser: (fullName: string, email: string) => void;

  categories: Category[];
  quizzes: Quiz[];
  activeExam: ActiveExamState | null;
  lastAttemptResult: QuizAttempt | null;
  attemptsHistory: QuizAttempt[];

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

  // Admin actions
  createQuiz: (quizData: Partial<Quiz>) => Quiz;
  updateQuiz: (id: number, quizData: Partial<Quiz>) => void;
  deleteQuiz: (id: number) => void;
  toggleQuizStatus: (id: number) => void;
  addQuestionToQuiz: (quizId: number, question: Omit<Question, 'id' | 'quizId' | 'questionNumber'>) => void;
  deleteQuestion: (quizId: number, questionId: number) => void;
  resetDemoData: () => void;

  // Computed student stats
  studentStats: StudentStats;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'javaquiz_user_v3',
  QUIZZES: 'javaquiz_quizzes_v3',
  ATTEMPTS: 'javaquiz_attempts_v3',
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state - defaults to Administrator
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.fullName === 'Alex Vance' ||
          parsed.fullName?.includes('Sarah Chen') ||
          parsed.username === 'alex_student'
        ) {
          return DEMO_ADMIN;
        }
        return parsed;
      }
      return DEMO_ADMIN;
    } catch {
      return DEMO_ADMIN;
    }
  });

  // Quizzes list state
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  // Categories list
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Attempts history state
  const [attemptsHistory, setAttemptsHistory] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active quiz exam state
  const [activeExam, setActiveExam] = useState<ActiveExamState | null>(null);
  const [lastAttemptResult, setLastAttemptResult] = useState<QuizAttempt | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attemptsHistory));
  }, [attemptsHistory]);

  // Timer loop for active exam
  useEffect(() => {
    if (!activeExam) return;

    const interval = setInterval(() => {
      setActiveExam((prev) => {
        if (!prev) return null;
        if (prev.timeRemainingSeconds <= 1) {
          // Time expired! Auto submit will trigger
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

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (activeExam && activeExam.timeRemainingSeconds === 0) {
      submitExam();
    }
  }, [activeExam?.timeRemainingSeconds]);

  // Auth functions
  const loginAsDemoAdmin = () => {
    setCurrentUser(DEMO_ADMIN);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (fullName: string, email: string) => {
    const newUser: User = {
      id: Date.now(),
      username: email.split('@')[0],
      email,
      fullName,
      role: 'ROLE_ADMIN',
      createdAt: new Date().toISOString(),
      collegeOrCompany: 'Platform Administrator / Educator',
    };
    setCurrentUser(newUser);
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

  // Secure Server-like score calculation
  const submitExam = (): QuizAttempt => {
    if (!activeExam) {
      throw new Error('No active exam to submit');
    }

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

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100 * 100) / 100 : 0;
    const isPassed = percentage >= quiz.passingPercentage;

    const newAttempt: QuizAttempt = {
      id: Date.now(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      categoryName: quiz.categoryName,
      difficulty: quiz.difficulty,
      userId: currentUser?.id || 999,
      userName: currentUser?.fullName || 'Anonymous Student',
      userEmail: currentUser?.email || 'student@javaquiz.com',
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

  // Admin Actions
  const createQuiz = (data: Partial<Quiz>): Quiz => {
    const category = categories.find((c) => c.id === data.categoryId) || categories[0];
    const newQuiz: Quiz = {
      id: Date.now(),
      title: data.title || 'Untitled Java Quiz',
      slug: (data.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: data.description || '',
      categoryId: category.id,
      categoryName: category.name,
      difficulty: data.difficulty || 'MEDIUM',
      durationMinutes: data.durationMinutes || 15,
      passingPercentage: data.passingPercentage || 70,
      isActive: data.isActive !== undefined ? data.isActive : true,
      questionsCount: data.questions?.length || 0,
      totalMarks: data.questions?.reduce((acc, q) => acc + q.points, 0) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: data.questions || [],
    };

    setQuizzes((prev) => [newQuiz, ...prev]);
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
          // Renumber
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

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setQuizzes(INITIAL_QUIZZES);
    setAttemptsHistory([]);
    setCurrentUser(DEMO_ADMIN);
  };

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

  return (
    <QuizContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAsDemoAdmin,
        logout,
        registerUser,
        categories,
        quizzes,
        activeExam,
        lastAttemptResult,
        attemptsHistory,
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
        resetDemoData,
        studentStats,
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
