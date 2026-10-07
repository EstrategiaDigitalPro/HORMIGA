import React from 'react';
import { Sparkles, TrendingDown, PiggyBank, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const QuickNavBanner: React.FC = () => {
  const { setCurrentScreen } = useFinance();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      <button
        onClick={() => setCurrentScreen('descubrimientos')}
        className="p-3.5 bg-white border border-[#E8ECE6] hover:border-[#F4A340] rounded-xl text-left transition-all cursor-pointer group"
      >
        <Sparkles className="w-4 h-4 text-[#F4A340] mb-1.5" />
        <p className="text-xs font-bold text-[#202522] group-hover:text-[#C97E25]">
          Descubrimientos
        </p>
        <p className="text-[11px] text-[#68716B]">Patrones y hábitos</p>
      </button>

      <button
        onClick={() => setCurrentScreen('presupuesto')}
        className="p-3.5 bg-white border border-[#E8ECE6] hover:border-[#176B45] rounded-xl text-left transition-all cursor-pointer group"
      >
        <TrendingDown className="w-4 h-4 text-[#176B45] mb-1.5" />
        <p className="text-xs font-bold text-[#202522] group-hover:text-[#176B45]">
          Presupuesto
        </p>
        <p className="text-[11px] text-[#68716B]">Límites por categoría</p>
      </button>

      <button
        onClick={() => setCurrentScreen('ahorro')}
        className="p-3.5 bg-white border border-[#E8ECE6] hover:border-[#176B45] rounded-xl text-left transition-all cursor-pointer group"
      >
        <PiggyBank className="w-4 h-4 text-[#176B45] mb-1.5" />
        <p className="text-xs font-bold text-[#202522] group-hover:text-[#176B45]">
          Ahorro intencional
        </p>
        <p className="text-[11px] text-[#68716B]">Dinero protegido</p>
      </button>

      <button
        onClick={() => setCurrentScreen('historial')}
        className="p-3.5 bg-white border border-[#E8ECE6] hover:border-[#176B45] rounded-xl text-left transition-all cursor-pointer group"
      >
        <Calendar className="w-4 h-4 text-[#68716B] mb-1.5" />
        <p className="text-xs font-bold text-[#202522] group-hover:text-[#202522]">
          Historial de meses
        </p>
        <p className="text-[11px] text-[#68716B]">Evolución en el tiempo</p>
      </button>
    </div>
  );
};
