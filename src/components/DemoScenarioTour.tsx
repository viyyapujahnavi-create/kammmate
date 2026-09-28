import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, X, Play } from 'lucide-react';

interface DemoScenarioTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (view: string) => void;
}

export const DemoScenarioTour: React.FC<DemoScenarioTourProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const {
    tasks,
    assignHelper,
    startTask,
    markTaskCompleted,
    confirmTaskCompletion,
    rateTask,
    switchUser,
    resetDemoData,
    users,
    earnings
  } = useApp();

  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const groceryTask = tasks.find((t) => t.id === 'task-groceries-01') || tasks[0];
  const rahulUser = users.find((u) => u.id === 'helper-rahul');

  // Step 1: Jahnavi views matching helpers within 5 km (Rahul 1.2km, Priya 2.1km, Ravi 3.7km, Vikram 6.8km excluded)
  const handleAssignRahul = () => {
    if (groceryTask) {
      assignHelper(groceryTask.id, 'helper-rahul');
      switchUser('helper-rahul');
      setActiveStep(2);
      onNavigateTo('helper_dash');
    }
  };

  // Step 2: Rahul starts task
  const handleStartTask = () => {
    if (groceryTask) {
      startTask(groceryTask.id);
      setActiveStep(3);
    }
  };

  // Step 3: Rahul marks completed
  const handleMarkCompleted = () => {
    if (groceryTask) {
      markTaskCompleted(groceryTask.id);
      switchUser('user-jahnavi');
      setActiveStep(4);
      onNavigateTo('customer_dash');
    }
  };

  // Step 4: Jahnavi confirms completion & releases ₹150
  const handleConfirmCompletion = () => {
    if (groceryTask) {
      confirmTaskCompletion(groceryTask.id);
      setActiveStep(5);
    }
  };

  // Step 5: Jahnavi rates Rahul 5 stars
  const handleRateRahul = () => {
    if (groceryTask) {
      rateTask(groceryTask.id, 5, 'Rahul picked fresh vegetables quickly and delivered right on time! Super helpful.');
      setActiveStep(6);
      switchUser('helper-rahul');
      onNavigateTo('helper_dash');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Core Flow Walkthrough
              </h3>
              <p className="text-[11px] text-slate-500">
                Evaluating: Need &rarr; Match &rarr; Assign &rarr; Complete &rarr; Pay &rarr; Review
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-1">
          {[1, 2, 3, 4, 5, 6].map((st) => (
            <div
              key={st}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                activeStep === st
                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                  : activeStep > st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {activeStep > st ? '✓' : st}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
          {activeStep === 1 && (
            <div>
              <span className="font-bold text-slate-900 block mb-1 text-sm">
                Step 1: Match &amp; Assign Rahul Kumar
              </span>
              <p className="text-slate-600 leading-relaxed">
                Customer <strong>Jahnavi</strong> has posted <em>&ldquo;Buy groceries from nearby market&rdquo;</em> (₹150).
                The system filters available helpers:
              </p>
              <div className="mt-2 space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                <div className="text-emerald-700 font-semibold">✓ Rahul Kumar: 1.2 km (Eligible)</div>
                <div className="text-emerald-700 font-semibold">✓ Priya Sharma: 2.1 km (Eligible)</div>
                <div className="text-emerald-700 font-semibold">✓ Ravi Kumar: 3.7 km (Eligible)</div>
                <div className="text-rose-600 font-semibold">✕ Vikram Singh: 6.8 km (Excluded beyond 5 km)</div>
              </div>
              <button
                onClick={handleAssignRahul}
                className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Assign Rahul &amp; Switch to Rahul&apos;s Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <span className="font-bold text-slate-900 block mb-1 text-sm">
                Step 2: Rahul Accepts &amp; Starts Task
              </span>
              <p className="text-slate-600 leading-relaxed">
                Now logged in as <strong>Rahul Kumar (Helper)</strong>. Rahul has received the grocery assignment and is arriving at the market.
              </p>
              <button
                onClick={handleStartTask}
                className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4" />
                <span>Rahul clicks &ldquo;Start Task&rdquo;</span>
              </button>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <span className="font-bold text-slate-900 block mb-1 text-sm">
                Step 3: Rahul Finishes Grocery Shopping
              </span>
              <p className="text-slate-600 leading-relaxed">
                Rahul picked the tomatoes, onions, coriander and brown bread and delivered them to Jahnavi&apos;s gate.
              </p>
              <button
                onClick={handleMarkCompleted}
                className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Completed &amp; Switch back to Jahnavi</span>
              </button>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <span className="font-bold text-slate-900 block mb-1 text-sm">
                Step 4: Jahnavi Confirms &amp; Releases ₹150 Escrow
              </span>
              <p className="text-slate-600 leading-relaxed">
                Logged in as <strong>Jahnavi</strong>. She checks the grocery bag, confirms everything is fresh, and releases payment.
              </p>
              <button
                onClick={handleConfirmCompletion}
                className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Confirm Completion &amp; Release ₹150</span>
              </button>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <span className="font-bold text-slate-900 block mb-1 text-sm">
                Step 5: Community Rating &amp; Review
              </span>
              <p className="text-slate-600 leading-relaxed">
                Jahnavi submits a 5-star rating for Rahul Kumar with praise for his prompt delivery.
              </p>
              <button
                onClick={handleRateRahul}
                className="mt-4 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Submit 5-Star Review &amp; Check Rahul&apos;s Earnings</span>
              </button>
            </div>
          )}

          {activeStep === 6 && (
            <div className="text-center py-2 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">
                Core Scenario Successfully Verified!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rahul Kumar&apos;s wallet has received +₹150, his completed task count increased, and his profile now has Jahnavi&apos;s 5-star review.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    resetDemoData();
                    setActiveStep(1);
                    onNavigateTo('customer_dash');
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
