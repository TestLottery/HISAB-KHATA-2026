import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  BarChart3,
  ListOrdered,
  ShieldCheck,
} from 'lucide-react';
import {
  Transaction,
  FilterState,
  TransactionType,
} from './types';
import {
  loadTransactions,
  saveTransactions,
  loadPrefs,
  savePrefs,
  getSampleTransactions,
  clearStoredData,
  UserPrefs,
} from './utils/storage';
import { getTodayDateStr, exportToCSV } from './utils/formatters';
import { getCategoryById, getCategoryDisplayName } from './utils/categories';
import { t } from './utils/translations';
import { Navbar } from './components/Navbar';
import { DashboardCards } from './components/DashboardCards';
import { FilterBar } from './components/FilterBar';
import { TransactionList } from './components/TransactionList';
import { SummaryAnalytics } from './components/SummaryAnalytics';
import { TransactionModal } from './components/TransactionModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PrivacyAndDataModal } from './components/PrivacyAndDataModal';
import { SharePublishGuideModal } from './components/SharePublishGuideModal';
import { Toast } from './components/Toast';

const DEFAULT_FILTER: FilterState = {
  type: 'all',
  category: 'all',
  dateRange: 'all',
  startDate: '',
  endDate: '',
  searchQuery: '',
};

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prefs, setPrefs] = useState<UserPrefs>(loadPrefs());
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics'>('transactions');

  const trans = t[prefs.language];

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [defaultModalType, setDefaultModalType] = useState<TransactionType>('expense');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Initial load
  useEffect(() => {
    const loaded = loadTransactions();
    setTransactions(loaded);
  }, []);

  // Sync to storage on transaction change
  const updateTransactions = (newList: Transaction[]) => {
    setTransactions(newList);
    saveTransactions(newList);
  };

  // Sync preferences
  const updatePrefs = (newPrefs: UserPrefs) => {
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  };

  const handleToggleLanguage = () => {
    const nextLang = prefs.language === 'bn' ? 'en' : 'bn';
    updatePrefs({
      ...prefs,
      language: nextLang,
    });
    setToastMessage(nextLang === 'en' ? 'Language switched to English' : 'ভাষা বাংলায় পরিবর্তিত হয়েছে');
  };

  const handleToggleDigits = () => {
    updatePrefs({
      ...prefs,
      useBengaliDigits: !prefs.useBengaliDigits,
    });
  };

  const handleDismissPrivacyBanner = () => {
    updatePrefs({
      ...prefs,
      privacyNoticeDismissed: true,
    });
  };

  // Add or Edit Transaction
  const handleSaveTransaction = (
    data: Omit<Transaction, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Update
      const updated = transactions.map((tItem) =>
        tItem.id === existingId
          ? { ...tItem, ...data }
          : tItem
      );
      updateTransactions(updated);
      setToastMessage(trans.toastUpdated);
    } else {
      // Create new
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...data,
        createdAt: Date.now(),
      };
      updateTransactions([newTransaction, ...transactions]);
      setToastMessage(data.type === 'income' ? trans.toastIncomeAdded : trans.toastExpenseAdded);
    }
    setEditingTransaction(null);
  };

  // Delete transaction with confirmation
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const filtered = transactions.filter((tItem) => tItem.id !== deleteTarget.id);
    updateTransactions(filtered);
    setToastMessage(trans.toastDeleted);
    setDeleteTarget(null);
  };

  // Clear all data
  const handleConfirmClearAll = () => {
    clearStoredData();
    setTransactions([]);
    setIsClearAllConfirmOpen(false);
    setToastMessage(trans.toastCleared);
  };

  // Load sample data
  const handleLoadSampleData = () => {
    const samples = getSampleTransactions();
    updateTransactions(samples);
    setToastMessage(trans.toastSampleLoaded);
  };

  // Open modal helpers
  const handleOpenAddModal = (type: TransactionType = 'expense') => {
    setEditingTransaction(null);
    setDefaultModalType(type);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tItem: Transaction) => {
    setEditingTransaction(tItem);
    setDefaultModalType(tItem.type);
    setIsModalOpen(true);
  };

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    const todayStr = getTodayDateStr();

    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = `${yesterdayObj.getFullYear()}-${String(yesterdayObj.getMonth() + 1).padStart(2, '0')}-${String(yesterdayObj.getDate()).padStart(2, '0')}`;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonthPrefix = `${currentYear}-${currentMonth}`;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoTime = oneWeekAgo.getTime();

    return transactions.filter((tItem) => {
      // 1. Type filter
      if (filter.type !== 'all' && tItem.type !== filter.type) {
        return false;
      }

      // 2. Category filter
      if (filter.category !== 'all' && tItem.category !== filter.category) {
        return false;
      }

      // 3. Search query
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase().trim();
        const noteMatch = (tItem.note || '').toLowerCase().includes(query);
        const catObj = getCategoryById(tItem.category);
        const categoryMatchBn = catObj.name.toLowerCase().includes(query);
        const categoryMatchEn = catObj.nameEn.toLowerCase().includes(query);
        if (!noteMatch && !categoryMatchBn && !categoryMatchEn) {
          return false;
        }
      }

      // 4. Date range filter
      if (filter.dateRange === 'today') {
        return tItem.date === todayStr;
      }
      if (filter.dateRange === 'yesterday') {
        return tItem.date === yesterdayStr;
      }
      if (filter.dateRange === 'this_week') {
        const tTime = new Date(tItem.date).getTime();
        return tTime >= oneWeekAgoTime;
      }
      if (filter.dateRange === 'this_month') {
        return tItem.date.startsWith(currentMonthPrefix);
      }
      if (filter.dateRange === 'this_year') {
        return tItem.date.startsWith(`${currentYear}-`);
      }
      if (filter.dateRange === 'custom') {
        if (filter.startDate && tItem.date < filter.startDate) return false;
        if (filter.endDate && tItem.date > filter.endDate) return false;
      }

      return true;
    });
  }, [transactions, filter]);

  // Overall totals
  const totalIncome = useMemo(
    () => transactions.filter((tItem) => tItem.type === 'income').reduce((sum, tItem) => sum + tItem.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () => transactions.filter((tItem) => tItem.type === 'expense').reduce((sum, tItem) => sum + tItem.amount, 0),
    [transactions]
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        language={prefs.language}
        onToggleLanguage={handleToggleLanguage}
        useBengaliDigits={prefs.useBengaliDigits}
        onToggleDigits={handleToggleDigits}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onExportCSV={() => {
          if (transactions.length === 0) {
            setToastMessage(trans.toastNoDataCsv);
          } else {
            exportToCSV(transactions, prefs.language);
            setToastMessage(trans.toastCsvSuccess);
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Privacy Notice Banner (Dismissible) */}
        {!prefs.privacyNoticeDismissed && (
          <div className="relative p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {trans.bannerTitle}
                </p>
                <p className="text-emerald-700 text-xs mt-0.5 leading-relaxed">
                  {trans.bannerDesc}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismissPrivacyBanner}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 rounded-lg shrink-0 transition"
            >
              {trans.bannerDismiss}
            </button>
          </div>
        )}

        {/* Dashboard Financial Summary Cards */}
        <DashboardCards
          language={prefs.language}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          useBengaliDigits={prefs.useBengaliDigits}
          transactionCount={transactions.length}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Navigation Tabs: Transactions vs Analytics */}
        <div className="flex items-center justify-between border-b border-slate-200 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition ${
                activeTab === 'transactions'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>
                {trans.tabTransactions} ({filteredTransactions.length})
              </span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition ${
                activeTab === 'analytics'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{trans.tabAnalytics}</span>
            </button>
          </div>

          {/* Quick new entry action */}
          {transactions.length > 0 && activeTab === 'transactions' && (
            <button
              onClick={() => handleOpenAddModal('expense')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{trans.newTransaction}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Transactions View */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            {(transactions.length > 0 || filter !== DEFAULT_FILTER) && (
              <FilterBar
                language={prefs.language}
                filter={filter}
                onChange={setFilter}
                onReset={() => setFilter(DEFAULT_FILTER)}
              />
            )}

            {/* List */}
            <TransactionList
              language={prefs.language}
              transactions={filteredTransactions}
              allTransactionsCount={transactions.length}
              useBengaliDigits={prefs.useBengaliDigits}
              onEdit={handleOpenEditModal}
              onDelete={(tItem) => setDeleteTarget(tItem)}
              onOpenAddModal={() => handleOpenAddModal('expense')}
              onLoadSampleData={handleLoadSampleData}
              onResetFilter={() => setFilter(DEFAULT_FILTER)}
            />
          </div>
        )}

        {/* Tab 2: Analytics & Summary View */}
        {activeTab === 'analytics' && (
          <SummaryAnalytics
            language={prefs.language}
            transactions={transactions}
            useBengaliDigits={prefs.useBengaliDigits}
          />
        )}
      </main>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <button
          onClick={() => handleOpenAddModal('expense')}
          className="w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-700/40 flex items-center justify-center hover:scale-105 active:scale-95 transition"
          aria-label={trans.newTransaction}
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-700">
            {trans.footerTitle}
          </p>
          <p className="text-slate-400">
            {trans.footerSub}
          </p>
        </div>
      </footer>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        language={prefs.language}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialTransaction={editingTransaction}
        defaultType={defaultModalType}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title={trans.confirmDeleteTitle}
        message={
          deleteTarget
            ? `${prefs.language === 'en' ? 'Are you sure you want to delete this entry from' : 'আপনি কি নিশ্চিতভাবে এই হিসাবটি মুছে ফেলতে চান:'} "${getCategoryDisplayName(getCategoryById(deleteTarget.category), prefs.language)}"?`
            : trans.confirmDeleteMsg
        }
        confirmLabel={trans.confirmDeleteYes}
        cancelLabel={trans.confirmDeleteNo}
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Clear All Confirmation Modal */}
      <ConfirmationModal
        isOpen={isClearAllConfirmOpen}
        title={trans.confirmClearTitle}
        message={trans.confirmClearMsg}
        confirmLabel={trans.confirmClearYes}
        cancelLabel={trans.cancel}
        isDanger={true}
        onConfirm={handleConfirmClearAll}
        onCancel={() => setIsClearAllConfirmOpen(false)}
      />

      {/* Privacy, Export & Backup Modal */}
      <PrivacyAndDataModal
        language={prefs.language}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        transactions={transactions}
        onRestoreTransactions={(restored) => {
          updateTransactions(restored);
        }}
        onOpenClearAllConfirm={() => setIsClearAllConfirmOpen(true)}
        onShowToast={(msg) => setToastMessage(msg)}
      />

      {/* Free Hosting and Share Guide Modal */}
      <SharePublishGuideModal
        language={prefs.language}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        appUrl={window.location.href}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
