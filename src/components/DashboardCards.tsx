import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { Language } from '../types';
import { formatCurrency, toBengaliDigits } from '../utils/formatters';
import { t } from '../utils/translations';

interface Props {
  language: Language;
  totalIncome: number;
  totalExpense: number;
  useBengaliDigits: boolean;
  transactionCount: number;
  onOpenAddModal: (type: 'income' | 'expense') => void;
}

export const DashboardCards: React.FC<Props> = ({
  language,
  totalIncome,
  totalExpense,
  useBengaliDigits,
  transactionCount,
  onOpenAddModal,
}) => {
  const trans = t[language];
  const balance = totalIncome - totalExpense;
  const isPositiveBalance = balance >= 0;

  // Calculate percentage of expense vs income
  const expensePercentage = totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0;
  const displayCount = useBengaliDigits ? toBengaliDigits(transactionCount) : transactionCount;
  const displayPercent = useBengaliDigits ? toBengaliDigits(expensePercentage) : expensePercentage;

  return (
    <div className="space-y-4">
      {/* Primary Balance Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 sm:p-7 shadow-xl shadow-emerald-900/15">
        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 rounded-full bg-teal-400/10 pointer-events-none blur-xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-200 text-sm font-semibold tracking-wide">
              <Wallet className="w-5 h-5 text-emerald-300" />
              <span>{trans.currentBalance}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-emerald-100">
              <Layers className="w-3.5 h-3.5" />
              <span>
                {trans.totalTransactions}: {displayCount} {trans.itemsUnit}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isPositiveBalance ? '' : '-'}{formatCurrency(balance, useBengaliDigits)}
              </h1>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                isPositiveBalance ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/40 text-red-200'
              }`}>
                {isPositiveBalance ? trans.surplus : trans.deficit}
              </span>
            </div>

            {totalIncome > 0 && (
              <div className="text-xs text-emerald-200/80">
                {trans.incomeSpent} <span className="font-bold text-white">{displayPercent}%</span> {trans.percentSpent}
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-3">
            <button
              onClick={() => onOpenAddModal('income')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 active:bg-emerald-500/50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition backdrop-blur-sm border border-emerald-400/30 shadow-xs"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              <span>{trans.addIncome}</span>
            </button>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500/30 hover:bg-rose-500/40 active:bg-rose-500/50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition backdrop-blur-sm border border-rose-400/30 shadow-xs"
            >
              <ArrowDownRight className="w-4 h-4 text-rose-300" />
              <span>{trans.addExpense}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Income and Expense Twin Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Income Card */}
        <div className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{trans.totalIncome}</span>
            </div>
            <div className="mt-1.5 text-2xl font-bold text-emerald-700">
              +{formatCurrency(totalIncome, useBengaliDigits)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{trans.totalExpense}</span>
            </div>
            <div className="mt-1.5 text-2xl font-bold text-rose-600">
              -{formatCurrency(totalExpense, useBengaliDigits)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
