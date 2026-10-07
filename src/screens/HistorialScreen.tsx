import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { MonthData } from '../types/finance';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { MonthSelectorTabs } from '../components/history/MonthSelectorTabs';
import { MonthSummaryCard } from '../components/history/MonthSummaryCard';
import { HistoricalMonthRow } from '../components/history/HistoricalMonthRow';

export const HistorialScreen: React.FC = () => {
  const { monthData, pastMonths, preferences } = useFinance();

  // Combine current month with past months
  const allMonths: MonthData[] = useMemo(() => [monthData, ...pastMonths], [monthData, pastMonths]);
  const [selectedKey, setSelectedKey] = useState<string>(monthData.monthKey);

  const activeMonth = useMemo(
    () => allMonths.find((m) => m.monthKey === selectedKey) || monthData,
    [allMonths, selectedKey, monthData]
  );

  // Compute metrics for activeMonth
  const activeIncome = useMemo(
    () => activeMonth.incomes.reduce((sum, i) => sum + i.amount, 0),
    [activeMonth.incomes]
  );
  const activeSpent = useMemo(
    () => activeMonth.expenses.reduce((sum, e) => sum + e.amount, 0),
    [activeMonth.expenses]
  );
  const activeSavings = activeMonth.savings?.separatedAmount || 0;
  const activeHormiga = useMemo(
    () =>
      activeMonth.expenses
        .filter((e) => e.isHormiga)
        .reduce((sum, e) => sum + e.amount, 0),
    [activeMonth.expenses]
  );

  // Compare with the month immediately preceding the active month
  const previousMonthComparison = useMemo(() => {
    const activeIndex = allMonths.findIndex((m) => m.monthKey === selectedKey);
    const previousMonth = activeIndex < allMonths.length - 1 ? allMonths[activeIndex + 1] : null;

    if (!previousMonth) return null;

    const prevHormiga = previousMonth.expenses
      .filter((e) => e.isHormiga)
      .reduce((sum, e) => sum + e.amount, 0);

    const diffAmount = activeHormiga - prevHormiga;

    if (diffAmount < 0) {
      return {
        isBetter: true,
        diffText: `Tus gastos hormiga bajaron ${formatCurrency(
          Math.abs(diffAmount),
          preferences.currency
        )} respecto a ${previousMonth.monthLabel}.`,
      };
    } else if (diffAmount > 0) {
      return {
        isBetter: false,
        diffText: `Tus gastos hormiga subieron ${formatCurrency(
          diffAmount,
          preferences.currency
        )} respecto a ${previousMonth.monthLabel}.`,
      };
    } else {
      return {
        isBetter: true,
        diffText: `Tus gastos hormiga se mantuvieron iguales que en ${previousMonth.monthLabel}.`,
      };
    }
  }, [allMonths, selectedKey, activeHormiga, preferences.currency]);

  const firstName = preferences.name?.trim().split(' ')[0] || preferences.name?.trim() || '';

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle="Progreso histórico" />

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Historial de meses
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          {firstName
            ? `${firstName}, compara tu evolución en ingresos, ahorros y gastos hormiga en el tiempo.`
            : 'Compara tu evolución en ingresos, ahorros y gastos hormiga en el tiempo.'}
        </p>
      </div>

      {/* Month Selector Tabs */}
      <MonthSelectorTabs
        months={allMonths}
        selectedKey={selectedKey}
        currentMonthKey={monthData.monthKey}
        onSelect={setSelectedKey}
      />

      {/* Selected Month Summary Card */}
      <MonthSummaryCard
        monthLabel={activeMonth.monthLabel}
        expenseCount={activeMonth.expenses.length}
        income={activeIncome}
        savings={activeSavings}
        spent={activeSpent}
        hormiga={activeHormiga}
        currency={preferences.currency}
        previousMonthComparison={previousMonthComparison}
      />

      {/* Chronological List of All Months */}
      <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E8ECE6]">
          <h3 className="text-base font-bold text-[#202522]">
            Comparativa cronológica de meses
          </h3>
          <p className="text-xs text-[#68716B]">
            Selecciona cualquier mes para inspeccionar su comportamiento
          </p>
        </div>

        <div className="divide-y divide-[#E8ECE6]">
          {allMonths.map((m) => (
            <HistoricalMonthRow
              key={m.monthKey}
              month={m}
              isSelected={m.monthKey === selectedKey}
              isCurrent={m.monthKey === monthData.monthKey}
              currency={preferences.currency}
              onClick={() => setSelectedKey(m.monthKey)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
