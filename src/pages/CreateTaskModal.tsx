import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowRight, ArrowLeft, Check, ShieldCheck, MapPin, Calendar, Clock, IndianRupee } from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';
import { PaymentType } from '../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryId?: string;
  onTaskCreated: (taskId: string) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  initialCategoryId,
  onTaskCreated,
}) => {
  const { categories, currentUser, createTask } = useApp();

  const [step, setStep] = useState<number>(1);
  const [categoryId, setCategoryId] = useState<string>(initialCategoryId || 'shopping-delivery');
  const [title, setTitle] = useState<string>('Pick up urgent groceries and bread');
  const [description, setDescription] = useState<string>(
    'Need 1 kg farm fresh carrots, milk packets, and brown bread picked up from Namdhari or MK Retail on 100 Feet Road.'
  );
  const [date, setDate] = useState<string>('Today, 28 Sep');
  const [time, setTime] = useState<string>('03:30 PM');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [locationAddress, setLocationAddress] = useState<string>(
    currentUser.address || 'Indiranagar 12th Main, Bengaluru'
  );
  const [paymentType, setPaymentType] = useState<PaymentType>('fixed');
  const [budget, setBudget] = useState<number>(150);
  const [specialInstructions, setSpecialInstructions] = useState<string>(
    'Please call before checking out from the store if anything is unavailable.'
  );

  if (!isOpen) return null;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = createTask({
      categoryId,
      categoryName: selectedCategory?.name || 'Everyday Errand',
      title,
      description,
      latitude: currentUser.latitude || 12.9716,
      longitude: currentUser.longitude || 77.5946,
      locationAddress,
      date,
      time,
      durationHours,
      paymentType,
      budget,
      specialInstructions,
    });

    onTaskCreated(created.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200">
        
        {/* Header with Steps */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 p-5 z-10 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Step {step} of 3
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {step === 1 && 'Select Task Category'}
              {step === 2 && 'Task Description & Schedule'}
              {step === 3 && 'Location, Budget & Review'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* STEP 1: Category Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Choose the service category:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setCategoryId(cat.id);
                        if (cat.rateType === 'hourly') {
                          setPaymentType('hourly');
                          setBudget(cat.minPrice * 1.5);
                        } else {
                          setPaymentType('fixed');
                          setBudget(Math.round((cat.minPrice + cat.maxPrice) / 2));
                        }
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                          {cat.samplePriceDisplay}
                        </span>
                        {cat.isSkilled && (
                          <span className="text-[10px] text-indigo-700 font-semibold block mt-1">
                            Requires trade qualification
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedCategory?.isSkilled && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Trade Qualification Verified:</strong> For {selectedCategory.name}, only verified professionals who passed credential check within 5 km will be matched.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Title, Description, Schedule */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Buy groceries from nearby market"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Details &amp; Items *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify items, store names, exact tasks to perform..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Today, 28 Sep"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="03:30 PM"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Duration
                </label>
                <div className="flex items-center gap-2">
                  {[0.5, 1, 1.5, 2, 3].map((hr) => (
                    <button
                      type="button"
                      key={hr}
                      onClick={() => setDurationHours(hr)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        durationHours === hr
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {hr} hr{hr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location, Payment, Special Instructions & Final Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Task Location Address (Indiranagar 5 km Hub) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Simulated Center: 12.9716° N, 77.5946° E. Only helpers within 5 km will be matched.
                </span>
              </div>

              {/* Payment Type & Budget */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Payment Structure</span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentType('fixed')}
                      className={`px-2.5 py-1 rounded font-semibold ${
                        paymentType === 'fixed' ? 'bg-slate-900 text-white' : 'text-slate-600'
                      }`}
                    >
                      Fixed Task Price
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType('hourly')}
                      className={`px-2.5 py-1 rounded font-semibold ${
                        paymentType === 'hourly' ? 'bg-slate-900 text-white' : 'text-slate-600'
                      }`}
                    >
                      Hourly Rate
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-600 font-semibold block">Your Budget Offer</span>
                    <span className="text-[11px] text-slate-400">
                      Sample range: {selectedCategory?.samplePriceDisplay}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-700">₹</span>
                    <input
                      type="number"
                      required
                      min={30}
                      value={budget}
                      onChange={(e) => setBudget(parseInt(e.target.value, 10) || 0)}
                      className="w-24 text-sm font-bold p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Call upon reaching gate; bring change for ₹500"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Review summary strip */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>{title}</span>
                  <span>₹{budget} ({paymentType})</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  {selectedCategory?.name} · {date} at {time} · 5 km nearby radar matching
                </div>
              </div>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Broadcast Task Within 5 km</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
