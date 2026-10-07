import React, { useState } from 'react';
import { Flame, Coins } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useInlineExpenseEditor } from '../../hooks/useInlineExpenseEditor';
import { ExpenseItemRow } from './ExpenseItemRow';
import { EmptyState } from '../common/EmptyState';

interface MovementsCardProps {
  maxItems?: number;
  showAllLink?: boolean;
}

export const MovementsCard: React.FC<MovementsCardProps> = ({
  maxItems = 7,
  showAllLink = true,
}) => {
  const {
    monthData,
    openRegisterModal,
    deleteExpense,
    setCurrentScreen,
    preferences,
  } = useFinance();

  const [filterType, setFilterType] = useState<'all' | 'hormiga'>('all');

  const {
    editingExpenseId,
    editingName,
    setEditingName,
    startEditing,
    saveEditing,
    handleKeyDown,
  } = useInlineExpenseEditor();

  const filteredExpenses = monthData.expenses
    .filter((e) => (filterType === 'hormiga' ? e.isHormiga : true))
    .slice(0, maxItems);

  const totalFilteredCount = monthData.expenses.filter((e) =>
    filterType === 'hormiga' ? e.isHormiga : true
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#E8ECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#202522]">
            Movimientos de {monthData.monthLabel}
          </h3>
          <p className="text-xs text-[#68716B]">
            Registros y salidas de dinero ordenados cronológicamente
          </p>
        </div>

        {/* Interactive filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#F7F8F6] rounded-xl border border-[#E8ECE6] self-start sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-[#202522] shadow-2xs font-semibold'
                : 'text-[#68716B] hover:text-[#202522]'
            }`}
          >
            Todos ({monthData.expenses.length})
          </button>
          <button
            onClick={() => setFilterType('hormiga')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              filterType === 'hormiga'
                ? 'bg-white text-[#C97E25] shadow-2xs font-semibold'
                : 'text-[#68716B] hover:text-[#202522]'
            }`}
          >
            <Flame className="w-3 h-3 text-[#F4A340]" />
            <span>Solo hormiga ({monthData.expenses.filter((e) => e.isHormiga).length})</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-[#E8ECE6]">
        {filteredExpenses.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Coins className="w-5 h-5 text-[#176B45]" />}
              title={
                filterType === 'hormiga'
                  ? 'No tienes gastos hormiga registrados'
                  : 'Aún no tienes movimientos registrados'
              }
              description={
                filterType === 'hormiga'
                  ? 'Los pequeños consumos que marques como hormiga se clasificarán aquí.'
                  : 'Registra tus compras cotidianas o pagos del mes para comenzar a tener control de tus finanzas.'
              }
              actionLabel="Registrar primer gasto"
              onAction={openRegisterModal}
            />
          </div>
        ) : (
          filteredExpenses.map((exp) => (
            <ExpenseItemRow
              key={exp.id}
              expense={exp}
              isEditing={editingExpenseId === exp.id}
              editingName={editingName}
              onStartEdit={() => startEditing(exp.id, exp.description)}
              onNameChange={setEditingName}
              onSaveEdit={() => saveEditing(exp.id)}
              onKeyDown={(e) => handleKeyDown(e, exp.id)}
              onDelete={() => deleteExpense(exp.id)}
              currencyCode={preferences.currency}
              focusColor={exp.isHormiga ? 'amber' : 'green'}
            />
          ))
        )}
      </div>

      {showAllLink && monthData.expenses.length > maxItems && (
        <div className="p-3 bg-[#F7F8F6] text-center border-t border-[#E8ECE6]">
          <button
            onClick={() => setCurrentScreen('analisis')}
            className="text-xs font-semibold text-[#176B45] hover:underline cursor-pointer"
          >
            Ver análisis completo y todos los {monthData.expenses.length} movimientos →
          </button>
        </div>
      )}
    </div>
  );
};
