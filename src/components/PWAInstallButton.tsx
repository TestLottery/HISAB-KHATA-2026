import React, { useState } from 'react';
import { Download, Smartphone, X, Share, MoreVertical, Globe } from 'lucide-react';
import { Language } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  language?: Language;
}

export const PWAInstallButton: React.FC<Props> = ({ language = 'bn' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside installed standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const isEn = language === 'en';

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-emerald-950 text-xs font-bold shadow-md transition active:scale-95 border border-amber-300"
        title={isEn ? 'Install as App on Mobile / PC' : 'মোবাইলে অ্যাপ হিসেবে ইনস্টল করুন'}
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{isEn ? 'Install App' : 'অ্যাপ ইনস্টল'}</span>
        <span className="sm:hidden">{isEn ? 'Install' : 'ইনস্টল'}</span>
      </button>

      {/* Guided Modal for Android, Chrome, and iOS */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>{isEn ? 'How to Install on Mobile' : 'মোবাইলে অ্যাপ ইনস্টল করার নিয়ম'}</span>
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-700 leading-relaxed">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      ১
                    </span>
                    <div>
                      Safari ব্রাউজারের নিচে থাকা <strong className="inline-flex items-center gap-1"><Share className="w-3 h-3 text-blue-500" /> Share</strong> বাটনে ট্যাপ করুন।
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      ২
                    </span>
                    <div>
                      তালিকা থেকে <strong>"Add to Home Screen"</strong> বেছে নিন।
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      ৩
                    </span>
                    <div>
                      উপরে ডানে <strong>"Add"</strong> চাপলেই হোম স্ক্রিনে অ্যাপ আইকন তৈরি হয়ে যাবে!
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 1: Open in Chrome */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      ১
                    </span>
                    <div>
                      <strong>সরাসরি Google Chrome-এ খুলুন:</strong>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        WhatsApp বা Messenger-এর ভেতরের ব্রাউজার থেকে লিংকে ঢুকলে মেনুতে ৩টি ডটে চেপে <strong>"Open in Chrome"</strong> নির্বাচন করুন।
                      </p>
                    </div>
                  </div>

                  {/* Step 2: 3 dots menu */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      ২
                    </span>
                    <div>
                      ক্রোম ব্রাউজারের একদম উপরে ডানপাশের <strong>৩টি ডট মেনু (<MoreVertical className="w-3.5 h-3.5 inline text-slate-700" />)</strong>-এ চাপুন।
                    </div>
                  </div>

                  {/* Step 3: Install app / Add to home screen */}
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold shrink-0 text-[11px]">
                      ৩
                    </span>
                    <div>
                      মেনুর তালিকা থেকে <strong>"Install app"</strong> অথবা <strong>"Add to Home screen" (হোম স্ক্রিনে যোগ করুন)</strong> চাপুন।
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                    💡 <em>স্যামসাং বা ভিভো ফোনে এটি <strong>"Add page to &gt; Home screen"</strong> নামে থাকতে পারে।</em>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-2xl bg-emerald-700 py-3 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm"
            >
              {isEn ? 'Got it' : 'বুঝেছি, ধন্যবাদ'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
