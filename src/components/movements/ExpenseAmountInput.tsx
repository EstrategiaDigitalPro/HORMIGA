import React from 'react';
import { formatCurrency } from '../../utils/currency';

interface ExpenseAmountInputProps {
  rawAmount: string;
  onChange: (val: string) => void;
  currencySymbol: string;
  currencyCode: string;
}

export const ExpenseAmountInput: React.FC<ExpenseAmountInputProps> = ({
  rawAmount,
  onChange,
  currencySymbol,
  currencyCode,
}) => {
  const handleQuickAdd = (addVal: number) => {
    const current = parseFloat(rawAmount) || 0;
    onChange(String(current + addVal));
  };

  return (
    <div className="text-center space-y-2 pt-2 pb-1 bg-[#F7F8F6]/60 p-4 rounded-2xl border border-[#E8ECE6]/60">
      <label
        htmlFor="expense-amount"
        className="block text-xs font-semibold uppercase tracking-wider text-[#68716B]"
      >
        ¿Cuánto fue el monto?
      </label>
      <div className="relative inline-flex items-center justify-center w-full">
        <span className="text-2xl sm:text-3xl font-bold text-[#176B45] mr-1.5">
          {currencySymbol}
        </span>
        <input
          id="expense-amount"
          type="number"
          inputMode="decimal"
          step="any"
          min="1"
          placeholder="0"
          value={rawAmount}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-[260px] text-center text-4xl sm:text-5xl font-extrabold text-[#202522] tracking-tight bg-transparent focus:outline-hidden num-tabular border-b-2 border-transparent focus:border-[#176B45] pb-1 transition-colors"
          required
        />
      </div>

      {/* Quick amount shortcuts */}
      <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
        {[1000, 5000, 10000, 20000].map((val) => (
          <button
            type="button"
            key={val}
            onClick={() => handleQuickAdd(val)}
            className="min-h-[44px] px-3.5 py-2 text-xs sm:text-sm font-semibold bg-white text-[#202522] hover:bg-[#EBF4EF] hover:text-[#176B45] active:scale-[0.98] rounded-xl border border-[#E8ECE6] transition-all cursor-pointer num-tabular shadow-2xs"
          >
            +{formatCurrency(val, currencyCode, false)}
          </button>
        ))}
      </div>
    </div>
  );
};
