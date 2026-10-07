import React, { useState } from 'react';
import { Wallet, Plus, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { IncomeSource } from '../types/finance';
import { formatCurrency } from '../utils/currency';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AddIncomeForm } from '../components/incomes/AddIncomeForm';
import { IncomeItemRow } from '../components/incomes/IncomeItemRow';
import { EmptyState } from '../components/common/EmptyState';

export const IngresosScreen: React.FC = () => {
  const {
    monthData,
    setCurrentScreen,
    preferences,
    addIncome,
    updateIncome,
    deleteIncome,
  } = useFinance();

  const [incomesList, setIncomesList] = useState<IncomeSource[]>(monthData.incomes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setIncomesList(monthData.incomes);
  }, [monthData.incomes]);

  const handleAmountChange = (id: string, value: string) => {
    const numeric = parseFloat(value) || 0;
    setIncomesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: numeric } : item))
    );
  };

  const handleNameChange = (id: string, value: string) => {
    setIncomesList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const handleAddSubmit = (newIncome: Omit<IncomeSource, 'id'>) => {
    addIncome(newIncome);
    setShowAddForm(false);
  };

  const handleSaveAll = () => {
    incomesList.forEach((inc) => {
      updateIncome(inc.id, { name: inc.name, amount: inc.amount });
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setCurrentScreen('mi_mes');
    }, 900);
  };

  const calculatedTotal = incomesList.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const firstName = preferences.name?.trim().split(' ')[0] || preferences.name?.trim() || '';

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData.monthLabel} />

      {/* Screen Title (Exact match with button) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Ingresos
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          {firstName
            ? `${firstName}, registra y organiza de dónde proviene tu dinero este mes.`
            : 'Registra y organiza de dónde proviene tu dinero este mes.'}
        </p>
      </div>

      {/* Top Banner: Total Monthly Income */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B45] uppercase tracking-wider">
            <Wallet className="w-4 h-4" />
            <span>Ingreso total del mes</span>
          </div>
          <span className="text-xs text-[#68716B]">
            {incomesList.length} {incomesList.length === 1 ? 'entrada' : 'entradas'}
          </span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-[#202522] num-tabular tracking-tight">
          {formatCurrency(calculatedTotal, preferences.currency)}
        </div>
        <p className="text-xs text-[#68716B]">
          Este monto define el total disponible para distribuir entre tu ahorro intencional y tus gastos del mes.
        </p>
      </div>

      {/* Income Entries List */}
      <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E8ECE6] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#202522]">Fuentes de ingreso</h2>
            <p className="text-xs text-[#68716B]">
              Define de dónde proviene tu dinero este mes
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold text-[#176B45] bg-[#EBF4EF] hover:bg-[#176B45]/15 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Agregar ingreso</span>
            </button>
          )}
        </div>

        {/* Inline Add Form */}
        {showAddForm && (
          <AddIncomeForm
            onAdd={handleAddSubmit}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Existing List or Empty State */}
        {incomesList.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Wallet className="w-5 h-5 text-[#176B45]" />}
              title="Aún no tienes ingresos registrados"
              description="Agrega tu sueldo, trabajo independiente u otras entradas de dinero para calcular tu disponible mensual."
              actionLabel="Agregar primer ingreso"
              onAction={() => setShowAddForm(true)}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E8ECE6]">
            {incomesList.map((item) => (
              <IncomeItemRow
                key={item.id}
                income={item}
                currencySymbol={preferences.currencySymbol}
                onNameChange={handleNameChange}
                onAmountChange={handleAmountChange}
                onDelete={(id) => {
                  deleteIncome(id);
                  setIncomesList((prev) => prev.filter((i) => i.id !== id));
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumb-friendly action area in the bottom half of the screen */}
      <div className="space-y-3 pt-1">
        {!showAddForm && incomesList.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full min-h-[48px] py-3 bg-white hover:bg-[#F7F8F6] text-[#176B45] border-2 border-dashed border-[#176B45]/40 hover:border-[#176B45] text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Agregar otro ingreso</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={savedSuccess}
          className="w-full min-h-[50px] py-3.5 bg-[#176B45] hover:bg-[#125537] text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Ingresos guardados correctamente</span>
            </>
          ) : (
            <span>Guardar ingresos</span>
          )}
        </button>
      </div>
    </div>
  );
};
