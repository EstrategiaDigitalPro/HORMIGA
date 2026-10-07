import React, { useState, useEffect } from 'react';
import { ShieldCheck, Target, Sparkles, Lock, Check, FileText } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { ScreenHeader } from '../components/common/ScreenHeader';

export const AhorroScreen: React.FC = () => {
  const {
    monthData,
    preferences,
    updateSavingsGoal,
    separateSavingsAmount,
  } = useFinance();

  const safeSavings = monthData?.savings || {
    monthlyTarget: 0,
    separatedAmount: 0,
    annualDerivedTarget: 0,
    notes: '',
  };

  const currencyCode = preferences?.currency || 'CLP';
  const currencySymbol = preferences?.currencySymbol || '$';
  const firstName = preferences?.name?.trim().split(' ')[0] || preferences?.name?.trim() || '';

  // Local string states for inputs to allow freely clearing, typing, and backspacing 0
  const [goalStr, setGoalStr] = useState<string>(
    safeSavings.monthlyTarget === 0 ? '' : String(safeSavings.monthlyTarget)
  );
  const [separatedStr, setSeparatedStr] = useState<string>(
    safeSavings.separatedAmount === 0 ? '' : String(safeSavings.separatedAmount)
  );
  const [notesStr, setNotesStr] = useState<string>(safeSavings.notes || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync if month changes
  useEffect(() => {
    if (monthData?.savings) {
      setGoalStr(monthData.savings.monthlyTarget === 0 ? '' : String(monthData.savings.monthlyTarget));
      setSeparatedStr(monthData.savings.separatedAmount === 0 ? '' : String(monthData.savings.separatedAmount));
      setNotesStr(monthData.savings.notes || '');
    }
  }, [monthData?.monthKey]);

  const numMonthlyTarget = Math.max(0, parseFloat(goalStr) || 0);
  const numSeparated = Math.max(0, parseFloat(separatedStr) || 0);
  const annualTarget = numMonthlyTarget * 12;
  const progressPercent =
    numMonthlyTarget > 0 ? Math.min(100, Math.round((numSeparated / numMonthlyTarget) * 100)) : 0;
  const missingAmount = Math.max(0, numMonthlyTarget - numSeparated);

  const triggerToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2200);
  };

  const handleGoalChange = (val: string) => {
    setGoalStr(val);
    const parsed = Math.max(0, parseFloat(val) || 0);
    updateSavingsGoal({
      monthlyTarget: parsed,
      annualDerivedTarget: parsed * 12,
    });
  };

  const handleSeparatedChange = (val: string) => {
    setSeparatedStr(val);
    const parsed = Math.max(0, parseFloat(val) || 0);
    separateSavingsAmount(parsed);
  };

  const handleNotesChange = (val: string) => {
    setNotesStr(val);
    updateSavingsGoal({ notes: val });
  };

  const handleQuickSetSeparated = (amount: number) => {
    const safeAmount = Math.max(0, amount);
    setSeparatedStr(safeAmount === 0 ? '' : String(safeAmount));
    separateSavingsAmount(safeAmount);
    triggerToast();
  };

  const handleManualSave = () => {
    updateSavingsGoal({
      monthlyTarget: numMonthlyTarget,
      annualDerivedTarget: annualTarget,
      notes: notesStr,
    });
    separateSavingsAmount(numSeparated);
    triggerToast();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData?.monthLabel || 'Octubre 2026'} />

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Ahorro
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          {firstName
            ? `${firstName}, define tu meta mensual y separa tu dinero intencionalmente para protegerlo.`
            : 'Define tu meta mensual y separa tu dinero intencionalmente para protegerlo.'}
        </p>
      </div>

      {/* 1. OBJETIVO MENSUAL DE AHORRO (Directly Editable) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F4A340] uppercase tracking-wider">
            <Target className="w-4 h-4 text-[#F4A340]" />
            <span>Objetivo mensual de ahorro</span>
          </div>
          <span className="text-xs text-[#68716B]">Escribe tu meta</span>
        </div>

        {/* Big direct input */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 pb-1 border-b-2 border-[#E8ECE6] focus-within:border-[#176B45] transition-colors">
            <span className="text-2xl sm:text-3xl font-bold text-[#176B45]">
              {currencySymbol}
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="0"
              value={goalStr}
              onChange={(e) => handleGoalChange(e.target.value)}
              onFocus={(e) => {
                if (e.target.value === '0') setGoalStr('');
                else e.target.select();
              }}
              className="w-full text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#202522] bg-transparent focus:outline-hidden num-tabular"
              aria-label="Objetivo mensual de ahorro"
            />
            <span className="text-sm font-semibold text-[#68716B] shrink-0 font-sans">
              / mes
            </span>
          </div>
          <p className="text-[11px] text-[#68716B] pt-0.5">
            Puedes cambiar esta cifra cuando quieras; se guarda de forma inmediata.
          </p>
        </div>

        {/* Derived Annual Goal */}
        <div className="p-3.5 bg-[#FEF7EE] rounded-xl border border-[#F4A340]/30 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F4A340] shrink-0" />
            <span className="text-[#202522] font-semibold">Meta anual proyectada:</span>
          </div>
          <span className="font-extrabold text-[#C97E25] num-tabular text-sm sm:text-base">
            {formatCurrency(annualTarget, currencyCode)} al año
          </span>
        </div>
      </div>

      {/* 2. AHORRO YA SEPARADO (Directly Editable) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEF7EE] text-[#F4A340] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#202522]">Ahorro ya separado</h3>
              <p className="text-xs text-[#68716B]">Dinero resguardado fuera de tus gastos del mes</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-[#176B45] bg-[#EBF4EF] px-2.5 py-1 rounded-lg inline-block">
              {progressPercent}% de la meta alcanzado
            </span>
          </div>
        </div>

        {/* Big direct input for separated savings */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#68716B]">Monto efectivamente separado este mes:</label>
          <div className="flex items-center gap-2 pb-1 border-b-2 border-[#E8ECE6] focus-within:border-[#176B45] transition-colors">
            <span className="text-2xl sm:text-3xl font-bold text-[#176B45]">
              {currencySymbol}
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="0"
              value={separatedStr}
              onChange={(e) => handleSeparatedChange(e.target.value)}
              onFocus={(e) => {
                if (e.target.value === '0') setSeparatedStr('');
                else e.target.select();
              }}
              className="w-full text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#176B45] bg-transparent focus:outline-hidden num-tabular"
              aria-label="Monto de ahorro ya separado"
            />
          </div>
        </div>

        {/* Shortcut Quick Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickSetSeparated(numMonthlyTarget)}
            className="px-3 py-2 text-xs font-semibold bg-[#F7F8F6] text-[#202522] rounded-xl border border-[#E8ECE6] hover:bg-[#EBF4EF] hover:text-[#176B45] transition-all cursor-pointer"
          >
            Meta completa ({formatCurrency(numMonthlyTarget, currencyCode)})
          </button>
          <button
            type="button"
            onClick={() => handleQuickSetSeparated(Math.round(numMonthlyTarget / 2))}
            className="px-3 py-2 text-xs font-semibold bg-[#F7F8F6] text-[#202522] rounded-xl border border-[#E8ECE6] hover:bg-[#EBF4EF] hover:text-[#176B45] transition-all cursor-pointer"
          >
            50% de la meta ({formatCurrency(Math.round(numMonthlyTarget / 2), currencyCode)})
          </button>
          <button
            type="button"
            onClick={() => handleQuickSetSeparated(0)}
            className="px-3 py-2 text-xs font-medium text-[#68716B] hover:text-red-600 rounded-xl hover:bg-red-50 transition-all cursor-pointer ml-auto"
          >
            Poner en $0
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full bg-[#F7F8F6] rounded-full h-3.5 overflow-hidden p-0.5 border border-[#E8ECE6]">
            <div
              className="h-full rounded-full bg-[#176B45] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#68716B] num-tabular">
            <span>$0</span>
            <span>
              {numSeparated >= numMonthlyTarget && numMonthlyTarget > 0
                ? '¡Meta mensual cumplida!'
                : `Faltan ${formatCurrency(missingAmount, currencyCode)}`}
            </span>
            <span>Meta: {formatCurrency(numMonthlyTarget, currencyCode)}</span>
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
      </div>

      {/* 3. PROPÓSITO O NOTAS DEL AHORRO (Directly Editable) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#202522]">
          <FileText className="w-4 h-4 text-[#176B45]" />
          <span>Propósito o notas del ahorro (opcional)</span>
        </div>
        <input
          type="text"
          placeholder="Ej: Fondo de emergencia, vacaciones, pie hipotecario, estudios..."
          value={notesStr}
          onChange={(e) => handleNotesChange(e.target.value)}
          className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#F7F8F6] border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
        />
      </div>

      {/* 4. Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleManualSave}
          className="w-full py-3.5 bg-[#176B45] hover:bg-[#125537] text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>Guardar cambios en mi ahorro</span>
        </button>
      </div>

      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#176B45] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Ahorro actualizado y descontado del saldo disponible</span>
        </div>
      )}
    </div>
  );
};
