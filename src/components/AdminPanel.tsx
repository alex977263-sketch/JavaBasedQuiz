import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  EyeOff,
  Users,
  Award,
  Layers,
  BookOpen,
  Code,
  FileQuestion,
  HelpCircle,
  Save,
  X,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Quiz, Question, Difficulty } from '../types/quiz';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    quizzes,
    categories,
    attemptsHistory,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    toggleQuizStatus,
    addQuestionToQuiz,
    deleteQuestion,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<'quizzes' | 'questions' | 'reports'>('quizzes');

  // Modals state
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // New Quiz form fields
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    categoryId: 1,
    difficulty: 'MEDIUM' as Difficulty,
    durationMinutes: 15,
    passingPercentage: 70,
  });

  // Selected Quiz for Question Management
  const [selectedQuizIdForQuestions, setSelectedQuizIdForQuestions] = useState<number>(quizzes[0]?.id || 1);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  // New Question form fields
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    codeSnippet: '',
    codeLanguage: 'java',
    points: 10,
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOptionKey: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
    difficulty: 'MEDIUM' as Difficulty,
  });

  // Role validation check
  if (currentUser?.role !== 'ROLE_ADMIN') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          The administrative control panel is restricted to authenticated users with <code>ROLE_ADMIN</code> authority. Please log in as an administrator to manage questions and quizzes.
        </p>
      </div>
    );
  }

  // Handle Save Quiz (Create or Edit)
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, {
        title: quizForm.title,
        description: quizForm.description,
        categoryId: quizForm.categoryId,
        difficulty: quizForm.difficulty,
        durationMinutes: quizForm.durationMinutes,
        passingPercentage: quizForm.passingPercentage,
      });
      setEditingQuiz(null);
    } else {
      createQuiz({
        title: quizForm.title,
        description: quizForm.description,
        categoryId: quizForm.categoryId,
        difficulty: quizForm.difficulty,
        durationMinutes: quizForm.durationMinutes,
        passingPercentage: quizForm.passingPercentage,
        questions: [],
      });
      setShowCreateQuizModal(false);
    }

    setQuizForm({
      title: '',
      description: '',
      categoryId: 1,
      difficulty: 'MEDIUM',
      durationMinutes: 15,
      passingPercentage: 70,
    });
  };

  // Handle Add Question
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    addQuestionToQuiz(selectedQuizIdForQuestions, {
      questionText: questionForm.questionText,
      codeSnippet: questionForm.codeSnippet || undefined,
      codeLanguage: questionForm.codeLanguage,
      points: Number(questionForm.points),
      difficulty: questionForm.difficulty,
      correctOptionKey: questionForm.correctOptionKey,
      explanation: questionForm.explanation,
      options: [
        { id: Date.now() + 1, optionKey: 'A', optionText: questionForm.optionA },
        { id: Date.now() + 2, optionKey: 'B', optionText: questionForm.optionB },
        { id: Date.now() + 3, optionKey: 'C', optionText: questionForm.optionC },
        { id: Date.now() + 4, optionKey: 'D', optionText: questionForm.optionD },
      ],
    });

    setShowAddQuestionModal(false);
    setQuestionForm({
      questionText: '',
      codeSnippet: '',
      codeLanguage: 'java',
      points: 10,
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOptionKey: 'A',
      explanation: '',
      difficulty: 'MEDIUM',
    });
  };

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizIdForQuestions) || quizzes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Administrator Control Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Quiz Management & Exam Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author curriculum questions, adjust timers, configure pass thresholds, and review student attempt logs.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingQuiz(null);
            setQuizForm({
              title: '',
              description: '',
              categoryId: 1,
              difficulty: 'MEDIUM',
              durationMinutes: 15,
              passingPercentage: 70,
            });
            setShowCreateQuizModal(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Create New Quiz
        </button>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            activeTab === 'quizzes'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Quizzes Catalog ({quizzes.length})
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            activeTab === 'questions'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Question Bank Manager
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${
            activeTab === 'reports'
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Student Attempts Audit ({attemptsHistory.length})
        </button>
      </div>

      {/* TAB 1: Quizzes Table */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-4">Title & Category</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Questions</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Pass Mark</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{quiz.title}</div>
                      <div className="text-[11px] text-slate-400">{quiz.categoryName}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{quiz.difficulty}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900">{quiz.questionsCount}</span>
                      <span className="text-slate-400 text-[11px]"> ({quiz.totalMarks} pts)</span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {quiz.durationMinutes} min
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {quiz.passingPercentage}%
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleQuizStatus(quiz.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                          quiz.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {quiz.isActive ? 'Active (Published)' : 'Draft (Inactive)'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedQuizIdForQuestions(quiz.id);
                          setActiveTab('questions');
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold"
                        title="Manage Questions"
                      >
                        Questions
                      </button>

                      <button
                        onClick={() => {
                          setEditingQuiz(quiz);
                          setQuizForm({
                            title: quiz.title,
                            description: quiz.description,
                            categoryId: quiz.categoryId,
                            difficulty: quiz.difficulty,
                            durationMinutes: quiz.durationMinutes,
                            passingPercentage: quiz.passingPercentage,
                          });
                          setShowCreateQuizModal(true);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                        title="Edit Quiz"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete quiz "${quiz.title}"? This will remove all its questions.`)) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600"
                        title="Delete Quiz"
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

      {/* TAB 2: Questions Bank Manager */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Quiz Selector bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Selected Quiz:</span>
              <select
                value={selectedQuizIdForQuestions}
                onChange={(e) => setSelectedQuizIdForQuestions(Number(e.target.value))}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.title} ({q.questionsCount} questions)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </button>
          </div>

          {/* Questions list for selected quiz */}
          {selectedQuiz && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {selectedQuiz.questions.length} questions for "{selectedQuiz.title}"
                </span>
                <span>Total Points: {selectedQuiz.totalMarks}</span>
              </div>

              {selectedQuiz.questions.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-xs text-slate-500">
                  No questions yet for this quiz. Click "Add Question" to create one.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedQuiz.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900">
                              {q.questionText}
                            </h4>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {q.points} Points · Correct Option: {q.correctOptionKey}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm('Delete this question?')) {
                              deleteQuestion(selectedQuiz.id, q.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {q.codeSnippet && (
                        <div className="bg-slate-950 rounded-lg p-3 overflow-x-auto">
                          <pre className="text-xs font-mono text-blue-100">
                            <code>{q.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg border ${
                              opt.optionKey === q.correctOptionKey
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-2">[{opt.optionKey}]</span>
                            {opt.optionText}
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <strong className="text-slate-700">Explanation: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Student Attempts Audit */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">All Student Attempt Logs</h3>
            <span className="text-xs text-slate-500">{attemptsHistory.length} Total Submissions</span>
          </div>

          {attemptsHistory.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No quiz submissions recorded on the server yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Student</th>
                    <th className="px-6 py-3.5">Quiz</th>
                    <th className="px-6 py-3.5">Score</th>
                    <th className="px-6 py-3.5">Percentage</th>
                    <th className="px-6 py-3.5">Result</th>
                    <th className="px-6 py-3.5">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attemptsHistory.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{att.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{att.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {att.quizTitle}
                      </td>
                      <td className="px-6 py-4">
                        {att.score} / {att.maxScore} pts
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {att.percentage}%
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            att.isPassed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {att.isPassed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {new Date(att.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create or Edit Quiz */}
      {showCreateQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingQuiz ? 'Edit Quiz' : 'Create New Assessment'}
              </h3>
              <button
                onClick={() => setShowCreateQuizModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Java Concurrency & Threads"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Brief description of topics covered"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={quizForm.categoryId}
                    onChange={(e) => setQuizForm({ ...quizForm, categoryId: Number(e.target.value) })}
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
                    value={quizForm.difficulty}
                    onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value as Difficulty })}
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
                    min="1"
                    max="180"
                    required
                    value={quizForm.durationMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Passing Mark (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={quizForm.passingPercentage}
                    onChange={(e) => setQuizForm({ ...quizForm, passingPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateQuizModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
                >
                  Save Quiz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Question to Quiz */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Question to "{selectedQuiz.title}"
              </h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Question Statement</label>
                <textarea
                  rows={2}
                  required
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  placeholder="e.g. Which method must be implemented when writing a Thread in Java?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Code Snippet (Optional)
                </label>
                <textarea
                  rows={3}
                  value={questionForm.codeSnippet}
                  onChange={(e) => setQuestionForm({ ...questionForm, codeSnippet: e.target.value })}
                  placeholder="public class Example { ... }"
                  className="w-full px-3 py-2 border border-slate-800 rounded-lg text-blue-100 bg-slate-950 font-mono text-xs"
                />
              </div>

              {/* Options A, B, C, D */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Four Answer Options</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">A</span>
                    <input
                      type="text"
                      required
                      placeholder="Option A text"
                      value={questionForm.optionA}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">B</span>
                    <input
                      type="text"
                      required
                      placeholder="Option B text"
                      value={questionForm.optionB}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">C</span>
                    <input
                      type="text"
                      required
                      placeholder="Option C text"
                      value={questionForm.optionC}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">D</span>
                    <input
                      type="text"
                      required
                      placeholder="Option D text"
                      value={questionForm.optionD}
                      onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Correct Answer</label>
                  <select
                    value={questionForm.correctOptionKey}
                    onChange={(e) => setQuestionForm({ ...questionForm, correctOptionKey: e.target.value as 'A' | 'B' | 'C' | 'D' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white font-bold"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Points</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({ ...questionForm, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  placeholder="Explain why the answer is correct and cite Java language specification details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
