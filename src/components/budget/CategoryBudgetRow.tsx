import React from 'react';
import { CategoryBudget } from '../../types/finance';
import { formatCurrency } from '../../utils/currency';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface CategoryBudgetRowProps {
  category: CategoryBudget;
  spent: number;
  currencyCode: string;
  currencySymbol: string;
  onAmountChange: (id: string, value: string) => void;
}

export const CategoryBudgetRow: React.FC<CategoryBudgetRowProps> = ({
  category,
  spent,
  currencyCode,
  currencySymbol,
  onAmountChange,
}) => {
  const planned = category.plannedAmount || 1;
  const percentUsed = Math.round((spent / planned) * 100);
  const isOver = spent > planned;
  const isWarning = !isOver && percentUsed >= 75;

  return (
    <div className="p-4 sm:p-5 space-y-3 hover:bg-[#F7F8F6]/40 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              category.isHormigaCategory
                ? 'bg-[#FEF7EE] text-[#F4A340]'
                : 'bg-[#F7F8F6] text-[#202522]'
            }`}
          >
            {getCategoryIcon(category.icon || category.name, category.isHormigaCategory)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-[#202522]">{category.name}</span>
              {category.isHormigaCategory && (
                <span className="text-[10px] font-semibold text-[#C97E25] bg-[#FEF7EE] px-1.5 py-0.5 rounded-sm">
                  Microgastos
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#68716B] mt-0.5 num-tabular">
              <span>Gastado: {formatCurrency(spent, currencyCode)}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  isOver
                    ? 'text-[#DC2626] font-bold'
                    : isWarning
                    ? 'text-[#C97E25] font-semibold'
                    : 'text-[#176B45]'
                }
              >
                {percentUsed}% usado
              </span>
            </div>
          </div>
        </div>

        {/* Planned Input */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs text-[#68716B] font-medium hidden sm:inline">
            Tope mensual:
          </span>
          <div className="flex items-center gap-1.5 bg-[#F7F8F6] px-3.5 py-2 rounded-xl border border-[#E8ECE6] min-h-[44px]">
            <span className="text-xs font-bold text-[#68716B]">
              {currencySymbol}
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={category.plannedAmount}
              onChange={(e) => onAmountChange(category.id, e.target.value)}
              className="w-24 sm:w-28 text-right font-extrabold text-[#202522] bg-transparent focus:outline-hidden num-tabular text-sm"
              aria-label={`Tope para ${category.name}`}
            />
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="w-full bg-[#F7F8F6] rounded-full h-2.5 overflow-hidden border border-[#E8ECE6]/60">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isOver
                ? 'bg-[#DC2626]'
                : isWarning
                ? 'bg-[#F4A340]'
                : 'bg-[#176B45]'
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-[#68716B]">
          <span>
            {isOver
              ? `Sobrepasado por ${formatCurrency(spent - planned, currencyCode)}`
              : `Disponible: ${formatCurrency(planned - spent, currencyCode)}`}
          </span>
          <span>Tope: {formatCurrency(planned, currencyCode)}</span>
        </div>
      </div>
    </div>
  );
};
