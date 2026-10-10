import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface Props {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<Props> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md border border-slate-700/60 animate-in slide-in-from-bottom-3 duration-200">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 text-slate-400 hover:text-white rounded-lg transition"
        aria-label="বন্ধ করুন"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
