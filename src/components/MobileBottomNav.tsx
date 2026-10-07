import React from 'react';
import { Home, PieChart, Plus, Flame, BarChart3 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Screen } from '../types/finance';

export const MobileBottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, openRegisterModal } = useFinance();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8ECE6] safe-area-pb">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* 1. Inicio */}
        <button
          onClick={() => setCurrentScreen('mi_mes')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
            currentScreen === 'mi_mes'
              ? 'text-[#176B45]'
              : 'text-[#68716B] hover:text-[#202522]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentScreen === 'mi_mes' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Inicio</span>
        </button>

        {/* 2. Presupuesto */}
        <button
          onClick={() => setCurrentScreen('presupuesto')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
            currentScreen === 'presupuesto'
              ? 'text-[#176B45]'
              : 'text-[#68716B] hover:text-[#202522]'
          }`}
        >
          <PieChart className={`w-5 h-5 ${currentScreen === 'presupuesto' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Presupuesto</span>
        </button>

        {/* 3. + Gasto (Prominent Center Button) */}
        <div className="flex items-center justify-center">
          <button
            onClick={openRegisterModal}
            className="flex items-center justify-center w-12 h-12 -mt-3 rounded-full bg-[#F4A340] text-[#202522] shadow-md shadow-[#F4A340]/25 border-2 border-white hover:bg-[#E08F2D] active:scale-95 transition-transform cursor-pointer"
            aria-label="Registrar nuevo gasto"
            title="Registrar gasto"
          >
            <Plus className="w-6 h-6 stroke-[2.6]" />
          </button>
        </div>

        {/* 4. Hormiga */}
        <button
          onClick={() => setCurrentScreen('gastos_hormiga')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
            currentScreen === 'gastos_hormiga'
              ? 'text-[#F4A340] font-semibold'
              : 'text-[#68716B] hover:text-[#202522]'
          }`}
        >
          <Flame className={`w-5 h-5 ${currentScreen === 'gastos_hormiga' ? 'text-[#F4A340] fill-[#F4A340]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Hormiga</span>
        </button>

        {/* 5. Análisis */}
        <button
          onClick={() => setCurrentScreen('analisis')}
          className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors cursor-pointer ${
            currentScreen === 'analisis'
              ? 'text-[#176B45]'
              : 'text-[#68716B] hover:text-[#202522]'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${currentScreen === 'analisis' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Análisis</span>
        </button>
      </div>
    </nav>
  );
};
