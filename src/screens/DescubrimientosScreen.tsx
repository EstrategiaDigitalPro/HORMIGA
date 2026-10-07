import React from 'react';
import { Sparkles } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { DiscoveriesList } from '../components/discoveries/DiscoveriesList';

export const DescubrimientosScreen: React.FC = () => {
  const { monthData, preferences } = useFinance();
  const firstName = preferences.name?.trim().split(' ')[0] || preferences.name?.trim() || '';

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData.monthLabel} />

      {/* Screen Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#F4A340] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#F4A340]" />
          <span>Patrones y hábitos financieros</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Descubrimientos
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B]">
          {firstName
            ? `${firstName}, aquí tienes conclusiones y patrones detectados por HORMIGA para ayudarte a tomar mejores decisiones.`
            : 'Conclusiones y patrones claros detectados por HORMIGA para ayudarte a tomar mejores decisiones.'}
        </p>
      </div>

      {/* Insight Cards List */}
      <DiscoveriesList />
    </div>
  );
};
