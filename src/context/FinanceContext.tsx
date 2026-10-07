import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CategoryBudget,
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
  addCategoryBudget: (category: Omit<CategoryBudget, 'id'>) => void;

  togglePaymentPaid: (id: string) => void;
  addPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
  deletePayment: (id: string) => void;

  resetToInitialData: () => void;
  importUserData: (dataJson: string) => boolean;

  // Calculated metrics
  totalIncome: number;
  savingsSeparated: number;
  savingsMonthlyTarget: number;
  totalSpent: number;
  availableRemaining: number;
  totalBudget: number;
  budgetUsedPercent: number;

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
    setMonthData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
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
      budgets: prev.budgets.map((b) => (b.id === id ? { ...b, plannedAmount } : b)),
    }));
  };

  const addCategoryBudget = (category: Omit<CategoryBudget, 'id'>) => {
    const newCat: CategoryBudget = {
      ...category,
      id: `cat_${Date.now()}`,
    };
    setMonthData((prev) => ({
      ...prev,
      budgets: [...prev.budgets, newCat],
    }));
  };

  // Recurring Payments mutations
  const togglePaymentPaid = (id: string) => {
    setMonthData((prev) => {
      const targetPayment = prev.payments.find((p) => p.id === id);
      if (!targetPayment) return prev;

      const newIsPaid = !targetPayment.isPaid;
      const todayStr = new Date().toISOString().split('T')[0];
      let updatedExpenses = [...prev.expenses];

      if (newIsPaid) {
        const existingExp = updatedExpenses.find((e) => e.description.includes(targetPayment.name));
        if (!existingExp) {
          updatedExpenses = [
            {
              id: `exp_pay_${targetPayment.id}`,
              amount: targetPayment.amount,
              category: targetPayment.category,
              description: `Pago: ${targetPayment.name}`,
              isHormiga: false,
              date: todayStr,
              createdAt: new Date().toISOString(),
            },
            ...updatedExpenses,
          ];
        }
      } else {
        updatedExpenses = updatedExpenses.filter((e) => e.id !== `exp_pay_${targetPayment.id}`);
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
    }));
  };

  // Calculated Financial Metrics (Pure computation delegating to utility functions)
  const totalIncome = useMemo(() => calculateTotalIncome(monthData.incomes), [monthData.incomes]);
  const savingsSeparated = monthData.savings?.separatedAmount || 0;
  const savingsMonthlyTarget = monthData.savings?.monthlyTarget || 0;
  const totalSpent = useMemo(() => calculateTotalSpent(monthData.expenses), [monthData.expenses]);

  const availableRemaining = useMemo(
    () => calculateAvailableRemaining(totalIncome, savingsSeparated, totalSpent),
    [totalIncome, savingsSeparated, totalSpent]
  );

  const totalBudget = useMemo(() => calculateTotalBudget(monthData.budgets), [monthData.budgets]);
  const budgetUsedPercent = useMemo(
    () => calculateBudgetUsedPercent(totalSpent, totalBudget),
    [totalSpent, totalBudget]
  );

  const gastosHormigaSpent = useMemo(
    () => calculateGastosHormigaSpent(monthData.expenses),
    [monthData.expenses]
  );

  const gastosHormigaBudget = useMemo(
    () => calculateGastosHormigaBudget(monthData.budgets),
    [monthData.budgets]
  );

  const gastosHormigaPercent = useMemo(
    () => calculateGastosHormigaPercent(gastosHormigaSpent, gastosHormigaBudget),
    [gastosHormigaSpent, gastosHormigaBudget]
  );

  const gastosHormigaByType = useMemo(
    () => calculateGastosHormigaByType(monthData.expenses),
    [monthData.expenses]
  );

  const paymentsMetrics = useMemo(
    () => calculatePaymentsMetrics(monthData.payments),
    [monthData.payments]
  );

  const { status: budgetStatus, text: budgetStatusText } = useMemo(
    () => determineBudgetStatus(availableRemaining, totalBudget, totalSpent, budgetUsedPercent),
    [availableRemaining, totalBudget, totalSpent, budgetUsedPercent]
  );

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
        addCategoryBudget,
        togglePaymentPaid,
        addPayment,
        deletePayment,
        resetToInitialData,
        importUserData,
        totalIncome,
        savingsSeparated,
        savingsMonthlyTarget,
        totalSpent,
        availableRemaining,
        totalBudget,
        budgetUsedPercent,
        gastosHormigaSpent,
        gastosHormigaBudget,
        gastosHormigaPercent,
        gastosHormigaByType,
        completedPaymentsCount: paymentsMetrics.completedCount,
        pendingPaymentsCount: paymentsMetrics.pendingCount,
        pendingPaymentsAmount: paymentsMetrics.pendingAmount,
        budgetStatus,
        budgetStatusText,
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
