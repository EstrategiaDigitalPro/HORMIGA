import React from 'react';
import { LogOut } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const ActiveSessionCard: React.FC = () => {
  const { preferences, setCurrentScreen } = useFinance();

  const handleSignOut = () => {
    if (
      window.confirm(
        '¿Deseas cerrar tu sesión? Tus datos locales se conservarán para tu próximo ingreso.'
      )
    ) {
      setCurrentScreen('mi_mes');
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E8ECE6] shadow-2xs flex items-center justify-between">
      <div>
        <span className="text-xs font-bold text-[#202522] block">Sesión activa</span>
        <span className="text-[11px] text-[#68716B]">Conectado como {preferences.email}</span>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Cerrar sesión</span>
      </button>
    </div>
  );
};
