import React, { useState } from 'react';
import { RecurringPayment } from '../../types/finance';
import { Modal } from '../common/Modal';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payment: Omit<RecurringPayment, 'id'>) => void;
  currencySymbol: string;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currencySymbol,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('10');
  const [category, setCategory] = useState('Servicios');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    const day = parseInt(dueDay) || 1;
    if (!name.trim() || numAmount <= 0) return;

    onAdd({
      name: name.trim(),
      amount: numAmount,
      dueDay: Math.min(31, Math.max(1, day)),
      category,
      isPaid: false,
    });

    setName('');
    setAmount('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar nueva obligación"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Nombre del pago</label>
          <input
            type="text"
            inputMode="text"
            placeholder="Ej: Internet hogar, Plan celular, Seguro"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#202522]">Monto</label>
            <div className="flex items-center gap-1.5 bg-[#F7F8F6] px-3 py-2 rounded-xl border border-[#E8ECE6] min-h-[46px]">
              <span className="text-xs font-bold text-[#68716B]">{currencySymbol}</span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                min="1"
                placeholder="Ej: 25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-base font-bold text-[#202522] bg-transparent focus:outline-hidden num-tabular"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#202522]">Día de vencimiento</label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="31"
              placeholder="Ej: 10"
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden cursor-pointer"
          >
            <option value="Vivienda">Vivienda</option>
            <option value="Servicios">Servicios</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Salud">Salud</option>
            <option value="Transporte">Transporte</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 min-h-[46px] py-2.5 text-xs sm:text-sm font-semibold text-[#68716B] hover:text-[#202522] rounded-xl border border-[#E8ECE6] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-1/2 min-h-[46px] py-2.5 text-xs sm:text-sm font-semibold bg-[#176B45] text-white rounded-xl hover:bg-[#125537] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            Agregar pago
          </button>
        </div>
      </form>
    </Modal>
  );
};
