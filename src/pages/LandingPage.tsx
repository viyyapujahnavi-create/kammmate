import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  IndianRupee,
  Layers
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';

// Generated Hero & Lifestyle visual images
const HERO_IMAGE_URL = '/src/assets/images/hero_community_help_1790578116445.jpg';
const SERVICE_VISUAL_URL = '/src/assets/images/service_tasks_visual_1790578133514.jpg';

interface LandingPageProps {
  setCurrentView: (view: string) => void;
  onOpenCreateTask: (categoryId?: string) => void;
  onSelectCategoryFilter: (categoryId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentView,
  onOpenCreateTask,
  onSelectCategoryFilter,
}) => {
  const { categories, reviews, switchRole } = useApp();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Hyperlocal 5 km Matching Prototype</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Need a hand? <br />
                <span className="text-emerald-600">Find a nearby one.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connect with verified people living within <strong>5 km</strong> for everyday market shopping, document courier, home chores, repairs, and technical assistance.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenCreateTask()}
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Post a Task Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    switchRole('helper');
                    setCurrentView('helper_dash');
                  }}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all border border-slate-200 flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Earn by Helping</span>
                </button>
              </div>

              {/* Social Proof & Metrics Strip */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    5k
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">5 km Strict Radius</span>
                    <span>No distant delays</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">Verified Trades</span>
                    <span>Plumbing &amp; Electrical</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    ★
                  </div>
                  <div>
                    <span className="block font-bold text-slate-800">4.8 / 5.0 Rating</span>
                    <span>Neighborhood trusted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 aspect-[4/3] sm:aspect-[16/11]">
                <img
                  src={HERO_IMAGE_URL}
                  alt="Neighborhood community members and helpers in a sunny residential area"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to stylized SVG card if local image path fails in any test runner
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Floating Simulation Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-white text-xs flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Indiranagar Hub · 5 km Radius Active</span>
                </div>

                {/* Preloaded Demo Task Card Floating */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Demo Task: Buy Groceries
                    </span>
                    <span className="font-bold text-emerald-700">₹150</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">
                    Rahul Kumar (1.2 km away) matched &amp; ready to pickup from local market.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Everyday Services
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Tasks Handled Nearby
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sample demo rates shown. Transparent hourly or fixed pricing.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('categories')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All 12 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-800 group-hover:bg-emerald-50 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                    <CategoryIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  {cat.isSkilled ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      Verified Trade
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-500">
                      General Errand
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                  {cat.shortDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sample Rate</span>
                  <span className="text-xs font-bold text-slate-800">{cat.samplePriceDisplay}</span>
                </div>

                <button
                  onClick={() => onOpenCreateTask(cat.id)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Post Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works - Step by Step */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simple &amp; Fast Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How KaamMate Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              From posting an errand to getting it done by someone 5 minutes away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Post a Task',
                desc: 'Pick category, set budget, date/time, and add your local instructions.',
              },
              {
                step: '02',
                title: 'Find Within 5 km',
                desc: 'Our geo-filter scans available, verified neighbors in your immediate locality.',
              },
              {
                step: '03',
                title: 'Choose Helper',
                desc: 'Check ratings, distance, past tasks, and confirm assignment.',
              },
              {
                step: '04',
                title: 'Get It Done',
                desc: 'Helper completes the task. Real-time progress updates on your timeline.',
              },
              {
                step: '05',
                title: 'Confirm & Rate',
                desc: 'Release simulated payment from escrow and leave a community review.',
              },
            ].map((s, idx) => (
              <div
                key={s.step}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-xl font-black text-emerald-600/40 block mb-2">
                    {s.step}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick interactive shortcut to radar map */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setCurrentView('nearby')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore Interactive 5 km Radar Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Verification Rules (Anti-Slop, Clear Policy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dual-Tier Qualification Architecture</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Clear Safety Rules: General vs. Skilled Services
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We separate basic everyday errands from regulated trades to ensure complete safety and peace of mind.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">
                  1. Everyday Tasks (Shopping, Delivery, Household, Gardening)
                </span>
                <span className="text-slate-600">
                  Requires government photo ID verification and active account check. No specialized trade diploma required.
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs">
                <span className="font-bold text-indigo-900 block mb-0.5">
                  2. Skilled &amp; Technical Services (Plumbing, Electrical, Tech)
                </span>
                <span className="text-indigo-800">
                  Qualification verification required. Helpers must submit certified ITI / wireman license or verified degree. Only verified helpers can accept skilled tasks.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md aspect-[4/3]">
              <img
                src={SERVICE_VISUAL_URL}
                alt="Everyday neighborhood tools and service checklist"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Testimonials & Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Real Experiences
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Trusted in the Neighborhood
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Read recent demo feedback from real customer-helper interactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center text-amber-400 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{rev.customerName}</span>
                  <span className="text-[11px] text-slate-400">{rev.taskTitle}</span>
                </div>
                <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
