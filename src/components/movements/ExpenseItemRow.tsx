import React from 'react';
import { Flame, TrendingDown, Edit3, Check, Trash2 } from 'lucide-react';
import { ExpenseTransaction } from '../../types/finance';
import { formatCurrency, formatDateSpanish } from '../../utils/currency';

interface ExpenseItemRowProps {
  expense: ExpenseTransaction;
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onNameChange: (val: string) => void;
  onSaveEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  currencyCode: string;
  focusColor?: 'green' | 'amber';
}

export const ExpenseItemRow: React.FC<ExpenseItemRowProps> = ({
  expense,
  isEditing,
  editingName,
  onStartEdit,
  onNameChange,
  onSaveEdit,
  onKeyDown,
  onDelete,
  currencyCode,
  focusColor = 'green',
}) => {
  const isAmber = focusColor === 'amber' || expense.isHormiga;
  const hoverTextClass = isAmber ? 'hover:text-[#C97E25]' : 'hover:text-[#176B45]';
  const inputBorderClass = isAmber ? 'border-[#F4A340]' : 'border-[#176B45]';

  return (
    <div className="p-4 sm:px-5 flex items-center justify-between gap-3 hover:bg-[#F7F8F6]/60 transition-colors group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            expense.isHormiga
              ? 'bg-[#FEF7EE] text-[#F4A340]'
              : 'bg-[#EBF4EF] text-[#176B45]'
          }`}
        >
          {expense.isHormiga ? (
            <Flame className="w-5 h-5 fill-[#F4A340]" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => onNameChange(e.target.value)}
                onKeyDown={onKeyDown}
                className={`w-full max-w-sm min-h-[44px] px-3 py-2 text-sm font-semibold bg-white border ${inputBorderClass} rounded-xl focus:outline-hidden`}
                autoFocus
                placeholder="Nombre del gasto"
              />
              <button
                type="button"
                onClick={onSaveEdit}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white bg-[#176B45] hover:bg-[#125537] rounded-xl transition-colors cursor-pointer shrink-0"
                title="Guardar nombre"
                aria-label="Guardar nombre"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              <p
                onClick={onStartEdit}
                className={`text-sm sm:text-base font-bold text-[#202522] truncate cursor-pointer ${hoverTextClass} transition-colors`}
                title="Toca para editar el nombre"
              >
                {expense.description}
              </p>
              <button
                type="button"
                onClick={onStartEdit}
                className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#68716B] hover:text-[#202522] rounded-lg transition-colors cursor-pointer opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                title="Cambiar nombre del gasto"
                aria-label="Editar nombre del gasto"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-[#68716B] mt-0.5">
            <span>{expense.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatDateSpanish(expense.date)}</span>
            {expense.isHormiga && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#C97E25] font-semibold">Gasto hormiga</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm sm:text-base font-extrabold text-[#202522] num-tabular">
          -{formatCurrency(expense.amount, currencyCode)}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#68716B] hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          title="Eliminar gasto"
          aria-label="Eliminar gasto"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
