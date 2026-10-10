import React, { useState } from 'react';
import { Share2, Globe, Github, Zap, Check, Copy, X } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';

interface Props {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const SharePublishGuideModal: React.FC<Props> = ({ language, isOpen, onClose, appUrl }) => {
  const trans = t[language];
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {trans.shareTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {trans.shareSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Direct Share Link Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{trans.shareDirectLink}</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                {trans.shareLiveStatus}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl || window.location.href}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-700 outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? trans.copied : trans.copyLink}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              {trans.shareHint}
            </p>
          </div>

          {/* Free Hosting Alternatives */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{trans.freeHostingTitle}</span>
            </h4>
            <p className="text-xs text-slate-600">
              {trans.freeHostingDesc}
            </p>

            <div className="space-y-2.5">
              {/* Vercel */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    {trans.vercelTitle}
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {trans.vercelDesc}
                </p>
              </div>

              {/* Netlify */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    {trans.netlifyTitle}
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {trans.netlifyDesc}
                </p>
              </div>

              {/* GitHub Pages */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-700" />
                    {trans.githubTitle}
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {trans.githubDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition"
          >
            {trans.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};
