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
  name: 'Camila Morales',
  email: 'camila.morales@example.com',
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
  { id: 'vivienda', name: 'Vivienda', plannedAmount: 550000, icon: 'Home', color: '#176B45' },
  { id: 'alimentacion', name: 'Alimentación', plannedAmount: 320000, icon: 'Utensils', color: '#2563EB' },
  { id: 'transporte', name: 'Transporte', plannedAmount: 120000, icon: 'Car', color: '#0891B2' },
  { id: 'servicios', name: 'Servicios', plannedAmount: 110000, icon: 'Zap', color: '#8B5CF6' },
  { id: 'salud', name: 'Salud', plannedAmount: 80000, icon: 'HeartPulse', color: '#EC4899' },
  { id: 'entretenimiento', name: 'Entretenimiento', plannedAmount: 100000, icon: 'Gamepad2', color: '#F59E0B' },
  { id: 'gastos_hormiga', name: 'Gastos hormiga', plannedAmount: 120000, icon: 'Flame', color: '#F4A340', isHormigaCategory: true },
  { id: 'otros', name: 'Otros', plannedAmount: 70000, icon: 'Layers', color: '#68716B' },
];

export const INITIAL_INCOMES: IncomeSource[] = [
  { id: 'inc_1', name: 'Salario mensual principal', amount: 1650000, category: 'salario' },
  { id: 'inc_2', name: 'Asesorías / Trabajo independiente', amount: 350000, category: 'independiente' },
];

export const INITIAL_SAVINGS: SavingsGoal = {
  monthlyTarget: 400000,
  separatedAmount: 350000,
  annualDerivedTarget: 4800000,
  notes: 'Fondo de emergencia e inversión para vacaciones',
};

export const INITIAL_PAYMENTS: RecurringPayment[] = [
  { id: 'pay_1', name: 'Arriendo departamento', amount: 550000, category: 'Vivienda', dueDay: 5, isPaid: true, paidDate: '2026-10-02', isPac: true },
  { id: 'pay_2', name: 'Internet fibra & telefonía', amount: 42000, category: 'Servicios', dueDay: 8, isPaid: true, paidDate: '2026-10-04', isPac: true },
  { id: 'pay_3', name: 'Suscripciones streaming (Netflix/Spotify)', amount: 19500, category: 'Entretenimiento', dueDay: 10, isPaid: true, paidDate: '2026-10-03', isPac: true },
  { id: 'pay_4', name: 'Electricidad y Agua potable', amount: 43000, category: 'Servicios', dueDay: 14, isPaid: false, isPac: false },
  { id: 'pay_5', name: 'Seguro complementario de salud', amount: 25000, category: 'Salud', dueDay: 18, isPaid: false, isPac: true },
  { id: 'pay_6', name: 'Cuota tarjeta de crédito', amount: 65000, category: 'Otros', dueDay: 24, isPaid: false, isPac: false },
];

export const INITIAL_EXPENSES: ExpenseTransaction[] = [
  {
    id: 'exp_1',
    amount: 550000,
    category: 'Vivienda',
    description: 'Pago mensual de arriendo',
    isHormiga: false,
    date: '2026-10-02',
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'exp_2',
    amount: 19500,
    category: 'Entretenimiento',
    description: 'Netflix + Spotify familiar',
    isHormiga: false,
    date: '2026-10-03',
    createdAt: '2026-10-03T11:00:00Z',
  },
  {
    id: 'exp_3',
    amount: 42000,
    category: 'Servicios',
    description: 'Boleta fibra hogar',
    isHormiga: false,
    date: '2026-10-04',
    createdAt: '2026-10-04T09:30:00Z',
  },
  {
    id: 'exp_4',
    amount: 78000,
    category: 'Alimentación',
    description: 'Supermercado compra semanal',
    isHormiga: false,
    date: '2026-10-03',
    createdAt: '2026-10-03T18:20:00Z',
  },
  {
    id: 'exp_5',
    amount: 22000,
    category: 'Transporte',
    description: 'Carga de combustible / tarjeta transporte',
    isHormiga: false,
    date: '2026-10-01',
    createdAt: '2026-10-01T08:15:00Z',
  },
  // Gastos hormiga reales
  {
    id: 'exp_h1',
    amount: 6800,
    category: 'Gastos hormiga',
    description: 'Café latte + medialuna cafetería',
    isHormiga: true,
    hormigaType: 'cafes',
    date: '2026-10-05',
    createdAt: '2026-10-05T09:10:00Z',
  },
  {
    id: 'exp_h2',
    amount: 3400,
    category: 'Gastos hormiga',
    description: 'Snack y bebida en tienda de servicio',
    isHormiga: true,
    hormigaType: 'snacks',
    date: '2026-10-05',
    createdAt: '2026-10-05T16:40:00Z',
  },
  {
    id: 'exp_h3',
    amount: 18500,
    category: 'Gastos hormiga',
    description: 'Delivery hamburguesa noche de domingo',
    isHormiga: true,
    hormigaType: 'delivery',
    date: '2026-10-04',
    createdAt: '2026-10-04T21:15:00Z',
  },
  {
    id: 'exp_h4',
    amount: 7200,
    category: 'Gastos hormiga',
    description: 'Taxi Uber trayecto corto por lluvia',
    isHormiga: true,
    hormigaType: 'transporte_corto',
    date: '2026-10-04',
    createdAt: '2026-10-04T14:10:00Z',
  },
  {
    id: 'exp_h5',
    amount: 14900,
    category: 'Gastos hormiga',
    description: 'Compra por impulso: funda celular en mall',
    isHormiga: true,
    hormigaType: 'impulso',
    date: '2026-10-03',
    createdAt: '2026-10-03T19:40:00Z',
  },
  {
    id: 'exp_h6',
    amount: 5500,
    category: 'Gastos hormiga',
    description: 'Café americano + muffin tarde',
    isHormiga: true,
    hormigaType: 'cafes',
    date: '2026-10-02',
    createdAt: '2026-10-02T16:30:00Z',
  },
  {
    id: 'exp_h7',
    amount: 21000,
    category: 'Gastos hormiga',
    description: 'Delivery sushi con amigos',
    isHormiga: true,
    hormigaType: 'delivery',
    date: '2026-10-02',
    createdAt: '2026-10-02T22:00:00Z',
  },
  {
    id: 'exp_h8',
    amount: 9800,
    category: 'Gastos hormiga',
    description: 'Uber nocturno regreso fiesta',
    isHormiga: true,
    hormigaType: 'transporte_corto',
    date: '2026-10-01',
    createdAt: '2026-10-01T23:50:00Z',
  },
  {
    id: 'exp_6',
    amount: 32000,
    category: 'Alimentación',
    description: 'Feria verduras y panadería',
    isHormiga: false,
    date: '2026-10-04',
    createdAt: '2026-10-04T12:00:00Z',
  },
];

export const INITIAL_MONTH_DATA: MonthData = {
  monthKey: '2026-10',
  monthLabel: 'Octubre 2026',
  incomes: INITIAL_INCOMES,
  savings: INITIAL_SAVINGS,
  budgets: INITIAL_BUDGETS,
  payments: INITIAL_PAYMENTS,
  expenses: INITIAL_EXPENSES,
};

export const PAST_MONTHS_DATA: MonthData[] = [
  {
    monthKey: '2026-09',
    monthLabel: 'Septiembre 2026',
    incomes: [
      { id: 'p_inc_1', name: 'Salario', amount: 1650000, category: 'salario' },
      { id: 'p_inc_2', name: 'Aguinaldo fiestas', amount: 180000, category: 'otros' },
    ],
    savings: {
      monthlyTarget: 400000,
      separatedAmount: 400000,
      annualDerivedTarget: 4800000,
    },
    budgets: INITIAL_BUDGETS,
    payments: INITIAL_PAYMENTS.map((p) => ({ ...p, isPaid: true })),
    expenses: [
      { id: 'sep_1', amount: 550000, category: 'Vivienda', description: 'Arriendo', isHormiga: false, date: '2026-09-02', createdAt: '2026-09-02T10:00:00Z' },
      { id: 'sep_2', amount: 310000, category: 'Alimentación', description: 'Supermercado y asado', isHormiga: false, date: '2026-09-17', createdAt: '2026-09-17T12:00:00Z' },
      { id: 'sep_3', amount: 115000, category: 'Transporte', description: 'Combustible y peajes', isHormiga: false, date: '2026-09-18', createdAt: '2026-09-18T10:00:00Z' },
      { id: 'sep_4', amount: 104000, category: 'Servicios', description: 'Cuentas básicas', isHormiga: false, date: '2026-09-10', createdAt: '2026-09-10T10:00:00Z' },
      { id: 'sep_5', amount: 165000, category: 'Gastos hormiga', description: 'Gastos hormiga acumulados del mes', isHormiga: true, hormigaType: 'cafes', date: '2026-09-28', createdAt: '2026-09-28T10:00:00Z' },
    ],
  },
  {
    monthKey: '2026-08',
    monthLabel: 'Agosto 2026',
    incomes: [
      { id: 'aug_inc_1', name: 'Salario', amount: 1650000, category: 'salario' },
      { id: 'aug_inc_2', name: 'Freelance diseño', amount: 240000, category: 'independiente' },
    ],
    savings: {
      monthlyTarget: 400000,
      separatedAmount: 380000,
      annualDerivedTarget: 4800000,
    },
    budgets: INITIAL_BUDGETS,
    payments: INITIAL_PAYMENTS.map((p) => ({ ...p, isPaid: true })),
    expenses: [
      { id: 'aug_1', amount: 550000, category: 'Vivienda', description: 'Arriendo', isHormiga: false, date: '2026-08-02', createdAt: '2026-08-02T10:00:00Z' },
      { id: 'aug_2', amount: 285000, category: 'Alimentación', description: 'Supermercado', isHormiga: false, date: '2026-08-15', createdAt: '2026-08-15T12:00:00Z' },
      { id: 'aug_3', amount: 98000, category: 'Transporte', description: 'Transporte público y bencina', isHormiga: false, date: '2026-08-20', createdAt: '2026-08-20T10:00:00Z' },
      { id: 'aug_4', amount: 102000, category: 'Servicios', description: 'Luz, agua, internet', isHormiga: false, date: '2026-08-10', createdAt: '2026-08-10T10:00:00Z' },
      { id: 'aug_5', amount: 142000, category: 'Gastos hormiga', description: 'Gastos hormiga acumulados del mes', isHormiga: true, hormigaType: 'delivery', date: '2026-08-28', createdAt: '2026-08-28T10:00:00Z' },
    ],
  },
];
