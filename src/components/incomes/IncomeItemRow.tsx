import React from 'react';
import { Briefcase, Trash2 } from 'lucide-react';
import { IncomeSource } from '../../types/finance';

interface IncomeItemRowProps {
  income: IncomeSource;
  currencySymbol: string;
  onNameChange: (id: string, name: string) => void;
  onAmountChange: (id: string, amount: string) => void;
  onDelete: (id: string) => void;
}

export const IncomeItemRow: React.FC<IncomeItemRowProps> = ({
  income,
  currencySymbol,
  onNameChange,
  onAmountChange,
  onDelete,
}) => {
  const categoryLabels: Record<string, string> = {
    salario: 'Salario',
    negocio: 'Negocio',
    independiente: 'Independiente',
    pension: 'Pensión',
    otros: 'Otros',
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F8F6]/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EBF4EF] text-[#176B45] flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <input
            type="text"
            value={income.name}
            onChange={(e) => onNameChange(income.id, e.target.value)}
            className="text-sm sm:text-base font-bold text-[#202522] bg-transparent border-b border-transparent hover:border-[#E8ECE6] focus:border-[#176B45] focus:outline-hidden px-1 -mx-1"
          />
          <div className="text-xs text-[#68716B]">
            {categoryLabels[income.category] || 'Ingreso'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        <div className="flex items-center gap-1.5 bg-[#F7F8F6] px-3.5 py-2 rounded-xl border border-[#E8ECE6] min-h-[44px]">
          <span className="text-xs font-semibold text-[#68716B]">
            {currencySymbol}
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={income.amount}
            onChange={(e) => onAmountChange(income.id, e.target.value)}
            className="w-28 text-right font-extrabold text-[#202522] bg-transparent focus:outline-hidden num-tabular text-sm"
          />
        </div>

        <button
          type="button"
          onClick={() => onDelete(income.id)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#68716B] hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
          title="Eliminar ingreso"
          aria-label="Eliminar ingreso"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
