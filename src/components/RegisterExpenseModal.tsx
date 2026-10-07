import React, { useState, useEffect, useRef } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { Modal } from './common/Modal';
import { ExpenseAmountInput } from './movements/ExpenseAmountInput';
import { CategorySelector } from './movements/CategorySelector';
import { HormigaToggleCard } from './movements/HormigaToggleCard';

export const RegisterExpenseModal: React.FC = () => {
  const {
    isRegisterModalOpen,
    closeRegisterModal,
    addExpense,
    preferences,
    monthData,
  } = useFinance();

  const [name, setName] = useState<string>('');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('Alimentación');
  const [isHormiga, setIsHormiga] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the custom name input when opened
  useEffect(() => {
    if (isRegisterModalOpen) {
      setName('');
      setRawAmount('');
      setCategory('Alimentación');
      setIsHormiga(false);
      setDate(new Date().toISOString().split('T')[0]);
      setIsSubmitting(false);
      setErrorMessage(null);
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isRegisterModalOpen]);

  const numericAmount = parseFloat(rawAmount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage('Por favor escribe un nombre o descripción para identificar este gasto.');
      nameInputRef.current?.focus();
      return;
    }

    if (numericAmount <= 0) {
      setErrorMessage('Por favor ingresa un monto válido mayor a 0.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    // Provide visual feedback before closing
    setTimeout(() => {
      addExpense({
        amount: numericAmount,
        category,
        description: trimmedName,
        isHormiga,
        date,
      });
      setIsSubmitting(false);
      closeRegisterModal();
    }, 350);
  };

  const modalTitle = (
    <div className="flex items-center gap-2">
      <span className="text-base font-bold text-[#202522]">Registrar gasto</span>
      <span className="text-xs text-[#68716B]">· {monthData.monthLabel}</span>
    </div>
  );

  return (
    <Modal
      isOpen={isRegisterModalOpen}
      onClose={closeRegisterModal}
      title={modalTitle}
      maxWidth="max-w-lg"
      variant="bottom-sheet"
    >
      <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
        {/* Error notification if validation fails */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium animate-in fade-in">
            {errorMessage}
          </div>
        )}

        {/* 1. Custom Expense Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="custom-expense-name"
            className="block text-xs font-bold uppercase tracking-wider text-[#202522]"
          >
            Nombre del gasto
          </label>
          <input
            ref={nameInputRef}
            id="custom-expense-name"
            type="text"
            autoCapitalize="sentences"
            placeholder="Ej: Café con medialuna, Supermercado, Bencina"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            className="w-full min-h-[46px] px-4 py-3 text-base font-semibold text-[#202522] bg-[#F7F8F6] border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:bg-white focus:outline-hidden transition-all placeholder:text-[#68716B]/60 placeholder:font-normal"
            required
          />
        </div>

        {/* 2. Amount Input: "¿Cuánto gastaste?" with quick shortcuts */}
        <ExpenseAmountInput
          rawAmount={rawAmount}
          onChange={(val) => {
            setRawAmount(val);
            if (errorMessage) setErrorMessage(null);
          }}
          currencySymbol={preferences.currencySymbol}
          currencyCode={preferences.currency}
        />

        {/* 3. Category for Budget classification */}
        <CategorySelector
          selectedCategory={category}
          onSelectCategory={setCategory}
          onSelectHormigaCategory={() => setIsHormiga(true)}
        />

        {/* 4. "¿Es un gasto hormiga?" Toggle Card */}
        <HormigaToggleCard
          isHormiga={isHormiga}
          onToggle={setIsHormiga}
        />

        {/* 5. Date */}
        <div className="space-y-1">
          <label htmlFor="expense-date" className="block text-xs font-semibold text-[#68716B]">
            Fecha del gasto
          </label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
          />
        </div>

        {/* Main Action Button in the lower half of screen */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || numericAmount <= 0}
            className={`w-full min-h-[50px] py-3.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs ${
              name.trim() && numericAmount > 0 && !isSubmitting
                ? 'bg-[#176B45] hover:bg-[#125537] active:scale-[0.99]'
                : 'bg-[#68716B]/40 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando gasto...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Guardar gasto</span>
                {numericAmount > 0 && (
                  <span className="font-mono text-xs opacity-90">
                    ({formatCurrency(numericAmount, preferences.currency)})
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
