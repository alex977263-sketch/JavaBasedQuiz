import React, { useState } from 'react';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Maximize2,
  Code,
  Check,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export const QuizEngine: React.FC = () => {
  const {
    activeExam,
    selectAnswer,
    toggleFlagQuestion,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    submitExam,
    cancelExam,
  } = useQuiz();

  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!activeExam) return null;

  const {
    quiz,
    shuffledQuestions,
    currentQuestionIndex,
    answers,
    flaggedQuestionIds,
    timeRemainingSeconds,
    totalDurationSeconds,
  } = activeExam;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;
  const currentAnswer = answers[currentQuestion.id] || null;
  const isFlagged = flaggedQuestionIds.includes(currentQuestion.id);

  // Time calculations
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = timeRemainingSeconds < 120; // less than 2 minutes

  // Progress metrics
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = flaggedQuestionIds.length;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOptionSelect = (key: 'A' | 'B' | 'C' | 'D') => {
    selectAnswer(currentQuestion.id, key);
  };

  const handleClearAnswer = () => {
    selectAnswer(currentQuestion.id, null);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmModal(false);
    submitExam();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
              {quiz.categoryName} · {quiz.difficulty}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
              {quiz.title}
            </h1>
          </div>
        </div>

        {/* Center / Right: Live Countdown Timer & Quit */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold transition-colors ${
              isTimeCritical
                ? 'bg-rose-950/70 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-blue-300'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400' : 'text-blue-400'}`} />
            <span>{formattedTime}</span>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to exit the exam? Your unsaved progress will be lost.')) {
                cancelExam();
              }
            }}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            Exit Exam
          </button>
        </div>
      </header>

      {/* Progress Strip */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-blue-500 h-1 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Main Examination Workspace */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="max-w-4xl w-full flex flex-col justify-between space-y-6">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-600 text-white">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-slate-400">
                ({currentQuestion.points} Points)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFlagQuestion(currentQuestion.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  isFlagged
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current text-amber-400' : ''}`} />
                <span>{isFlagged ? 'Flagged for Review' : 'Mark for Review'}</span>
              </button>

              {currentAnswer && (
                <button
                  onClick={handleClearAnswer}
                  className="text-xs text-slate-400 hover:text-rose-300 px-2 py-1 transition-colors"
                >
                  Clear Choice
                </button>
              )}
            </div>
          </div>

          {/* Question Content Body */}
          <div className="space-y-5">
            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {currentQuestion.questionText}
            </h2>

            {/* Code Snippet Box (Syntax Styled) */}
            {currentQuestion.codeSnippet && (
              <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    <span>Java Source</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(currentQuestion.codeSnippet!)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono text-blue-100 overflow-x-auto leading-relaxed">
                  <code>{currentQuestion.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Answer Options (A, B, C, D) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer === option.optionKey;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.optionKey)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 text-white'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-200'
                    }`}
                  >
                    {/* Option Indicator Ring */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                      }`}
                    >
                      {option.optionKey}
                    </div>

                    <div className="flex-1 pt-0.5 text-sm sm:text-base font-normal leading-snug">
                      {option.optionText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Question Navigation Palette (1..N) */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Question Palette
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> Answered ({answeredCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 border border-slate-600"></span> Unanswered ({unansweredCount})
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Flagged ({flaggedCount})
                </span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="flex flex-wrap gap-2">
              {shuffledQuestions.map((q, idx) => {
                const isCur = idx === currentQuestionIndex;
                const isAns = answers[q.id] !== null && answers[q.id] !== undefined;
                const isFlg = flaggedQuestionIds.includes(q.id);

                let btnClass = 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700';
                if (isAns) {
                  btnClass = 'bg-blue-600 border-blue-500 text-white';
                }
                if (isFlg) {
                  btnClass = 'bg-amber-500 border-amber-400 text-slate-950 font-bold';
                }
                if (isCur) {
                  btnClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-950';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-9 h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${btnClass}`}
                    title={`Go to question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Action Buttons (Previous, Next, Submit) */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirmModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog Modal */}
      {showSubmitConfirmModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Submit Exam</h3>
                <p className="text-xs text-slate-400">Confirm your answers before final evaluation</p>
              </div>
            </div>

            {/* Submission Status Summary */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span className="font-semibold text-white">{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Answered:</span>
                <span className="font-semibold">{answeredCount}</span>
              </div>
              {unansweredCount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Unanswered Questions:</span>
                  <span className="font-semibold">{unansweredCount}</span>
                </div>
              )}
              {flaggedCount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Flagged for Review:</span>
                  <span className="font-semibold">{flaggedCount}</span>
                </div>
              )}
              <div className="flex justify-between text-blue-400 pt-1 border-t border-slate-800">
                <span>Time Remaining:</span>
                <span className="font-mono font-semibold">{formattedTime}</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  You have {unansweredCount} unanswered questions. Unanswered questions will receive 0 marks.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Back to Exam
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-colors"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
