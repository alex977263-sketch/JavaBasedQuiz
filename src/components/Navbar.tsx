import React from 'react';
import {
  Coffee,
  LayoutDashboard,
  BookOpen,
  History,
  ShieldCheck,
  Code2,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export type ActiveTab = 'catalog' | 'dashboard' | 'history' | 'admin';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const { currentUser, loginAsDemoAdmin, logout } = useQuiz();

  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    JavaQuiz
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                  Online Examination Platform
                </p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Quizzes
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <History className="w-4 h-4" />
                My History
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Admin Panel
              </button>
            </nav>
          </div>

          {/* Right Actions: User Profile */}
          <div className="flex items-center gap-3">
            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 pl-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700 flex items-center justify-center text-sm font-semibold text-indigo-200">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-indigo-300 font-mono">
                      ROLE_ADMIN
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-2 py-1.5 rounded ${
              activeTab === 'catalog' ? 'text-blue-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1.5 rounded ${
              activeTab === 'dashboard' ? 'text-blue-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2 py-1.5 rounded ${
              activeTab === 'history' ? 'text-blue-400 font-semibold' : 'text-slate-400'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2 py-1.5 rounded ${
              activeTab === 'admin' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
};
