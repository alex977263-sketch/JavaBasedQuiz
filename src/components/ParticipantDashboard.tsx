import React, { useState } from 'react';
import {
  History,
  BarChart2,
  MessageSquare,
  BellRing,
  Trophy,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Send,
  Eye,
  Award,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizAttempt } from '../types/quiz';

interface ParticipantDashboardProps {
  onStartQuiz: (quizId: number) => void;
  onViewReview: (attempt: QuizAttempt) => void;
  onBrowseQuizzes: () => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  onStartQuiz,
  onViewReview,
  onBrowseQuizzes,
}) => {
  const {
    currentUser,
    attemptsHistory,
    studentStats,
    interactions,
    sendInteraction,
    reminders,
    addQuizReminder,
    deleteQuizReminder,
    toggleQuizReminderCompleted,
    leaderboard,
    quizzes,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<'history' | 'report' | 'interactions' | 'reminders' | 'leaderboard'>('history');

  // Filter participant's own attempts
  const userAttempts = attemptsHistory.filter(
    (a) => currentUser && a.userId === currentUser.id
  );

  // Filter participant's own interactions
  const userInteractions = interactions.filter(
    (item) => currentUser && item.participantId === currentUser.id
  );

  // Filter participant's reminders
  const userReminders = reminders.filter(
    (r) => currentUser && r.participantId === currentUser.id
  );

  // New Interaction / Doubt state
  const [showNewInteractionModal, setShowNewInteractionModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number>(quizzes[0]?.id || 1);
  const [doubtSubject, setDoubtSubject] = useState('');
  const [doubtMessage, setDoubtMessage] = useState('');
  const [interactionSuccess, setInteractionSuccess] = useState(false);

  // New Reminder state
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderQuizId, setReminderQuizId] = useState<number>(quizzes[0]?.id || 1);
  const [reminderDateTime, setReminderDateTime] = useState('');
  const [reminderNote, setReminderNote] = useState('');

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins === 0) return `${remainingSec}s`;
    return `${mins}m ${remainingSec}s`;
  };

  const handleSendDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtSubject || !doubtMessage) return;

    sendInteraction(selectedQuizId, doubtSubject, doubtMessage);
    setInteractionSuccess(true);
    setDoubtSubject('');
    setDoubtMessage('');
    setTimeout(() => {
      setInteractionSuccess(false);
      setShowNewInteractionModal(false);
    }, 1500);
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderDateTime) return;

    addQuizReminder(reminderQuizId, reminderDateTime, reminderNote);
    setShowReminderModal(false);
    setReminderNote('');
    setReminderDateTime('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-blue-900/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Participant Assessment Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser?.fullName || 'Participant'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track your test submissions, analyze topic weaknesses, interact with quiz creators, and compete on the global leaderboard.
            </p>
          </div>

          <button
            onClick={onBrowseQuizzes}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            Take a Quiz
          </button>
        </div>
      </div>

      {/* 5 Tabs as specified in prompt */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          1. Quiz Participation History ({userAttempts.length})
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'report'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          2. Performance Report
        </button>

        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'interactions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          3. Interaction History ({userInteractions.length})
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reminders'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-4 h-4" />
          4. Quiz Reminders ({userReminders.length})
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'leaderboard'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          5. Leaderboard
        </button>
      </div>

      {/* TAB 1: QUIZ PARTICIPATION HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Exam Participation Log</h3>
              <p className="text-xs text-slate-500">
                Log of all tests completed, scores achieved, time taken, and creator reviews.
              </p>
            </div>
            <button
              onClick={onBrowseQuizzes}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Browse Catalog →
            </button>
          </div>

          {userAttempts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <p>You have not attempted any quizzes yet.</p>
              <button
                onClick={onBrowseQuizzes}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-xs"
              >
                Take Your First Quiz
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Quiz / Subject</th>
                    <th className="px-6 py-3.5">Date Attempted</th>
                    <th className="px-6 py-3.5">Score</th>
                    <th className="px-6 py-3.5">Percentage</th>
                    <th className="px-6 py-3.5">Result</th>
                    <th className="px-6 py-3.5">Creator Feedback</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{attempt.quizTitle}</div>
                        <div className="text-[11px] text-slate-400">{attempt.categoryName} · {attempt.difficulty}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {new Date(attempt.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                        {attempt.score} / {attempt.maxScore} pts
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                        {attempt.percentage}%
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
                      <td className="px-6 py-4">
                        {attempt.creatorFeedback ? (
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {attempt.creatorFeedback.gradeTag}
                            </span>
                            <div className="text-[11px] text-slate-600 line-clamp-1 italic">
                              "{attempt.creatorFeedback.feedbackNotes}"
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => onViewReview(attempt)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-200 transition-colors"
                        >
                          Review Answers
                        </button>
                        <button
                          onClick={() => onStartQuiz(attempt.quizId)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 transition-colors"
                        >
                          Retake
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERFORMANCE REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Key KPI summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Tests Completed</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{studentStats.quizzesAttempted}</div>
              <div className="text-xs text-emerald-600 mt-1">{studentStats.quizzesPassed} passed successfully</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Average Percentage</span>
              <div className="text-3xl font-extrabold text-indigo-700 mt-1">{studentStats.averageScore}%</div>
              <div className="text-xs text-slate-400 mt-1">Across all completed attempts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Personal Peak Score</span>
              <div className="text-3xl font-extrabold text-amber-600 mt-1">{studentStats.bestScore}%</div>
              <div className="text-xs text-amber-700 mt-1">Best recorded result</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">Time Practiced</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">{formatSeconds(studentStats.totalTimeSpentSeconds)}</div>
              <div className="text-xs text-slate-400 mt-1">Under exam conditions</div>
            </div>
          </div>

          {/* Detailed Category Strength & Feedback */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Subject Mastery & Category Breakdown
            </h3>

            {Object.keys(studentStats.categoryProficiency).length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                Take tests in different categories to generate personalized subject proficiency metrics.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(studentStats.categoryProficiency).map(([catName, data]) => (
                  <div key={catName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span>{catName} ({data.attempted} tests)</span>
                      <span>{data.avgPercentage}% Accuracy</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${
                          data.avgPercentage >= 80 ? 'bg-emerald-600' : data.avgPercentage >= 65 ? 'bg-blue-600' : 'bg-amber-500'
                        }`}
                        style={{ width: `${data.avgPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTION HISTORY */}
      {activeTab === 'interactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Communication with Quiz Creators</h3>
              <p className="text-xs text-slate-500">
                Ask questions, seek clarifications on answers, and read creator guidance.
              </p>
            </div>
            <button
              onClick={() => setShowNewInteractionModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              Ask a Doubt / Send Feedback
            </button>
          </div>

          {userInteractions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No messages sent yet. Have a doubt about a quiz problem? Click "Ask a Doubt" to message the creator.
            </div>
          ) : (
            <div className="space-y-4">
              {userInteractions.map((msg) => (
                <div key={msg.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{msg.subject}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            msg.status === 'RESOLVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Quiz: {msg.quizTitle} · To: {msg.creatorName || 'Quiz Creator'} · Sent {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                    <strong>Your Message: </strong> {msg.message}
                  </div>

                  {msg.reply ? (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 leading-relaxed">
                      <strong>Creator Reply ({msg.repliedByName}): </strong> {msg.reply}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      ⏳ Awaiting response from quiz creator...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUIZ REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Scheduled Quiz Reminders</h3>
              <p className="text-xs text-slate-500">
                Plan your preparation schedule and set alerts for upcoming assessments.
              </p>
            </div>
            <button
              onClick={() => setShowReminderModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              Set Quiz Reminder
            </button>
          </div>

          {userReminders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No reminders scheduled. Set a reminder for tests you want to tackle this week.
            </div>
          ) : (
            <div className="space-y-3">
              {userReminders.map((r) => (
                <div
                  key={r.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs transition-colors ${
                    r.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-blue-50/40 border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={r.isCompleted}
                      onChange={() => toggleQuizReminderCompleted(r.id)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div>
                      <h4 className={`font-bold text-sm ${r.isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {r.quizTitle}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-blue-600 inline" />
                        <span>Scheduled: {new Date(r.reminderDateTime).toLocaleString()}</span>
                        {r.note && <span>· Note: "{r.note}"</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteQuizReminder(r.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Overall Rankings & Participant Leaderboard</h3>
            <p className="text-xs text-slate-500">
              Rankings determined by total earned score points, passing rate, and consistent mastery.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Rank</th>
                  <th className="px-6 py-3.5">Participant</th>
                  <th className="px-6 py-3.5">Quizzes Passed</th>
                  <th className="px-6 py-3.5">Total Points</th>
                  <th className="px-6 py-3.5">Average Accuracy</th>
                  <th className="px-6 py-3.5">Honorary Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((entry) => {
                  const isCurrent = currentUser?.id === entry.userId;

                  return (
                    <tr
                      key={entry.userId}
                      className={isCurrent ? 'bg-blue-50/70 font-bold text-blue-950' : 'hover:bg-slate-50'}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              entry.rank === 1
                                ? 'bg-amber-400 text-slate-950 shadow-xs'
                                : entry.rank === 2
                                ? 'bg-slate-300 text-slate-900 shadow-xs'
                                : entry.rank === 3
                                ? 'bg-amber-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {entry.userName} {isCurrent && <span className="text-[11px] text-blue-600">(You)</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{entry.userEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        {entry.quizzesPassed} / {entry.quizzesAttempted} tests
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">
                        {entry.totalPoints} pts
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {entry.averagePercentage}%
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {entry.badge}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ask Doubt Modal */}
      {showNewInteractionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-slate-900">Ask a Question / Send Doubt to Creator</h3>

            {interactionSuccess ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Question sent to quiz creator inbox!</span>
              </div>
            ) : (
              <form onSubmit={handleSendDoubt} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Related Quiz Assessment</label>
                  <select
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  >
                    {quizzes.map((q) => (
                      <option key={q.id} value={q.id}>{q.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Question Number</label>
                  <input
                    type="text"
                    required
                    value={doubtSubject}
                    onChange={(e) => setDoubtSubject(e.target.value)}
                    placeholder="e.g. Q4 String Constant Pool Explanation"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Message Details</label>
                  <textarea
                    rows={4}
                    required
                    value={doubtMessage}
                    onChange={(e) => setDoubtMessage(e.target.value)}
                    placeholder="Describe your doubt or confusion in detail..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewInteractionModal(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Question
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Set Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Schedule Quiz Reminder</h3>

            <form onSubmit={handleAddReminder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quiz</label>
                <select
                  value={reminderQuizId}
                  onChange={(e) => setReminderQuizId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                >
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reminder Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Personal Note (Optional)</label>
                <input
                  type="text"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  placeholder="e.g. Revise Binary Search Tree rotations first"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
