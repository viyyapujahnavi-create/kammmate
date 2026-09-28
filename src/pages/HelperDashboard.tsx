import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskTrackingTimeline } from '../components/TaskTrackingTimeline';
import {
  IndianRupee,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Play,
  ArrowUpRight,
  ShieldCheck,
  Star,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { formatDistance, calculateDistanceKm } from '../utils/geo';
import { Task } from '../types';

export const HelperDashboard: React.FC = () => {
  const {
    currentUser,
    tasks,
    earnings,
    updateUserAvailability,
    startTask,
    markTaskCompleted,
    assignHelper,
    requestMockPayout,
    categories,
    users,
    switchUser
  } = useApp();

  const [filterRadius, setFilterRadius] = useState<number>(5.0);
  const [activeTab, setActiveTab] = useState<'assigned' | 'nearby_feed' | 'earnings'>('assigned');
  const [payoutAmount, setPayoutAmount] = useState<string>('500');

  const isAvailable = currentUser.isAvailable !== false;

  // Tasks assigned to this helper
  const assignedTasks = tasks.filter((t) => t.assignedHelperId === currentUser.id);
  const activeAssignedTasks = assignedTasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled');

  // Nearby unassigned tasks looking for helpers within 5 km
  const nearbyOpenTasks = tasks.filter((t) => {
    if (t.status !== 'searching') return false;
    const distance = calculateDistanceKm(
      currentUser.latitude,
      currentUser.longitude,
      t.latitude,
      t.longitude
    );
    return distance <= filterRadius;
  });

  // Helper earnings history
  const helperEarnings = earnings.filter((e) => e.helperId === currentUser.id);

  // Check whether helper is verified for skilled tasks
  const isHelperVerified = currentUser.verificationStatus === 'verified';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Helper Profile Header & Availability Toggle */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h1>
              {isHelperVerified ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ID &amp; Skills Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Verification Pending (Skilled Tasks Locked)
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" /> {currentUser.rating} ({currentUser.reviewCount} reviews)
              </span>
              <span>·</span>
              <span>{currentUser.completedTasksCount} completed chores</span>
              <span>·</span>
              <span>Base Rate: ₹{currentUser.fixedRateDefault || currentUser.hourlyRate}</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle and Account Switcher for Demo */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-700">
              {isAvailable ? 'Available for tasks' : 'Currently Busy'}
            </span>
            <button
              onClick={() => updateUserAvailability(currentUser.id, !isAvailable)}
              className="text-emerald-600 focus:outline-none"
            >
              {isAvailable ? (
                <ToggleRight className="w-8 h-8 fill-emerald-600 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* Quick toggle between Rahul (Verified) and Dinesh (Pending) to test verification gating */}
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block mb-0.5">Demo helper toggle:</span>
            {currentUser.id === 'helper-rahul' ? (
              <button
                onClick={() => switchUser('helper-dinesh')}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold bg-amber-50 px-2 py-1 rounded border border-amber-200"
              >
                Switch to Dinesh (Pending Plumber)
              </button>
            ) : (
              <button
                onClick={() => switchUser('helper-rahul')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200"
              >
                Switch to Rahul (Verified Errand Helper)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Warning Banner if Helper is Pending */}
      {!isHelperVerified && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold">Qualification Verification Required for Skilled Tasks:</strong>
            <p>
              Your certificate ({currentUser.certificateTitle || 'Submitted Credential'}) is currently pending approval by the KaamMate admin team.
              You cannot accept skilled tasks (plumbing, electrical) until verified. You can switch to Admin from the top bar to approve this credential immediately!
            </p>
          </div>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Today&apos;s Earnings</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            ₹{currentUser.earningsToday || 0}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            Instant settlement on confirmation
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">This Week&apos;s Earnings</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            ₹{currentUser.earningsWeek || 0}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Mon &ndash; Sun period
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Total Lifetime Earnings</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            ₹{currentUser.earningsTotal || 0}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Mock wallet balance
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block">Active Service Radius</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {currentUser.serviceRadiusKm || 5.0} km
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            Indiranagar &amp; surrounds
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'assigned'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Assigned Tasks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-white text-[10px]">
              {activeAssignedTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('nearby_feed')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'nearby_feed'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Nearby Opportunities (&lt; 5 km)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px]">
              {nearbyOpenTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'earnings'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Earnings &amp; Payout</span>
          </button>
        </div>

        {/* Assigned Tasks Feed */}
        {activeTab === 'assigned' && (
          <div className="space-y-6">
            {activeAssignedTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
                <p className="text-slate-500 text-xs">
                  No active assignments currently. Check out the &ldquo;Nearby Opportunities&rdquo; tab to accept tasks within 5 km!
                </p>
                <button
                  onClick={() => setActiveTab('nearby_feed')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Browse Nearby Tasks
                </button>
              </div>
            ) : (
              activeAssignedTasks.map((task) => (
                <div key={task.id} className="space-y-3">
                  <TaskTrackingTimeline task={task} />
                </div>
              ))
            )}
          </div>
        )}

        {/* Nearby Tasks Feed */}
        {activeTab === 'nearby_feed' && (
          <div className="space-y-4">
            {nearbyOpenTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-500 text-xs">
                No new open tasks broadcasted within {filterRadius} km right now.
              </div>
            ) : (
              nearbyOpenTasks.map((task) => {
                const distance = calculateDistanceKm(
                  currentUser.latitude,
                  currentUser.longitude,
                  task.latitude,
                  task.longitude
                );
                const category = categories.find((c) => c.id === task.categoryId);
                const isSkilledCategory = category?.isSkilled ?? false;
                const canAccept = !isSkilledCategory || isHelperVerified;

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded">
                          {task.categoryName}
                        </span>
                        {isSkilledCategory && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                            Trade Verification Required
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {formatDistance(distance)} away ({task.locationAddress})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {task.date}, {task.time}
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800">
                          Est. Duration: {task.durationHours} hr
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Offer Budget</span>
                        <span className="text-lg font-bold text-emerald-700">
                          ₹{task.budget}
                        </span>
                      </div>

                      {canAccept ? (
                        <button
                          onClick={() => assignHelper(task.id, currentUser.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors whitespace-nowrap"
                        >
                          Accept Task
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-2 bg-slate-200 text-slate-400 font-semibold text-xs rounded-lg cursor-not-allowed whitespace-nowrap"
                          title="Qualification verification required. Ask admin to approve your credential."
                        >
                          Verification Required
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Earnings & Simulated Payout Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            {/* Payout Simulator Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Simulated Wallet Balance
                </span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  ₹{currentUser.earningsTotal || 0}
                </span>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  Simulated prototype escrow ledger. All earnings can be transferred immediately to your test UPI / Bank account.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-28 px-3 py-2 text-xs bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Amount"
                />
                <button
                  onClick={() => {
                    const amt = parseInt(payoutAmount, 10);
                    if (amt > 0) requestMockPayout(currentUser.id, amt);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-colors whitespace-nowrap"
                >
                  Request Mock Payout
                </button>
              </div>
            </div>

            {/* Earnings Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-800">
                Completed Task Transactions Ledger
              </div>

              {helperEarnings.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No payout transactions logged yet. Complete tasks to see credits here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Task</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Payment Method</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {helperEarnings.map((earn) => (
                        <tr key={earn.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{earn.taskTitle}</td>
                          <td className="py-3 px-4 text-slate-600">{earn.customerName}</td>
                          <td className="py-3 px-4 text-slate-500">{earn.categoryName}</td>
                          <td className="py-3 px-4 text-slate-500">{earn.date}</td>
                          <td className="py-3 px-4 text-slate-500">{earn.paymentMethod}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-700">
                            +₹{earn.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
