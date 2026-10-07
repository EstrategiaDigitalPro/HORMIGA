import React, { useMemo } from 'react';
import { formatCurrency } from '../../utils/currency';

export interface CategorySpendingItem {
  name: string;
  actual: number;
  planned: number;
  percentageOfTotalSpent: number;
  percentageOfPlanned: number;
  color: string;
}

interface DonutChartProps {
  categories: CategorySpendingItem[];
  totalSpent: number;
  currencyCode: string;
}

const DEFAULT_COLORS = ['#176B45', '#F4A340', '#2563EB', '#8B5CF6', '#EC4899', '#0891B2', '#68716B'];

export const DonutChart: React.FC<DonutChartProps> = ({
  categories,
  totalSpent,
  currencyCode,
}) => {
  const donutSlices = useMemo(() => {
    let accumulatedAngle = 0;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;

    return categories.map((cat, idx) => {
      const slicePercent = totalSpent > 0 ? cat.actual / totalSpent : 0;
      const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
      const strokeDashoffset = -(accumulatedAngle * circumference);
      accumulatedAngle += slicePercent;

      return {
        ...cat,
        color: cat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categories, totalSpent]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      {/* Donut SVG */}
      <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
        <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
          <circle
            cx="70"
            cy="70"
            r="54"
            fill="none"
            stroke="#F7F8F6"
            strokeWidth="14"
          />
          {donutSlices.map((slice, i) => (
            <circle
              key={i}
              cx="70"
              cy="70"
              r="54"
              fill="none"
              stroke={slice.color}
              strokeWidth="14"
              strokeDasharray={slice.strokeDasharray}
              strokeDashoffset={slice.strokeDashoffset}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xs text-[#68716B] font-medium">Total gastado</span>
          <span className="text-sm font-extrabold text-[#202522] num-tabular">
            {formatCurrency(totalSpent, currencyCode)}
          </span>
        </div>
      </div>

      {/* Category List with Proportional Bars */}
      <div className="md:col-span-7 space-y-3">
        {categories.map((cat, idx) => {
          const isHormiga = cat.name === 'Gastos hormiga';
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-[#202522]">{cat.name}</span>
                  {isHormiga && (
                    <span className="text-[10px] text-[#C97E25] bg-[#FEF7EE] px-1.5 py-0.2 rounded-sm font-semibold">
                      Microgastos
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 num-tabular">
                  <span className="font-extrabold text-[#202522]">
                    {formatCurrency(cat.actual, currencyCode)}
                  </span>
                  <span className="text-[#68716B] font-medium w-10 text-right">
                    {Math.round(cat.percentageOfTotalSpent)}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#F7F8F6] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentageOfTotalSpent}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
