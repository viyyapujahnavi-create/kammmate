import React from 'react';
import { HelperWithDistance } from '../context/AppContext';
import { Task } from '../types';
import { X, ShieldCheck, Star, MapPin, IndianRupee, CheckCircle2 } from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface AssignHelperModalProps {
  helper: HelperWithDistance | null;
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string, helperId: string) => void;
}

export const AssignHelperModal: React.FC<AssignHelperModalProps> = ({
  helper,
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !helper || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assign Nearby Helper</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirm assignment for &ldquo;{task.title}&rdquo;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Helper Card Details */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src={helper.avatar}
              alt={helper.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">{helper.name}</h4>
                {helper.verificationStatus === 'verified' && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                  {helper.rating}
                </span>
                <span>·</span>
                <span>{helper.completedTasksCount} completed tasks</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Distance:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {formatDistance(helper.distanceKm)} (Within 5 km)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Task Budget:</span>
              <span className="font-semibold text-slate-900 flex items-center gap-0.5 mt-0.5">
                <IndianRupee className="w-3.5 h-3.5 text-slate-700" /> ₹{task.budget} ({task.paymentType})
              </span>
            </div>
          </div>

          {helper.certificateTitle && (
            <div className="mt-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{helper.certificateTitle}</span>
            </div>
          )}
        </div>

        {/* Escrow safety notice */}
        <div className="mt-4 p-3 rounded-lg bg-sky-50 text-[11px] text-sky-800 border border-sky-100 leading-relaxed">
          <strong>Safe Escrow Guarantee:</strong> Payment of ₹{task.budget} will remain securely held until you inspect the completed work and confirm satisfactory completion.
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(task.id, helper.id);
              onClose();
            }}
            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
};
