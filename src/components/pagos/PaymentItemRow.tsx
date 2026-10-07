import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { RecurringPayment } from '../../types/finance';
import { formatCurrency, formatDateSpanish } from '../../utils/currency';
import { getCategoryIcon } from '../../utils/categoryIcons';

interface PaymentItemRowProps {
  payment: RecurringPayment;
  currencyCode: string;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PaymentItemRow: React.FC<PaymentItemRowProps> = ({
  payment,
  currencyCode,
  onTogglePaid,
  onDelete,
}) => {
  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors bg-white">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            payment.isPaid
              ? 'bg-[#EBF4EF] text-[#176B45]'
              : 'bg-[#FEF7EE] text-[#C97E25]'
          }`}
        >
          {getCategoryIcon(payment.category)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold text-[#202522]">
              {payment.name}
            </span>
            {payment.isPaid ? (
              <span className="text-[11px] font-semibold text-[#176B45] bg-[#EBF4EF] px-2 py-0.5 rounded-md">
                Pagado
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-[#C97E25] bg-[#FEF7EE] px-2 py-0.5 rounded-md">
                Pendiente
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#68716B] mt-0.5">
            <span>{payment.category}</span>
            <span aria-hidden="true">·</span>
            <span>Vence día {payment.dueDay}</span>
            {payment.paidDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>Pagado {formatDateSpanish(payment.paidDate)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#E8ECE6]/60">
        <div className="text-right">
          <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
            {formatCurrency(payment.amount, currencyCode)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!payment.isPaid ? (
            <button
              type="button"
              onClick={() => onTogglePaid(payment.id)}
              className="min-h-[44px] px-4 py-2.5 bg-[#176B45] hover:bg-[#125537] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Marcar pagado</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onTogglePaid(payment.id)}
              className="min-h-[44px] px-3.5 py-2 bg-[#F7F8F6] hover:bg-neutral-200 text-[#68716B] hover:text-[#202522] text-xs font-medium rounded-xl border border-[#E8ECE6] transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
            >
              Desmarcar
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(payment.id)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#68716B] hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            title="Eliminar obligación"
            aria-label="Eliminar obligación"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
