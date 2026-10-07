import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { UserGreetingBanner } from '../components/home/UserGreetingBanner';
import { FinancialFiguresGrid } from '../components/home/FinancialFiguresGrid';
import { BudgetProgressBar } from '../components/home/BudgetProgressBar';
import { MonthlyHealthBadge } from '../components/MonthlyHealthBadge';
import { SpotlightCards } from '../components/home/SpotlightCards';
import { MovementsCard } from '../components/movements/MovementsCard';
import { QuickNavBanner } from '../components/home/QuickNavBanner';
import { formatExactDateSpanish } from '../utils/currency';

export const MiMesScreen: React.FC = () => {
  const { openRegisterModal, preferences } = useFinance();
  const firstName = preferences.name?.trim().split(' ')[0] || 'Camila';
  const exactDate = formatExactDateSpanish();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Warm Personal Greeting & Name Field */}
      <UserGreetingBanner />

      {/* 2. Top Header: Current Month & Question */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8ECE6]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#68716B]">
            <Calendar className="w-3.5 h-3.5 text-[#176B45]" />
            <span>Control financiero mensual</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{exactDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight mt-0.5">
            ¿Cómo vas con tu dinero este mes, {firstName}?
          </h1>
        </div>

        {/* Quick CTA button */}
        <div className="flex items-center gap-2">
          <button
            onClick={openRegisterModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F4A340] hover:bg-[#E08F2D] text-[#202522] text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Registrar gasto</span>
          </button>
        </div>
      </div>

      {/* 3. 4 Prominent Figures Grid */}
      <FinancialFiguresGrid />

      {/* 4. Visual Progress Indicator for Monthly Spending Budget */}
      <BudgetProgressBar />

      {/* 5. Status Message Badge */}
      <MonthlyHealthBadge />

      {/* 6. 2-Column Section: Pagos vs Gastos Hormiga */}
      <SpotlightCards />

      {/* 7. Recent Transactions Section */}
      <MovementsCard maxItems={7} showAllLink={true} />

      {/* 8. Quick Navigation Shortcuts */}
      <QuickNavBanner />
    </div>
  );
};
