import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-10 text-center flex flex-col items-center justify-center space-y-3 bg-[#F7F8F6]/50 rounded-2xl border border-dashed border-[#E8ECE6] ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#176B45] border border-[#E8ECE6] shadow-2xs">
          {icon}
        </div>
      )}

      <div className="max-w-sm space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-[#202522]">{title}</h4>
        <p className="text-xs sm:text-sm text-[#68716B] leading-relaxed">{description}</p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#176B45] hover:bg-[#125537] active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{actionLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};
