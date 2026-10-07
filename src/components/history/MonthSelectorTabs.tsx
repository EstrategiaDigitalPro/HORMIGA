import React from 'react';
import { MonthData } from '../../types/finance';

interface MonthSelectorTabsProps {
  months: MonthData[];
  selectedKey: string;
  currentMonthKey: string;
  onSelect: (key: string) => void;
}

export const MonthSelectorTabs: React.FC<MonthSelectorTabsProps> = ({
  months,
  selectedKey,
  currentMonthKey,
  onSelect,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
      {months.map((m) => {
        const isSelected = m.monthKey === selectedKey;
        const isCurrent = m.monthKey === currentMonthKey;
        return (
          <button
            key={m.monthKey}
            onClick={() => onSelect(m.monthKey)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
              isSelected
                ? 'bg-[#176B45] text-white border-[#176B45] shadow-xs'
                : 'bg-white text-[#202522] border-[#E8ECE6] hover:bg-[#F7F8F6]'
            }`}
          >
            <span>{m.monthLabel}</span>
            {isCurrent && (
              <span
                className={`ml-1.5 text-[10px] ${
                  isSelected ? 'text-white/80' : 'text-[#176B45]'
                }`}
              >
                (Actual)
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
