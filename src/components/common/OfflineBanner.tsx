import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const OfflineBanner: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  if (!isOnline) {
    return (
      <div className="bg-[#FEF7EE] border-b border-[#F4A340]/40 text-[#202522] px-4 py-2 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
        <WifiOff className="w-3.5 h-3.5 text-[#C97E25] shrink-0" />
        <span>
          <strong>Modo local activo:</strong> Estás sin internet, pero HORMIGA sigue funcionando y
          guardando tus movimientos en tu dispositivo.
        </span>
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div className="bg-[#EBF4EF] border-b border-[#176B45]/30 text-[#176B45] px-4 py-2 text-xs flex items-center justify-center gap-2 animate-in fade-in duration-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#176B45] shrink-0" />
        <span>Conexión a internet restablecida.</span>
      </div>
    );
  }

  return null;
};
