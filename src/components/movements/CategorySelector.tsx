import React from 'react';

const CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Servicios',
  'Vivienda',
  'Salud',
  'Entretenimiento',
  'Compras',
  'Gastos hormiga',
  'Otros',
];

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectHormigaCategory: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectHormigaCategory,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#202522]">
        Categoría para tu presupuesto
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              type="button"
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                if (cat === 'Gastos hormiga') {
                  onSelectHormigaCategory();
                }
              }}
              className={`min-h-[44px] px-2.5 py-2.5 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer truncate active:scale-[0.98] ${
                isSelected
                  ? cat === 'Gastos hormiga'
                    ? 'bg-[#FEF7EE] text-[#C97E25] border-[#F4A340] ring-1 ring-[#F4A340] shadow-2xs'
                    : 'bg-[#EBF4EF] text-[#176B45] border-[#176B45] ring-1 ring-[#176B45] shadow-2xs'
                  : 'bg-white text-[#202522] border-[#E8ECE6] hover:bg-[#F7F8F6]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
