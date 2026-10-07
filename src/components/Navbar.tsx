import React from 'react';
import { Plus, User, Sparkles } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Screen } from '../types/finance';
import { HormigaLogo } from './HormigaLogo';

export const Navbar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    openRegisterModal,
    preferences,
  } = useFinance();

  const navLinks: { screen: Screen; label: string }[] = [
    { screen: 'mi_mes', label: 'Mi Mes' },
    { screen: 'presupuesto', label: 'Presupuesto' },
    { screen: 'gastos_hormiga', label: 'Gastos Hormiga' },
    { screen: 'analisis', label: 'Análisis' },
    { screen: 'pagos', label: 'Pagos' },
    { screen: 'ahorro', label: 'Ahorro' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8ECE6] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-3">
          <HormigaLogo
            size="md"
            showText={true}
            onClick={() => setCurrentScreen('mi_mes')}
          />
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(({ screen, label }) => {
            const isActive = currentScreen === screen;
            return (
              <button
                key={screen}
                onClick={() => setCurrentScreen(screen)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#176B45] bg-[#EBF4EF] font-semibold'
                    : 'text-[#68716B] hover:text-[#202522] hover:bg-black/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Discoveries badge / button on desktop */}
          <button
            onClick={() => setCurrentScreen('descubrimientos')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              currentScreen === 'descubrimientos'
                ? 'bg-[#FEF7EE] text-[#C97E25] border-[#F4A340]/40'
                : 'bg-white text-[#202522] border-[#E8ECE6] hover:bg-[#F7F8F6]'
            }`}
            title="Descubrimientos del mes"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F4A340]" />
            <span>Descubrimientos</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={openRegisterModal}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#202522] bg-[#F4A340] hover:bg-[#E08F2D] active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Registrar gasto</span>
          </button>

          {/* User profile / settings link */}
          <button
            onClick={() => setCurrentScreen('mi_cuenta')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
              currentScreen === 'mi_cuenta'
                ? 'bg-[#EBF4EF] text-[#176B45] border-[#176B45]/30'
                : 'bg-white text-[#68716B] border-[#E8ECE6] hover:text-[#202522] hover:bg-[#F7F8F6]'
            }`}
            title={`Cuenta de ${preferences.name}`}
            aria-label="Mi Cuenta"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
