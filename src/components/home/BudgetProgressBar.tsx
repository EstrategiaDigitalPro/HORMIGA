import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';

export const BudgetProgressBar: React.FC = () => {
  const { totalSpent, totalBudget, budgetUsedPercent, preferences } = useFinance();
  const visualBudgetProgress = Math.min(100, Math.max(0, budgetUsedPercent));

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#202522]">
            Presupuesto mensual utilizado
          </span>
          <span className="text-xs text-[#68716B]">
            ({Math.round(budgetUsedPercent)}% de {formatCurrency(totalBudget, preferences.currency)})
          </span>
        </div>
        <span className="text-xs font-semibold text-[#68716B] num-tabular">
          {formatCurrency(totalSpent, preferences.currency)} de {formatCurrency(totalBudget, preferences.currency)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#F7F8F6] rounded-full h-3.5 overflow-hidden p-0.5 border border-[#E8ECE6]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            budgetUsedPercent > 100
              ? 'bg-[#DC2626]'
              : budgetUsedPercent > 75
              ? 'bg-[#F4A340]'
              : 'bg-[#176B45]'
          }`}
          style={{ width: `${visualBudgetProgress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#68716B] pt-0.5">
        <span>0%</span>
        <span>50%</span>
        <span>75% (Alerta)</span>
        <span>100% ({formatCurrency(totalBudget, preferences.currency)})</span>
      </div>
    </div>
  );
};
