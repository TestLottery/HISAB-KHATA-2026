import React from 'react';
import { Plus, BookOpen, Sparkles, FilterX } from 'lucide-react';
import { Language, Transaction } from '../types';
import { formatDateLocale, formatCurrency } from '../utils/formatters';
import { t } from '../utils/translations';
import { TransactionItem } from './TransactionItem';

interface Props {
  language: Language;
  transactions: Transaction[];
  allTransactionsCount: number;
  useBengaliDigits: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
  onLoadSampleData: () => void;
  onResetFilter: () => void;
}

export const TransactionList: React.FC<Props> = ({
  language,
  transactions,
  allTransactionsCount,
  useBengaliDigits,
  onEdit,
  onDelete,
  onOpenAddModal,
  onLoadSampleData,
  onResetFilter,
}) => {
  const trans = t[language];

  // If zero transactions in the entire database
  if (allTransactionsCount === 0) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          {trans.emptyTitle}
        </h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {trans.emptyDesc}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{trans.emptyAddBtn}</span>
          </button>
          <button
            onClick={onLoadSampleData}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2 transition border border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{trans.emptySampleBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  // If transactions exist, but filtered search has no matches
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <FilterX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          {trans.noResultsTitle}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {trans.noResultsDesc}
        </p>
        <div className="mt-5">
          <button
            onClick={onResetFilter}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            {trans.resetFilter}
          </button>
        </div>
      </div>
    );
  }

  // Group transactions by date
  const grouped: Record<string, Transaction[]> = {};
  for (const tItem of transactions) {
    if (!grouped[tItem.date]) {
      grouped[tItem.date] = [];
    }
    grouped[tItem.date].push(tItem);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-6">
      {sortedDates.map((dateStr) => {
        const dayTransactions = grouped[dateStr];
        const dayIncome = dayTransactions
          .filter((tItem) => tItem.type === 'income')
          .reduce((sum, tItem) => sum + tItem.amount, 0);
        const dayExpense = dayTransactions
          .filter((tItem) => tItem.type === 'expense')
          .reduce((sum, tItem) => sum + tItem.amount, 0);

        return (
          <div key={dateStr} className="space-y-2">
            {/* Date Group Header */}
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                {formatDateLocale(dateStr, language)}
              </span>

              {/* Day's quick income/expense breakdown */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                {dayIncome > 0 && (
                  <span className="text-emerald-700 font-medium">
                    +{formatCurrency(dayIncome, useBengaliDigits)}
                  </span>
                )}
                {dayExpense > 0 && (
                  <span className="text-rose-600 font-medium">
                    -{formatCurrency(dayExpense, useBengaliDigits)}
                  </span>
                )}
              </div>
            </div>

            {/* List of items on this day */}
            <div className="space-y-2">
              {dayTransactions.map((item) => (
                <TransactionItem
                  key={item.id}
                  language={language}
                  transaction={item}
                  useBengaliDigits={useBengaliDigits}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
