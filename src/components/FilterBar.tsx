import React, { useState } from 'react';
import { Search, Calendar, X, RotateCcw } from 'lucide-react';
import { DateFilterType, FilterState, Language } from '../types';
import { CATEGORIES, getCategoryDisplayName } from '../utils/categories';
import { t } from '../utils/translations';

interface Props {
  language: Language;
  filter: FilterState;
  onChange: (updated: FilterState) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<Props> = ({ language, filter, onChange, onReset }) => {
  const trans = t[language];
  const [showCustomDates, setShowCustomDates] = useState<boolean>(filter.dateRange === 'custom');

  const handleTypeSelect = (type: 'all' | 'income' | 'expense') => {
    onChange({ ...filter, type, category: 'all' });
  };

  const handleDateRangeSelect = (dateRange: DateFilterType) => {
    setShowCustomDates(dateRange === 'custom');
    onChange({ ...filter, dateRange });
  };

  const isFilterActive =
    filter.type !== 'all' ||
    filter.category !== 'all' ||
    filter.dateRange !== 'all' ||
    Boolean(filter.searchQuery.trim());

  // Available categories based on selected type
  const availableCategories =
    filter.type === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.type === filter.type);

  const datePresets = [
    { id: 'all', label: trans.timeAll },
    { id: 'today', label: trans.timeToday },
    { id: 'yesterday', label: trans.timeYesterday },
    { id: 'this_week', label: trans.timeThisWeek },
    { id: 'this_month', label: trans.timeThisMonth },
    { id: 'this_year', label: trans.timeThisYear },
    { id: 'custom', label: trans.timeCustom },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3.5 shadow-xs">
      {/* Top row: Search input & Type pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={trans.searchPlaceholder}
            value={filter.searchQuery}
            onChange={(e) => onChange({ ...filter, searchQuery: e.target.value })}
            className="w-full pl-10 pr-9 py-2 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onChange({ ...filter, searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => handleTypeSelect('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter.type === 'all'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {trans.allTransactions}
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect('income')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter.type === 'income'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            {trans.incomeOnly}
          </button>
          <button
            type="button"
            onClick={() => handleTypeSelect('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter.type === 'expense'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            {trans.expenseOnly}
          </button>
        </div>
      </div>

      {/* Date ranges & Category dropdown */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        {/* Date Presets */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium mr-1 shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            {trans.timeLabel}
          </span>
          {datePresets.map((item) => (
            <button
              key={item.id}
              onClick={() => handleDateRangeSelect(item.id as DateFilterType)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                filter.dateRange === item.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="ml-auto flex items-center gap-2">
          <select
            value={filter.category}
            onChange={(e) => onChange({ ...filter, category: e.target.value })}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="all">{trans.allCategories}</option>
            {availableCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getCategoryDisplayName(cat, language)}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          {isFilterActive && (
            <button
              onClick={onReset}
              className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1.5 rounded-lg flex items-center gap-1 font-semibold transition"
              title="Reset Filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{trans.resetFilter}</span>
            </button>
          )}
        </div>
      </div>

      {/* Custom Date Range Inputs */}
      {showCustomDates && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 text-xs animate-in fade-in duration-100">
          <span className="font-semibold text-slate-600">{trans.startDate}</span>
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => onChange({ ...filter, startDate: e.target.value })}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 outline-none focus:border-emerald-500"
          />
          <span className="font-semibold text-slate-600">{trans.endDate}</span>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => onChange({ ...filter, endDate: e.target.value })}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 outline-none focus:border-emerald-500"
          />
        </div>
      )}
    </div>
  );
};
