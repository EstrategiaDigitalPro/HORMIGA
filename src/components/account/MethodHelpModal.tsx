import React from 'react';
import { Modal } from '../common/Modal';

interface MethodHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodHelpModal: React.FC<MethodHelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="El método HORMIGA en 3 pasos"
      maxWidth="max-w-md"
    >
      <div className="space-y-3 text-xs text-[#68716B] leading-relaxed pt-1">
        <p>
          <strong className="text-[#202522] font-semibold block">1. Separa tu ahorro primero:</strong>
          En lugar de ahorrar "lo que sobre a fin de mes", define tu meta mensual y márcala como
          separada apenas recibes tus ingresos.
        </p>
        <p>
          <strong className="text-[#202522] font-semibold block">
            2. Mantén tus obligaciones cubiertas:
          </strong>
          Revisa la pantalla de Pagos para saber exactamente qué boletas o compromisos fijos faltan
          por pagar.
        </p>
        <p>
          <strong className="text-[#202522] font-semibold block">
            3. Vigila los gastos hormiga:
          </strong>
          Anota tus microgastos en segundos con el botón verde central. Notarás de inmediato cómo
          pequeños cafés o compras por impulso afectan tu presupuesto real.
        </p>
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 text-xs font-semibold bg-[#176B45] text-white rounded-xl hover:bg-[#125537] cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </Modal>
  );
};
