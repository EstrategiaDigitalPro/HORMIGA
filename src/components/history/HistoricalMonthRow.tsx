import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { MonthData } from '../../types/finance';
import { formatCurrency } from '../../utils/currency';

interface HistoricalMonthRowProps {
  month: MonthData;
  isSelected: boolean;
  isCurrent: boolean;
  currency: string;
  onClick: () => void;
}

export const HistoricalMonthRow: React.FC<HistoricalMonthRowProps> = ({
  month,
  isSelected,
  isCurrent,
  currency,
  onClick,
}) => {
  const mIncome = month.incomes.reduce((sum, i) => sum + i.amount, 0);
  const mSpent = month.expenses.reduce((sum, e) => sum + e.amount, 0);
  const mHormiga = month.expenses
    .filter((e) => e.isHormiga)
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
        isSelected ? 'bg-[#EBF4EF]/40 font-medium' : 'hover:bg-[#F7F8F6]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isSelected ? 'bg-[#176B45] text-white' : 'bg-[#F7F8F6] text-[#68716B]'
          }`}
        >
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#202522]">{month.monthLabel}</span>
            {isCurrent && (
              <span className="text-[10px] font-semibold text-[#176B45] bg-[#EBF4EF] px-1.5 py-0.5 rounded-sm">
                Mes actual
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#68716B] mt-0.5 num-tabular">
            <span>Ingreso: {formatCurrency(mIncome, currency)}</span>
            <span aria-hidden="true">·</span>
            <span>Gasto: {formatCurrency(mSpent, currency)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 self-end sm:self-center">
        <div className="text-right">
          <span className="text-[11px] text-[#68716B] block">Gastos hormiga</span>
          <span className="text-sm font-extrabold text-[#C97E25] num-tabular">
            {formatCurrency(mHormiga, currency)}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#68716B]" />
      </div>
    </div>
  );
};
