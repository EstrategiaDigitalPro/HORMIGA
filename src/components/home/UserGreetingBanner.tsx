import React, { useState, useEffect } from 'react';
import { User, Sparkles, Edit3, Check } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatExactDateSpanish } from '../../utils/currency';

export const UserGreetingBanner: React.FC = () => {
  const { preferences, updatePreferences } = useFinance();
  const [userNameInput, setUserNameInput] = useState<string>(preferences.name || '');
  const [isEditingUserName, setIsEditingUserName] = useState<boolean>(false);

  useEffect(() => {
    setUserNameInput(preferences.name || '');
  }, [preferences.name]);

  const handleSaveName = () => {
    const trimmed = userNameInput.trim();
    if (trimmed) {
      updatePreferences({ name: trimmed });
    } else {
      setUserNameInput(preferences.name || '');
    }
    setIsEditingUserName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setUserNameInput(preferences.name || '');
      setIsEditingUserName(false);
    }
  };

  const firstName = preferences.name?.trim().split(' ')[0] || preferences.name?.trim() || '';
  const exactDate = formatExactDateSpanish();

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8ECE6] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EBF4EF] to-[#d8ede0] text-[#176B45] flex items-center justify-center shrink-0 border border-[#176B45]/20 shadow-2xs">
          <User className="w-5 h-5 stroke-[2.3]" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#176B45] uppercase tracking-wider">
              Bienvenido a HORMIGA
            </span>
            <span className="text-xs text-[#68716B]" aria-hidden="true">·</span>
            <span className="text-[11px] text-[#68716B] font-medium capitalize">
              {exactDate}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-extrabold text-[#202522] tracking-tight">
              ¡Hola,
            </span>

            {isEditingUserName ? (
              <div className="inline-flex items-center gap-1.5">
                <input
                  type="text"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleNameKeyDown}
                  placeholder="Escribe tu nombre..."
                  autoFocus
                  className="text-xl sm:text-2xl font-extrabold text-[#176B45] bg-[#EBF4EF]/80 px-2.5 py-0.5 rounded-xl border-2 border-[#176B45] focus:outline-hidden min-w-[150px] max-w-[260px]"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1.5 bg-[#176B45] hover:bg-[#125537] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                  title="Guardar nombre"
                  aria-label="Guardar nombre"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingUserName(true)}
                className="inline-flex items-center gap-1.5 text-xl sm:text-2xl font-extrabold text-[#176B45] hover:text-[#125537] border-b-2 border-dashed border-[#176B45]/40 hover:border-[#176B45] transition-all px-1 py-0.5 cursor-pointer rounded-sm group text-left"
                title="Haz clic para escribir o cambiar tu nombre"
              >
                <span>{preferences.name || 'Escribe tu nombre'}</span>
                <Edit3 className="w-3.5 h-3.5 text-[#176B45]/60 group-hover:text-[#176B45] transition-colors" />
              </button>
            )}

            <span className="text-xl sm:text-2xl font-extrabold text-[#202522]">
              !
            </span>
          </div>
        </div>
      </div>

      {/* Button: [Nombre], soy HORMIGA tu nueva amiga */}
      <button
        type="button"
        onClick={() => setIsEditingUserName(true)}
        className="flex items-center gap-2 self-start md:self-auto bg-[#FEF7EE] hover:bg-[#FDF2E2] active:scale-98 px-3.5 py-2 rounded-xl border border-[#F4A340]/40 text-xs text-[#202522] shadow-2xs transition-all cursor-pointer group"
        title="Toca para cambiar tu nombre en cualquier momento"
      >
        <Sparkles className="w-4 h-4 text-[#F4A340] shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold text-[#202522]">
          {firstName ? `${firstName}, soy HORMIGA tu nueva amiga` : '¡Soy HORMIGA tu nueva amiga!'}
        </span>
      </button>
    </div>
  );
};
