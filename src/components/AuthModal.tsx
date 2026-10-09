import React, { useState } from 'react';
import { X, UserCheck, Shield, Sparkles, AlertCircle, Edit3, GraduationCap } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Role } from '../types/quiz';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { registerUser, loginAsDemoAdmin, loginAsDemoCreator, loginAsDemoParticipant } = useQuiz();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('ROLE_PARTICIPANT');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (isLoginTab) {
      // If logging in, check email to match role or default to participant
      if (email.toLowerCase().includes('admin')) {
        loginAsDemoAdmin();
      } else if (email.toLowerCase().includes('creator')) {
        loginAsDemoCreator();
      } else {
        loginAsDemoParticipant();
      }
      onClose();
    } else {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      registerUser(fullName.trim(), email.trim(), selectedRole);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              JQ
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isLoginTab ? 'Sign In to JavaQuiz Pro' : 'Create New Account'}
              </h3>
              <p className="text-[11px] text-slate-400">Spring Security & Role-Based Access Control</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Sign-in Banner for the 3 User Types */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Role Login (One-Click)</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => {
                loginAsDemoAdmin();
                onClose();
              }}
              className="w-full py-2 px-3 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 font-semibold rounded-lg transition-colors flex items-center gap-2 text-xs shadow-xs text-left"
            >
              <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold">1. Admin:</span> Platform Administrator
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemoCreator();
                onClose();
              }}
              className="w-full py-2 px-3 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-amber-800 font-semibold rounded-lg transition-colors flex items-center gap-2 text-xs shadow-xs text-left"
            >
              <Edit3 className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold">2. Quiz Creator:</span> Prof. James Gosling
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                loginAsDemoParticipant();
                onClose();
              }}
              className="w-full py-2 px-3 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-700 font-semibold rounded-lg transition-colors flex items-center gap-2 text-xs shadow-xs text-left"
            >
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold">3. Participant:</span> Rahul Sharma
              </div>
            </button>
          </div>
        </div>

        {/* Tabs: Sign In vs Register */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => {
              setIsLoginTab(true);
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              isLoginTab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLoginTab(false);
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-lg transition-colors ${
              !isLoginTab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {!isLoginTab && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select User Type / Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_PARTICIPANT')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      selectedRole === 'ROLE_PARTICIPANT'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Participant
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_CREATOR')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      selectedRole === 'ROLE_CREATOR'
                        ? 'border-amber-600 bg-amber-50 text-amber-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Quiz Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ROLE_ADMIN')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      selectedRole === 'ROLE_ADMIN'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@javaquiz.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-colors mt-2"
          >
            {isLoginTab ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
