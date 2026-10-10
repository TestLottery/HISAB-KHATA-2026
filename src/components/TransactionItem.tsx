import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Language, Transaction } from '../types';
import { getCategoryById, getCategoryDisplayName } from '../utils/categories';
import { formatCurrency, formatShortDate } from '../utils/formatters';
import { t } from '../utils/translations';
import { CategoryIcon } from './CategoryIcon';

interface Props {
  language: Language;
  transaction: Transaction;
  useBengaliDigits: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<Props> = ({
  language,
  transaction,
  useBengaliDigits,
  onEdit,
  onDelete,
}) => {
  const trans = t[language];
  const category = getCategoryById(transaction.category);
  const isIncome = transaction.type === 'income';

  return (
    <div className="group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Icon Badge */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs"
          style={{ backgroundColor: category.bgLight, color: category.color }}
        >
          <CategoryIcon iconName={category.iconName} className="w-5 h-5" />
        </div>

        {/* Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 text-sm truncate">
              {getCategoryDisplayName(category, language)}
            </h4>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                isIncome
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {isIncome ? trans.incomeBadge : trans.expenseBadge}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>{formatShortDate(transaction.date, language)}</span>
            {transaction.note && (
              <>
                <span>•</span>
                <span className="truncate text-slate-600 max-w-[140px] sm:max-w-[220px]" title={transaction.note}>
                  {transaction.note}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
        <div className="text-right">
          <div
            className={`font-bold text-base sm:text-lg tabular-nums ${
              isIncome ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, useBengaliDigits)}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(transaction)}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
            title={trans.editTitle}
            aria-label={trans.editTitle}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title={trans.deleteTitle}
            aria-label={trans.deleteTitle}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
