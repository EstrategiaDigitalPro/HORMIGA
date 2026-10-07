import React from 'react';
import { Coffee, Cookie, UtensilsCrossed, Car, ShoppingBag, Sparkles, Coins } from 'lucide-react';
import { HormigaType, HormigaTypeConfig } from '../../types/finance';
import { formatCurrency } from '../../utils/currency';

interface RankedHormigaTypesProps {
  types: (HormigaTypeConfig & {
    amount: number;
    count: number;
    percentage: number;
  })[];
  currencyCode: string;
}

export const RankedHormigaTypes: React.FC<RankedHormigaTypesProps> = ({
  types,
  currencyCode,
}) => {
  const typeIcons: Record<HormigaType, React.ReactNode> = {
    cafes: <Coffee className="w-4 h-4 text-[#F4A340]" />,
    snacks: <Cookie className="w-4 h-4 text-[#F59E0B]" />,
    delivery: <UtensilsCrossed className="w-4 h-4 text-[#DC2626]" />,
    transporte_corto: <Car className="w-4 h-4 text-[#2563EB]" />,
    impulso: <ShoppingBag className="w-4 h-4 text-[#8B5CF6]" />,
    suscripciones: <Sparkles className="w-4 h-4 text-[#10B981]" />,
    otros: <Coins className="w-4 h-4 text-[#68716B]" />,
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-[#E8ECE6]">
        <h2 className="text-base font-bold text-[#202522]">
          Ranking de microgastos del mes
        </h2>
        <p className="text-xs text-[#68716B]">
          Ordenados de mayor a menor fuga de dinero
        </p>
      </div>

      <div className="divide-y divide-[#E8ECE6]">
        {types.map((type, idx) => (
          <div
            key={type.id}
            className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-[#F7F8F6]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-xs font-bold text-[#68716B] num-tabular">
                #{idx + 1}
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#FEF7EE] flex items-center justify-center shrink-0">
                {typeIcons[type.id]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#202522]">
                    {type.label}
                  </span>
                  {type.count > 0 && (
                    <span className="text-[11px] text-[#68716B]">
                      ({type.count} {type.count === 1 ? 'vez' : 'veces'})
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#68716B] mt-0.5">
                  {type.example}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-base font-extrabold text-[#202522] num-tabular">
                {formatCurrency(type.amount, currencyCode)}
              </div>
              <div className="text-xs font-medium text-[#C97E25] num-tabular">
                {type.percentage}% del total hormiga
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
