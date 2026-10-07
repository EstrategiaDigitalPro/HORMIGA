import React from 'react';
import { ArrowRight } from 'lucide-react';

interface InsightCardProps {
  icon: React.ReactNode;
  tagText: string;
  badgeRight?: React.ReactNode;
  title: string;
  description: React.ReactNode;
  actionButton?: {
    label: string;
    onClick: () => void;
    colorClass?: string;
  };
  variant?: 'default' | 'amber' | 'green' | 'danger';
}

export const InsightCard: React.FC<InsightCardProps> = ({
  icon,
  tagText,
  badgeRight,
  title,
  description,
  actionButton,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-white border-[#E8ECE6]',
    amber: 'bg-white border-[#F4A340]/40 bg-gradient-to-br from-white to-[#FEF7EE]/30',
    green: 'bg-white border-[#176B45]/30 bg-gradient-to-br from-white to-[#EBF4EF]/40',
    danger: 'bg-white border-red-200 bg-red-50/30',
  };

  const tagColorStyles = {
    default: 'text-[#68716B]',
    amber: 'text-[#C97E25]',
    green: 'text-[#176B45]',
    danger: 'text-red-600',
  };

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border shadow-2xs space-y-3 transition-colors ${
        variantStyles[variant]
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              tagColorStyles[variant]
            }`}
          >
            {tagText}
          </span>
        </div>
        {badgeRight && <div>{badgeRight}</div>}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-[#202522] tracking-tight">
        {title}
      </h3>

      <div className="text-xs sm:text-sm text-[#68716B] leading-relaxed">
        {description}
      </div>

      {actionButton && (
        <div className="pt-2">
          <button
            onClick={actionButton.onClick}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold hover:underline cursor-pointer ${
              actionButton.colorClass || 'text-[#176B45]'
            }`}
          >
            <span>{actionButton.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
