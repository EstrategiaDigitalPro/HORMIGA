import React, { useState } from 'react';
import { ShieldCheck, Target, Sparkles, Lock, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { SeparateSavingsModal } from '../components/savings/SeparateSavingsModal';
import { useDisclosure } from '../hooks/useDisclosure';

export const AhorroScreen: React.FC = () => {
  const {
    monthData,
    preferences,
    updateSavingsGoal,
    separateSavingsAmount,
  } = useFinance();

  const [monthlyTarget, setMonthlyTarget] = useState(
    monthData.savings.monthlyTarget || 400000
  );
  const [separatedAmount, setSeparatedAmount] = useState(
    monthData.savings.separatedAmount || 0
  );
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalInput, setTempGoalInput] = useState(String(monthlyTarget));
  const separateModal = useDisclosure(false);
  const [showToast, setShowToast] = useState(false);

  const annualTarget = monthlyTarget * 12;
  const progressPercent =
    monthlyTarget > 0 ? Math.min(100, Math.round((separatedAmount / monthlyTarget) * 100)) : 0;

  const handleSaveGoal = () => {
    const val = parseFloat(tempGoalInput) || 0;
    setMonthlyTarget(val);
    updateSavingsGoal({ monthlyTarget: val, annualDerivedTarget: val * 12 });
    setIsEditingGoal(false);
  };

  const handleConfirmSeparation = (amountToSet: number) => {
    setSeparatedAmount(amountToSet);
    separateSavingsAmount(amountToSet);
    separateModal.close();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData.monthLabel} />

      {/* Screen Title (Exact match with button) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Ahorro
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          Define tu meta mensual y separa tu dinero intencionalmente para protegerlo
        </p>
      </div>

      {/* Top Banner: Monthly Savings Goal */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F4A340] uppercase tracking-wider">
            <Target className="w-4 h-4 text-[#F4A340]" />
            <span>Objetivo mensual de ahorro</span>
          </div>
          <button
            onClick={() => {
              setTempGoalInput(String(monthlyTarget));
              setIsEditingGoal(!isEditingGoal);
            }}
            className="text-xs text-[#176B45] hover:underline font-semibold cursor-pointer"
          >
            {isEditingGoal ? 'Cancelar' : 'Modificar meta'}
          </button>
        </div>

        {isEditingGoal ? (
          <div className="flex items-center gap-2 max-w-sm pt-1">
            <div className="flex items-center gap-1.5 bg-[#F7F8F6] px-3 py-2 rounded-xl border border-[#E8ECE6] flex-1">
              <span className="text-sm font-bold text-[#68716B]">
                {preferences.currencySymbol}
              </span>
              <input
                type="number"
                value={tempGoalInput}
                onChange={(e) => setTempGoalInput(e.target.value)}
                className="w-full text-lg font-bold text-[#202522] bg-transparent focus:outline-hidden num-tabular"
              />
            </div>
            <button
              onClick={handleSaveGoal}
              className="px-4 py-2.5 bg-[#176B45] text-white text-xs font-semibold rounded-xl cursor-pointer"
            >
              Guardar
            </button>
          </div>
        ) : (
          <div className="text-3xl sm:text-4xl font-extrabold text-[#202522] num-tabular tracking-tight">
            {formatCurrency(monthlyTarget, preferences.currency)}
            <span className="text-xs sm:text-sm font-medium text-[#68716B] ml-2 font-sans">
              / mes
            </span>
          </div>
        )}

        {/* Derived Annual Goal */}
        <div className="p-3 bg-[#FEF7EE] rounded-xl border border-[#F4A340]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4A340]" />
            <span className="text-[#202522] font-medium">Meta anual proyectada:</span>
          </div>
          <span className="font-extrabold text-[#C97E25] num-tabular">
            {formatCurrency(annualTarget, preferences.currency)} al año
          </span>
        </div>
      </div>

      {/* Amount Already Separated & Visual Progress */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FEF7EE] text-[#F4A340] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202522]">Ahorro ya separado</h3>
              <p className="text-xs text-[#68716B]">Dinero protegido de tus gastos</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#176B45] num-tabular">
              {formatCurrency(separatedAmount, preferences.currency)}
            </div>
            <span className="text-xs font-semibold text-[#68716B]">
              {progressPercent}% de la meta
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#F7F8F6] rounded-full h-3 overflow-hidden p-0.5 border border-[#E8ECE6]">
            <div
              className="h-full rounded-full bg-[#176B45] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#68716B]">
            <span>$0</span>
            <span>Faltan {formatCurrency(Math.max(0, monthlyTarget - separatedAmount), preferences.currency)}</span>
            <span>Meta: {formatCurrency(monthlyTarget, preferences.currency)}</span>
          </div>
        </div>

        {/* Clear Educational Concept Card */}
        <div className="p-4 rounded-xl bg-[#EBF4EF] border border-[#176B45]/20 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
          <div className="text-xs text-[#202522] leading-relaxed space-y-1">
            <p className="font-bold text-[#176B45]">
              El ahorro es dinero intencionalmente separado, no dinero disponible para gastar.
            </p>
            <p className="text-[#68716B]">
              Al marcar tu ahorro como separado en HORMIGA, se descuenta de tu saldo disponible mensual para que no caigas en la ilusión de tener más dinero para gastos cotidianos.
            </p>
          </div>
        </div>

        {/* Primary Action: Marcar ahorro como separado */}
        <div className="pt-2">
          <button
            onClick={separateModal.open}
            className="w-full py-3.5 bg-[#176B45] hover:bg-[#125537] text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Marcar ahorro como separado</span>
          </button>
        </div>
      </div>

      {/* Quick Adjustment Modal */}
      <SeparateSavingsModal
        isOpen={separateModal.isOpen}
        onClose={separateModal.close}
        monthlyTarget={monthlyTarget}
        currentSeparated={separatedAmount}
        currencyCode={preferences.currency}
        currencySymbol={preferences.currencySymbol}
        onConfirm={handleConfirmSeparation}
      />

      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#176B45] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Ahorro actualizado y descontado del saldo disponible</span>
        </div>
      )}
    </div>
  );
};
