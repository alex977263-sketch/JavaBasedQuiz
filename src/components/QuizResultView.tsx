import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  LayoutDashboard,
  Code,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { QuizAttempt } from '../types/quiz';

interface QuizResultViewProps {
  attempt: QuizAttempt;
  onRetakeQuiz: (quizId: number) => void;
  onBackToDashboard: () => void;
  onBrowseQuizzes: () => void;
}

export const QuizResultView: React.FC<QuizResultViewProps> = ({
  attempt,
  onRetakeQuiz,
  onBackToDashboard,
  onBrowseQuizzes,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'CORRECT' | 'INCORRECT' | 'UNANSWERED'>('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (attempt.isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [attempt.isPassed]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec} seconds`;
    return `${mins} min ${remainingSec} sec`;
  };

  const toggleExpand = (questionId: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const filteredReviews = attempt.reviews.filter((r) => {
    if (filterMode === 'CORRECT') return r.isCorrect;
    if (filterMode === 'INCORRECT') return !r.isCorrect && !r.isUnanswered;
    if (filterMode === 'UNANSWERED') return r.isUnanswered;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Result Hero Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border ${
          attempt.isPassed
            ? 'bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-emerald-800/40'
            : 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border-rose-800/40'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Assessment Performance Report</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {attempt.quizTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Evaluated on {new Date(attempt.submittedAt).toLocaleString()} · Duration: {formatSeconds(attempt.timeTakenSeconds)}
            </p>
          </div>

          {/* Pass / Fail Score Badge */}
          <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-white/10 self-start md:self-auto">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Final Percentage</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {attempt.percentage}%
              </div>
              <div className="text-[11px] text-slate-400">
                Passing Mark: {attempt.passingPercentage}%
              </div>
            </div>

            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wider uppercase border ${
                attempt.isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
              }`}
            >
              {attempt.isPassed ? 'PASSED' : 'NEEDS PRACTICE'}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Score Earned</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {attempt.score} <span className="text-xs text-slate-400 font-normal">/ {attempt.maxScore}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Total points</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-emerald-600 uppercase">Correct</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {attempt.correctAnswersCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Math.round((attempt.correctAnswersCount / attempt.totalQuestions) * 100)}% accuracy
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-rose-600 uppercase">Incorrect</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {attempt.incorrectAnswersCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Needs review</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Unanswered</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">
            {attempt.unansweredCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Skipped</div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRetakeQuiz(attempt.quizId)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retake Quiz
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            My Dashboard
          </button>
        </div>

        <button
          onClick={onBrowseQuizzes}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
        >
          Explore More Quizzes <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Question-By-Question Detailed Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Comprehensive Solutions & Explanations</h2>
            <p className="text-xs text-slate-500">
              Review correct options, compare your choices, and understand Java semantics.
            </p>
          </div>

          {/* Filter Reviews Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(['ALL', 'CORRECT', 'INCORRECT', 'UNANSWERED'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  filterMode === mode
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'ALL' ? 'All' : mode.charAt(0) + mode.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const isExpanded = expandedQuestions[review.questionId] !== false; // default open

            return (
              <div
                key={review.questionId}
                className={`bg-white rounded-xl border transition-all overflow-hidden shadow-xs ${
                  review.isCorrect
                    ? 'border-emerald-200 hover:border-emerald-300'
                    : review.isUnanswered
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-rose-200 hover:border-rose-300'
                }`}
              >
                {/* Question Header Strip */}
                <div
                  onClick={() => toggleExpand(review.questionId)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 select-none"
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="pt-0.5">
                      {review.isCorrect ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : review.isUnanswered ? (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">
                          Question {review.questionNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{review.pointsAwarded} / {review.maxPoints} pts</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-semibold ${
                            review.isCorrect
                              ? 'text-emerald-700'
                              : review.isUnanswered
                              ? 'text-slate-600'
                              : 'text-rose-700'
                          }`}
                        >
                          {review.isCorrect
                            ? 'Correct'
                            : review.isUnanswered
                            ? 'Unanswered'
                            : 'Incorrect'}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                        {review.questionText}
                      </h3>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-1 space-y-4 border-t border-slate-100">
                    {/* Code snippet if any */}
                    {review.codeSnippet && (
                      <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 overflow-x-auto">
                        <pre className="text-xs font-mono text-blue-100 leading-relaxed">
                          <code>{review.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Options list showing student selection vs correct selection */}
                    <div className="space-y-2 pt-1">
                      {review.options.map((opt) => {
                        const isChosen = review.studentSelectedKey === opt.optionKey;
                        const isTheCorrectOne = review.correctOptionKey === opt.optionKey;

                        let cardStyle = 'border-slate-200 bg-slate-50 text-slate-700';
                        let badgeText = '';

                        if (isTheCorrectOne) {
                          cardStyle = 'border-emerald-300 bg-emerald-50 text-emerald-950 font-medium';
                          badgeText = 'Correct Answer';
                        }
                        if (isChosen && !isTheCorrectOne) {
                          cardStyle = 'border-rose-300 bg-rose-50 text-rose-950';
                          badgeText = 'Your Answer (Incorrect)';
                        }
                        if (isChosen && isTheCorrectOne) {
                          badgeText = 'Your Answer (Correct)';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${cardStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-800 shrink-0">
                                {opt.optionKey}
                              </span>
                              <span>{opt.optionText}</span>
                            </div>

                            {badgeText && (
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${
                                  isTheCorrectOne
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-rose-600 text-white'
                                }`}
                              >
                                {badgeText}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 p-4 space-y-1 text-xs">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Concept & Explanation</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed pt-1">
                        {review.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
