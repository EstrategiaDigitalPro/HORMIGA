import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CategoryBudget,
  CategoryFinancialMetrics,
  ExpenseTransaction,
  HormigaType,
  IncomeSource,
  MonthData,
  RecurringPayment,
  SavingsGoal,
  Screen,
  UserPreferences,
} from '../types/finance';
import { useFinanceStorage } from '../hooks/useFinanceStorage';
import {
  calculateCentralFinances,
  calculateTotalIncome,
  calculateTotalSpent,
  calculateAvailableRemaining,
  calculateTotalBudget,
  calculateBudgetUsedPercent,
  calculateGastosHormigaSpent,
  calculateGastosHormigaBudget,
  calculateGastosHormigaPercent,
  calculateGastosHormigaByType,
  calculatePaymentsMetrics,
  determineBudgetStatus,
} from '../utils/financeCalculations';

interface FinanceContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentMonthKey: string;
  setCurrentMonthKey: (key: string) => void;
  isRegisterModalOpen: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;

  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;

  monthData: MonthData;
  pastMonths: MonthData[];

  // Action methods
  addExpense: (expense: Omit<ExpenseTransaction, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  updateExpense: (id: string, updates: Partial<ExpenseTransaction>) => void;

  addIncome: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncome: (id: string, updates: Partial<IncomeSource>) => void;
  deleteIncome: (id: string) => void;

  updateSavingsGoal: (goal: Partial<SavingsGoal>) => void;
  separateSavingsAmount: (amount: number) => void;

  updateCategoryBudget: (id: string, plannedAmount: number) => void;
  updateAllBudgets: (budgets: CategoryBudget[]) => void;
  addCategoryBudget: (category: Omit<CategoryBudget, 'id'>) => void;

  togglePaymentPaid: (id: string) => void;
  addPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
  deletePayment: (id: string) => void;

  resetToInitialData: () => void;
  importUserData: (dataJson: string) => boolean;

  // Single central source of truth metrics
  totalIncome: number;
  savingsSeparated: number;
  savingsMonthlyTarget: number;
  totalSpent: number;
  availableRemaining: number;
  totalBudget: number;
  budgetUsedPercent: number;

  categoriesMetrics: CategoryFinancialMetrics[];
  categoryMetricsMap: Record<string, CategoryFinancialMetrics>;

  gastosHormigaSpent: number;
  gastosHormigaBudget: number;
  gastosHormigaPercent: number;
  gastosHormigaByType: Record<HormigaType, { count: number; amount: number }>;

  completedPaymentsCount: number;
  pendingPaymentsCount: number;
  pendingPaymentsAmount: number;

  budgetStatus: 'good' | 'warning' | 'over';
  budgetStatusText: string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('mi_mes');
  const [currentMonthKey, setCurrentMonthKey] = useState<string>('2026-10');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // Storage and persistent state managed via dedicated hook
  const {
    preferences,
    setPreferences,
    monthData,
    setMonthData,
    pastMonths,
    resetToInitialData,
    importUserData,
  } = useFinanceStorage();

  // Modal actions
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  // Preference updates
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  // Expense mutations
  const addExpense = (newExpense: Omit<ExpenseTransaction, 'id' | 'createdAt'>) => {
    const expense: ExpenseTransaction = {
      ...newExpense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setMonthData((prev) => ({
      ...prev,
      expenses: [expense, ...prev.expenses],
    }));
  };

  const deleteExpense = (id: string) => {
    setMonthData((prev) => {
      const expToDelete = prev.expenses.find((e) => e.id === id);
      const linkedPaymentId =
        expToDelete?.paymentId || (id.startsWith('exp_pay_') ? id.replace('exp_pay_', '') : null);

      return {
        ...prev,
        expenses: prev.expenses.filter((e) => e.id !== id),
        // Si el gasto estaba vinculado a un pago pendiente, desmarcar el pago de manera coherente
        payments: linkedPaymentId
          ? prev.payments.map((p) =>
              p.id === linkedPaymentId ? { ...p, isPaid: false, paidDate: undefined } : p
            )
          : prev.payments,
      };
    });
  };

  const updateExpense = (id: string, updates: Partial<ExpenseTransaction>) => {
    setMonthData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  // Income mutations
  const addIncome = (newIncome: Omit<IncomeSource, 'id'>) => {
    const income: IncomeSource = {
      ...newIncome,
      id: `inc_${Date.now()}`,
    };
    setMonthData((prev) => ({
      ...prev,
      incomes: [...prev.incomes, income],
    }));
  };

  const updateIncome = (id: string, updates: Partial<IncomeSource>) => {
    setMonthData((prev) => ({
      ...prev,
      incomes: prev.incomes.map((inc) => (inc.id === id ? { ...inc, ...updates } : inc)),
    }));
  };

  const deleteIncome = (id: string) => {
    setMonthData((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((inc) => inc.id !== id),
    }));
  };

  // Savings mutations
  const updateSavingsGoal = (updates: Partial<SavingsGoal>) => {
    setMonthData((prev) => {
      const updated = { ...prev.savings, ...updates };
      if (updates.monthlyTarget !== undefined && !updates.annualDerivedTarget) {
        updated.annualDerivedTarget = updates.monthlyTarget * 12;
      }
      return {
        ...prev,
        savings: updated,
      };
    });
  };

  const separateSavingsAmount = (amount: number) => {
    setMonthData((prev) => ({
      ...prev,
      savings: {
        ...prev.savings,
        separatedAmount: Math.max(0, amount),
      },
    }));
  };

  // Budget mutations
  const updateCategoryBudget = (id: string, plannedAmount: number) => {
    setMonthData((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) =>
        b.id === id ? { ...b, plannedAmount: Math.max(0, plannedAmount) } : b
      ),
    }));
  };

  const updateAllBudgets = (budgets: CategoryBudget[]) => {
    setMonthData((prev) => ({
      ...prev,
      budgets: budgets.map((b) => ({
        ...b,
        plannedAmount: Math.max(0, Number(b.plannedAmount) || 0),
      })),
    }));
  };

  const addCategoryBudget = (category: Omit<CategoryBudget, 'id'>) => {
    const newCat: CategoryBudget = {
      ...category,
      id: `cat_${Date.now()}`,
      plannedAmount: Math.max(0, Number(category.plannedAmount) || 0),
    };
    setMonthData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, newCat],
    }));
  };

  // Recurring Payments mutations
  // Regla 4:
  // Cuando un pago pendiente se marca como "Pagado":
  // - cambia su estado a pagado;
  // - genera o activa UN ÚNICO movimiento financiero;
  // - ese movimiento debe reflejarse automáticamente en Mi Mes, Presupuesto y Análisis;
  // - nunca debe duplicarse;
  // - si ya existe un movimiento asociado a ese pago, NO crear otro.
  const togglePaymentPaid = (id: string) => {
    setMonthData((prev) => {
      const targetPayment = prev.payments.find((p) => p.id === id);
      if (!targetPayment) return prev;

      const newIsPaid = !targetPayment.isPaid;
      const todayStr = new Date().toISOString().split('T')[0];
      let updatedExpenses = [...prev.expenses];

      if (newIsPaid) {
        // Verificar si ya existe un movimiento asociado a este pago
        const existingExp = updatedExpenses.find(
          (e) =>
            e.paymentId === targetPayment.id ||
            e.id === `exp_pay_${targetPayment.id}` ||
            e.description?.toLowerCase().trim() === `pago: ${targetPayment.name}`.toLowerCase().trim() ||
            (e.description?.toLowerCase().trim() === targetPayment.name.toLowerCase().trim() &&
              Math.abs((Number(e.amount) || 0) - (Number(targetPayment.amount) || 0)) < 0.01)
        );

        if (!existingExp) {
          // Generar UN ÚNICO movimiento financiero
          updatedExpenses = [
            {
              id: `exp_pay_${targetPayment.id}`,
              paymentId: targetPayment.id,
              amount: Number(targetPayment.amount) || 0,
              category: targetPayment.category,
              description: `Pago: ${targetPayment.name}`,
              isHormiga: false,
              date: todayStr,
              createdAt: new Date().toISOString(),
            },
            ...updatedExpenses,
          ];
        } else {
          // Si ya existía, asegurarse de que quede vinculado con paymentId y no crear otro
          updatedExpenses = updatedExpenses.map((e) =>
            e.id === existingExp.id
              ? {
                  ...e,
                  paymentId: targetPayment.id,
                  amount: Number(targetPayment.amount) || 0,
                  category: targetPayment.category,
                }
              : e
          );
        }
      } else {
        // Al desmarcar como pendiente, revertir el movimiento asociado para que no se cuente como gasto real
        updatedExpenses = updatedExpenses.filter(
          (e) =>
            e.paymentId !== targetPayment.id &&
            e.id !== `exp_pay_${targetPayment.id}` &&
            e.description !== `Pago: ${targetPayment.name}`
        );
      }

      return {
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === id
            ? {
                ...p,
                isPaid: newIsPaid,
                paidDate: newIsPaid ? todayStr : undefined,
              }
            : p
        ),
        expenses: updatedExpenses,
      };
    });
  };

  const addPayment = (payment: Omit<RecurringPayment, 'id'>) => {
    const newPay: RecurringPayment = {
      ...payment,
      id: `pay_${Date.now()}`,
    };
    setMonthData((prev) => ({
      ...prev,
      payments: [...prev.payments, newPay],
    }));
  };

  const deletePayment = (id: string) => {
    setMonthData((prev) => ({
      ...prev,
      payments: prev.payments.filter((p) => p.id !== id),
      expenses: prev.expenses.filter(
        (e) => e.paymentId !== id && e.id !== `exp_pay_${id}` && e.description !== `Pago: ${prev.payments.find(p => p.id === id)?.name}`
      ),
    }));
  };

  // Única fuente de verdad central para todos los cálculos financieros
  const centralFinances = useMemo(() => calculateCentralFinances(monthData), [monthData]);

  return (
    <FinanceContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentMonthKey,
        setCurrentMonthKey,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal,
        preferences,
        updatePreferences,
        monthData,
        pastMonths,
        addExpense,
        deleteExpense,
        updateExpense,
        addIncome,
        updateIncome,
        deleteIncome,
        updateSavingsGoal,
        separateSavingsAmount,
        updateCategoryBudget,
        updateAllBudgets,
        addCategoryBudget,
        togglePaymentPaid,
        addPayment,
        deletePayment,
        resetToInitialData,
        importUserData,

        // Métricas calculadas centralizadas
        totalIncome: centralFinances.totalIncome,
        savingsSeparated: centralFinances.savingsSeparated,
        savingsMonthlyTarget: centralFinances.savingsMonthlyTarget,
        totalSpent: centralFinances.totalSpent,
        availableRemaining: centralFinances.availableRemaining,
        totalBudget: centralFinances.totalBudget,
        budgetUsedPercent: centralFinances.budgetUsedPercent,

        categoriesMetrics: centralFinances.categoriesMetrics,
        categoryMetricsMap: centralFinances.categoryMetricsMap,

        gastosHormigaSpent: centralFinances.gastosHormigaSpent,
        gastosHormigaBudget: centralFinances.gastosHormigaBudget,
        gastosHormigaPercent: centralFinances.gastosHormigaPercent,
        gastosHormigaByType: centralFinances.gastosHormigaByType,

        completedPaymentsCount: centralFinances.completedPaymentsCount,
        pendingPaymentsCount: centralFinances.pendingPaymentsCount,
        pendingPaymentsAmount: centralFinances.pendingPaymentsAmount,

        budgetStatus: centralFinances.budgetStatus,
        budgetStatusText: centralFinances.budgetStatusText,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

// Re-export pure helpers for backwards compatibility
export {
  calculateTotalIncome,
  calculateTotalSpent,
  calculateAvailableRemaining,
  calculateTotalBudget,
  calculateBudgetUsedPercent,
  calculateGastosHormigaSpent,
  calculateGastosHormigaBudget,
  calculateGastosHormigaPercent,
  calculateGastosHormigaByType,
  calculatePaymentsMetrics,
  determineBudgetStatus,
};
