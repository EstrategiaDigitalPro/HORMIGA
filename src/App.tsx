import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { RegisterExpenseModal } from './components/RegisterExpenseModal';

import { MiMesScreen } from './screens/MiMesScreen';
import { IngresosScreen } from './screens/IngresosScreen';
import { AhorroScreen } from './screens/AhorroScreen';
import { PresupuestoScreen } from './screens/PresupuestoScreen';
import { PagosScreen } from './screens/PagosScreen';
import { GastosHormigaScreen } from './screens/GastosHormigaScreen';
import { AnalisisScreen } from './screens/AnalisisScreen';
import { DescubrimientosScreen } from './screens/DescubrimientosScreen';
import { HistorialScreen } from './screens/HistorialScreen';
import { MiCuentaScreen } from './screens/MiCuentaScreen';

import { OfflineBanner } from './components/common/OfflineBanner';

const MainContent: React.FC = () => {
  const { currentScreen } = useFinance();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'mi_mes':
        return <MiMesScreen />;
      case 'ingresos':
        return <IngresosScreen />;
      case 'ahorro':
        return <AhorroScreen />;
      case 'presupuesto':
        return <PresupuestoScreen />;
      case 'pagos':
        return <PagosScreen />;
      case 'gastos_hormiga':
        return <GastosHormigaScreen />;
      case 'analisis':
        return <AnalisisScreen />;
      case 'descubrimientos':
        return <DescubrimientosScreen />;
      case 'historial':
        return <HistorialScreen />;
      case 'mi_cuenta':
        return <MiCuentaScreen />;
      default:
        return <MiMesScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#202522] flex flex-col font-sans">
      {/* Offline Alert Banner */}
      <OfflineBanner />

      {/* Desktop / Tablet Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-28 lg:pb-12">
        {renderScreen()}
      </main>

      {/* Quick Register Expense Modal */}
      <RegisterExpenseModal />

      {/* Compact Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
