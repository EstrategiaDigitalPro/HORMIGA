import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { IncomeSource } from '../../types/finance';

interface AddIncomeFormProps {
  onAdd: (income: Omit<IncomeSource, 'id'>) => void;
  onCancel: () => void;
}

export const AddIncomeForm: React.FC<AddIncomeFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeSource['category']>('salario');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount) || 0;
    if (!name.trim() || amountNum <= 0) return;

    onAdd({
      name: name.trim(),
      amount: amountNum,
      category,
    });

    setName('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-[#F7F8F6] border-b border-[#E8ECE6] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#202522]">Nueva fuente de dinero</span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-[#68716B] hover:text-[#202522] cursor-pointer min-h-[36px] px-2 flex items-center"
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1 sm:col-span-1">
          <label className="text-[11px] font-semibold text-[#68716B]">Tipo</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden cursor-pointer"
          >
            <option value="salario">Salario / Sueldo</option>
            <option value="negocio">Negocio propio</option>
            <option value="independiente">Trabajo independiente</option>
            <option value="pension">Pensión / Jubilación</option>
            <option value="otros">Otros ingresos</option>
          </select>
        </div>

        <div className="space-y-1 sm:col-span-1">
          <label className="text-[11px] font-semibold text-[#68716B]">Nombre o concepto</label>
          <input
            type="text"
            inputMode="text"
            placeholder="Ej: Sueldo fijo, Proyecto freelance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
            required
          />
        </div>

        <div className="space-y-1 sm:col-span-1">
          <label className="text-[11px] font-semibold text-[#68716B]">Monto mensual</label>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            placeholder="0"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={(e) => {
              if (e.target.value === '0') setAmount('');
              else e.target.select();
            }}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden num-tabular"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="submit"
          className="min-h-[46px] px-5 py-2.5 bg-[#176B45] hover:bg-[#125537] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar a la lista</span>
        </button>
      </div>
    </form>
  );
};
