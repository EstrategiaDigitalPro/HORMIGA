import {
  CategoryBudget,
  ExpenseTransaction,
  HormigaType,
  IncomeSource,
  RecurringPayment,
} from '../types/finance';

/**
 * Calculates sum of monthly incomes.
 */
export function calculateTotalIncome(incomes: IncomeSource[]): number {
  return incomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
}

/**
 * Calculates sum of monthly expenses.
 */
export function calculateTotalSpent(expenses: ExpenseTransaction[]): number {
  return expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
}

/**
 * Calculates available remaining spending money.
 * Formula: Income - Intentional Separated Savings - Expenses
 */
export function calculateAvailableRemaining(
  totalIncome: number,
  savingsSeparated: number,
  totalSpent: number
): number {
  return totalIncome - savingsSeparated - totalSpent;
}

/**
 * Calculates total planned budget across all categories.
 */
export function calculateTotalBudget(budgets: CategoryBudget[]): number {
  return budgets.reduce((acc, curr) => acc + (curr.plannedAmount || 0), 0);
}

/**
 * Calculates percentage of budget used.
 */
export function calculateBudgetUsedPercent(totalSpent: number, totalBudget: number): number {
  return totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
}

/**
 * Calculates total spent on micro-expenses (gastos hormiga).
 */
export function calculateGastosHormigaSpent(expenses: ExpenseTransaction[]): number {
  return expenses
    .filter((e) => e.isHormiga)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
}

/**
 * Finds or derives the budget limit for gastos hormiga.
 */
export function calculateGastosHormigaBudget(budgets: CategoryBudget[]): number {
  const hormigaCat = budgets.find(
    (b) => b.isHormigaCategory || b.id === 'gastos_hormiga' || b.name.toLowerCase().includes('hormiga')
  );
  return hormigaCat ? hormigaCat.plannedAmount : 120000;
}

/**
 * Calculates percentage of gastos hormiga budget consumed.
 */
export function calculateGastosHormigaPercent(spent: number, budget: number): number {
  return budget > 0 ? (spent / budget) * 100 : 0;
}

/**
 * Groups gastos hormiga by category type.
 */
export function calculateGastosHormigaByType(
  expenses: ExpenseTransaction[]
): Record<HormigaType, { count: number; amount: number }> {
  const map: Record<HormigaType, { count: number; amount: number }> = {
    cafes: { count: 0, amount: 0 },
    snacks: { count: 0, amount: 0 },
    delivery: { count: 0, amount: 0 },
    transporte_corto: { count: 0, amount: 0 },
    impulso: { count: 0, amount: 0 },
    suscripciones: { count: 0, amount: 0 },
    otros: { count: 0, amount: 0 },
  };

  expenses.forEach((e) => {
    if (e.isHormiga) {
      const type = e.hormigaType || 'otros';
      if (map[type]) {
        map[type].count += 1;
        map[type].amount += e.amount;
      } else {
        map.otros.count += 1;
        map.otros.amount += e.amount;
      }
    }
  });

  return map;
}

/**
 * Computes counts and amounts for recurring payments.
 */
export function calculatePaymentsMetrics(payments: RecurringPayment[]): {
  completedCount: number;
  pendingCount: number;
  pendingAmount: number;
} {
  const completedCount = payments.filter((p) => p.isPaid).length;
  const pendingPayments = payments.filter((p) => !p.isPaid);
  const pendingCount = pendingPayments.length;
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return { completedCount, pendingCount, pendingAmount };
}

/**
 * Computes overall budget status and user-facing friendly guidance message.
 */
export function determineBudgetStatus(
  availableRemaining: number,
  totalBudget: number,
  totalSpent: number,
  budgetUsedPercent: number
): { status: 'good' | 'warning' | 'over'; text: string } {
  if (availableRemaining < 0 || (totalBudget > 0 && totalSpent > totalBudget)) {
    return {
      status: 'over',
      text: 'Has superado tu presupuesto',
    };
  }

  if (budgetUsedPercent >= 75) {
    return {
      status: 'warning',
      text: 'Cuidado con tu presupuesto',
    };
  }

  return {
    status: 'good',
    text: 'Vas bien con tu presupuesto',
  };
}
