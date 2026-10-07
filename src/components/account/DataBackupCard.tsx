import React from 'react';
import { Download, Upload, RefreshCw, HelpCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface DataBackupCardProps {
  onSuccessToast: () => void;
  onOpenHelp: () => void;
}

export const DataBackupCard: React.FC<DataBackupCardProps> = ({
  onSuccessToast,
  onOpenHelp,
}) => {
  const { preferences, monthData, pastMonths, resetToInitialData, importUserData } = useFinance();

  const handleExportData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      preferences,
      monthData,
      pastMonths,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hormiga_respaldo_${monthData.monthKey}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = importUserData(text);
          if (success) {
            onSuccessToast();
          }
        }
      };
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Restaurar los datos de ejemplo predeterminados?')) {
      resetToInitialData();
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-4">
      <h2 className="text-base font-bold text-[#202522]">Respaldo de tu información</h2>
      <p className="text-xs text-[#68716B]">
        Tus datos se guardan de forma privada y local en tu navegador. Puedes descargarlos o
        transferirlos cuando desees.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleExportData}
          className="p-3 bg-[#F7F8F6] hover:bg-[#EBF4EF] border border-[#E8ECE6] rounded-xl text-left transition-colors flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#176B45] shrink-0 border border-[#E8ECE6]">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#202522] block group-hover:text-[#176B45]">
              Exportar datos (JSON)
            </span>
            <span className="text-[11px] text-[#68716B]">Copia de seguridad</span>
          </div>
        </button>

        <label className="p-3 bg-[#F7F8F6] hover:bg-[#EBF4EF] border border-[#E8ECE6] rounded-xl text-left transition-colors flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#176B45] shrink-0 border border-[#E8ECE6]">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#202522] block group-hover:text-[#176B45]">
              Importar respaldo
            </span>
            <span className="text-[11px] text-[#68716B]">Cargar archivo previo</span>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="sr-only"
          />
        </label>
      </div>

      <div className="pt-2 border-t border-[#E8ECE6] flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-[#68716B] hover:text-[#202522] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar datos de demostración</span>
        </button>

        <button
          type="button"
          onClick={onOpenHelp}
          className="inline-flex items-center gap-1.5 text-xs text-[#176B45] font-semibold hover:underline cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ayuda sobre el método</span>
        </button>
      </div>
    </div>
  );
};
