import React from 'react';
import { CheckCircle2, Clock, ChevronRight, Flame, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';

export const SpotlightCards: React.FC = () => {
  const {
    completedPaymentsCount,
    pendingPaymentsCount,
    pendingPaymentsAmount,
    monthData,
    gastosHormigaSpent,
    gastosHormigaPercent,
    setCurrentScreen,
    preferences,
  } = useFinance();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Pagos Summary Card */}
      <div
        onClick={() => setCurrentScreen('pagos')}
        className="bg-white p-5 rounded-2xl border border-[#E8ECE6] hover:border-[#176B45]/40 transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EBF4EF] text-[#176B45] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#202522]">Pagos del mes</h3>
            </div>
            <span className="text-xs text-[#176B45] font-semibold group-hover:underline flex items-center gap-0.5">
              Gestionar <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-1.5 text-xs text-[#202522]">
              <span className="w-2 h-2 rounded-full bg-[#176B45]"></span>
              <span className="font-semibold">{completedPaymentsCount}</span> pagados
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#C97E25]">
              <span className="w-2 h-2 rounded-full bg-[#F4A340]"></span>
              <span className="font-semibold">{pendingPaymentsCount}</span> pendientes
            </div>
          </div>

          <p className="text-xs text-[#68716B] mt-1">
            {pendingPaymentsCount > 0
              ? `Faltan ${formatCurrency(pendingPaymentsAmount, preferences.currency)} por pagar este mes.`
              : '¡Excelente! Todos tus compromisos recurrentes están al día.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E8ECE6] flex items-center justify-between text-xs text-[#68716B]">
          <span>{monthData.payments.length} obligaciones registradas</span>
          <div className="flex items-center gap-1 text-[#176B45] font-medium">
            <Clock className="w-3 h-3" />
            <span>Ver calendario</span>
          </div>
        </div>
      </div>

      {/* Gastos Hormiga Spotlight Card */}
      <div
        onClick={() => setCurrentScreen('gastos_hormiga')}
        className="bg-white p-5 rounded-2xl border border-[#F4A340]/40 bg-gradient-to-br from-white to-[#FEF7EE]/40 hover:border-[#F4A340] transition-all cursor-pointer group shadow-2xs flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FEF7EE] text-[#F4A340] flex items-center justify-center">
                <Flame className="w-4 h-4 fill-[#F4A340]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#202522]">Gastos hormiga del mes</h3>
              </div>
            </div>
            <span className="text-xs text-[#C97E25] font-semibold group-hover:underline flex items-center gap-0.5">
              Descubrir <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 py-1">
            <span className="text-2xl font-extrabold text-[#202522] num-tabular tracking-tight">
              {formatCurrency(gastosHormigaSpent, preferences.currency)}
            </span>
            <span className="text-xs font-semibold text-[#C97E25]">
              ({Math.round(gastosHormigaPercent)}% de su tope)
            </span>
          </div>

          <p className="text-xs text-[#68716B] mt-1 leading-relaxed">
            Pequeños consumos diarios acumulados. A este ritmo representarán{' '}
            <strong className="text-[#202522] font-semibold">
              {formatCurrency(gastosHormigaSpent * 12, preferences.currency)} al año
            </strong>.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#F4A340]/20 flex items-center justify-between text-xs text-[#C97E25] font-medium">
          <span>Ver análisis de microgastos</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
