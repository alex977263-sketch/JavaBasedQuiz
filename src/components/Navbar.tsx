import React, { useState } from 'react';
import {
  Coffee,
  BookOpen,
  History,
  ShieldCheck,
  Edit3,
  GraduationCap,
  LogOut,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export type ActiveTab =
  | 'catalog'
  | 'participant-dashboard'
  | 'creator-dashboard'
  | 'admin-dashboard'
  | 'history';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuth }) => {
  const {
    currentUser,
    loginAsDemoAdmin,
    loginAsDemoCreator,
    loginAsDemoParticipant,
    logout,
  } = useQuiz();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'Admin', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'ROLE_CREATOR':
        return { label: 'Quiz Creator', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'ROLE_PARTICIPANT':
      default:
        return { label: 'Participant', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
  };

  const handleRoleSelect = (roleType: 'admin' | 'creator' | 'participant') => {
    setShowRoleMenu(false);
    if (roleType === 'admin') {
      loginAsDemoAdmin();
      setActiveTab('admin-dashboard');
    } else if (roleType === 'creator') {
      loginAsDemoCreator();
      setActiveTab('creator-dashboard');
    } else {
      loginAsDemoParticipant();
      setActiveTab('participant-dashboard');
    }
  };

  const currentRole = currentUser?.role || 'ROLE_PARTICIPANT';

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
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
                <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                  Java Online Examination Platform
                </p>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'catalog'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Quizzes
              </button>

              <button
                onClick={() => setActiveTab('participant-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'participant-dashboard'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                Participant Hub
              </button>

              <button
                onClick={() => setActiveTab('creator-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'creator-dashboard'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-amber-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                Creator Hub
              </button>

              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-indigo-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Admin Hub
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'history'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Attempts
              </button>
            </nav>
          </div>

          {/* Right Actions: Role Quick-Switcher & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick 1-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
                title="Switch between the 3 official user roles"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-slate-400">Role:</span>
                <span className="font-bold text-white">
                  {currentRole === 'ROLE_ADMIN'
                    ? 'Admin'
                    : currentRole === 'ROLE_CREATOR'
                    ? 'Quiz Creator'
                    : 'Participant'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-700/80 text-[11px] font-semibold text-slate-400">
                    SWITCH ACTIVE USER TYPE
                  </div>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      currentRole === 'ROLE_ADMIN' ? 'bg-indigo-950/60 text-indigo-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <div>
                        <div>1. Admin</div>
                        <div className="text-[10px] text-slate-400 font-normal">Administrator</div>
                      </div>
                    </div>
                    {currentRole === 'ROLE_ADMIN' && <span className="text-[10px] text-indigo-400 font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('creator')}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      currentRole === 'ROLE_CREATOR' ? 'bg-amber-950/60 text-amber-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <div>
                        <div>2. Quiz Creator</div>
                        <div className="text-[10px] text-slate-400 font-normal">Prof. James Gosling</div>
                      </div>
                    </div>
                    {currentRole === 'ROLE_CREATOR' && <span className="text-[10px] text-amber-400 font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => handleRoleSelect('participant')}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-700 transition-colors ${
                      currentRole === 'ROLE_PARTICIPANT' ? 'bg-blue-950/60 text-blue-300 font-bold' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <div>
                        <div>3. Participant</div>
                        <div className="text-[10px] text-slate-400 font-normal">Rahul Sharma</div>
                      </div>
                    </div>
                    {currentRole === 'ROLE_PARTICIPANT' && <span className="text-[10px] text-blue-400 font-bold">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-1">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {currentUser.fullName}
                    </p>
                    <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded border font-mono ${getRoleBadge(currentUser.role).color}`}>
                      {getRoleBadge(currentUser.role).label}
                    </span>
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
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Responsive Mobile / Tablet Sub-Navbar */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800 text-[11px] overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-2 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'catalog' ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-400'
            }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setActiveTab('participant-dashboard')}
            className={`px-2 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'participant-dashboard' ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-400'
            }`}
          >
            Participant
          </button>
          <button
            onClick={() => setActiveTab('creator-dashboard')}
            className={`px-2 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'creator-dashboard' ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-400'
            }`}
          >
            Creator
          </button>
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className={`px-2 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'admin-dashboard' ? 'text-indigo-400 font-bold bg-slate-800' : 'text-slate-400'
            }`}
          >
            Admin
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2 py-1 rounded whitespace-nowrap font-medium ${
              activeTab === 'history' ? 'text-blue-400 font-bold bg-slate-800' : 'text-slate-400'
            }`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
};
