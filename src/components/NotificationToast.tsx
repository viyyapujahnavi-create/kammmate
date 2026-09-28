import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, ShieldAlert, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeNotificationToast, dismissToast } = useApp();

  useEffect(() => {
    if (activeNotificationToast) {
      const timer = setTimeout(() => {
        dismissToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeNotificationToast, dismissToast]);

  if (!activeNotificationToast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl p-4 shadow-2xl border border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
          {activeNotificationToast.type === 'verification' ? (
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
        </div>
        <div className="flex-1 pr-2">
          <h5 className="text-xs font-bold text-white">{activeNotificationToast.title}</h5>
          <p className="text-xs text-slate-300 mt-0.5 leading-snug">{activeNotificationToast.message}</p>
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
