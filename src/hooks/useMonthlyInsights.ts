import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useMonthlyInsights() {
  const {
    monthData,
    totalSpent,
    savingsSeparated,
    savingsMonthlyTarget,
    gastosHormigaSpent,
    categoriesMetrics,
  } = useFinance();

  return useMemo(() => {
    // 1. Largest spending category from central metrics
    const sortedCategories = [...categoriesMetrics]
      .filter((m) => m.spent > 0)
      .sort((a, b) => b.spent - a.spent);

    const topCategory = sortedCategories[0];
    const topCatName = topCategory ? topCategory.name : 'Alimentación';
    const topCatAmount = topCategory ? topCategory.spent : 0;
    const topCatPercent = totalSpent > 0 ? Math.round((topCatAmount / totalSpent) * 100) : 0;

    // 2. Budget exceeded check (sin usar || 1 ni valores anómalos)
    const topExceeded = categoriesMetrics
      .filter((m) => m.isOver)
      .map((m) => ({
        ...m,
        spent: m.spent,
        planned: m.planned,
        pct: Math.round(m.percentUsed),
        diff: m.spent - m.planned,
      }))
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

    (monthData.expenses || []).forEach((e) => {
      if (e.isHormiga && e.date) {
        const d = new Date(`${e.date}T12:00:00Z`);
        const dayIdx = d.getUTCDay();
        if (daysMap[dayIdx]) {
          daysMap[dayIdx].count += 1;
          daysMap[dayIdx].total += Number(e.amount) || 0;
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
  }, [
    monthData,
    totalSpent,
    savingsSeparated,
    savingsMonthlyTarget,
    gastosHormigaSpent,
    categoriesMetrics,
  ]);
}
