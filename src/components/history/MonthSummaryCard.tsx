import React from 'react';
import { CheckCircle2, Flame } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

interface MonthSummaryCardProps {
  monthLabel: string;
  expenseCount: number;
  income: number;
  savings: number;
  spent: number;
  hormiga: number;
  currency: string;
  previousMonthComparison?: {
    diffText: string;
    isBetter: boolean;
  } | null;
}

export const MonthSummaryCard: React.FC<MonthSummaryCardProps> = ({
  monthLabel,
  expenseCount,
  income,
  savings,
  spent,
  hormiga,
  currency,
  previousMonthComparison,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-[#E8ECE6] pb-4">
        <div>
          <span className="text-xs font-bold text-[#176B45] uppercase tracking-wider block">
            Resumen del período
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#202522] tracking-tight mt-0.5">
            {monthLabel}
          </h2>
        </div>
        <span className="text-xs text-[#68716B]">
          {expenseCount} movimientos registrados
        </span>
      </div>

      {/* 4 Figures */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#F7F8F6] rounded-xl border border-[#E8ECE6] space-y-1">
          <span className="text-xs text-[#68716B] font-medium block">Ingresos</span>
          <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
            {formatCurrency(income, currency)}
          </div>
        </div>

        <div className="p-3.5 bg-[#FEF7EE] rounded-xl border border-[#F4A340]/30 space-y-1">
          <span className="text-xs text-[#C97E25] font-medium block">Ahorro separado</span>
          <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
            {formatCurrency(savings, currency)}
          </div>
        </div>

        <div className="p-3.5 bg-[#F7F8F6] rounded-xl border border-[#E8ECE6] space-y-1">
          <span className="text-xs text-[#68716B] font-medium block">Total gastado</span>
          <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
            {formatCurrency(spent, currency)}
          </div>
        </div>

        <div className="p-3.5 bg-[#FEF7EE] rounded-xl border border-[#F4A340]/30 space-y-1">
          <span className="text-xs text-[#C97E25] font-medium block">Gastos hormiga</span>
          <div className="text-base sm:text-lg font-extrabold text-[#C97E25] num-tabular">
            {formatCurrency(hormiga, currency)}
          </div>
        </div>
      </div>

      {/* Highlight Banner on Progress */}
      {previousMonthComparison && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            previousMonthComparison.isBetter
              ? 'bg-[#EBF4EF] border-[#176B45]/30 text-[#176B45]'
              : 'bg-[#FEF7EE] border-[#F4A340]/40 text-[#C97E25]'
          }`}
        >
          {previousMonthComparison.isBetter ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2.2]" />
          ) : (
            <Flame className="w-5 h-5 shrink-0" />
          )}
          <p className="text-xs sm:text-sm font-semibold leading-relaxed">
            {previousMonthComparison.diffText}
          </p>
        </div>
      )}
    </div>
  );
};
