import React, { useState } from 'react';
import { useApp, HelperWithDistance } from '../context/AppContext';
import { SimulatedMap } from '../components/SimulatedMap';
import { HelperProfileModal } from '../components/HelperProfileModal';
import { AssignHelperModal } from '../components/AssignHelperModal';
import {
  MapPin,
  ShieldCheck,
  Star,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserX,
  IndianRupee,
  Layers
} from 'lucide-react';
import { formatDistance } from '../utils/geo';
import { CategoryIcon } from '../components/CategoryIcon';
import { Task } from '../types';

interface NearbyHelpersPageProps {
  initialCategoryId?: string;
  onOpenCreateTaskWithHelper?: (helperId: string) => void;
}

export const NearbyHelpersPage: React.FC<NearbyHelpersPageProps> = ({
  initialCategoryId,
  onOpenCreateTaskWithHelper,
}) => {
  const { categories, tasks, currentUser, assignHelper, getNearbyHelpersForTask } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'shopping-delivery');
  const [activeTab, setActiveTab] = useState<'all' | 'eligible' | 'excluded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHelperForProfile, setSelectedHelperForProfile] = useState<HelperWithDistance | null>(null);
  const [helperToAssign, setHelperToAssign] = useState<HelperWithDistance | null>(null);

  // Pick an active searching task if available (e.g. Jahnavi's grocery task) or default task
  const activeSearchingTask = tasks.find(
    (t) => t.status === 'searching' && (t.customerId === currentUser.id || currentUser.role !== 'customer')
  ) || tasks.find((t) => t.status === 'searching') || null;

  // Retrieve matching helpers for the selected category
  const { eligible, excludedByDistance, excludedByVerification, allWithDistance } = getNearbyHelpersForTask({
    latitude: currentUser.latitude,
    longitude: currentUser.longitude,
    categoryId: selectedCategory,
  });

  const categoryObj = categories.find((c) => c.id === selectedCategory);

  // Filter list by search query and active tab
  const displayHelpers = allWithDistance.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'eligible') return h.isEligibleForCategory;
    if (activeTab === 'excluded') return !h.isEligibleForCategory;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Strict 5 km Hyperlocal Matching</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Nearby Helpers &amp; Geo-Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing available neighbors centered around {currentUser.address || 'Indiranagar 12th Main, Bengaluru'}.
            </p>
          </div>

          {/* Active task badge */}
          {activeSearchingTask && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs max-w-sm">
              <span className="text-emerald-800 font-bold block">
                Active Task Needing Helper:
              </span>
              <span className="text-emerald-900 font-semibold block truncate">
                &ldquo;{activeSearchingTask.title}&rdquo; (₹{activeSearchingTask.budget})
              </span>
            </div>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Simulated Interactive Radar Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="font-semibold text-slate-700">Simulated Radar Canvas</span>
          <span>Click any pin on the map to preview or assign</span>
        </div>
        <SimulatedMap
          helpers={allWithDistance}
          selectedCategoryName={categoryObj?.name}
          onSelectHelper={(helper) => setSelectedHelperForProfile(helper)}
          onAssignHelper={(helper) => {
            if (activeSearchingTask) {
              setHelperToAssign(helper);
            } else if (onOpenCreateTaskWithHelper) {
              onOpenCreateTaskWithHelper(helper.id);
            }
          }}
        />
      </div>

      {/* Matching Results & Statistics Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{eligible.length} suitable helpers found within 5 km</span>
              {eligible.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Ready to Assign
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered for skill &ldquo;{categoryObj?.name}&rdquo; {categoryObj?.isSkilled ? '(Requires Trade Qualification)' : '(General Errand)'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Helpers ({allWithDistance.length})
            </button>
            <button
              onClick={() => setActiveTab('eligible')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'eligible' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Eligible ({eligible.length})
            </button>
            <button
              onClick={() => setActiveTab('excluded')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeTab === 'excluded' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Excluded Beyond 5km / Unverified ({allWithDistance.length - eligible.length})
            </button>
          </div>
        </div>

        {/* Search input inside list */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search helper by name or neighborhood street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Helper Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayHelpers.map((helper) => {
          const isEligible = helper.isEligibleForCategory;
          const isOutsideRadius = helper.distanceKm > 5.0;
          const isUnverified = helper.exclusionReason === 'unverified_skill';

          return (
            <div
              key={helper.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isEligible
                  ? 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                  : 'border-slate-200 bg-slate-50/70 opacity-80'
              }`}
            >
              <div>
                {/* Header: Photo, Name, Distance & Rating */}
                <div className="flex items-start gap-3">
                  <img
                    src={helper.avatar}
                    alt={helper.name}
                    className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{helper.name}</h3>
                      {helper.verificationStatus === 'verified' && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                        {helper.rating}
                      </span>
                      <span>·</span>
                      <span>{helper.completedTasksCount} tasks</span>
                    </div>

                    {/* Distance Badge */}
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      <MapPin className={`w-3.5 h-3.5 ${isOutsideRadius ? 'text-rose-500' : 'text-emerald-600'}`} />
                      <span className={`font-semibold ${isOutsideRadius ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {formatDistance(helper.distanceKm)} away
                      </span>
                      {isOutsideRadius && (
                        <span className="text-[10px] text-rose-500 font-semibold">(Beyond 5 km)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Helper Bio & Address */}
                <div className="mt-3 text-xs text-slate-600 line-clamp-2">
                  {helper.bio || helper.address}
                </div>

                {/* Rates & Verification Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Standard Rate</span>
                    <span className="font-bold text-slate-900">
                      ₹{helper.fixedRateDefault || helper.hourlyRate} / task
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] block">Availability</span>
                    <span className={`font-semibold text-xs ${helper.isAvailable !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {helper.isAvailable !== false ? 'Available Now' : 'Busy'}
                    </span>
                  </div>
                </div>

                {/* Certificate info or exclusion reason notice */}
                {helper.certificateTitle && (
                  <div className="mt-2 p-2 bg-slate-100 rounded-lg text-[11px] text-slate-700 truncate">
                    {helper.certificateTitle}
                  </div>
                )}

                {!isEligible && (
                  <div className="mt-3 p-2 bg-rose-50 border border-rose-100 rounded-lg text-[11px] text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>
                      {isOutsideRadius && 'Excluded by 5 km matching radius limit.'}
                      {isUnverified && 'Qualification verification required.'}
                      {helper.exclusionReason === 'skill_mismatch' && 'Not registered for this category.'}
                      {helper.exclusionReason === 'unavailable' && 'Helper currently set to busy.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedHelperForProfile(helper)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  View Profile
                </button>

                {isEligible ? (
                  <button
                    onClick={() => {
                      if (activeSearchingTask) {
                        setHelperToAssign(helper);
                      } else if (onOpenCreateTaskWithHelper) {
                        onOpenCreateTaskWithHelper(helper.id);
                      }
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors text-center whitespace-nowrap"
                  >
                    Assign Helper
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 py-2 px-3 bg-slate-200 text-slate-400 text-xs font-semibold rounded-lg cursor-not-allowed text-center whitespace-nowrap"
                    title={isOutsideRadius ? 'Outside 5 km limit' : 'Qualification verification required'}
                  >
                    Not Eligible
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Profile Modal */}
      <HelperProfileModal
        helper={selectedHelperForProfile}
        isOpen={!!selectedHelperForProfile}
        onClose={() => setSelectedHelperForProfile(null)}
        onAssign={(helperId) => {
          const h = allWithDistance.find((x) => x.id === helperId);
          if (h && activeSearchingTask) {
            setHelperToAssign(h);
          }
        }}
        showAssignButton={!!activeSearchingTask}
      />

      {/* Assign Helper Confirmation Modal */}
      <AssignHelperModal
        helper={helperToAssign}
        task={activeSearchingTask}
        isOpen={!!helperToAssign}
        onClose={() => setHelperToAssign(null)}
        onConfirm={(taskId, helperId) => {
          assignHelper(taskId, helperId);
          setHelperToAssign(null);
        }}
      />
    </div>
  );
};
