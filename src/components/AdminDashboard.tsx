import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Settings,
  BarChart3,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  Send,
  Eye,
  X,
  FileCheck2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { User, Role, Quiz } from '../types/quiz';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    quizzes,
    approveQuiz,
    rejectQuiz,
    systemSettings,
    updateSystemSettings,
    systemAlerts,
    addSystemAlert,
    dismissSystemAlert,
    attemptsHistory,
  } = useQuiz();

  const [activeTab, setActiveTab] = useState<'users' | 'content' | 'settings' | 'reports' | 'alerts'>('users');

  // User modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    role: 'ROLE_PARTICIPANT' as Role,
    collegeOrCompany: '',
    isEnabled: true,
  });

  // Reject quiz modal state
  const [rejectingQuizId, setRejectingQuizId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(systemSettings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // New Alert state
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertMessage, setNewAlertMessage] = useState('');
  const [newAlertType, setNewAlertType] = useState<'INFO' | 'WARNING' | 'CRITICAL'>('INFO');

  // Preview quiz modal state
  const [previewQuiz, setPreviewQuiz] = useState<Quiz | null>(null);

  // Stats computation
  const pendingQuizzesCount = quizzes.filter((q) => q.approvalStatus === 'PENDING').length;
  const approvedQuizzesCount = quizzes.filter((q) => q.approvalStatus === 'APPROVED').length;
  const totalAttemptsCount = attemptsHistory.length;

  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        role: user.role,
        collegeOrCompany: user.collegeOrCompany || '',
        isEnabled: user.isEnabled,
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        fullName: '',
        email: '',
        username: '',
        role: 'ROLE_PARTICIPANT',
        collegeOrCompany: '',
        isEnabled: true,
      });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, userFormData);
    } else {
      createUser({
        fullName: userFormData.fullName,
        email: userFormData.email,
        username: userFormData.username || userFormData.email.split('@')[0],
        role: userFormData.role,
        collegeOrCompany: userFormData.collegeOrCompany,
        isEnabled: userFormData.isEnabled,
      });
    }
    setShowUserModal(false);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingQuizId) {
      rejectQuiz(rejectingQuizId, rejectionReason);
      setRejectingQuizId(null);
      setRejectionReason('');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(settingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAlertTitle && newAlertMessage) {
      addSystemAlert(newAlertTitle, newAlertMessage, newAlertType);
      setNewAlertTitle('');
      setNewAlertMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Institutional Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Administrator Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Oversee user accounts, review and approve quiz content, manage system settings, and inspect performance reports.
          </p>
        </div>

        {/* Quick KPI Counters */}
        <div className="flex items-center gap-3 text-xs bg-white border border-slate-200 rounded-xl p-2 shadow-xs">
          <div className="px-3 py-1 border-r border-slate-100 text-center">
            <span className="block font-bold text-slate-900 text-base">{users.length}</span>
            <span className="text-slate-400 text-[11px]">Users</span>
          </div>
          <div className="px-3 py-1 border-r border-slate-100 text-center">
            <span className="block font-bold text-amber-600 text-base">{pendingQuizzesCount}</span>
            <span className="text-slate-400 text-[11px]">Pending Content</span>
          </div>
          <div className="px-3 py-1 text-center">
            <span className="block font-bold text-emerald-600 text-base">{approvedQuizzesCount}</span>
            <span className="text-slate-400 text-[11px]">Live Quizzes</span>
          </div>
        </div>
      </div>

      {/* 5 Tab Navigation Controls as required by specification */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          1. User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'content'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          2. Quiz Content Management
          {pendingQuizzesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
              {pendingQuizzesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          3. System Settings
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          4. Performance Reports
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'alerts'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          5. System Alerts ({systemAlerts.length})
        </button>
      </div>

      {/* 1. USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">User Account Directory</h3>
              <p className="text-xs text-slate-500">
                Manage all registered Administrator, Quiz Creator, and Participant accounts.
              </p>
            </div>
            <button
              onClick={() => handleOpenUserModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start"
            >
              <Plus className="w-4 h-4" />
              Create New User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Name & Username</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Assigned Role</th>
                  <th className="px-6 py-3.5">Organization / Dept</th>
                  <th className="px-6 py-3.5">Account Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">@{u.username}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : u.role === 'ROLE_CREATOR'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {u.role === 'ROLE_ADMIN' ? 'Admin' : u.role === 'ROLE_CREATOR' ? 'Quiz Creator' : 'Participant'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.collegeOrCompany || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                          u.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle account status"
                      >
                        {u.isEnabled ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenUserModal(u)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-blue-600"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete user ${u.fullName}?`)) {
                            deleteUser(u.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. QUIZ CONTENT MANAGEMENT TAB */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quiz Content Approval Queue</h3>
              <p className="text-xs text-slate-500">
                Review submitted quiz modules from Quiz Creators and grant approval for participant access.
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
              {pendingQuizzesCount} quizzes requiring administrative action
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Quiz Title & Category</th>
                  <th className="px-6 py-3.5">Submitted By</th>
                  <th className="px-6 py-3.5">Questions</th>
                  <th className="px-6 py-3.5">Duration</th>
                  <th className="px-6 py-3.5">Approval Status</th>
                  <th className="px-6 py-3.5 text-right">Approval Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{quiz.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {quiz.categoryName} · {quiz.difficulty}
                      </div>
                      {quiz.rejectionReason && (
                        <div className="text-[11px] text-rose-600 mt-1 font-medium bg-rose-50 p-1.5 rounded border border-rose-100">
                          Rejection note: {quiz.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{quiz.createdByName}</div>
                      <div className="text-[11px] text-slate-400">Creator ID #{quiz.createdByUserId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">{quiz.questionsCount}</span>
                      <span className="text-slate-400 text-[11px]"> ({quiz.totalMarks} pts)</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{quiz.durationMinutes} mins</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                          quiz.approvalStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : quiz.approvalStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {quiz.approvalStatus === 'APPROVED'
                          ? '✓ APPROVED'
                          : quiz.approvalStatus === 'PENDING'
                          ? '⏳ PENDING APPROVAL'
                          : '✗ REJECTED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setPreviewQuiz(quiz)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
                        title="Preview Questions"
                      >
                        <Eye className="w-3.5 h-3.5 inline mr-1" />
                        Preview
                      </button>

                      {quiz.approvalStatus !== 'APPROVED' && (
                        <button
                          onClick={() => approveQuiz(quiz.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs transition-colors"
                        >
                          Approve
                        </button>
                      )}

                      {quiz.approvalStatus !== 'REJECTED' && (
                        <button
                          onClick={() => {
                            setRejectingQuizId(quiz.id);
                            setRejectionReason('');
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SYSTEM SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-3xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">System-Wide Platform Settings</h3>
            <p className="text-xs text-slate-500">
              Configure parameters governing default timers, thresholds, automatic approvals, and maintenance modes.
            </p>
          </div>

          {settingsSavedMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Platform settings updated successfully across all operational modules.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform Brand Title</label>
              <input
                type="text"
                required
                value={settingsForm.platformTitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, platformTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={settingsForm.defaultDurationMinutes}
                  onChange={(e) => setSettingsForm({ ...settingsForm, defaultDurationMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Default Passing Percentage (%)</label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={settingsForm.defaultPassingPercentage}
                  onChange={(e) => setSettingsForm({ ...settingsForm, defaultPassingPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">System Broadcast Announcement</label>
              <textarea
                rows={2}
                value={settingsForm.systemAnnouncement}
                onChange={(e) => setSettingsForm({ ...settingsForm, systemAnnouncement: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.autoApproveQuizzes}
                  onChange={(e) => setSettingsForm({ ...settingsForm, autoApproveQuizzes: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Auto-Approve Creator Submissions</span>
                  <span className="text-[11px] text-slate-500">
                    Bypasses administrative review queue and publishes quizzes immediately upon creator authoring.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.allowParticipantInteractions}
                  onChange={(e) => setSettingsForm({ ...settingsForm, allowParticipantInteractions: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Enable Participant Doubts & Interactions</span>
                  <span className="text-[11px] text-slate-500">
                    Allows participants to message quiz creators with questions on specific problems.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.maintenanceMode}
                  onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-900 block">Maintenance Mode</span>
                  <span className="text-[11px] text-slate-500">
                    Displays warning banner and restricts new quiz submissions during server upgrades.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Save Configuration Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. PERFORMANCE REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Quiz Performance Analytics & Reports</h3>
              <p className="text-xs text-slate-500">
                Aggregated metrics, participant scoring distributions, and category engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Attempts Logged</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{totalAttemptsCount}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Across all approved subjects</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 uppercase">Platform Passing Rate</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {totalAttemptsCount > 0
                    ? Math.round((attemptsHistory.filter((a) => a.isPassed).length / totalAttemptsCount) * 100)
                    : 85}%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Scored above quiz pass mark</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-500 uppercase">Active Question Bank</span>
                <div className="text-2xl font-bold text-indigo-700 mt-1">
                  {quizzes.reduce((acc, q) => acc + q.questionsCount, 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Author-reviewed questions</div>
              </div>
            </div>

            {/* Category Performance Breakdown Bar Representation */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Category Proficiency & Average Performance
              </h4>

              {[
                { name: 'Java Programming', avg: 82, count: 24 },
                { name: 'Object-Oriented Programming (OOP)', avg: 76, count: 18 },
                { name: 'Data Structures & Algorithms', avg: 68, count: 15 },
                { name: 'DBMS and SQL', avg: 79, count: 12 },
                { name: 'Operating Systems', avg: 74, count: 9 },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="font-semibold">{cat.name}</span>
                    <span className="text-slate-500">Avg {cat.avg}% ({cat.count} submissions)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        cat.avg >= 80 ? 'bg-emerald-600' : cat.avg >= 70 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${cat.avg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SYSTEM ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Create Alert Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Broadcast System Alert</h3>
              <p className="text-xs text-slate-500">
                Notify quiz creators and participants of critical updates, maintenance, or platform announcements.
              </p>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    placeholder="e.g. Java Certification Exam Window Open"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity Type</label>
                  <select
                    value={newAlertType}
                    onChange={(e) => setNewAlertType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                  >
                    <option value="INFO">Information (Blue)</option>
                    <option value="WARNING">Warning (Amber)</option>
                    <option value="CRITICAL">Critical (Red)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alert Message</label>
                <textarea
                  rows={2}
                  required
                  value={newAlertMessage}
                  onChange={(e) => setNewAlertMessage(e.target.value)}
                  placeholder="Detailed notification content..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast Alert
              </button>
            </form>
          </div>

          {/* Active Alerts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Active System Alerts & Notices ({systemAlerts.length})
            </h4>

            {systemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${
                  alert.type === 'CRITICAL'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : alert.type === 'WARNING'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      alert.type === 'CRITICAL'
                        ? 'text-rose-600'
                        : alert.type === 'WARNING'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <div>
                    <h5 className="font-bold text-sm leading-snug">{alert.title}</h5>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">{alert.message}</p>
                    <span className="text-[10px] opacity-75 mt-2 block">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => dismissSystemAlert(alert.id)}
                  className="text-slate-400 hover:text-slate-700 p-1"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Create / Edit Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit User Account' : 'Register New User Account'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={userFormData.fullName}
                  onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                  placeholder="e.g. Ananya Roy"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="ananya@university.edu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">System Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as Role })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-white"
                >
                  <option value="ROLE_PARTICIPANT">Participant (Takes Quizzes)</option>
                  <option value="ROLE_CREATOR">Quiz Creator (Authors & Grades Quizzes)</option>
                  <option value="ROLE_ADMIN">Administrator (Full System Control)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">College / Organization</label>
                <input
                  type="text"
                  value={userFormData.collegeOrCompany}
                  onChange={(e) => setUserFormData({ ...userFormData, collegeOrCompany: e.target.value })}
                  placeholder="e.g. Department of Computer Science"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Save User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Quiz Feedback Dialog */}
      {rejectingQuizId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Reject Quiz Submission</h3>
            <p className="text-xs text-slate-500">
              Provide actionable guidance for the Quiz Creator to rectify questions or formatting.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain the required revisions before approval..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingQuizId(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Quiz Questions Dialog */}
      {previewQuiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{previewQuiz.title}</h3>
                <p className="text-xs text-slate-500">{previewQuiz.categoryName} · {previewQuiz.questionsCount} Questions</p>
              </div>
              <button onClick={() => setPreviewQuiz(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {previewQuiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">
                    Q{idx + 1}. {q.questionText}
                  </div>
                  {q.codeSnippet && (
                    <pre className="p-3 bg-slate-950 text-blue-100 rounded-lg font-mono text-[11px] overflow-x-auto">
                      <code>{q.codeSnippet}</code>
                    </pre>
                  )}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`p-2 rounded border ${
                          opt.optionKey === q.correctOptionKey
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        [{opt.optionKey}] {opt.optionText}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    <strong>Explanation: </strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
