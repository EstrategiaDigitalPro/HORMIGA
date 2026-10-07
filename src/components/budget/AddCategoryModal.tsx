import React, { useState } from 'react';
import { CategoryBudget } from '../../types/finance';
import { Modal } from '../common/Modal';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<CategoryBudget, 'id'>) => void;
  currencySymbol: string;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  currencySymbol,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newCatAmount) || 0;
    if (!newCatName.trim() || amount <= 0) return;

    onAdd({
      name: newCatName.trim(),
      plannedAmount: amount,
      icon: 'Layers',
      color: '#68716B',
      isHormigaCategory: newCatName.toLowerCase().includes('hormiga'),
    });

    setNewCatName('');
    setNewCatAmount('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva categoría de gasto"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Nombre de la categoría</label>
          <input
            type="text"
            inputMode="text"
            placeholder="Ej: Mascotas, Gimnasio, Ropa"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
            required
            autoFocus
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Tope mensual planeado</label>
          <div className="flex items-center gap-1.5 bg-[#F7F8F6] px-3.5 py-2.5 rounded-xl border border-[#E8ECE6] min-h-[46px]">
            <span className="text-sm font-bold text-[#68716B]">{currencySymbol}</span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="Ej: 50000"
              min="1"
              value={newCatAmount}
              onChange={(e) => setNewCatAmount(e.target.value)}
              className="w-full text-base font-bold text-[#202522] bg-transparent focus:outline-hidden num-tabular"
              required
            />
          </div>
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
            Crear categoría
          </button>
        </div>
      </form>
    </Modal>
  );
};
