import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Clock,
  Award,
  Layers,
  Shuffle,
  Play,
  Edit3,
  Trash2,
  CheckCircle,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Difficulty, Quiz } from '../types/quiz';

interface QuizCatalogProps {
  onStartQuiz: (quizId: number, shuffle?: boolean) => void;
  onEditQuiz?: (quiz: Quiz) => void;
}

export const QuizCatalog: React.FC<QuizCatalogProps> = ({ onStartQuiz, onEditQuiz }) => {
  const { quizzes, categories, currentUser, toggleQuizStatus, deleteQuiz } = useQuiz();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [shuffleToggles, setShuffleToggles] = useState<Record<number, boolean>>({});

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  // Filter quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      // If not admin, only show active quizzes
      if (!isAdmin && !quiz.isActive) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && quiz.categoryId !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'ALL' && quiz.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = quiz.title.toLowerCase().includes(query);
        const matchesDesc = quiz.description.toLowerCase().includes(query);
        const matchesCategory = quiz.categoryName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [quizzes, isAdmin, selectedCategory, selectedDifficulty, searchTerm]);

  const toggleShuffleForQuiz = (quizId: number) => {
    setShuffleToggles((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'EASY':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'HARD':
        return 'text-rose-700 bg-rose-50 border-rose-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Assessment Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Browse Programming Quizzes
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Choose a subject, test your problem-solving capabilities under timed conditions, and inspect in-depth explanations for every question.
          </p>
        </div>

        {/* Stats Pill / Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <span>{filteredQuizzes.length} tests available</span>
          <span aria-hidden="true">·</span>
          <span>{filteredQuizzes.reduce((acc, q) => acc + q.questionsCount, 0)} total questions</span>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, keyword, or concepts (e.g. OOP, multithreading, arrays)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs text-slate-900 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Difficulty Filter Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start">
            {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff === 'ALL' ? 'All Difficulties' : diff.charAt(0) + diff.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs (Segmented Button Bar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Categories ({quizzes.length})
          </button>

          {categories.map((cat) => {
            const count = quizzes.filter((q) => q.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.name} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No quizzes match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting difficulty and category filters.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedDifficulty('ALL');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const isShuffleOn = !!shuffleToggles[quiz.id];

            return (
              <div
                key={quiz.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  quiz.isActive ? 'border-slate-200 hover:border-blue-400' : 'border-dashed border-amber-300 bg-amber-50/20'
                }`}
              >
                {/* Card Top Section */}
                <div className="p-6 space-y-4">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-blue-700 uppercase tracking-wide text-[11px]">
                      {quiz.categoryName}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                      {!quiz.isActive && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          DRAFT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Metadata Specs (Clean typography, no static pill spam) */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-slate-600 text-xs">
                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Questions</span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm mt-0.5">
                        {quiz.questionsCount}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Duration</span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm mt-0.5">
                        {quiz.durationMinutes} min
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Award className="w-3.5 h-3.5" />
                        <span>Pass Mark</span>
                      </div>
                      <span className="font-bold text-slate-900 text-sm mt-0.5">
                        {quiz.passingPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Exam Settings (Shuffle questions toggle) */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={isShuffleOn}
                        onChange={() => toggleShuffleForQuiz(quiz.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="flex items-center gap-1 font-medium">
                        <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                        Randomize questions
                      </span>
                    </label>

                    <span className="text-[11px] text-slate-400">
                      {quiz.totalMarks} points
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  {/* Start Exam Button */}
                  <button
                    onClick={() => onStartQuiz(quiz.id, isShuffleOn)}
                    disabled={!quiz.isActive && !isAdmin}
                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start Assessment
                  </button>

                  {/* Admin Direct Management Actions */}
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleQuizStatus(quiz.id)}
                        className={`p-2 rounded-lg border text-xs transition-colors ${
                          quiz.isActive
                            ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'border-slate-300 text-slate-600 bg-white hover:bg-slate-100'
                        }`}
                        title={quiz.isActive ? 'Active (Click to Draft)' : 'Draft (Click to Publish)'}
                      >
                        {quiz.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {onEditQuiz && (
                        <button
                          onClick={() => onEditQuiz(quiz)}
                          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                          title="Edit Quiz"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete quiz "${quiz.title}"?`)) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
