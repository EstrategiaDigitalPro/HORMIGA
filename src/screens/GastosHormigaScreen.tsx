import React, { useState } from 'react';
import { Flame, TrendingDown, Sparkles, Plus, HelpCircle, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { HORMIGA_TYPES } from '../utils/initialData';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { RankedHormigaTypes } from '../components/hormiga/RankedHormigaTypes';
import { ExpenseItemRow } from '../components/movements/ExpenseItemRow';
import { useInlineExpenseEditor } from '../hooks/useInlineExpenseEditor';
import { EmptyState } from '../components/common/EmptyState';

export const GastosHormigaScreen: React.FC = () => {
  const {
    monthData,
    preferences,
    gastosHormigaSpent,
    gastosHormigaBudget,
    gastosHormigaPercent,
    gastosHormigaByType,
    openRegisterModal,
    deleteExpense,
  } = useFinance();

  const [showTip, setShowTip] = useState(true);

  const {
    editingExpenseId,
    editingName,
    setEditingName,
    startEditing,
    saveEditing,
    handleKeyDown,
  } = useInlineExpenseEditor();

  const hormigaExpenses = monthData.expenses.filter((e) => e.isHormiga);
  const annualProjection = gastosHormigaSpent * 12;
  const halfSavings = gastosHormigaSpent / 2;
  const halfSavingsAnnual = halfSavings * 12;

  // Rank types by accumulated amount
  const rankedTypes = HORMIGA_TYPES.map((t) => {
    const data = gastosHormigaByType[t.id] || { count: 0, amount: 0 };
    const percentage =
      gastosHormigaSpent > 0 ? Math.round((data.amount / gastosHormigaSpent) * 100) : 0;
    return {
      ...t,
      amount: data.amount,
      count: data.count,
      percentage,
    };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData.monthLabel} />

      {/* Screen Title (Exact match with button) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Gastos hormiga
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          Descubre exactamente cuánto suman tus microgastos cotidianos y compras impulsivas
        </p>
      </div>

      {/* First-time friendly visual cue / educational tip */}
      {showTip && (
        <div className="p-4 rounded-2xl bg-[#FEF7EE] border border-[#F4A340]/40 flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#C97E25] shrink-0 mt-0.5" />
            <div className="text-xs text-[#202522] leading-relaxed space-y-0.5">
              <span className="font-bold text-[#C97E25] block">
                ¿Qué es un gasto hormiga?
              </span>
              <p className="text-[#68716B]">
                Son compras pequeñas de bajo costo (un café, golosinas, traslados cortos o delivery)
                que parecen no afectar tu bolsillo día a día, pero que sumadas al mes pueden
                consumir gran parte de tu dinero disponible sin que lo notes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowTip(false)}
            className="p-1 rounded-lg text-[#68716B] hover:text-[#202522] cursor-pointer shrink-0"
            aria-label="Cerrar pista"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner: Total Spent on Gastos Hormiga & Budget % */}
      <div className="bg-gradient-to-br from-[#FEF7EE] via-white to-white p-6 sm:p-8 rounded-2xl border border-[#F4A340]/40 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C97E25] uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-[#F4A340] text-[#F4A340]" />
            <span>Microgastos acumulados</span>
          </div>
          <span className="text-xs text-[#68716B]">
            {hormigaExpenses.length} microgastos registrados
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#202522] num-tabular tracking-tight">
            {formatCurrency(gastosHormigaSpent, preferences.currency)}
          </div>
          <div className="text-xs font-bold text-[#C97E25] bg-[#FEF7EE] px-3 py-1.5 rounded-xl border border-[#F4A340]/30 self-start sm:self-auto">
            {Math.round(gastosHormigaPercent)}% del tope mensual de {formatCurrency(gastosHormigaBudget, preferences.currency)}
          </div>
        </div>

        {/* Progress Bar against Hormiga Budget */}
        <div className="space-y-1">
          <div className="w-full bg-[#E8ECE6]/60 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                gastosHormigaPercent > 100
                  ? 'bg-[#DC2626]'
                  : gastosHormigaPercent > 75
                  ? 'bg-[#F4A340]'
                  : 'bg-[#176B45]'
              }`}
              style={{ width: `${Math.min(100, gastosHormigaPercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#68716B]">
            <span>$0</span>
            <span>
              {gastosHormigaPercent > 100
                ? `Excedido por ${formatCurrency(gastosHormigaSpent - gastosHormigaBudget, preferences.currency)}`
                : `Margen disponible: ${formatCurrency(gastosHormigaBudget - gastosHormigaSpent, preferences.currency)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Discovery Impact & Annual Projection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Annual Projection */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#68716B]">
            <TrendingDown className="w-4 h-4 text-[#DC2626]" />
            <span>Proyección a 12 meses</span>
          </div>
          <div className="text-2xl font-extrabold text-[#202522] num-tabular">
            {formatCurrency(annualProjection, preferences.currency)}
          </div>
          <p className="text-xs text-[#68716B] leading-relaxed">
            Al ritmo actual, estos pequeños consumos representarán este monto al cabo de un año.
          </p>
        </div>

        {/* Potential Release / Savings Opportunity */}
        <div className="bg-white p-5 rounded-2xl border border-[#176B45]/30 bg-gradient-to-br from-white to-[#EBF4EF]/40 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B45]">
            <Sparkles className="w-4 h-4 text-[#176B45]" />
            <span>Oportunidad de ahorro</span>
          </div>
          <div className="text-2xl font-extrabold text-[#176B45] num-tabular">
            {formatCurrency(halfSavings, preferences.currency)} / mes
          </div>
          <p className="text-xs text-[#202522]/80 leading-relaxed">
            Si reduces tus gastos hormiga a la mitad, liberarías{' '}
            <strong className="text-[#176B45] font-bold">
              {formatCurrency(halfSavingsAnnual, preferences.currency)} al año
            </strong>{' '}
            directo para tus metas reales.
          </p>
        </div>
      </div>

      {/* Ranked List of Main Types of Gastos Hormiga */}
      <RankedHormigaTypes types={rankedTypes} currencyCode={preferences.currency} />

      {/* Individual Gastos Hormiga Log */}
      <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E8ECE6] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#202522]">
              Detalle de microgastos registrados
            </h2>
            <p className="text-xs text-[#68716B]">
              Cada gasto menor detectado este mes
            </p>
          </div>
        </div>

        {hormigaExpenses.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Flame className="w-5 h-5 text-[#F4A340]" />}
              title="¡Excelente! Aún no tienes gastos hormiga anotados"
              description="Cuando compres un café, un snack o pidas un delivery, márcalo como gasto hormiga para ver su impacto aquí."
              actionLabel="Registrar primer microgasto"
              onAction={openRegisterModal}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E8ECE6]">
            {hormigaExpenses.map((exp) => (
              <ExpenseItemRow
                key={exp.id}
                expense={exp}
                isEditing={editingExpenseId === exp.id}
                editingName={editingName}
                onStartEdit={() => startEditing(exp.id, exp.description)}
                onNameChange={setEditingName}
                onSaveEdit={() => saveEditing(exp.id)}
                onKeyDown={(e) => handleKeyDown(e, exp.id)}
                onDelete={() => deleteExpense(exp.id)}
                currencyCode={preferences.currency}
                focusColor="amber"
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumb-friendly lower action zone */}
      <div className="pt-1">
        <button
          type="button"
          onClick={openRegisterModal}
          className="w-full min-h-[50px] py-3.5 bg-[#F4A340] hover:bg-[#E08F2D] text-[#202522] text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar nuevo gasto hormiga</span>
        </button>
      </div>
    </div>
  );
};
