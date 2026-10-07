import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';

export const MonthlyHealthBadge: React.FC = () => {
  const {
    budgetStatus,
    budgetStatusText,
    budgetUsedPercent,
    availableRemaining,
    preferences,
  } = useFinance();

  const firstName = preferences.name?.trim().split(' ')[0] || '';
  const greetingName = firstName ? `${firstName}, ` : '';

  const configs = {
    good: {
      borderColor: 'border-[#176B45]/30',
      bgColor: 'bg-[#EBF4EF]/80',
      textColor: 'text-[#176B45]',
      icon: CheckCircle2,
      title: `${greetingName}vas bien con tu presupuesto`,
      detail: `Tienes ${formatCurrency(availableRemaining, preferences.currency)} disponibles para lo que resta de mes. Mantén este ritmo.`,
    },
    warning: {
      borderColor: 'border-[#F4A340]/40',
      bgColor: 'bg-[#FEF7EE]',
      textColor: 'text-[#C97E25]',
      icon: AlertTriangle,
      title: `${greetingName}cuidado con tu presupuesto`,
      detail: `Has utilizado el ${Math.round(budgetUsedPercent)}% de tu presupuesto planeado. Prioriza los pagos esenciales.`,
    },
    over: {
      borderColor: 'border-[#DC2626]/30',
      bgColor: 'bg-red-50/80',
      textColor: 'text-[#DC2626]',
      icon: AlertCircle,
      title: `${greetingName}has superado tu presupuesto`,
      detail: availableRemaining < 0
        ? `Has sobrepasado tus ingresos por ${formatCurrency(Math.abs(availableRemaining), preferences.currency)}. Revisa tus categorías y frena los microgastos.`
        : `Has superado el 100% del presupuesto asignado para el mes.`,
    },
  };

  const current = configs[budgetStatus];
  const Icon = current.icon;

  return (
    <div
      className={`rounded-2xl border ${current.borderColor} ${current.bgColor} p-4 sm:p-5 flex items-start gap-3.5 transition-colors`}
    >
      <div className={`p-1.5 rounded-xl bg-white/80 shrink-0 mt-0.5 ${current.textColor} shadow-xs`}>
        <Icon className="w-5 h-5 stroke-[2.2]" />
      </div>
      <div className="space-y-1">
        <h4 className={`text-sm sm:text-base font-bold ${current.textColor} tracking-tight capitalize-first`}>
          {current.title}
        </h4>
        <p className="text-xs sm:text-sm text-[#202522]/80 leading-relaxed">
          {current.detail}
        </p>
      </div>
    </div>
  );
};
