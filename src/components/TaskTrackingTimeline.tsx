import React from 'react';
import { Task, TaskStatus } from '../types';
import { Check, Clock, Play, CheckCircle2, IndianRupee, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TaskTrackingTimelineProps {
  task: Task;
  onOpenRatingModal?: () => void;
}

export const TaskTrackingTimeline: React.FC<TaskTrackingTimelineProps> = ({
  task,
  onOpenRatingModal,
}) => {
  const { currentUser, startTask, markTaskCompleted, confirmTaskCompletion } = useApp();

  const isAssigned = !!task.assignedHelperId;
  const isCustomer = currentUser.id === task.customerId;
  const isAssignedHelper = currentUser.id === task.assignedHelperId;

  // Stages configuration
  const stages = [
    {
      key: 'posted',
      label: 'Task Posted',
      sub: task.createdAt,
      isDone: true,
      isActive: task.status === 'searching' && !isAssigned,
    },
    {
      key: 'found',
      label: 'Helpers Matched',
      sub: 'Within 5 km radius',
      isDone: isAssigned || task.status !== 'searching',
      isActive: task.status === 'searching' && isAssigned,
    },
    {
      key: 'assigned',
      label: 'Helper Assigned',
      sub: task.assignedHelperName || 'Awaiting assignment',
      isDone: ['helper_assigned', 'in_progress', 'pending_confirmation', 'completed'].includes(task.status),
      isActive: task.status === 'helper_assigned',
    },
    {
      key: 'started',
      label: 'Work Started',
      sub: task.startedAt || 'In progress',
      isDone: ['in_progress', 'pending_confirmation', 'completed'].includes(task.status),
      isActive: task.status === 'in_progress',
    },
    {
      key: 'completed',
      label: 'Work Completed',
      sub: task.completedAt || 'Helper finishes task',
      isDone: ['pending_confirmation', 'completed'].includes(task.status),
      isActive: task.status === 'pending_confirmation',
    },
    {
      key: 'paid',
      label: 'Payment Released',
      sub: task.isPaid ? `₹${task.budget} released` : 'Escrow held safely',
      isDone: task.status === 'completed' && !!task.isPaid,
      isActive: task.status === 'completed',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Live Task Progress
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">
            {task.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{task.categoryName}</span>
            <span>·</span>
            <span>Budget: ₹{task.budget} ({task.paymentType})</span>
            <span>·</span>
            <span>Status: <strong className="capitalize text-slate-700">{task.status.replace('_', ' ')}</strong></span>
          </div>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-2">
          {task.status === 'completed' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Task Completed &amp; Settled
            </span>
          ) : task.status === 'in_progress' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 animate-pulse">
              <Clock className="w-4 h-4 text-sky-600" /> Work In Progress
            </span>
          ) : task.status === 'pending_confirmation' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" /> Awaiting Customer Confirmation
            </span>
          ) : task.status === 'helper_assigned' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Helper Assigned
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-4 h-4 text-amber-600" /> Matching Nearby Helpers
            </span>
          )}
        </div>
      </div>

      {/* Stepper Timeline Bar */}
      <div className="py-8">
        <div className="relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />

          {stages.map((stage, idx) => {
            const isCompleted = stage.isDone;
            const isCurrent = stage.isActive;

            return (
              <div key={stage.key} className="relative z-10 flex flex-col items-center text-center px-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : isCurrent
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-md'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : idx + 1}
                </div>

                <div className="mt-3 max-w-[100px]">
                  <span className={`block text-xs font-semibold ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                    {stage.label}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                    {stage.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Zone for Helper & Customer */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-600">
          {isCustomer && (
            <span>
              You are viewing as <strong>Customer ({currentUser.name})</strong>.
              {task.status === 'pending_confirmation' && ' Please inspect the work and confirm completion to credit ₹' + task.budget + ' to the helper.'}
              {task.status === 'completed' && !task.customerRated && ' Task finished! Submit a rating & review for ' + task.assignedHelperName + '.'}
            </span>
          )}
          {isAssignedHelper && (
            <span>
              You are the assigned <strong>Helper ({currentUser.name})</strong>.
              {task.status === 'helper_assigned' && ' When you arrive at the location, click "Start Task".'}
              {task.status === 'in_progress' && ' Once the work is done, click "Mark Completed".'}
            </span>
          )}
          {!isCustomer && !isAssignedHelper && (
            <span>
              Simulated demonstration view. Current role: <strong>{currentUser.name}</strong> ({currentUser.role}).
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Helper Actions */}
          {task.status === 'helper_assigned' && (
            <button
              onClick={() => startTask(task.id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Play className="w-4 h-4" /> Start Task
            </button>
          )}

          {task.status === 'in_progress' && (
            <button
              onClick={() => markTaskCompleted(task.id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark Completed
            </button>
          )}

          {/* Customer Actions */}
          {task.status === 'pending_confirmation' && (
            <button
              onClick={() => confirmTaskCompletion(task.id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <IndianRupee className="w-4 h-4" /> Confirm Completion &amp; Pay ₹{task.budget}
            </button>
          )}

          {task.status === 'completed' && !task.customerRated && onOpenRatingModal && (
            <button
              onClick={onOpenRatingModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              ★ Rate &amp; Review Helper
            </button>
          )}

          {task.status === 'completed' && task.customerRated && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Review Submitted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
