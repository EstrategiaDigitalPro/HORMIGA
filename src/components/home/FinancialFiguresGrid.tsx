import React from 'react';
import { Wallet, PiggyBank, TrendingDown, Coins, ChevronRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';

export const FinancialFiguresGrid: React.FC = () => {
  const {
    totalIncome,
    savingsSeparated,
    savingsMonthlyTarget,
    totalSpent,
    availableRemaining,
    totalBudget,
    monthData,
    setCurrentScreen,
    preferences,
  } = useFinance();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Ingresos */}
      <div
        onClick={() => setCurrentScreen('ingresos')}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8ECE6] hover:border-[#176B45]/40 transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center justify-between text-xs text-[#68716B] mb-2">
          <span className="font-medium">Ingresos totales</span>
          <div className="w-7 h-7 rounded-lg bg-[#EBF4EF] text-[#176B45] flex items-center justify-center group-hover:scale-105 transition-transform">
            <Wallet className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#202522] num-tabular tracking-tight">
          {formatCurrency(totalIncome, preferences.currency)}
        </div>
        <div className="text-[11px] text-[#68716B] mt-1 flex items-center gap-1 group-hover:text-[#176B45] transition-colors">
          <span>{monthData.incomes.length} fuentes de ingreso</span>
          <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
        </div>
      </div>

      {/* 2. Ahorro ya separado */}
      <div
        onClick={() => setCurrentScreen('ahorro')}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8ECE6] hover:border-[#F4A340]/50 transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center justify-between text-xs text-[#68716B] mb-2">
          <span className="font-medium">Ahorro separado</span>
          <div className="w-7 h-7 rounded-lg bg-[#FEF7EE] text-[#C97E25] flex items-center justify-center group-hover:scale-105 transition-transform">
            <PiggyBank className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#202522] num-tabular tracking-tight">
          {formatCurrency(savingsSeparated, preferences.currency)}
        </div>
        <div className="text-[11px] text-[#68716B] mt-1 flex items-center gap-1 group-hover:text-[#C97E25] transition-colors">
          <span>Meta: {formatCurrency(savingsMonthlyTarget, preferences.currency)}</span>
          <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
        </div>
      </div>

      {/* 3. Total gastado */}
      <div
        onClick={() => setCurrentScreen('presupuesto')}
        className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8ECE6] hover:border-black/20 transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center justify-between text-xs text-[#68716B] mb-2">
          <span className="font-medium">Total gastado</span>
          <div className="w-7 h-7 rounded-lg bg-neutral-100 text-[#202522] flex items-center justify-center group-hover:scale-105 transition-transform">
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#202522] num-tabular tracking-tight">
          {formatCurrency(totalSpent, preferences.currency)}
        </div>
        <div className="text-[11px] text-[#68716B] mt-1 flex items-center gap-1">
          <span>Presupuesto: {formatCurrency(totalBudget, preferences.currency)}</span>
          <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
        </div>
      </div>

      {/* 4. Dinero disponible restante */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-2xs ${
          availableRemaining >= 0
            ? 'bg-[#176B45] text-white border-[#176B45]'
            : 'bg-red-600 text-white border-red-600'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-white/80 mb-2">
          <span className="font-medium">Disponible restante</span>
          <div className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
            <Coins className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-extrabold text-white num-tabular tracking-tight">
          {formatCurrency(availableRemaining, preferences.currency)}
        </div>
        <div className="text-[11px] text-white/80 mt-1">
          {availableRemaining >= 0 ? 'Sin tocar tu ahorro' : 'Sobrepasado del ingreso'}
        </div>
      </div>
    </div>
  );
};
