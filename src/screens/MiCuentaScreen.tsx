import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { UserProfileForm } from '../components/account/UserProfileForm';
import { DataBackupCard } from '../components/account/DataBackupCard';
import { ActiveSessionCard } from '../components/account/ActiveSessionCard';
import { MethodHelpModal } from '../components/account/MethodHelpModal';
import { useDisclosure } from '../hooks/useDisclosure';

export const MiCuentaScreen: React.FC = () => {
  const [savedToast, setSavedToast] = useState(false);
  const helpModal = useDisclosure(false);

  const showSuccessToast = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Reusable Header */}
      <ScreenHeader subtitle="Ajustes personales" />

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Mi cuenta
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          Configuración básica y preferencias de tu gestor de dinero
        </p>
      </div>

      {/* 1. Main Settings Form */}
      <UserProfileForm onSaved={showSuccessToast} />

      {/* 2. Data Backup & Restore */}
      <DataBackupCard
        onSuccessToast={showSuccessToast}
        onOpenHelp={helpModal.open}
      />

      {/* 3. Sign Out Card */}
      <ActiveSessionCard />

      {/* Help Modal */}
      <MethodHelpModal isOpen={helpModal.isOpen} onClose={helpModal.close} />

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#176B45] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Preferencias guardadas correctamente</span>
        </div>
      )}
    </div>
  );
};
