import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskTrackingTimeline } from '../components/TaskTrackingTimeline';
import { RatingModal } from '../components/RatingModal';
import { AssignHelperModal } from '../components/AssignHelperModal';
import { HelperProfileModal } from '../components/HelperProfileModal';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Star,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Task, User } from '../types';
import { formatDistance } from '../utils/geo';

interface CustomerDashboardProps {
  onOpenCreateTask: () => void;
  onExploreNearby: (categoryId?: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onOpenCreateTask,
  onExploreNearby,
}) => {
  const { currentUser, tasks, cancelTask, assignHelper, rateTask, getNearbyHelpersForTask, users } = useApp();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [taskForRating, setTaskForRating] = useState<Task | null>(null);
  const [taskForAssigning, setTaskForAssigning] = useState<Task | null>(null);
  const [selectedHelperForProfile, setSelectedHelperForProfile] = useState<User | null>(null);

  // Filter tasks created by customer
  const customerTasks = tasks.filter((t) => t.customerId === currentUser.id);

  const activeTasks = customerTasks.filter(
    (t) => t.status !== 'completed' && t.status !== 'cancelled'
  );

  const historyTasks = customerTasks.filter(
    (t) => t.status === 'completed' || t.status === 'cancelled'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
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
                Welcome back, {currentUser.name}!
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Customer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.address}, {currentUser.city}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onExploreNearby()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Find Nearby Helpers
          </button>
          <button
            onClick={onOpenCreateTask}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Active Tasks</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {activeTasks.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Completed Chores</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">
            {historyTasks.filter((t) => t.status === 'completed').length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Neighborhood Rating</span>
          <span className="text-2xl font-bold text-amber-500 mt-1 block flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {currentUser.rating}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 block">Service Radius Limit</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            5.0 km
          </span>
        </div>
      </div>

      {/* Tabs: Active Tasks vs Task History */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Tasks</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-700 text-white text-[10px]">
              {activeTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Task History</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {historyTasks.length}
            </span>
          </button>
        </div>

        {/* Active Tasks Feed */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
                <p className="text-slate-500 text-xs">You do not have any active tasks right now.</p>
                <button
                  onClick={onOpenCreateTask}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Post a Task
                </button>
              </div>
            ) : (
              activeTasks.map((task) => {
                const { eligible } = getNearbyHelpersForTask(task.id);
                const isSearching = task.status === 'searching';

                return (
                  <div key={task.id} className="space-y-3">
                    {/* Live Tracking Timeline for this task */}
                    <TaskTrackingTimeline
                      task={task}
                      onOpenRatingModal={() => setTaskForRating(task)}
                    />

                    {/* Matching Helpers Carousel/Quick Assign if Searching */}
                    {isSearching && (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>{eligible.length} suitable helpers found within 5 km for this task</span>
                            </h4>
                            <p className="text-[11px] text-emerald-800 mt-0.5">
                              Sorted by proximity. Click to view profile and confirm assignment.
                            </p>
                          </div>

                          <button
                            onClick={() => onExploreNearby(task.categoryId)}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                          >
                            Open 5 km Radar Map &rarr;
                          </button>
                        </div>

                        {/* Top 3 helpers cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {eligible.slice(0, 3).map((helper) => (
                            <div
                              key={helper.id}
                              className="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs flex flex-col justify-between"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={helper.avatar}
                                  alt={helper.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-slate-900 truncate">
                                    {helper.name}
                                  </h5>
                                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                    <span className="text-amber-500 font-semibold">★ {helper.rating}</span>
                                    <span>·</span>
                                    <span className="text-emerald-700 font-semibold">
                                      {formatDistance(helper.distanceKm)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-800">
                                  ₹{helper.fixedRateDefault || helper.hourlyRate}
                                </span>
                                <button
                                  onClick={() => {
                                    assignHelper(task.id, helper.id);
                                  }}
                                  className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] rounded-lg shadow-xs transition-colors"
                                >
                                  Assign Helper
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Task History Feed */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {historyTasks.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center text-slate-500 text-xs">
                No past tasks in history yet.
              </div>
            ) : (
              historyTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{task.title}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {task.status === 'completed' ? 'Completed & Settled' : 'Cancelled'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{task.categoryName}</span>
                      <span>·</span>
                      <span>{task.date} at {task.time}</span>
                      <span>·</span>
                      <span>Amount: <strong>₹{task.budget}</strong></span>
                      {task.assignedHelperName && (
                        <>
                          <span>·</span>
                          <span>Helper: <strong>{task.assignedHelperName}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status === 'completed' && !task.customerRated && (
                      <button
                        onClick={() => setTaskForRating(task)}
                        className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition-colors"
                      >
                        ★ Rate Helper
                      </button>
                    )}

                    {task.status === 'completed' && task.customerRated && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Rated
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {taskForRating && (
        <RatingModal
          task={taskForRating}
          isOpen={!!taskForRating}
          onClose={() => setTaskForRating(null)}
          onSubmitRating={(taskId, rating, comment) => {
            rateTask(taskId, rating, comment);
            setTaskForRating(null);
          }}
        />
      )}

      {/* Helper Profile Modal */}
      <HelperProfileModal
        helper={selectedHelperForProfile}
        isOpen={!!selectedHelperForProfile}
        onClose={() => setSelectedHelperForProfile(null)}
        showAssignButton={false}
      />
    </div>
  );
};
