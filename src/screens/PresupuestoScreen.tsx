import React, { useState } from 'react';
import { PieChart, Check, Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryBudget } from '../types/finance';
import { formatCurrency } from '../utils/currency';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { CategoryBudgetRow } from '../components/budget/CategoryBudgetRow';
import { AddCategoryModal } from '../components/budget/AddCategoryModal';
import { useDisclosure } from '../hooks/useDisclosure';
import { EmptyState } from '../components/common/EmptyState';

export const PresupuestoScreen: React.FC = () => {
  const {
    monthData,
    setCurrentScreen,
    preferences,
    updateCategoryBudget,
    addCategoryBudget,
  } = useFinance();

  const [budgetsList, setBudgetsList] = useState<CategoryBudget[]>(monthData.budgets);
  const categoryModal = useDisclosure(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setBudgetsList(monthData.budgets);
  }, [monthData.budgets]);

  // Map category spent from expenses
  const categorySpentMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    monthData.expenses.forEach((e) => {
      const catKey = e.isHormiga ? 'Gastos hormiga' : e.category;
      map[catKey] = (map[catKey] || 0) + e.amount;
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [monthData.expenses]);

  const totalPlanned = budgetsList.reduce(
    (sum, b) => sum + (parseFloat(String(b.plannedAmount)) || 0),
    0
  );

  const handleAmountChange = (id: string, value: string) => {
    const numeric = parseFloat(value) || 0;
    setBudgetsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, plannedAmount: numeric } : b))
    );
  };

  const handleSaveBudget = () => {
    budgetsList.forEach((b) => {
      updateCategoryBudget(b.id, b.plannedAmount);
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setCurrentScreen('mi_mes');
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData.monthLabel} />

      {/* Screen Title (Exact match with button) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Presupuesto
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          Planifica cuánto deseas gastar por categoría para no salirte de tus metas
        </p>
      </div>

      {/* Top Banner: Total Planned Spending */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B45] uppercase tracking-wider">
            <PieChart className="w-4 h-4" />
            <span>Presupuesto planeado total</span>
          </div>
          <span className="text-xs text-[#68716B]">
            {budgetsList.length} categorías
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-[#202522] num-tabular tracking-tight">
          {formatCurrency(totalPlanned, preferences.currency)}
        </div>
        <p className="text-xs text-[#68716B]">
          Establece el tope máximo mensual que deseas gastar en cada rubro para mantener el control.
        </p>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E8ECE6] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#202522]">Límites por categoría</h2>
            <p className="text-xs text-[#68716B]">
              Compara lo presupuestado contra el gasto real registrado a la fecha
            </p>
          </div>
          <button
            type="button"
            onClick={categoryModal.open}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-[#176B45] bg-[#EBF4EF] hover:bg-[#176B45]/15 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nueva categoría</span>
          </button>
        </div>

        {budgetsList.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<PieChart className="w-5 h-5 text-[#176B45]" />}
              title="No hay categorías de presupuesto"
              description="Crea categorías como Alimentación, Vivienda o Gastos hormiga para asignar un límite a cada una."
              actionLabel="Crear primera categoría"
              onAction={categoryModal.open}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E8ECE6]">
            {budgetsList.map((cat) => {
              const spent =
                categorySpentMap[cat.name] ||
                (cat.isHormigaCategory ? categorySpentMap['Gastos hormiga'] : 0) ||
                0;

              return (
                <CategoryBudgetRow
                  key={cat.id}
                  category={cat}
                  spent={spent}
                  currencyCode={preferences.currency}
                  currencySymbol={preferences.currencySymbol}
                  onAmountChange={handleAmountChange}
                />
              );
            })}
          </div>
        )}

        {/* Total Budget Summary at Bottom */}
        <div className="p-5 bg-[#F7F8F6] border-t border-[#E8ECE6] flex items-center justify-between">
          <span className="text-sm font-bold text-[#202522]">Total presupuesto mensual</span>
          <span className="text-lg font-extrabold text-[#202522] num-tabular">
            {formatCurrency(totalPlanned, preferences.currency)}
          </span>
        </div>
      </div>

      {/* Thumb-friendly lower action zone */}
      <div className="space-y-3 pt-1">
        {budgetsList.length > 0 && (
          <button
            type="button"
            onClick={categoryModal.open}
            className="w-full min-h-[48px] py-3 bg-white hover:bg-[#F7F8F6] text-[#176B45] border-2 border-dashed border-[#176B45]/40 hover:border-[#176B45] text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Agregar otra categoría</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveBudget}
          disabled={savedSuccess}
          className="w-full min-h-[50px] py-3.5 bg-[#176B45] hover:bg-[#125537] text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Presupuesto guardado y actualizado</span>
            </>
          ) : (
            <span>Guardar presupuesto</span>
          )}
        </button>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={categoryModal.isOpen}
        onClose={categoryModal.close}
        onAdd={addCategoryBudget}
        currencySymbol={preferences.currencySymbol}
      />
    </div>
  );
};
