import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CategoryBudget } from '../../types/finance';
import { CategorySpendingItem } from './DonutChart';
import { formatCurrency } from '../../utils/currency';

interface BudgetVsRealityTableProps {
  budgets: CategoryBudget[];
  categorySpending: CategorySpendingItem[];
  currencyCode: string;
}

export const BudgetVsRealityTable: React.FC<BudgetVsRealityTableProps> = ({
  budgets,
  categorySpending,
  currencyCode,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-[#E8ECE6]">
        <h3 className="text-base sm:text-lg font-bold text-[#202522]">
          Presupuesto vs. Realidad
        </h3>
        <p className="text-xs text-[#68716B]">
          Seguimiento de cumplimiento por cada rubro
        </p>
      </div>

      <div className="divide-y divide-[#E8ECE6]">
        {budgets.map((b) => {
          const actual =
            categorySpending.find(
              (c) => c.name === b.name || (b.isHormigaCategory && c.name === 'Gastos hormiga')
            )?.actual || 0;
          const planned = b.plannedAmount || 1;
          const pct = Math.round((actual / planned) * 100);
          const isOver = actual > planned;
          const isWarning = !isOver && pct >= 75;
          const delta = planned - actual;

          return (
            <div
              key={b.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F8F6]/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#202522]">{b.name}</span>
                  {isOver ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3 h-3" />
                      Excedido
                    </span>
                  ) : isWarning ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C97E25] bg-[#FEF7EE] px-2 py-0.5 rounded-md">
                      En alerta ({pct}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#176B45] bg-[#EBF4EF] px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      En control
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-[#68716B] num-tabular">
                  <span>Planeado: {formatCurrency(planned, currencyCode)}</span>
                  <span aria-hidden="true">·</span>
                  <span>Real: {formatCurrency(actual, currencyCode)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <span className="text-xs text-[#68716B] block">
                    {isOver ? 'Sobrepasado por' : 'Restante por gastar'}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-extrabold num-tabular ${
                      isOver ? 'text-[#DC2626]' : 'text-[#176B45]'
                    }`}
                  >
                    {isOver
                      ? `+${formatCurrency(Math.abs(delta), currencyCode)}`
                      : formatCurrency(delta, currencyCode)}
                  </span>
                </div>

                <div className="w-20 sm:w-24">
                  <div className="w-full bg-[#F7F8F6] rounded-full h-2 overflow-hidden border border-[#E8ECE6]">
                    <div
                      className={`h-full rounded-full ${
                        isOver ? 'bg-[#DC2626]' : isWarning ? 'bg-[#F4A340]' : 'bg-[#176B45]'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#68716B] block text-right mt-0.5 num-tabular">
                    {pct}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
