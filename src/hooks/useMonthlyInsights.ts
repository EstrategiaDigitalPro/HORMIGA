import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useMonthlyInsights() {
  const { monthData, totalSpent, savingsSeparated, savingsMonthlyTarget, gastosHormigaSpent } =
    useFinance();

  return useMemo(() => {
    // 1. Largest spending category
    const categoryTotals: Record<string, number> = {};
    monthData.expenses.forEach((e) => {
      const key = e.isHormiga ? 'Gastos hormiga' : e.category;
      categoryTotals[key] = (categoryTotals[key] || 0) + e.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    );
    const topCategory = sortedCategories[0] || ['Alimentación', 0];
    const topCatName = topCategory[0];
    const topCatAmount = topCategory[1];
    const topCatPercent = totalSpent > 0 ? Math.round((topCatAmount / totalSpent) * 100) : 0;

    // 2. Budget exceeded check
    const topExceeded = monthData.budgets
      .map((b) => {
        const spent =
          categoryTotals[b.name] ||
          (b.isHormigaCategory ? categoryTotals['Gastos hormiga'] : 0) ||
          0;
        const planned = b.plannedAmount || 1;
        const pct = Math.round((spent / planned) * 100);
        return { ...b, spent, planned, pct, diff: spent - planned };
      })
      .filter((b) => b.diff > 0)
      .sort((a, b) => b.diff - a.diff)[0];

    // 3. Savings percent
    const savingsPct =
      savingsMonthlyTarget > 0
        ? Math.round((savingsSeparated / savingsMonthlyTarget) * 100)
        : 0;

    // 4. Half hormiga release
    const halfHormiga = Math.round(gastosHormigaSpent / 2);
    const halfHormigaAnnual = halfHormiga * 12;

    // 5. Day of week with most hormiga
    const daysMap: Record<number, { name: string; count: number; total: number }> = {
      0: { name: 'domingos', count: 0, total: 0 },
      1: { name: 'lunes', count: 0, total: 0 },
      2: { name: 'martes', count: 0, total: 0 },
      3: { name: 'miércoles', count: 0, total: 0 },
      4: { name: 'jueves', count: 0, total: 0 },
      5: { name: 'viernes', count: 0, total: 0 },
      6: { name: 'sábados', count: 0, total: 0 },
    };

    monthData.expenses.forEach((e) => {
      if (e.isHormiga && e.date) {
        const d = new Date(`${e.date}T12:00:00Z`);
        const dayIdx = d.getUTCDay();
        if (daysMap[dayIdx]) {
          daysMap[dayIdx].count += 1;
          daysMap[dayIdx].total += e.amount;
        }
      }
    });

    const peakDay = Object.values(daysMap).sort((a, b) => b.total - a.total)[0];

    return {
      topCatName,
      topCatAmount,
      topCatPercent,
      topExceeded,
      savingsPct,
      halfHormiga,
      halfHormigaAnnual,
      peakDay,
    };
  }, [monthData, totalSpent, savingsSeparated, savingsMonthlyTarget, gastosHormigaSpent]);
}
