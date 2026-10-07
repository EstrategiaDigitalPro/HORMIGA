import {
  CategoryBudget,
  ExpenseTransaction,
  HormigaTypeConfig,
  IncomeSource,
  MonthData,
  RecurringPayment,
  SavingsGoal,
  UserPreferences,
} from '../types/finance';

export const HORMIGA_TYPES: HormigaTypeConfig[] = [
  {
    id: 'cafes',
    label: 'Cafés y bebidas',
    example: 'Café de paso, té, bebidas frías',
    iconName: 'Coffee',
  },
  {
    id: 'snacks',
    label: 'Snacks y golosinas',
    example: 'Kioscos, galletas, chocolates',
    iconName: 'Cookie',
  },
  {
    id: 'delivery',
    label: 'Delivery y antojos',
    example: 'Apps de comida rápida, postres',
    iconName: 'UtensilsCrossed',
  },
  {
    id: 'transporte_corto',
    label: 'Taxis y transportes cortos',
    example: 'Uber/Cabify por pereza de caminar o metro',
    iconName: 'Car',
  },
  {
    id: 'impulso',
    label: 'Compras por impulso',
    example: 'Vitrineo en rebajas, accesorios no planeados',
    iconName: 'ShoppingBag',
  },
  {
    id: 'suscripciones',
    label: 'Suscripciones olvidadas',
    example: 'Apps o servicios con poco uso',
    iconName: 'Sparkles',
  },
  {
    id: 'otros',
    label: 'Otros microgastos',
    example: 'Propinas extra, comisiones, juegos',
    iconName: 'Coins',
  },
];

export const INITIAL_PREFERENCES: UserPreferences = {
  name: '',
  email: '',
  country: 'Chile',
  currency: 'CLP',
  currencySymbol: '$',
  customCategories: [
    'Vivienda',
    'Alimentación',
    'Transporte',
    'Servicios',
    'Salud',
    'Entretenimiento',
    'Gastos hormiga',
    'Otros',
  ],
};

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { id: 'vivienda', name: 'Vivienda', plannedAmount: 0, icon: 'Home', color: '#176B45' },
  { id: 'alimentacion', name: 'Alimentación', plannedAmount: 0, icon: 'Utensils', color: '#2563EB' },
  { id: 'transporte', name: 'Transporte', plannedAmount: 0, icon: 'Car', color: '#0891B2' },
  { id: 'servicios', name: 'Servicios', plannedAmount: 0, icon: 'Zap', color: '#8B5CF6' },
  { id: 'salud', name: 'Salud', plannedAmount: 0, icon: 'HeartPulse', color: '#EC4899' },
  { id: 'entretenimiento', name: 'Entretenimiento', plannedAmount: 0, icon: 'Gamepad2', color: '#F59E0B' },
  { id: 'gastos_hormiga', name: 'Gastos hormiga', plannedAmount: 0, icon: 'Flame', color: '#F4A340', isHormigaCategory: true },
  { id: 'otros', name: 'Otros', plannedAmount: 0, icon: 'Layers', color: '#68716B' },
];

export const INITIAL_INCOMES: IncomeSource[] = [];

export const INITIAL_SAVINGS: SavingsGoal = {
  monthlyTarget: 0,
  separatedAmount: 0,
  annualDerivedTarget: 0,
  notes: '',
};

export const INITIAL_PAYMENTS: RecurringPayment[] = [];

export const INITIAL_EXPENSES: ExpenseTransaction[] = [];

export const INITIAL_MONTH_DATA: MonthData = {
  monthKey: '2026-10',
  monthLabel: 'Octubre 2026',
  incomes: INITIAL_INCOMES,
  savings: INITIAL_SAVINGS,
  budgets: INITIAL_BUDGETS,
  payments: INITIAL_PAYMENTS,
  expenses: INITIAL_EXPENSES,
};

export const PAST_MONTHS_DATA: MonthData[] = [];
