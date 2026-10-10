import React, { useState, useEffect } from 'react';
import { X, Check, PlusCircle, MinusCircle } from 'lucide-react';
import { Language, Transaction, TransactionType } from '../types';
import { getCategoriesByType, getCategoryDisplayName } from '../utils/categories';
import { getTodayDateStr } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id' | 'createdAt'>, existingId?: string) => void;
  initialTransaction?: Transaction | null;
  defaultType?: TransactionType;
}

export const TransactionModal: React.FC<Props> = ({
  language,
  isOpen,
  onClose,
  onSave,
  initialTransaction,
  defaultType = 'expense',
}) => {
  const trans = t[language];
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('food');
  const [date, setDate] = useState<string>(getTodayDateStr());
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount.toString());
      setCategory(initialTransaction.category);
      setDate(initialTransaction.date);
      setNote(initialTransaction.note || '');
      setError('');
    } else {
      setType(defaultType);
      setAmount('');
      const categories = getCategoriesByType(defaultType);
      setCategory(categories[0]?.id || 'food');
      setDate(getTodayDateStr());
      setNote('');
      setError('');
    }
  }, [initialTransaction, defaultType, isOpen]);

  // When type changes, ensure valid category is selected
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const availableCategories = getCategoriesByType(newType);
    if (!availableCategories.some((c) => c.id === category)) {
      setCategory(availableCategories[0]?.id || (newType === 'income' ? 'salary' : 'food'));
    }
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + addValue).toString());
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError(trans.errAmount);
      return;
    }

    if (!date) {
      setError(trans.errDate);
      return;
    }

    if (!category) {
      setError(trans.errCategory);
      return;
    }

    onSave(
      {
        type,
        amount: numAmount,
        category,
        date,
        note: note.trim(),
      },
      initialTransaction ? initialTransaction.id : undefined
    );

    onClose();
  };

  if (!isOpen) return null;

  const currentCategories = getCategoriesByType(type);
  const isEditing = Boolean(initialTransaction);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? trans.modalEditTitle : trans.modalAddTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? trans.modalEditDesc : trans.modalAddDesc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Income / Expense Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{trans.typeIncome}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                type === 'expense'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              <span>{trans.typeExpense}</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {trans.amountLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-2xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-bold text-xl">
                ₹
              </div>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                autoFocus
                className="block w-full pl-10 pr-4 py-3.5 text-2xl font-bold rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-800 transition"
              />
            </div>

            {/* Quick Amount Add Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {[100, 500, 1000, 2000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAddAmount(val)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition"
                >
                  +{val}
                </button>
              ))}
              {amount && (
                <button
                  type="button"
                  onClick={() => setAmount('')}
                  className="px-2 py-1 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  {trans.clear}
                </button>
              )}
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {trans.categorySelect} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      if (error) setError('');
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="p-1.5 rounded-lg shrink-0"
                      style={{ backgroundColor: isSelected ? '#10b981' : cat.color, color: '#ffffff' }}
                    >
                      <CategoryIcon iconName={cat.iconName} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{getCategoryDisplayName(cat, language)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {trans.dateLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                max="2099-12-31"
                onChange={(e) => setDate(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {trans.noteLabel}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={trans.notePlaceholder}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-slate-800 text-sm"
              />
            </div>
          </div>

          {/* Validation Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition"
            >
              {trans.cancel}
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition flex items-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                  : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? trans.saveUpdate : trans.saveNew}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
