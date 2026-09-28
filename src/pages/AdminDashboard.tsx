import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  AlertTriangle,
  Award,
  FileText,
  RotateCcw,
  Check,
  X,
  Search,
  Layers
} from 'lucide-react';
import { VerificationStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    users,
    tasks,
    earnings,
    categories,
    verifyHelperCertificate,
    resetDemoData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'tasks'>('verifications');
  const [userSearch, setUserSearch] = useState('');

  // Metrics
  const totalCustomers = users.filter((u) => u.role === 'customer').length;
  const totalHelpers = users.filter((u) => u.role === 'helper').length;
  const activeTasksCount = tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingHelpers = users.filter((u) => u.role === 'helper' && u.verificationStatus === 'pending');
  const totalPlatformEarnings = earnings.reduce((acc, e) => acc + e.amount, 0);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>KaamMate Admin Operations Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Moderation &amp; Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit trade certificates, approve plumbers/electricians, and review simulated community transactions.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Environment</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Total Customers</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{totalCustomers}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Total Helpers</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{totalHelpers}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Active Tasks</span>
          <span className="text-xl font-bold text-sky-600 mt-1 block">{activeTasksCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Completed Chores</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">{completedTasksCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Pending Verifications</span>
          <span className={`text-xl font-bold mt-1 block ${pendingHelpers.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
            {pendingHelpers.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Simulated Volume</span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">₹{totalPlatformEarnings}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'verifications'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Qualification Approvals</span>
          {pendingHelpers.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
              {pendingHelpers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Manage Users ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'tasks'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Task Audit ({tasks.length})</span>
        </button>
      </div>

      {/* Verifications Desk */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong>Skilled Verification Enforcement:</strong> Only helpers with &ldquo;Verified&rdquo; status can accept skilled tasks (plumbing, electrical repairs).
            Review submitted credentials below and click <strong>Approve</strong> to unlock skilled work for that helper immediately.
          </div>

          {pendingHelpers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">All Credentials Reviewed</h3>
              <p className="text-xs text-slate-500">There are no pending helper certificates waiting for verification.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingHelpers.map((helper) => (
                <div
                  key={helper.id}
                  className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={helper.avatar}
                        alt={helper.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{helper.name}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">{helper.phone} · {helper.address}</div>
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1">
                          Status: Pending Review
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Certificate preview card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>{helper.certificateTitle || 'Vocational Trade Certificate'}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>ID Proof: {helper.idProofType}</span>
                    </div>
                    {helper.certificateDocumentUrl && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-h-32">
                        <img
                          src={helper.certificateDocumentUrl}
                          alt="Certificate Scan"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Decision Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => verifyHelperCertificate(helper.id, 'unverified')}
                      className="flex-1 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => verifyHelperCertificate(helper.id, 'verified')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve &amp; Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name, email, or role..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-600">
                        {u.role}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[160px]">
                        {u.address}
                      </td>
                      <td className="py-3 px-4 font-semibold text-amber-500">
                        ★ {u.rating}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          u.verificationStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : u.verificationStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {u.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.role === 'helper' && (
                          <button
                            onClick={() => {
                              const nextStatus = u.verificationStatus === 'verified' ? 'unverified' : 'verified';
                              verifyHelperCertificate(u.id, nextStatus as VerificationStatus);
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                          >
                            Toggle Verification
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Management */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Helper</th>
                  <th className="py-3 px-4 text-right">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{task.title}</td>
                    <td className="py-3 px-4 text-slate-600">{task.customerName}</td>
                    <td className="py-3 px-4 text-slate-500">{task.categoryName}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-[11px] font-semibold text-slate-700">
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {task.assignedHelperName || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{task.budget}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
