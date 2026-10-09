import React, { useState } from 'react';
import {
  History,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  BookOpen,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizAttempt } from '../types/quiz';

interface AttemptsHistoryProps {
  onViewReview: (attempt: QuizAttempt) => void;
  onRetakeQuiz: (quizId: number) => void;
  onBrowseQuizzes: () => void;
}

export const AttemptsHistory: React.FC<AttemptsHistoryProps> = ({
  onViewReview,
  onRetakeQuiz,
  onBrowseQuizzes,
}) => {
  const { attemptsHistory, currentUser } = useQuiz();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');

  // Filter attempts belonging to user (or all if admin)
  const userAttempts = attemptsHistory.filter((a) => {
    if (currentUser?.role === 'ROLE_ADMIN') return true;
    return a.userId === currentUser?.id;
  });

  const filteredAttempts = userAttempts.filter((a) => {
    if (statusFilter === 'PASSED' && !a.isPassed) return false;
    if (statusFilter === 'FAILED' && a.isPassed) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.quizTitle.toLowerCase().includes(q) ||
        a.categoryName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec}s`;
    return `${mins}m ${remainingSec}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessment Attempt History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past scores, analyze accuracy trends, and revisit explanations for answered questions.
          </p>
        </div>

        <button
          onClick={onBrowseQuizzes}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start"
        >
          <BookOpen className="w-4 h-4" />
          Take New Test
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter past attempts by title or category..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
          {(['ALL', 'PASSED', 'FAILED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All' : st === 'PASSED' ? 'Passed' : 'Failed'}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List View */}
      {filteredAttempts.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No attempts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't completed any assessments matching the current filter.
          </p>
          <button
            onClick={onBrowseQuizzes}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Browse Quiz Catalog
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Quiz / Subject</th>
                  <th className="px-6 py-3.5">Submitted At</th>
                  <th className="px-6 py-3.5">Time Spent</th>
                  <th className="px-6 py-3.5">Score Breakdown</th>
                  <th className="px-6 py-3.5">Percentage</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {attempt.quizTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {attempt.categoryName} · {attempt.difficulty}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(attempt.submittedAt).toLocaleDateString()} {new Date(attempt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {formatSeconds(attempt.timeTakenSeconds)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900 font-semibold">
                        {attempt.score} / {attempt.maxScore} pts
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {attempt.correctAnswersCount} correct, {attempt.incorrectAnswersCount} incorrect
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {attempt.percentage}%
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          attempt.isPassed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {attempt.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => onViewReview(attempt)}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
                        title="View Detailed Question Explanations"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => onRetakeQuiz(attempt.quizId)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
                        title="Retake Quiz"
                      >
                        Retake
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
