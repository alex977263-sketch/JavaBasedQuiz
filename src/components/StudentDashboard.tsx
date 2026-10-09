import React from 'react';
import {
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Award,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizAttempt } from '../types/quiz';

interface StudentDashboardProps {
  onStartQuiz: (quizId: number) => void;
  onViewReview: (attempt: QuizAttempt) => void;
  onBrowseQuizzes: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartQuiz,
  onViewReview,
  onBrowseQuizzes,
}) => {
  const { currentUser, studentStats, attemptsHistory, quizzes } = useQuiz();

  const userAttempts = attemptsHistory.filter(
    (a) => currentUser && a.userId === currentUser.id
  );

  const recentAttempts = userAttempts.slice(0, 5);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec}s`;
    return `${mins}m ${remainingSec}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Spring & Core Java Learning Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.fullName || 'Platform Administrator'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Sharpen your core Java proficiency, object-oriented principles, multithreading, and algorithmic intuition with real-time feedback and server-side verified scoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBrowseQuizzes}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Take a Test
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quizzes Taken */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tests Attempted
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {studentStats.quizzesAttempted}
            </span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{studentStats.quizzesPassed} passed</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Score
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {studentStats.averageScore}%
            </span>
            <span className="text-xs text-slate-500">accuracy</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across all submitted tests
          </div>
        </div>

        {/* Best Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Best Score
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {studentStats.bestScore}%
            </span>
            <span className="text-xs text-amber-600 font-semibold">Peak</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Personal record
          </div>
        </div>

        {/* Time Practiced */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Time Practiced
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {formatSeconds(studentStats.totalTimeSpentSeconds)}
            </span>
            <span className="text-xs text-slate-500">total</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Active examination time
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Attempts (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Test Attempts</h2>
              <p className="text-xs text-slate-500">Review your past performance and explanations</p>
            </div>
            {recentAttempts.length > 0 && (
              <span className="text-xs text-slate-400">
                Showing {recentAttempts.length} recent
              </span>
            )}
          </div>

          {recentAttempts.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">No quizzes attempted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a topic from the quiz catalog to test your Java knowledge and record your first score.
              </p>
              <button
                onClick={onBrowseQuizzes}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Start First Quiz
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 hover:border-blue-300 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{attempt.categoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatSeconds(attempt.timeTakenSeconds)}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {attempt.quizTitle}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="text-emerald-700 font-medium">
                        ✓ {attempt.correctAnswersCount} Correct
                      </span>
                      <span className="text-red-700 font-medium">
                        ✗ {attempt.incorrectAnswersCount} Incorrect
                      </span>
                      {attempt.unansweredCount > 0 && (
                        <span className="text-slate-500">
                          - {attempt.unansweredCount} Unanswered
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col sm:items-end justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-slate-900">
                        {attempt.percentage}%
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          attempt.isPassed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {attempt.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewReview(attempt)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Review Answers →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recommended Quizzes & Categories */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Featured Java Tests</h3>
              <button
                onClick={onBrowseQuizzes}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {quizzes.slice(0, 3).map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{quiz.categoryName}</span>
                    <span className="font-semibold text-slate-700">{quiz.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {quiz.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      {quiz.questionsCount} questions · {quiz.durationMinutes} min
                    </span>
                    <button
                      onClick={() => onStartQuiz(quiz.id)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 text-white text-[11px] font-semibold rounded transition-colors"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Study Tip Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200/80 rounded-xl p-5 space-y-2 text-slate-800">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Java Certification Tip</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Remember that in Java, string literals with identical character sequences share memory in the <strong>String Constant Pool</strong>. When created with <code>new String()</code>, separate heap objects are allocated. Always compare strings using <code>.equals()</code> rather than <code>==</code>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
