import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlusCircle,
  User,
  Shield,
  Briefcase,
  Users,
  Compass,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenCreateTask: () => void;
  onRunDemoScenario: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenCreateTask,
  onRunDemoScenario,
}) => {
  const { currentUser, switchUser, switchRole, resetDemoData, tasks } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCustomerTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length;

  return (
    <>
      {/* Demo Simulation Top Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">KaamMate Demo Environment</span>
          <span className="text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">5 km Proximity Matching Active (Bengaluru Central)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRunDemoScenario}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800"
            title="Auto-run customer Jahnavi grocery task assignment to Rahul"
          >
            <Sparkles className="w-3 h-3" /> Auto Demo: Jahnavi &rarr; Rahul
          </button>

          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset simulated data to fresh start"
          >
            <RotateCcw className="w-3 h-3" /> Reset Demo
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-6 Text Links) - Zone 3 (1-2 Primary Actions) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xl font-extrabold tracking-tight text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                K
              </span>
              <span>KaamMate</span>
            </button>
          </div>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setCurrentView('landing')}
              className={`hover:text-slate-900 transition-colors ${currentView === 'landing' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentView('categories')}
              className={`hover:text-slate-900 transition-colors ${currentView === 'categories' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Services &amp; Rates
            </button>

            <button
              onClick={() => setCurrentView('nearby')}
              className={`hover:text-slate-900 transition-colors ${currentView === 'nearby' ? 'text-emerald-700 font-bold' : ''}`}
            >
              5 km Radar &amp; Helpers
            </button>

            <button
              onClick={() => {
                if (currentUser.role === 'customer') setCurrentView('customer_dash');
                else if (currentUser.role === 'helper') setCurrentView('helper_dash');
                else setCurrentView('admin_dash');
              }}
              className={`hover:text-slate-900 transition-colors flex items-center gap-1.5 ${
                ['customer_dash', 'helper_dash', 'admin_dash'].includes(currentView)
                  ? 'text-emerald-700 font-bold'
                  : ''
              }`}
            >
              <span>Dashboard</span>
              {currentUser.role === 'customer' && activeCustomerTasks > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeCustomerTasks}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('safety')}
              className={`hover:text-slate-900 transition-colors ${currentView === 'safety' ? 'text-emerald-700 font-bold' : ''}`}
            >
              Trust &amp; Verification
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions (Post a Task & Role Switcher) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateTask}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Task</span>
            </button>

            {/* Quick Demo Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 transition-colors text-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left hidden lg:block leading-tight">
                  <span className="block font-bold text-slate-800 truncate max-w-[100px]">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {currentUser.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Demo Account
                  </div>

                  <button
                    onClick={() => {
                      switchRole('customer');
                      setCurrentView('customer_dash');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                      currentUser.id === 'user-jahnavi' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Jahnavi Viyyapu</div>
                      <div className="text-[10px] text-slate-500">Customer (Needs Groceries/Tasks)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('helper');
                      setCurrentView('helper_dash');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                      currentUser.id === 'helper-rahul' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Rahul Kumar</div>
                      <div className="text-[10px] text-slate-500">Helper (Verified · 1.2 km away)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchUser('helper-dinesh');
                      setCurrentView('helper_dash');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                      currentUser.id === 'helper-dinesh' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-semibold">Dinesh Rao</div>
                      <div className="text-[10px] text-amber-700">Helper (Pending Qualification Plumber)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setCurrentView('admin_dash');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                      currentUser.role === 'admin' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold">Admin Console</div>
                      <div className="text-[10px] text-slate-500">Verify Helpers &amp; Manage Platform</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 text-xs font-semibold text-slate-700">
            <button
              onClick={() => {
                setCurrentView('landing');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentView('categories');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Services &amp; Rates
            </button>
            <button
              onClick={() => {
                setCurrentView('nearby');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              5 km Nearby Radar
            </button>
            <button
              onClick={() => {
                if (currentUser.role === 'customer') setCurrentView('customer_dash');
                else if (currentUser.role === 'helper') setCurrentView('helper_dash');
                else setCurrentView('admin_dash');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Dashboard ({currentUser.role})
            </button>
            <button
              onClick={() => {
                setCurrentView('safety');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2"
            >
              Trust &amp; Safety
            </button>
            <button
              onClick={() => {
                onOpenCreateTask();
                setMobileMenuOpen(false);
              }}
              className="w-full mt-2 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-center"
            >
              + Post a Task
            </button>
          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom Nav (Within 15% Viewport Cap) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-1.5 px-4 flex items-center justify-around text-center">
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex flex-col items-center text-[10px] ${currentView === 'landing' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
        >
          <Compass className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView('nearby')}
          className={`flex flex-col items-center text-[10px] ${currentView === 'nearby' ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}
        >
          <MapPin className="w-5 h-5" />
          <span>5km Map</span>
        </button>

        <button
          onClick={onOpenCreateTask}
          className="flex flex-col items-center -mt-4"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 mt-0.5">Post</span>
        </button>

        <button
          onClick={() => {
            if (currentUser.role === 'customer') setCurrentView('customer_dash');
            else if (currentUser.role === 'helper') setCurrentView('helper_dash');
            else setCurrentView('admin_dash');
          }}
          className={`flex flex-col items-center text-[10px] ${
            ['customer_dash', 'helper_dash', 'admin_dash'].includes(currentView)
              ? 'text-emerald-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex flex-col items-center text-[10px] text-slate-500"
        >
          <User className="w-5 h-5" />
          <span>Role</span>
        </button>
      </div>
    </>
  );
};
