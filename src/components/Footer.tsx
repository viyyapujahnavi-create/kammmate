import React from 'react';
import { ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pb-16 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <span className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                K
              </span>
              <span>KaamMate</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Need a hand? Find a nearby one. Connecting people who need everyday tasks done with trusted nearby helpers within 5 km.
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Hub: Indiranagar, Bengaluru</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('landing')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('categories')} className="hover:text-white transition-colors">
                  Categories &amp; Rates
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('nearby')} className="hover:text-white transition-colors">
                  5 km Nearby Radar
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('safety')} className="hover:text-white transition-colors">
                  Trust &amp; Verification Rules
                </button>
              </li>
            </ul>
          </div>

          {/* User Roles */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 text-xs uppercase tracking-wider">User Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('customer_dash')} className="hover:text-white transition-colors">
                  Customer Dashboard (Jahnavi)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('helper_dash')} className="hover:text-white transition-colors">
                  Helper Dashboard (Rahul Kumar)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin_dash')} className="hover:text-white transition-colors">
                  Admin Verification Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="text-slate-200 font-bold mb-3 text-xs uppercase tracking-wider">Safety &amp; Escrow</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              All skilled trades (plumbing, electrical) require verified trade credentials. Task payments remain safely in escrow until customer confirmation.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated Escrow Protection</span>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-slate-400">
          <p>
            &copy; 2026 KaamMate Inc. <strong>Prototype/Demo Platform:</strong> Locations, users, prices, payments and verification statuses shown are simulated.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setCurrentView('safety')} className="hover:text-slate-200">
              Terms of Demo
            </button>
            <span>·</span>
            <button onClick={() => setCurrentView('safety')} className="hover:text-slate-200">
              Privacy Simulation
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
