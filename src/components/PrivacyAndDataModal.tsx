import React, { useRef, useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Download,
  Upload,
  FileSpreadsheet,
  Trash2,
  X,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';
import { Language, Transaction } from '../types';
import { downloadBackupJSON, parseBackupJSON } from '../utils/storage';
import { exportToCSV } from '../utils/formatters';
import { t } from '../utils/translations';

interface Props {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onRestoreTransactions: (restored: Transaction[]) => void;
  onOpenClearAllConfirm: () => void;
  onShowToast: (msg: string) => void;
}

export const PrivacyAndDataModal: React.FC<Props> = ({
  language,
  isOpen,
  onClose,
  transactions,
  onRestoreTransactions,
  onOpenClearAllConfirm,
  onShowToast,
}) => {
  const trans = t[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreError, setRestoreError] = useState<string>('');

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    if (transactions.length === 0) {
      onShowToast(trans.toastNoDataBackup);
      return;
    }
    downloadBackupJSON(transactions);
    onShowToast(trans.toastBackupSuccess);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      onShowToast(trans.toastNoDataCsv);
      return;
    }
    exportToCSV(transactions, language);
    onShowToast(trans.toastCsvSuccess);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = parseBackupJSON(content);
      if (res.success && res.data) {
        onRestoreTransactions(res.data);
        onShowToast(`${trans.toastRestoreSuccess} (${res.data.length})`);
        setRestoreError('');
        onClose();
      } else {
        setRestoreError(res.error || (language === 'en' ? 'Invalid backup file.' : 'ফাইলটি সঠিক নয়।'));
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {trans.privacyModalTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {trans.privacyModalSubtitle}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Privacy Guarantee Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans.privacyGuaranteeTitle}</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed pl-6">
              {trans.privacyGuaranteeDesc}
            </p>
          </div>

          {/* Browser Cache Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{trans.privacyAlertTitle}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed pl-6">
              {trans.privacyAlertDesc}
            </p>
          </div>

          {/* Data Backup & Export Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-600" />
              <span>{trans.backupSectionTitle}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* CSV Export for Excel */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{trans.excelCardTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {trans.excelCardDesc}
                  </div>
                </div>
              </button>

              {/* JSON Backup Download */}
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 text-left transition flex items-start gap-3 group"
              >
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-105 transition shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{trans.backupDownloadTitle}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {trans.backupDownloadDesc}
                  </div>
                </div>
              </button>
            </div>

            {/* Restore from JSON */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-200 text-slate-700 shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{trans.restoreCardTitle}</div>
                  <div className="text-xs text-slate-500">
                    {trans.restoreCardDesc}
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="backup-file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 shadow-xs transition"
                >
                  {trans.selectFile}
                </button>
              </div>
            </div>

            {restoreError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                {restoreError}
              </div>
            )}
          </div>

          {/* Danger Zone: Clear all data */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>{trans.dangerZoneTitle}</span>
            </h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-red-50/60 border border-red-200">
              <p className="text-xs text-red-700 leading-relaxed">
                {trans.dangerZoneDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenClearAllConfirm();
                }}
                className="shrink-0 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition"
              >
                {trans.dangerZoneBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition"
          >
            {trans.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
};
