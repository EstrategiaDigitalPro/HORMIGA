import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currency';
import { Modal } from '../common/Modal';

interface SeparateSavingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyTarget: number;
  currentSeparated: number;
  currencyCode: string;
  currencySymbol: string;
  onConfirm: (amount: number) => void;
}

export const SeparateSavingsModal: React.FC<SeparateSavingsModalProps> = ({
  isOpen,
  onClose,
  monthlyTarget,
  currentSeparated,
  currencyCode,
  currencySymbol,
  onConfirm,
}) => {
  const [separateInput, setSeparateInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const initial = currentSeparated || monthlyTarget;
      setSeparateInput(initial > 0 ? String(initial) : '');
    }
  }, [isOpen, currentSeparated, monthlyTarget]);

  const handleConfirm = () => {
    const parsed = parseFloat(separateInput) || 0;
    onConfirm(parsed);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Separar ahorro este mes"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-xs text-[#68716B]">
          Ingresa el monto que transferiste a tu cuenta de ahorro o reserva protegida.
        </p>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Monto a separar</label>
          <div className="flex items-center gap-1.5 bg-[#F7F8F6] px-3 py-2 rounded-xl border border-[#E8ECE6]">
            <span className="text-sm font-bold text-[#68716B]">{currencySymbol}</span>
            <input
              type="number"
              placeholder="0"
              value={separateInput}
              onChange={(e) => setSeparateInput(e.target.value)}
              onFocus={(e) => {
                if (e.target.value === '0') setSeparateInput('');
                else e.target.select();
              }}
              className="w-full text-xl font-extrabold text-[#202522] bg-transparent focus:outline-hidden num-tabular"
              autoFocus
            />
          </div>
        </div>

        {/* Shortcut Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSeparateInput(String(monthlyTarget))}
            className="px-3 py-2 text-xs font-medium bg-[#F7F8F6] text-[#202522] rounded-lg border border-[#E8ECE6] hover:bg-[#EBF4EF] cursor-pointer"
          >
            Meta completa ({formatCurrency(monthlyTarget, currencyCode)})
          </button>
          <button
            type="button"
            onClick={() => setSeparateInput(String(Math.round(monthlyTarget / 2)))}
            className="px-3 py-2 text-xs font-medium bg-[#F7F8F6] text-[#202522] rounded-lg border border-[#E8ECE6] hover:bg-[#EBF4EF] cursor-pointer"
          >
            50% de la meta ({formatCurrency(monthlyTarget / 2, currencyCode)})
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 text-xs font-semibold text-[#68716B] hover:text-[#202522] rounded-xl border border-[#E8ECE6] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleConfirm}
            className="w-1/2 py-2.5 text-xs font-semibold bg-[#176B45] text-white rounded-xl hover:bg-[#125537] cursor-pointer"
          >
            Confirmar separación
          </button>
        </div>
      </div>
    </Modal>
  );
};
