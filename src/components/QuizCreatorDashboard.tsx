import React, { useState } from 'react';
import {
  FilePlus2,
  CheckSquare,
  MessageSquare,
  History,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Award,
  Send,
  Eye,
  X,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Difficulty, Question, Quiz, QuizAttempt } from '../types/quiz';

export const QuizCreatorDashboard: React.FC = () => {
  const {
    currentUser,
    quizzes,
    categories,
    createQuiz,
    deleteQuiz,
    addQuestionToQuiz,
    deleteQuestion,
    attemptsHistory,
    gradeAttempt,
    interactions,
    replyToInteraction,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<'create' | 'results' | 'interactions' | 'history' | 'overview'>('create');

  // New Quiz form fields
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(70);

  // New question form fields for active quiz creation
  const [questionsList, setQuestionsList] = useState<Omit<Question, 'id' | 'quizId' | 'questionNumber'>[]>([]);
  const [qText, setQText] = useState('');
  const [qCode, setQCode] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctKey, setCorrectKey] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [qExp, setQExp] = useState('');
  const [qPoints, setQPoints] = useState(10);
  const [quizCreatedSuccess, setQuizCreatedSuccess] = useState(false);

  // Grading modal state
  const [gradingAttempt, setGradingAttempt] = useState<QuizAttempt | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [gradeTag, setGradeTag] = useState<'EXCELLENT' | 'GOOD' | 'NEEDS_WORK'>('GOOD');

  // Reply interaction modal state
  const [activeInteractionId, setActiveInteractionId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Selected Quiz to manage questions
  const [selectedQuizId, setSelectedQuizId] = useState<number>(quizzes[0]?.id || 1);

  // Filter creator's quizzes
  const creatorQuizzes = quizzes.filter((q) => q.createdByUserId === currentUser?.id || currentUser?.role === 'ROLE_CREATOR');

  // Handle adding a question to the draft quiz
  const handleAddQuestionToDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText || !optA || !optB || !optC || !optD) return;

    const newQ: Omit<Question, 'id' | 'quizId' | 'questionNumber'> = {
      questionText: qText,
      codeSnippet: qCode || undefined,
      codeLanguage: 'java',
      options: [
        { id: Date.now() + 1, optionKey: 'A', optionText: optA },
        { id: Date.now() + 2, optionKey: 'B', optionText: optB },
        { id: Date.now() + 3, optionKey: 'C', optionText: optC },
        { id: Date.now() + 4, optionKey: 'D', optionText: optD },
      ],
      correctOptionKey: correctKey,
      explanation: qExp,
      points: Number(qPoints),
      difficulty,
    };

    setQuestionsList([...questionsList, newQ]);

    // Reset inputs
    setQText('');
    setQCode('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setQExp('');
  };

  // Submit complete quiz
  const handleSubmitQuiz = () => {
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title.');
      return;
    }
    if (questionsList.length === 0) {
      alert('Please add at least 1 question to the quiz.');
      return;
    }

    createQuiz({
      title: quizTitle,
      description: quizDesc,
      categoryId,
      difficulty,
      durationMinutes,
      passingPercentage,
      questions: questionsList.map((q, idx) => ({
        ...q,
        id: Date.now() + idx,
        quizId: 0,
        questionNumber: idx + 1,
      })),
    });

    setQuizCreatedSuccess(true);
    setQuizTitle('');
    setQuizDesc('');
    setQuestionsList([]);
    setTimeout(() => {
      setQuizCreatedSuccess(false);
      setActiveTab('history');
    }, 1800);
  };

  // Grade participant attempt
  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (gradingAttempt) {
      gradeAttempt(gradingAttempt.id, feedbackNotes, gradeTag);
      setGradingAttempt(null);
      setFeedbackNotes('');
    }
  };

  // Send reply to participant interaction
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeInteractionId && replyText) {
      replyToInteraction(activeInteractionId, replyText);
      setActiveInteractionId(null);
      setReplyText('');
    }
  };

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Creator Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Curriculum Authoring Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quiz Creator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author and publish timed programming assessments, review and grade participant submissions, and answer participant questions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-900 font-medium">
          <UserCheck className="w-4 h-4 text-amber-600" />
          <span>Active Author: {currentUser?.fullName || 'Prof. James Gosling'}</span>
        </div>
      </div>

      {/* 5 Tabs as specified in prompt */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'create'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FilePlus2 className="w-4 h-4" />
          1. Quiz Creation
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'results'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          2. Quiz Results & Grading ({attemptsHistory.length})
        </button>

        <button
          onClick={() => setActiveTab('interactions')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'interactions'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          3. Participant Interactions ({interactions.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          4. Quiz History ({creatorQuizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          5. Performance Overview
        </button>
      </div>

      {/* TAB 1: QUIZ CREATION */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {quizCreatedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Quiz submitted successfully! Redirecting to Quiz History...</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Quiz Basic Details (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Assessment Metadata
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g. Java Concurrency & ForkJoin Pool"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={quizDesc}
                    onChange={(e) => setQuizDesc(e.target.value)}
                    placeholder="Syllabus, topics tested, and expected competencies"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="180"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Passing Mark (%)</label>
                    <input
                      type="number"
                      min="40"
                      max="100"
                      value={passingPercentage}
                      onChange={(e) => setPassingPercentage(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                {/* Staged questions preview */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-800">
                      Staged Questions ({questionsList.length})
                    </span>
                    <span className="text-slate-400">
                      {questionsList.reduce((acc, q) => acc + q.points, 0)} Total Marks
                    </span>
                  </div>

                  {questionsList.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center text-slate-400">
                      No questions staged yet. Author questions using the form on the right.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {questionsList.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                        >
                          <span className="truncate font-medium text-slate-800">
                            {idx + 1}. {q.questionText}
                          </span>
                          <button
                            onClick={() => setQuestionsList(questionsList.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
                >
                  Submit Quiz for Approval
                </button>
              </div>
            </div>

            {/* Right: Question Authoring Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Question Editor & Options
              </h3>

              <form onSubmit={handleAddQuestionToDraft} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Question Statement</label>
                  <textarea
                    rows={2}
                    required
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="State the problem clearly..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Java Code Snippet (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={qCode}
                    onChange={(e) => setQCode(e.target.value)}
                    placeholder="public class Solution { ... }"
                    className="w-full px-3 py-2 border border-slate-800 rounded-lg text-blue-100 bg-slate-950 font-mono text-xs"
                  />
                </div>

                {/* 4 Options */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">Four Multiple Choice Options</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">A</span>
                      <input
                        type="text"
                        required
                        placeholder="Option A"
                        value={optA}
                        onChange={(e) => setOptA(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">B</span>
                      <input
                        type="text"
                        required
                        placeholder="Option B"
                        value={optB}
                        onChange={(e) => setOptB(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">C</span>
                      <input
                        type="text"
                        required
                        placeholder="Option C"
                        value={optC}
                        onChange={(e) => setOptC(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">D</span>
                      <input
                        type="text"
                        required
                        placeholder="Option D"
                        value={optD}
                        onChange={(e) => setOptD(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Designate Correct Answer</label>
                    <select
                      value={correctKey}
                      onChange={(e) => setCorrectKey(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white font-bold"
                    >
                      <option value="A">Option A is Correct</option>
                      <option value="B">Option B is Correct</option>
                      <option value="C">Option C is Correct</option>
                      <option value="D">Option D is Correct</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Points</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={qPoints}
                      onChange={(e) => setQPoints(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Explanation & Solution Walkthrough</label>
                  <textarea
                    rows={2}
                    required
                    value={qExp}
                    onChange={(e) => setQExp(e.target.value)}
                    placeholder="Explain JVM semantics, memory details, or time complexity..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Question to Quiz
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUIZ RESULTS & GRADING */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Review Quiz Results & Qualitative Grading</h3>
            <p className="text-xs text-slate-500">
              Inspect participant submissions, evaluate strengths, and provide mentor feedback notes.
            </p>
          </div>

          {attemptsHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No participant test submissions recorded yet. Take an exam to populate grading logs.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Participant</th>
                    <th className="px-6 py-3.5">Quiz</th>
                    <th className="px-6 py-3.5">Automated Score</th>
                    <th className="px-6 py-3.5">Percentage</th>
                    <th className="px-6 py-3.5">Creator Feedback Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attemptsHistory.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{att.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{att.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {att.quizTitle}
                      </td>
                      <td className="px-6 py-4">
                        {att.score} / {att.maxScore} pts
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">{att.percentage}%</span>
                        <span
                          className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            att.isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {att.isPassed ? 'PASS' : 'FAIL'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {att.creatorFeedback ? (
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {att.creatorFeedback.gradeTag}
                            </span>
                            <div className="text-[11px] text-slate-500 line-clamp-1 italic">
                              "{att.creatorFeedback.feedbackNotes}"
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending Creator Notes</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setGradingAttempt(att);
                            setFeedbackNotes(att.creatorFeedback?.feedbackNotes || '');
                            setGradeTag(att.creatorFeedback?.gradeTag || 'GOOD');
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-xs transition-colors"
                        >
                          {att.creatorFeedback ? 'Update Feedback' : 'Grade & Feedback'}
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

      {/* TAB 3: PARTICIPANT INTERACTIONS */}
      {activeTab === 'interactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Participant Interactions & Doubts Inbox</h3>
            <p className="text-xs text-slate-500">
              Respond to participant questions and feedback on specific assessment questions.
            </p>
          </div>

          {interactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No participant inquiries or messages received.
            </div>
          ) : (
            <div className="space-y-4">
              {interactions.map((msg) => (
                <div
                  key={msg.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                >
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
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        From: {msg.participantName} ({msg.participantEmail}) · Quiz: {msg.quizTitle}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveInteractionId(msg.id);
                        setReplyText(msg.reply || '');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors shrink-0"
                    >
                      {msg.reply ? 'Edit Reply' : 'Send Reply'}
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                    <strong>Participant Question: </strong> {msg.message}
                  </div>

                  {msg.reply && (
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-950 leading-relaxed">
                      <strong>Creator Response ({msg.repliedByName}): </strong> {msg.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUIZ HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Quiz History & Approval Log</h3>
            <p className="text-xs text-slate-500">
              Audit log of all authored quizzes, questions count, and institutional administrator approval status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Quiz Title & Category</th>
                  <th className="px-6 py-3.5">Questions</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Pass Mark</th>
                  <th className="px-6 py-3.5">Approval Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creatorQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{quiz.title}</div>
                      <div className="text-[11px] text-slate-400">{quiz.categoryName} · {quiz.difficulty}</div>
                      {quiz.rejectionReason && (
                        <div className="text-[11px] text-rose-600 font-medium bg-rose-50 p-1.5 rounded mt-1">
                          {quiz.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {quiz.questionsCount} ({quiz.totalMarks} pts)
                    </td>
                    <td className="px-6 py-4 text-slate-600">{quiz.durationMinutes} min</td>
                    <td className="px-6 py-4 text-slate-600">{quiz.passingPercentage}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          quiz.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : quiz.approvalStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {quiz.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete quiz "${quiz.title}"?`)) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                        title="Delete quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PERFORMANCE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Quiz Engagement & Content Metrics</h3>
              <p className="text-xs text-slate-500">
                Performance indicators across quizzes authored by your curriculum team.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase">Authored Tests</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{creatorQuizzes.length}</div>
                <div className="text-[11px] text-slate-500">Across 6 categories</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase">Approved Quizzes</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {creatorQuizzes.filter((q) => q.approvalStatus === 'APPROVED').length}
                </div>
                <div className="text-[11px] text-slate-500">Live in catalog</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase">Participant Takers</span>
                <div className="text-2xl font-bold text-blue-700 mt-1">{attemptsHistory.length}</div>
                <div className="text-[11px] text-slate-500">Submitted evaluations</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase">Participant Doubts</span>
                <div className="text-2xl font-bold text-amber-700 mt-1">{interactions.length}</div>
                <div className="text-[11px] text-slate-500">Inbox questions</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Attempt Dialog */}
      {gradingAttempt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Grade & Review Submission</h3>
                <p className="text-xs text-slate-500">
                  {gradingAttempt.userName} · {gradingAttempt.quizTitle} ({gradingAttempt.percentage}%)
                </p>
              </div>
              <button onClick={() => setGradingAttempt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrading} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualitative Grade Tag</label>
                <select
                  value={gradeTag}
                  onChange={(e) => setGradeTag(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white font-bold"
                >
                  <option value="EXCELLENT">EXCELLENT (Outstanding mastery)</option>
                  <option value="GOOD">GOOD (Solid foundation, minor misses)</option>
                  <option value="NEEDS_WORK">NEEDS WORK (Review core concepts)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mentor Feedback & Guidance</label>
                <textarea
                  rows={4}
                  required
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Provide personalized advice on the participant's incorrect questions, recommended readings, or encouragement..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingAttempt(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply to Interaction Dialog */}
      {activeInteractionId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reply to Participant Question</h3>

            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <textarea
                rows={4}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Author clear explanation to address the participant's doubt..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveInteractionId(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
