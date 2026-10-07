import React from 'react';
import {
  Flame,
  PieChart,
  ShieldAlert,
  CheckCircle2,
  PiggyBank,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currency';
import { useMonthlyInsights } from '../../hooks/useMonthlyInsights';
import { InsightCard } from './InsightCard';

export const DiscoveriesList: React.FC = () => {
  const {
    setCurrentScreen,
    preferences,
    totalSpent,
    savingsSeparated,
    savingsMonthlyTarget,
    gastosHormigaSpent,
    gastosHormigaPercent,
  } = useFinance();

  const {
    topCatName,
    topCatAmount,
    topCatPercent,
    topExceeded,
    savingsPct,
    halfHormiga,
    halfHormigaAnnual,
    peakDay,
  } = useMonthlyInsights();

  return (
    <div className="space-y-4">
      {/* 1. Gastos hormiga totales */}
      <InsightCard
        variant="amber"
        icon={
          <div className="w-8 h-8 rounded-xl bg-[#FEF7EE] text-[#F4A340] flex items-center justify-center">
            <Flame className="w-4 h-4 fill-[#F4A340]" />
          </div>
        }
        tagText="Microgastos acumulados"
        badgeRight={
          <span className="text-xs text-[#68716B] font-medium">
            {Math.round(gastosHormigaPercent)}% del tope
          </span>
        }
        title={`Tus gastos hormiga suman ${formatCurrency(
          gastosHormigaSpent,
          preferences.currency
        )} este mes`}
        description={
          <p>
            Representan el{' '}
            <strong className="text-[#202522]">
              {totalSpent > 0 ? Math.round((gastosHormigaSpent / totalSpent) * 100) : 0}%
            </strong>{' '}
            de todo tu dinero gastado. A este ritmo proyectado, sumarán{' '}
            <strong className="text-[#C97E25]">
              {formatCurrency(gastosHormigaSpent * 12, preferences.currency)} al año
            </strong>.
          </p>
        }
        actionButton={{
          label: 'Ver desglose de cafés, snacks y delivery',
          onClick: () => setCurrentScreen('gastos_hormiga'),
          colorClass: 'text-[#C97E25]',
        }}
      />

      {/* 2. Categoría con mayor gasto */}
      <InsightCard
        variant="default"
        icon={
          <div className="w-8 h-8 rounded-xl bg-[#EBF4EF] text-[#176B45] flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
        }
        tagText="Mayor concentración"
        badgeRight={
          <span className="text-xs text-[#68716B] font-semibold num-tabular">
            {topCatPercent}% del gasto
          </span>
        }
        title={`${topCatName} es tu categoría con mayor gasto (${formatCurrency(
          topCatAmount,
          preferences.currency
        )})`}
        description={
          <p>
            Casi 1 de cada {Math.max(2, Math.round(100 / (topCatPercent || 1)))} pesos que gastas
            se dirigen a este rubro. Si buscas generar holgura rápidamente, pequeñas compras
            optimizadas aquí tendrán el mayor impacto.
          </p>
        }
        actionButton={{
          label: `Revisar presupuesto de ${topCatName}`,
          onClick: () => setCurrentScreen('presupuesto'),
          colorClass: 'text-[#176B45]',
        }}
      />

      {/* 3. Desviación de presupuesto o Presupuesto en orden */}
      {topExceeded ? (
        <InsightCard
          variant="danger"
          icon={
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          }
          tagText="Desviación de presupuesto"
          badgeRight={
            <span className="text-xs text-red-600 font-bold">
              +{topExceeded.pct - 100}% sobre el tope
            </span>
          }
          title={`Gastaste un ${topExceeded.pct - 100}% más de lo presupuestado en ${
            topExceeded.name
          }`}
          description={
            <p>
              Habías planeado {formatCurrency(topExceeded.planned, preferences.currency)} y ya
              llevas registrados {formatCurrency(topExceeded.spent, preferences.currency)} (+
              {formatCurrency(topExceeded.diff, preferences.currency)} de exceso).
            </p>
          }
          actionButton={{
            label: 'Ajustar presupuesto para el resto del mes',
            onClick: () => setCurrentScreen('presupuesto'),
            colorClass: 'text-red-700',
          }}
        />
      ) : (
        <InsightCard
          variant="green"
          icon={
            <div className="w-8 h-8 rounded-xl bg-[#EBF4EF] text-[#176B45] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          }
          tagText="Presupuesto en orden"
          title="Ninguna categoría ha superado su límite presupuestado"
          description={
            <p>
              Tus gastos en vivienda, servicios y compras se mantienen dentro de los topes
              asignados este mes.
            </p>
          }
        />
      )}

      {/* 4. Progreso del ahorro */}
      <InsightCard
        variant="default"
        icon={
          <div className="w-8 h-8 rounded-xl bg-[#FEF7EE] text-[#F4A340] flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        }
        tagText="Ahorro intencional"
        badgeRight={
          <span className="text-xs text-[#176B45] font-bold">{savingsPct}% de la meta</span>
        }
        title={`Separaste ${formatCurrency(savingsSeparated, preferences.currency)} este mes`}
        description={
          <p>
            Este dinero ya está blindado de tus gastos diarios. Tu meta mensual es de{' '}
            {formatCurrency(savingsMonthlyTarget, preferences.currency)}. Faltan{' '}
            {formatCurrency(
              Math.max(0, savingsMonthlyTarget - savingsSeparated),
              preferences.currency
            )}{' '}
            para completar el 100%.
          </p>
        }
        actionButton={{
          label: 'Ver panel de ahorro',
          onClick: () => setCurrentScreen('ahorro'),
          colorClass: 'text-[#176B45]',
        }}
      />

      {/* 5. Oportunidad de liberación financiera */}
      <InsightCard
        variant="green"
        icon={
          <div className="w-8 h-8 rounded-xl bg-[#EBF4EF] text-[#176B45] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#176B45]" />
          </div>
        }
        tagText="Liberación de dinero"
        title={`Si reduces tus gastos hormiga a la mitad, podrías liberar ${formatCurrency(
          halfHormiga,
          preferences.currency
        )} al mes`}
        description={
          <p>
            Eso representa un acumulado de{' '}
            <strong className="text-[#176B45] font-bold">
              {formatCurrency(halfHormigaAnnual, preferences.currency)} al año
            </strong>{' '}
            que podrías destinar a inversión, amortizar deudas o crear un fondo para imprevistos.
          </p>
        }
      />

      {/* 6. Peak habit discovery */}
      {peakDay && peakDay.total > 0 && (
        <InsightCard
          variant="default"
          icon={
            <div className="w-8 h-8 rounded-xl bg-[#F7F8F6] text-[#202522] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          }
          tagText="Hábito semanal"
          title={`Los ${peakDay.name} concentran la mayor cantidad de microgastos`}
          description={
            <p>
              Durante los {peakDay.name} registraste {peakDay.count} compras pequeñas por un total
              de {formatCurrency(peakDay.total, preferences.currency)} (antojos, pedidos rápidos o
              traslados). Tomar conciencia de este día te ayudará a prevenir salidas innecesarias.
            </p>
          }
        />
      )}
    </div>
  );
};
