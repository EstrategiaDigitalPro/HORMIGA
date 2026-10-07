import React, { useState } from 'react';
import { Flame, HelpCircle } from 'lucide-react';

interface HormigaToggleCardProps {
  isHormiga: boolean;
  onToggle: (checked: boolean) => void;
}

export const HormigaToggleCard: React.FC<HormigaToggleCardProps> = ({
  isHormiga,
  onToggle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        isHormiga
          ? 'bg-[#FEF7EE] border-[#F4A340]/60 ring-1 ring-[#F4A340]/20'
          : 'bg-white border-[#E8ECE6]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame
            className={`w-4 h-4 ${
              isHormiga ? 'text-[#F4A340] fill-[#F4A340]' : 'text-[#68716B]'
            }`}
          />
          <span className="text-sm font-semibold text-[#202522]">
            ¿Es un gasto hormiga?
          </span>
          <button
            type="button"
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-[#68716B] hover:text-[#202522] p-0.5 cursor-pointer"
            title="¿Qué es un gasto hormiga?"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Toggle switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isHormiga}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#E8ECE6] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4A340]"></div>
        </label>
      </div>

      {showTooltip && (
        <p className="text-xs text-[#68716B] mt-2 pt-2 border-t border-[#F4A340]/20 leading-relaxed">
          Marca esta opción si es un consumo pequeño, impulsivo o no planificado que quieras
          monitorear en la sección de gastos hormiga.
        </p>
      )}
    </div>
  );
};
