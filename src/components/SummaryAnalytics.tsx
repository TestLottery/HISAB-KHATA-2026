import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Language, SummaryTabType, Transaction } from '../types';
import { getCategoryById, getCategoryDisplayName } from '../utils/categories';
import { formatCurrency, toBengaliDigits } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  language: Language;
  transactions: Transaction[];
  useBengaliDigits: boolean;
}

export const SummaryAnalytics: React.FC<Props> = ({ language, transactions, useBengaliDigits }) => {
  const trans = t[language];
  const [tab, setTab] = useState<SummaryTabType>('monthly');

  // Filter based on selected tab period
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  const getFilteredForTab = (): Transaction[] => {
    return transactions.filter((tItem) => {
      const [y, m, d] = tItem.date.split('-').map(Number);
      if (tab === 'daily') {
        return y === currentYear && m === currentMonth && d === currentDay;
      }
      if (tab === 'monthly') {
        return y === currentYear && m === currentMonth;
      }
      if (tab === 'yearly') {
        return y === currentYear;
      }
      return true; // overview
    });
  };

  const periodTransactions = getFilteredForTab();
  const incomeTotal = periodTransactions
    .filter((tItem) => tItem.type === 'income')
    .reduce((s, tItem) => s + tItem.amount, 0);
  const expenseTotal = periodTransactions
    .filter((tItem) => tItem.type === 'expense')
    .reduce((s, tItem) => s + tItem.amount, 0);
  const netSavings = incomeTotal - expenseTotal;

  // Category breakdown for expenses
  const expenseCategoriesMap: Record<string, number> = {};
  periodTransactions
    .filter((tItem) => tItem.type === 'expense')
    .forEach((tItem) => {
      expenseCategoriesMap[tItem.category] = (expenseCategoriesMap[tItem.category] || 0) + tItem.amount;
    });

  const sortedExpenseCategories = Object.entries(expenseCategoriesMap)
    .map(([catId, amount]) => ({
      category: getCategoryById(catId),
      amount,
      percentage: expenseTotal > 0 ? Math.round((amount / expenseTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Category breakdown for incomes
  const incomeCategoriesMap: Record<string, number> = {};
  periodTransactions
    .filter((tItem) => tItem.type === 'income')
    .forEach((tItem) => {
      incomeCategoriesMap[tItem.category] = (incomeCategoriesMap[tItem.category] || 0) + tItem.amount;
    });

  const sortedIncomeCategories = Object.entries(incomeCategoriesMap)
    .map(([catId, amount]) => ({
      category: getCategoryById(catId),
      amount,
      percentage: incomeTotal > 0 ? Math.round((amount / incomeTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const tabLabels: Record<SummaryTabType, string> = {
    daily: trans.periodDaily,
    monthly: trans.periodMonthly,
    yearly: trans.periodYearly,
    overview: trans.periodOverview,
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header and Period Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>{trans.analyticsTitle}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {tabLabels[tab]}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setTab('daily')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {trans.daily}
          </button>
          <button
            onClick={() => setTab('monthly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {trans.monthly}
          </button>
          <button
            onClick={() => setTab('yearly')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'yearly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {trans.yearly}
          </button>
          <button
            onClick={() => setTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition ${
              tab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {trans.overview}
          </button>
        </div>
      </div>

      {/* Period Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
          <div className="text-xs font-semibold text-emerald-800">{trans.totalIncome}</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            +{formatCurrency(incomeTotal, useBengaliDigits)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
          <div className="text-xs font-semibold text-rose-800">{trans.totalExpense}</div>
          <div className="text-xl font-bold text-rose-600 mt-1">
            -{formatCurrency(expenseTotal, useBengaliDigits)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-semibold text-slate-600">{trans.netSavings}</div>
          <div className={`text-xl font-bold mt-1 ${netSavings >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {netSavings >= 0 ? '' : '-'}{formatCurrency(netSavings, useBengaliDigits)}
          </div>
        </div>
      </div>

      {periodTransactions.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          {trans.noDataForPeriod}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Expense Category Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-rose-500" />
                <span>{trans.expenseBreakdown}</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {useBengaliDigits ? toBengaliDigits(sortedExpenseCategories.length) : sortedExpenseCategories.length} {trans.sectorsUnit}
              </span>
            </h4>

            {sortedExpenseCategories.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">{trans.noExpenseForPeriod}</p>
            ) : (
              <div className="space-y-2.5">
                {sortedExpenseCategories.map(({ category, amount, percentage }) => (
                  <div key={category.id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: category.bgLight, color: category.color }}
                        >
                          <CategoryIcon iconName={category.iconName} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800 truncate">
                          {getCategoryDisplayName(category, language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold tabular-nums">
                        <span className="text-rose-600">{formatCurrency(amount, useBengaliDigits)}</span>
                        <span className="text-slate-400 text-[11px]">
                          ({useBengaliDigits ? toBengaliDigits(percentage) : percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: category.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Income Category Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{trans.incomeBreakdown}</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {useBengaliDigits ? toBengaliDigits(sortedIncomeCategories.length) : sortedIncomeCategories.length} {trans.sourcesUnit}
              </span>
            </h4>

            {sortedIncomeCategories.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">{trans.noIncomeForPeriod}</p>
            ) : (
              <div className="space-y-2.5">
                {sortedIncomeCategories.map(({ category, amount, percentage }) => (
                  <div key={category.id} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: category.bgLight, color: category.color }}
                        >
                          <CategoryIcon iconName={category.iconName} className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800 truncate">
                          {getCategoryDisplayName(category, language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-bold tabular-nums">
                        <span className="text-emerald-700">+{formatCurrency(amount, useBengaliDigits)}</span>
                        <span className="text-slate-400 text-[11px]">
                          ({useBengaliDigits ? toBengaliDigits(percentage) : percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: '#10b981' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
