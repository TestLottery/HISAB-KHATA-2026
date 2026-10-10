import React from 'react';
import {
  Shield,
  FileSpreadsheet,
  Share2,
  Languages,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  language: Language;
  onToggleLanguage: () => void;
  useBengaliDigits: boolean;
  onToggleDigits: () => void;
  onOpenPrivacyModal: () => void;
  onOpenShareModal: () => void;
  onExportCSV: () => void;
}

export const Navbar: React.FC<Props> = ({
  language,
  onToggleLanguage,
  useBengaliDigits,
  onToggleDigits,
  onOpenPrivacyModal,
  onOpenShareModal,
  onExportCSV,
}) => {
  const trans = t[language];

  return (
    <header className="sticky top-0 z-30 bg-emerald-900/95 backdrop-blur-md text-white border-b border-emerald-800 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-emerald-950 font-black flex items-center justify-center text-lg shadow-sm shrink-0 border border-amber-300">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                {trans.appName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-800/80 text-emerald-200 border border-emerald-700/60 hidden sm:inline-block">
                {trans.offlineBadge}
              </span>
            </div>
            <p className="text-[10px] text-emerald-300 hidden sm:block">
              {trans.appSubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher Button (বাংলা / English) */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-700 flex items-center gap-1.5 transition shadow-xs"
            title={language === 'bn' ? 'Switch to English' : 'বাংলা ভাষায় দেখুন'}
          >
            <Languages className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Toggle digits between English and Bengali digits */}
          <button
            onClick={onToggleDigits}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1 ${
              useBengaliDigits
                ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-xs'
                : 'bg-emerald-800/70 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
            }`}
            title={useBengaliDigits ? trans.digitsToggleEn : trans.digitsToggleBn}
          >
            <span className="font-bold">{useBengaliDigits ? '১২৩' : '123'}</span>
          </button>

          {/* Export CSV Quick */}
          <button
            onClick={onExportCSV}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-800/70 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-medium transition flex items-center gap-1.5"
            title="CSV Export"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span className="hidden md:inline">{trans.excelButton}</span>
          </button>

          {/* Privacy & Backup Modal */}
          <button
            onClick={onOpenPrivacyModal}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-800/70 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-medium transition flex items-center gap-1.5"
            title={trans.privacyModalTitle}
          >
            <Shield className="w-4 h-4 text-emerald-300" />
            <span className="hidden md:inline">{trans.backupButton}</span>
          </button>

          {/* Share & Free Hosting Guide */}
          <button
            onClick={onOpenShareModal}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-800/70 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-medium transition flex items-center gap-1.5"
            title={trans.shareTitle}
          >
            <Share2 className="w-4 h-4 text-emerald-300" />
            <span className="hidden md:inline">{trans.shareButton}</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton language={language} />
        </div>
      </div>
    </header>
  );
};

