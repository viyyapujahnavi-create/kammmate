import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  UserCheck,
  Lock,
  HelpCircle,
  X
} from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportReason, setReportReason] = useState('Unpunctual / Delayed response');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Trust &amp; Community Integrity</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Trust, Safety &amp; Qualification System
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          How KaamMate ensures safe neighborly assistance through our strict 5 km radius, government ID checks, and mandatory trade credential verification for skilled services.
        </p>
      </div>

      {/* 4 Pillars of Safety Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Identity Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every helper uploads a verified government identity document (Aadhaar, Voter ID, or Driving License) before taking any tasks.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Trade Credential Gate</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Plumbing and electrical work strictly require verified vocational trade certificates (ITI, Wireman License). Unverified helpers are blocked.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Simulated Escrow</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Payments are withheld safely until the customer verifies the completed work. No upfront cash leaks or uncompleted task disputes.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Neighborhood Support</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            24/7 dedicated support desk and simulated SOS reporting if anything feels unsafe or does not meet agreed expectations.
          </p>
        </div>
      </div>

      {/* Two-Tier Qualification Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Qualification Architecture Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Understanding why some tasks require trade certificates while others do not.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Errands Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">Tier 1: General Neighborhood Tasks</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                General Access
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Errands such as grocery shopping, printing &amp; photocopying, domestic cleaning, gardening, and pet walking.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Account &amp; Phone Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aadhaar / National ID Proof Checked</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No trade license or degree required</span>
              </li>
            </ul>
          </div>

          {/* Skilled Regulated Tasks Card */}
          <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-indigo-950">Tier 2: Skilled &amp; Technical Services</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Qualification Mandatory
              </span>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              Tasks involving mains electricity, pressurized plumbing, appliances, or academic tutoring.
            </p>
            <ul className="text-xs text-indigo-900 space-y-1.5 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Government ITI or Wireman License required</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Admin human audit before helper is enabled</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Display &ldquo;Qualification Verified&rdquo; badge on profile</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency & Incident Action Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-white">Need Help or Want to Report an Issue?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            If a helper does not show up, work is substandard, or there is any safety concern, you can report the user or cancel the task anytime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-colors whitespace-nowrap"
          >
            Report an Incident / User
          </button>
        </div>
      </div>

      {/* Prototype Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
        <strong>Important Prototype Disclaimer:</strong> KaamMate is a demonstration prototype. User profiles, certificates, coordinates, and mock payments shown are purely simulated for UX and product flow evaluation.
      </div>

      {/* Incident Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Report an Incident</h3>
              <button
                onClick={() => {
                  setShowReportModal(false);
                  setReportSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Incident Report Received</h4>
                <p className="text-xs text-slate-500">
                  Our operations team has received your report. The customer or helper account will be audited within 15 minutes.
                </p>
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportSubmitted(false);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setReportSubmitted(true);
                }}
                className="mt-4 space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Issue Reason
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option>Unpunctual / Delayed response</option>
                    <option>Substandard quality of work</option>
                    <option>Rude behavior or misconduct</option>
                    <option>Dispute regarding budget / extra demands</option>
                    <option>Other concern</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Describe Incident Details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the task and interaction..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-sm"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
