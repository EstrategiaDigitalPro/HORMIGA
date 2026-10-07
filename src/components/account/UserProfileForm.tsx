import React, { useState } from 'react';
import { User, Globe, DollarSign, Check, Loader2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CURRENCIES } from '../../utils/currency';

interface UserProfileFormProps {
  onSaved: () => void;
}

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSaved }) => {
  const { preferences, updatePreferences } = useFinance();

  const [name, setName] = useState(preferences.name);
  const [email, setEmail] = useState(preferences.email);
  const [country, setCountry] = useState(preferences.country);
  const [currency, setCurrency] = useState(preferences.currency);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const currObj = CURRENCIES[currency] || CURRENCIES.CLP;
      updatePreferences({
        name: name.trim() || 'Camila',
        email: email.trim() || 'camila@ejemplo.com',
        country,
        currency,
        currencySymbol: currObj.symbol,
      });
      setIsSaving(false);
      onSaved();
    }, 300);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-5"
    >
      <h2 className="text-base font-bold text-[#202522] flex items-center gap-2">
        <User className="w-4 h-4 text-[#176B45]" />
        <span>Datos del titular</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Nombre completo</label>
          <input
            type="text"
            inputMode="text"
            autoCapitalize="words"
            placeholder="Escribe tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522]">Correo electrónico</label>
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Ej: camila.morales@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#68716B]" />
            <span>País de residencia</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden cursor-pointer"
          >
            <option value="Chile">Chile</option>
            <option value="México">México</option>
            <option value="Colombia">Colombia</option>
            <option value="Argentina">Argentina</option>
            <option value="España">España</option>
            <option value="Perú">Perú</option>
            <option value="Estados Unidos">Estados Unidos</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#202522] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#68716B]" />
            <span>Moneda principal</span>
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E8ECE6] rounded-xl focus:border-[#176B45] focus:outline-hidden cursor-pointer"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full min-h-[50px] py-3.5 bg-[#176B45] hover:bg-[#125537] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando cambios...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Guardar cambios</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
