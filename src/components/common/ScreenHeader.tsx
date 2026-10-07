import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface ScreenHeaderProps {
  rightContent?: React.ReactNode;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  rightContent,
  subtitle,
  onBack,
  backLabel = 'Volver a Mi Mes',
}) => {
  const { setCurrentScreen, monthData } = useFinance();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setCurrentScreen('mi_mes');
    }
  };

  return (
    <div className="flex items-center justify-between pb-3 border-b border-[#E8ECE6] gap-2">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 min-h-[44px] px-3 py-2 text-xs sm:text-sm font-bold text-[#176B45] hover:text-[#125537] bg-[#EBF4EF] hover:bg-[#176B45]/15 active:scale-[0.98] rounded-xl transition-all cursor-pointer shadow-2xs"
        aria-label={backLabel}
      >
        <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
        <span>{backLabel}</span>
      </button>

      {rightContent ? (
        rightContent
      ) : (
        <span className="text-xs sm:text-sm text-[#68716B] font-medium text-right truncate">
          {subtitle || monthData.monthLabel}
        </span>
      )}
    </div>
  );
};
