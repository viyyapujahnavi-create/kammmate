import React from 'react';
import { User, Review } from '../types';
import { HelperWithDistance, useApp } from '../context/AppContext';
import { X, Star, ShieldCheck, MapPin, CheckCircle, Clock, Award, FileText, Phone } from 'lucide-react';
import { formatDistance } from '../utils/geo';
import { CategoryIcon } from './CategoryIcon';

interface HelperProfileModalProps {
  helper: User | HelperWithDistance | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign?: (helperId: string) => void;
  showAssignButton?: boolean;
}

export const HelperProfileModal: React.FC<HelperProfileModalProps> = ({
  helper,
  isOpen,
  onClose,
  onAssign,
  showAssignButton = true,
}) => {
  const { reviews, categories } = useApp();

  if (!isOpen || !helper) return null;

  const helperReviews = reviews.filter((r) => r.helperId === helper.id);
  const distance = 'distanceKm' in helper ? helper.distanceKm : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <img
              src={helper.avatar}
              alt={helper.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{helper.name}</h3>
                {helper.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="w-3.5 h-3.5" /> ID Verified
                  </span>
                )}
                {helper.verificationStatus === 'pending' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    <Clock className="w-3.5 h-3.5" /> Verification Pending
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center text-amber-300 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 mr-1" /> {helper.rating} ({helper.reviewCount} reviews)
                </span>
                <span>·</span>
                <span>{helper.completedTasksCount} completed tasks</span>
                {distance !== undefined && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium flex items-center">
                      <MapPin className="w-3 h-3 mr-0.5" /> {formatDistance(distance)} away
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">Default Rate</span>
              <span className="text-sm font-bold text-slate-900">
                ₹{helper.fixedRateDefault || helper.hourlyRate} / task
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Availability</span>
              <span className={`text-sm font-bold ${helper.isAvailable !== false ? 'text-emerald-600' : 'text-slate-400'}`}>
                {helper.isAvailable !== false ? 'Available Now' : 'Busy'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Service Radius</span>
              <span className="text-sm font-bold text-slate-900">
                {helper.serviceRadiusKm || 5.0} km
              </span>
            </div>
          </div>

          {/* Bio */}
          {helper.bio && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                About Helper
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl shadow-2xs">
                {helper.bio}
              </p>
            </div>
          )}

          {/* Skills & Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Registered Skills &amp; Services
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {helper.skills?.map((skillId) => {
                const cat = categories.find((c) => c.id === skillId);
                return (
                  <div
                    key={skillId}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <CategoryIcon name={cat?.icon || 'HelpCircle'} className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">
                        {cat?.name || skillId}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {cat?.isSkilled ? 'Skilled Service' : 'General Assistance'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualifications & Certification Document Preview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Identity &amp; Qualification Verification
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 block">Government ID Verification</span>
                    <span className="text-[11px] text-slate-500">{helper.idProofType || 'Aadhaar / National ID (Simulated)'}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>

              {helper.certificateTitle ? (
                <div className="pt-3 border-t border-slate-200/80">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-slate-900 block">Trade / Professional Credential</span>
                        <span className="text-[11px] text-slate-600">{helper.certificateTitle}</span>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      helper.verificationStatus === 'verified'
                        ? 'text-emerald-700 bg-emerald-100/70'
                        : 'text-amber-800 bg-amber-100'
                    }`}>
                      {helper.verificationStatus === 'verified' ? 'Qualification Verified' : 'Under Review'}
                    </span>
                  </div>
                  {helper.certificateDocumentUrl && (
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 bg-white p-2 rounded border border-slate-200">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>Certificate Document On File (Admin Audited)</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  General errand helper. No professional trade degree mandatory for general shopping, cleaning, and delivery.
                </div>
              )}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 italic">
              Demo Notice: Helper credentials and verification statuses shown are simulated for prototype evaluation.
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Customer Reviews ({helperReviews.length})
            </h4>
            {helperReviews.length > 0 ? (
              <div className="space-y-2.5">
                {helperReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-800">{rev.customerName}</span>
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                        {rev.rating}
                      </div>
                    </div>
                    <p className="text-slate-600 italic">&ldquo;{rev.comment}&rdquo;</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{rev.createdAt} · {rev.taskTitle}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No reviews yet for this helper.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>{helper.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
            {showAssignButton && onAssign && (
              <button
                onClick={() => {
                  onAssign(helper.id);
                  onClose();
                }}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Assign This Helper
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
