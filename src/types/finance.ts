export type Screen =
  | 'mi_mes'
  | 'ingresos'
  | 'ahorro'
  | 'presupuesto'
  | 'pagos'
  | 'gastos_hormiga'
  | 'analisis'
  | 'descubrimientos'
  | 'historial'
  | 'mi_cuenta';

export type HormigaType =
  | 'cafes'
  | 'snacks'
  | 'delivery'
  | 'transporte_corto'
  | 'impulso'
  | 'suscripciones'
  | 'otros';

export interface HormigaTypeConfig {
  id: HormigaType;
  label: string;
  example: string;
  iconName: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  category: 'salario' | 'negocio' | 'independiente' | 'pension' | 'otros';
  notes?: string;
}

export interface CategoryBudget {
  id: string;
  name: string;
  plannedAmount: number;
  icon: string;
  color: string;
  isHormigaCategory?: boolean;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  category: string;
  dueDay: number; // 1-31
  isPaid: boolean;
  paidDate?: string;
  serviceProvider?: string;
  isPac?: boolean; // Pago Automático de Cuentas / Débito automático
}

export interface SavingsGoal {
  monthlyTarget: number;
  separatedAmount: number;
  annualDerivedTarget: number;
  notes?: string;
}

export interface ExpenseTransaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  isHormiga: boolean;
  hormigaType?: HormigaType;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO
  paymentId?: string; // Linked recurring payment ID if generated from a payment
}

export interface CategoryFinancialMetrics {
  id: string;
  name: string;
  icon: string;
  color: string;
  isHormigaCategory?: boolean;
  planned: number; // Límite mensual configurado
  spent: number; // Suma de los gastos reales PAGADOS de esa categoría
  pending: number; // Suma de pagos pendientes de esa categoría (NO sumado a gastado)
  available: number; // planned - spent
  percentUsed: number; // (spent / planned) * 100 si planned > 0, o 0
  isOver: boolean; // spent > planned
  isWarning: boolean; // !isOver && planned > 0 && percentUsed >= 75
  status: 'good' | 'warning' | 'over'; // 'good' = En control, 'warning' = En alerta, 'over' = Excedido
  statusLabel: string; // 'En control' | 'En alerta' | 'Excedido'
}

export interface CentralFinancialSummary {
  totalIncome: number;
  savingsSeparated: number;
  savingsMonthlyTarget: number;
  totalSpent: number;
  pendingPaymentsAmount: number;
  completedPaymentsCount: number;
  pendingPaymentsCount: number;
  totalBudget: number;
  budgetUsedPercent: number;
  availableRemaining: number;
  categoriesMetrics: CategoryFinancialMetrics[];
  categoryMetricsMap: Record<string, CategoryFinancialMetrics>;
  gastosHormigaSpent: number;
  gastosHormigaBudget: number;
  gastosHormigaPercent: number;
  gastosHormigaByType: Record<HormigaType, { count: number; amount: number }>;
  budgetStatus: 'good' | 'warning' | 'over';
  budgetStatusText: string;
}

export interface MonthData {
  monthKey: string; // e.g. '2026-10'
  monthLabel: string; // e.g. 'Octubre 2026'
  incomes: IncomeSource[];
  savings: SavingsGoal;
  budgets: CategoryBudget[];
  payments: RecurringPayment[];
  expenses: ExpenseTransaction[];
}

export interface UserPreferences {
  name: string;
  email: string;
  country: string;
  currency: string; // 'CLP' | 'USD' | 'EUR' | 'COP' | 'MXN'
  currencySymbol: string;
  customCategories: string[];
}
