import React, { useMemo } from 'react';
import { BarChart3, Sparkles, History, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { DonutChart, CategorySpendingItem } from '../components/analysis/DonutChart';
import { BudgetVsRealityTable } from '../components/analysis/BudgetVsRealityTable';

export const AnalisisScreen: React.FC = () => {
  const {
    monthData,
    setCurrentScreen,
    preferences,
    totalIncome,
    savingsSeparated,
    totalSpent,
    totalBudget,
    availableRemaining,
  } = useFinance();

  const firstName = preferences.name?.trim().split(' ')[0] || preferences.name?.trim() || '';

  // Aggregate spending by category
  const categorySpending: CategorySpendingItem[] = useMemo(() => {
    const map: Record<string, number> = {};
    monthData.expenses.forEach((e) => {
      const cat = e.isHormiga ? 'Gastos hormiga' : e.category;
      map[cat] = (map[cat] || 0) + e.amount;
    });

    const entries = Object.entries(map).map(([name, amount]) => {
      const budgetItem = monthData.budgets.find(
        (b) => b.name === name || (name === 'Gastos hormiga' && b.isHormigaCategory)
      );
      const planned = budgetItem?.plannedAmount || 0;
      const percentageOfTotalSpent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
      const percentageOfPlanned = planned > 0 ? (amount / planned) * 100 : 0;

      return {
        name,
        actual: amount,
        planned,
        percentageOfTotalSpent,
        percentageOfPlanned,
        color: budgetItem?.color || (name === 'Gastos hormiga' ? '#F4A340' : '#176B45'),
      };
    });

    return entries.sort((a, b) => b.actual - a.actual);
  }, [monthData.expenses, monthData.budgets, totalSpent]);

  const headerRight = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentScreen('descubrimientos')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C97E25] bg-[#FEF7EE] hover:bg-[#FEF7EE]/80 rounded-xl border border-[#F4A340]/40 transition-colors cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#F4A340]" />
        <span>Descubrimientos</span>
      </button>
      <button
        onClick={() => setCurrentScreen('historial')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#202522] bg-white hover:bg-[#F7F8F6] rounded-xl border border-[#E8ECE6] transition-colors cursor-pointer"
      >
        <History className="w-3.5 h-3.5 text-[#68716B]" />
        <span>Historial</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader rightContent={headerRight} />

      {/* Screen Title (Exact match with button) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Análisis
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          Visualiza la distribución de tu dinero, gráficos por categoría y comparación de presupuesto vs realidad
        </p>
      </div>

      {/* 1. Monthly Overview: Income vs Savings vs Planned vs Actual vs Available */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B45] uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Panorama general del mes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#202522] tracking-tight mt-1">
            Distribución global de {monthData.monthLabel}
          </h2>
        </div>

        {/* 5-Metric Balance Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#F7F8F6] border border-[#E8ECE6] space-y-1">
            <span className="text-[11px] font-semibold text-[#68716B] block">Ingresos</span>
            <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
              {formatCurrency(totalIncome, preferences.currency)}
            </div>
            <div className="text-[10px] text-[#176B45] font-medium">100% entrada</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FEF7EE] border border-[#F4A340]/30 space-y-1">
            <span className="text-[11px] font-semibold text-[#C97E25] block">Ahorro separado</span>
            <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
              {formatCurrency(savingsSeparated, preferences.currency)}
            </div>
            <div className="text-[10px] text-[#C97E25] font-medium">
              {totalIncome > 0 ? Math.round((savingsSeparated / totalIncome) * 100) : 0}% del ingreso
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F8F6] border border-[#E8ECE6] space-y-1">
            <span className="text-[11px] font-semibold text-[#68716B] block">Presupuestado</span>
            <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
              {formatCurrency(totalBudget, preferences.currency)}
            </div>
            <div className="text-[10px] text-[#68716B]">Tope de gasto</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F8F6] border border-[#E8ECE6] space-y-1">
            <span className="text-[11px] font-semibold text-[#68716B] block">Gasto real</span>
            <div className="text-base sm:text-lg font-extrabold text-[#202522] num-tabular">
              {formatCurrency(totalSpent, preferences.currency)}
            </div>
            <div className="text-[10px] text-[#68716B] font-medium">
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% del tope
            </div>
          </div>

          <div
            className={`p-3.5 rounded-xl border space-y-1 col-span-2 sm:col-span-1 ${
              availableRemaining >= 0
                ? 'bg-[#EBF4EF] border-[#176B45]/30'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <span className="text-[11px] font-semibold text-[#176B45] block">Disponible restante</span>
            <div className="text-base sm:text-lg font-extrabold text-[#176B45] num-tabular">
              {formatCurrency(availableRemaining, preferences.currency)}
            </div>
            <div className="text-[10px] text-[#176B45] font-medium">
              {availableRemaining >= 0 ? 'Sin tocar ahorro' : 'Déficit'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Spending Distribution by Category */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#202522]">
            Distribución del gasto por categoría
          </h3>
          <p className="text-xs text-[#68716B]">
            {firstName
              ? `${firstName}, ¿en qué rubros se está yendo tu dinero este mes?`
              : '¿En qué rubros se está yendo tu dinero este mes?'}
          </p>
        </div>

        <DonutChart
          categories={categorySpending}
          totalSpent={totalSpent}
          currencyCode={preferences.currency}
        />
      </div>

      {/* 3. Section: "Presupuesto vs. Realidad" */}
      <BudgetVsRealityTable
        budgets={monthData.budgets}
        categorySpending={categorySpending}
        currencyCode={preferences.currency}
      />

      {/* Discovery CTA */}
      <div
        onClick={() => setCurrentScreen('descubrimientos')}
        className="p-5 bg-gradient-to-r from-[#FEF7EE] to-white rounded-2xl border border-[#F4A340]/40 flex items-center justify-between cursor-pointer hover:border-[#F4A340] transition-all group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FEF7EE] text-[#F4A340] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#202522] group-hover:text-[#C97E25] transition-colors">
              Ver descubrimientos y patrones de este mes
            </h4>
            <p className="text-xs text-[#68716B]">
              Conclusiones automáticas generadas a partir de tus registros reales
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#C97E25] group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
