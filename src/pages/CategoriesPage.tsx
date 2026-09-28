import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { ShieldCheck, Search, Info, PlusCircle, ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  onOpenCreateTask: (categoryId?: string) => void;
  onExploreHelpers: (categoryId: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onOpenCreateTask,
  onExploreHelpers,
}) => {
  const { categories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'general' | 'skilled'>('all');

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'skilled'
        ? c.isSkilled
        : !c.isSkilled;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Service Categories &amp; Sample Rates
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find reliable assistance for home, errands, and skilled maintenance. Sample demo rates; actual rates may vary.
            </p>
          </div>

          <button
            onClick={() => onOpenCreateTask()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Task in Any Category</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 flex-1 min-w-[240px] px-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search category, task or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (12)
            </button>
            <button
              onClick={() => setFilterType('general')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General Errands (8)
            </button>
            <button
              onClick={() => setFilterType('skilled')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === 'skilled' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Skilled / Regulated (4)
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <CategoryIcon name={cat.icon} className="w-6 h-6" />
                </div>
                {cat.isSkilled ? (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Qualification Required
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    General Task
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{cat.fullDesc}</p>

              {/* Qualification Details */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5">Verification Rule:</span>
                <span className="text-slate-500 leading-snug">{cat.qualificationNote}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-400">Sample Demo Rate:</span>
                <span className="font-bold text-slate-900 text-sm">{cat.samplePriceDisplay}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onExploreHelpers(cat.id)}
                  className="py-2 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg text-center transition-colors"
                >
                  Nearby Helpers
                </button>
                <button
                  onClick={() => onOpenCreateTask(cat.id)}
                  className="py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                >
                  <span>Post Task</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Notice */}
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Demo Notice &amp; Rates Policy:</strong> Sample demo rates are indicative guidelines for Bangalore Indiranagar area in this prototype. Actual real-world pricing depends on task complexity, materials required, and mutual customer-helper agreement.
        </div>
      </div>
    </div>
  );
};
