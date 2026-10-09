/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Navbar, ActiveTab } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { QuizCatalog } from './components/QuizCatalog';
import { QuizEngine } from './components/QuizEngine';
import { QuizResultView } from './components/QuizResultView';
import { AttemptsHistory } from './components/AttemptsHistory';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { QuizAttempt, Quiz } from './types/quiz';
import {
  Coffee,
  Database,
  ShieldCheck,
  Server,
  Code2,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    activeExam,
    lastAttemptResult,
    setLastAttemptResult,
    startQuiz,
    resetDemoData,
    currentUser,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [selectedReviewAttempt, setSelectedReviewAttempt] = useState<QuizAttempt | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Handlers
  const handleStartQuiz = (quizId: number, shuffle?: boolean) => {
    setSelectedReviewAttempt(null);
    setLastAttemptResult(null);
    startQuiz(quizId, shuffle);
  };

  const handleViewReview = (attempt: QuizAttempt) => {
    setSelectedReviewAttempt(attempt);
  };

  const handleRetakeQuiz = (quizId: number) => {
    setSelectedReviewAttempt(null);
    setLastAttemptResult(null);
    startQuiz(quizId);
  };

  const handleBackToDashboard = () => {
    setSelectedReviewAttempt(null);
    setLastAttemptResult(null);
    setActiveTab('dashboard');
  };

  const handleBrowseQuizzes = () => {
    setSelectedReviewAttempt(null);
    setLastAttemptResult(null);
    setActiveTab('catalog');
  };

  // Determine what to display in main view
  const currentResultToDisplay = selectedReviewAttempt || lastAttemptResult;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedReviewAttempt(null);
          setLastAttemptResult(null);
          setActiveTab(tab);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If user just finished exam or clicked review on past attempt */}
        {currentResultToDisplay ? (
          <QuizResultView
            attempt={currentResultToDisplay}
            onRetakeQuiz={handleRetakeQuiz}
            onBackToDashboard={handleBackToDashboard}
            onBrowseQuizzes={handleBrowseQuizzes}
          />
        ) : (
          <>
            {activeTab === 'catalog' && (
              <QuizCatalog
                onStartQuiz={handleStartQuiz}
                onEditQuiz={(quiz) => {
                  setActiveTab('admin');
                }}
              />
            )}

            {activeTab === 'dashboard' && (
              <StudentDashboard
                onStartQuiz={handleStartQuiz}
                onViewReview={handleViewReview}
                onBrowseQuizzes={handleBrowseQuizzes}
              />
            )}

            {activeTab === 'history' && (
              <AttemptsHistory
                onViewReview={handleViewReview}
                onRetakeQuiz={handleRetakeQuiz}
                onBrowseQuizzes={handleBrowseQuizzes}
              />
            )}

            {activeTab === 'admin' && <AdminPanel />}
          </>
        )}
      </main>

      {/* Active Exam Overlay if an exam is running */}
      {activeExam && <QuizEngine />}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-200 text-sm">JavaQuiz Pro</span>
                <p className="text-[11px] text-slate-500">
                  Full-Stack Java Examination & Assessment Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setActiveTab('catalog')}
                className="hover:text-white transition-colors"
              >
                All Quizzes
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={resetDemoData}
                className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                title="Reset local storage data to initial defaults"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Sample Data
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} JavaQuiz Pro Platform. Designed for Java Developers & Computer Science Students.</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-blue-400" /> Java 17 + Spring Boot 3.2
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> MySQL 8.0 & JPA
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <QuizProvider>
      <MainApp />
    </QuizProvider>
  );
}
