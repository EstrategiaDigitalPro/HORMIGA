import {
  CategoryBudget,
  CategoryFinancialMetrics,
  CentralFinancialSummary,
  ExpenseTransaction,
  HormigaType,
  IncomeSource,
  MonthData,
  RecurringPayment,
} from '../types/finance';

/**
 * Calculates sum of monthly incomes.
 */
export function calculateTotalIncome(incomes: IncomeSource[]): number {
  return (incomes || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
}

/**
 * Calculates sum of monthly expenses (gastos reales efectivamente pagados).
 * Solo se consideran los movimientos registrados en expenses.
 */
export function calculateTotalSpent(expenses: ExpenseTransaction[]): number {
  return (expenses || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
}

/**
 * Calculates available remaining spending money.
 * Regla 2: Disponible = Ingresos - Ahorro separado - Gastos reales pagados.
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
 * Regla 6: El presupuesto mensual total debe corresponder a la suma de los
 * límites configurados en todas las categorías.
 */
export function calculateTotalBudget(budgets: CategoryBudget[]): number {
  return (budgets || []).reduce((acc, curr) => acc + (Number(curr.plannedAmount) || 0), 0);
}

/**
 * Calculates percentage of budget used.
 */
export function calculateBudgetUsedPercent(totalSpent: number, totalBudget: number): number {
  if (totalBudget <= 0) {
    return totalSpent > 0 ? 100 : 0;
  }
  return (totalSpent / totalBudget) * 100;
}

/**
 * Calculates total spent on micro-expenses (gastos hormiga).
 */
export function calculateGastosHormigaSpent(expenses: ExpenseTransaction[]): number {
  return (expenses || [])
    .filter((e) => Boolean(e.isHormiga))
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
}

/**
 * Finds or derives the budget limit for gastos hormiga.
 */
export function calculateGastosHormigaBudget(budgets: CategoryBudget[]): number {
  const hormigaCat = (budgets || []).find(
    (b) => b.isHormigaCategory || b.id === 'gastos_hormiga' || b.name.toLowerCase().includes('hormiga')
  );
  return hormigaCat ? Number(hormigaCat.plannedAmount) || 0 : 0;
}

/**
 * Calculates percentage of gastos hormiga budget consumed.
 */
export function calculateGastosHormigaPercent(spent: number, budget: number): number {
  if (budget <= 0) {
    return spent > 0 ? 100 : 0;
  }
  return (spent / budget) * 100;
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

  (expenses || []).forEach((e) => {
    if (e.isHormiga) {
      const type = e.hormigaType || 'otros';
      const amt = Number(e.amount) || 0;
      if (map[type]) {
        map[type].count += 1;
        map[type].amount += amt;
      } else {
        map.otros.count += 1;
        map.otros.amount += amt;
      }
    }
  });

  return map;
}

/**
 * Computes counts and amounts for recurring payments.
 * Regla 3: Los pagos pendientes NO deben sumarse al gasto real.
 */
export function calculatePaymentsMetrics(payments: RecurringPayment[]): {
  completedCount: number;
  pendingCount: number;
  pendingAmount: number;
} {
  const validPayments = payments || [];
  const completedCount = validPayments.filter((p) => Boolean(p.isPaid)).length;
  const pendingPayments = validPayments.filter((p) => !p.isPaid);
  const pendingCount = pendingPayments.length;
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

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

  if (totalBudget > 0 && budgetUsedPercent >= 75) {
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

/**
 * Capa central única de cálculo financiero para HORMIGA.
 * Garantiza una única fuente de verdad consumida por todas las pantallas:
 * - Mi Mes
 * - Presupuesto
 * - Análisis
 * - Pagos
 * - Ahorro
 */
export function calculateCentralFinances(monthData: MonthData): CentralFinancialSummary {
  const incomes = monthData?.incomes || [];
  const expenses = monthData?.expenses || [];
  const budgets = monthData?.budgets || [];
  const payments = monthData?.payments || [];
  const savings = monthData?.savings;

  // 1. Ingresos
  const totalIncome = calculateTotalIncome(incomes);

  // 2. Ahorro
  const savingsSeparated = Number(savings?.separatedAmount) || 0;
  const savingsMonthlyTarget = Number(savings?.monthlyTarget) || 0;

  // 3. Gastos reales (única fuente de verdad)
  const totalSpent = calculateTotalSpent(expenses);

  // 4. Disponible restante general: Ingresos - Ahorro separado - Gastos reales pagados
  const availableRemaining = calculateAvailableRemaining(totalIncome, savingsSeparated, totalSpent);

  // 5. Presupuesto total: suma exacta de las categorías
  const totalBudget = calculateTotalBudget(budgets);
  const budgetUsedPercent = calculateBudgetUsedPercent(totalSpent, totalBudget);

  // 6. Pagos métricas
  const { completedCount, pendingCount, pendingAmount } = calculatePaymentsMetrics(payments);

  // 7. Gastos hormiga métricas
  const gastosHormigaSpent = calculateGastosHormigaSpent(expenses);
  const gastosHormigaBudget = calculateGastosHormigaBudget(budgets);
  const gastosHormigaPercent = calculateGastosHormigaPercent(gastosHormigaSpent, gastosHormigaBudget);
  const gastosHormigaByType = calculateGastosHormigaByType(expenses);

  // 8. Métricas detalladas por categoría
  // Cada gasto debe contabilizarse EXACTAMENTE UNA VEZ en su categoría respectiva.
  const categoriesMetrics: CategoryFinancialMetrics[] = budgets.map((cat) => {
    const planned = Number(cat.plannedAmount) || 0;
    const catNameLower = cat.name.trim().toLowerCase();
    const catIdLower = cat.id.trim().toLowerCase();

    // Suma de gastos reales PAGADOS de esta categoría
    const spent = expenses.reduce((acc, exp) => {
      if (cat.isHormigaCategory) {
        return exp.isHormiga ? acc + (Number(exp.amount) || 0) : acc;
      }

      // Si no es la categoría de microgastos hormiga, los gastos hormiga van a su rubro hormiga
      if (exp.isHormiga) {
        return acc;
      }

      const expCatLower = (exp.category || '').trim().toLowerCase();
      if (expCatLower === catNameLower || expCatLower === catIdLower) {
        return acc + (Number(exp.amount) || 0);
      }
      return acc;
    }, 0);

    // Suma de pagos PENDIENTES de esta categoría (informativo, NUNCA sumado a gastado)
    const pending = payments.reduce((acc, pay) => {
      if (pay.isPaid) return acc;
      const payCatLower = (pay.category || '').trim().toLowerCase();
      if (payCatLower === catNameLower || payCatLower === catIdLower) {
        return acc + (Number(pay.amount) || 0);
      }
      return acc;
    }, 0);

    const available = planned - spent;
    const percentUsed = planned > 0 ? (spent / planned) * 100 : (spent > 0 ? 100 : 0);
    const isOver = spent > planned;
    const isWarning = !isOver && planned > 0 && percentUsed >= 75;

    let status: 'good' | 'warning' | 'over' = 'good';
    let statusLabel = 'En control';

    if (isOver) {
      status = 'over';
      statusLabel = 'Excedido';
    } else if (isWarning) {
      status = 'warning';
      statusLabel = 'En alerta';
    }

    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      isHormigaCategory: cat.isHormigaCategory,
      planned,
      spent,
      pending,
      available,
      percentUsed,
      isOver,
      isWarning,
      status,
      statusLabel,
    };
  });

  const categoryMetricsMap: Record<string, CategoryFinancialMetrics> = {};
  categoriesMetrics.forEach((m) => {
    categoryMetricsMap[m.name] = m;
    categoryMetricsMap[m.id] = m;
    categoryMetricsMap[m.name.toLowerCase()] = m;
  });

  // 9. Estado de salud general
  const { status: budgetStatus, text: budgetStatusText } = determineBudgetStatus(
    availableRemaining,
    totalBudget,
    totalSpent,
    budgetUsedPercent
  );

  return {
    totalIncome,
    savingsSeparated,
    savingsMonthlyTarget,
    totalSpent,
    pendingPaymentsAmount: pendingAmount,
    completedPaymentsCount: completedCount,
    pendingPaymentsCount: pendingCount,
    totalBudget,
    budgetUsedPercent,
    availableRemaining,
    categoriesMetrics,
    categoryMetricsMap,
    gastosHormigaSpent,
    gastosHormigaBudget,
    gastosHormigaPercent,
    gastosHormigaByType,
    budgetStatus,
    budgetStatusText,
  };
}

/**
 * Reconciliador y saneador de datos financieros:
 * 1. Corrige valores anómalos o placeholders accidentales (como $1 en Alimentación -> $0).
 * 2. Deduplica gastos asociados a pagos recurrentes para evitar dobles contabilizaciones.
 * 3. Garantiza coherencia bi-direccional entre pagos marcados como pagados y movimientos.
 */
export function reconcileMonthData(data: MonthData): MonthData {
  if (!data) return data;

  // 1. Sanear categorías de presupuesto: si tiene $1 placeholder accidental, corregir a $0
  const cleanedBudgets = (data.budgets || []).map((b) => ({
    ...b,
    plannedAmount: b.plannedAmount === 1 ? 0 : (Number(b.plannedAmount) || 0),
  }));

  const payments = data.payments || [];
  let expenses = [...(data.expenses || [])];

  // 2. Eliminar duplicados exactos por id
  const seenExpIds = new Set<string>();
  expenses = expenses.filter((e) => {
    if (!e || !e.id) return false;
    if (seenExpIds.has(e.id)) return false;
    seenExpIds.add(e.id);
    return true;
  });

  // 3. Sincronizar Pagos con Movimientos
  payments.forEach((payment) => {
    const isPaid = Boolean(payment.isPaid);
    const payAmt = Number(payment.amount) || 0;
    const payNameLower = (payment.name || '').trim().toLowerCase();

    // Localizar todos los movimientos que corresponden a este pago
    const matchingIndices: number[] = [];
    expenses.forEach((e, idx) => {
      const matchById = e.paymentId === payment.id || e.id === `exp_pay_${payment.id}`;
      const descLower = (e.description || '').trim().toLowerCase();
      const matchByName =
        descLower === `pago: ${payNameLower}` ||
        descLower === payNameLower;
      const matchByAmount = Math.abs((Number(e.amount) || 0) - payAmt) < 0.01;

      if (matchById || (matchByName && matchByAmount)) {
        matchingIndices.push(idx);
      }
    });

    if (isPaid) {
      if (matchingIndices.length === 0) {
        // Si está pagado pero no tiene movimiento, crear el único movimiento
        expenses.unshift({
          id: `exp_pay_${payment.id}`,
          paymentId: payment.id,
          amount: payAmt,
          category: payment.category,
          description: `Pago: ${payment.name}`,
          isHormiga: false,
          date: payment.paidDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        });
      } else {
        // Si ya existen movimientos para este pago, asegurar que haya exactamente UNO
        const primaryIdx = matchingIndices[0];
        expenses[primaryIdx] = {
          ...expenses[primaryIdx],
          paymentId: payment.id,
          amount: payAmt,
          category: payment.category,
          description: expenses[primaryIdx].description || `Pago: ${payment.name}`,
        };

        // Si había más de uno (doble contabilización histórica), eliminar los duplicados sobrantes
        if (matchingIndices.length > 1) {
          const duplicateIndices = new Set(matchingIndices.slice(1));
          expenses = expenses.filter((_, idx) => !duplicateIndices.has(idx));
        }
      }
    } else {
      // Si el pago es pendiente, NINGÚN movimiento generado para este pago debe existir
      if (matchingIndices.length > 0) {
        const removeIndices = new Set(
          matchingIndices.filter((idx) => {
            const e = expenses[idx];
            return e.paymentId === payment.id || e.id === `exp_pay_${payment.id}`;
          })
        );
        if (removeIndices.size > 0) {
          expenses = expenses.filter((_, idx) => !removeIndices.has(idx));
        }
      }
    }
  });

  return {
    ...data,
    budgets: cleanedBudgets,
    payments,
    expenses,
  };
}
