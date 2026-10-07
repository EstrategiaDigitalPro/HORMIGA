import React, { useState } from 'react';
import { CheckCircle2, Clock, Plus, Receipt } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/currency';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { PaymentItemRow } from '../components/pagos/PaymentItemRow';
import { AddPaymentModal } from '../components/pagos/AddPaymentModal';
import { useDisclosure } from '../hooks/useDisclosure';
import { EmptyState } from '../components/common/EmptyState';

export const PagosScreen: React.FC = () => {
  const {
    monthData,
    preferences,
    completedPaymentsCount,
    pendingPaymentsCount,
    pendingPaymentsAmount,
    togglePaymentPaid,
    addPayment,
    deletePayment,
  } = useFinance();

  const addModal = useDisclosure(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const filteredPayments = monthData.payments.filter((p) => {
    if (filter === 'pending') return !p.isPaid;
    if (filter === 'paid') return p.isPaid;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <ScreenHeader subtitle={monthData.monthLabel} />

      {/* Screen Title (Exact match with button) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202522] tracking-tight">
          Pagos
        </h1>
        <p className="text-xs sm:text-sm text-[#68716B] mt-0.5">
          Controla tus obligaciones fijas y servicios pendientes del mes
        </p>
      </div>

      {/* Top Banner: Completed vs Pending Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8ECE6] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#176B45] uppercase tracking-wider">
            <Receipt className="w-4 h-4" />
            <span>Resumen de obligaciones</span>
          </div>
          <span className="text-xs text-[#68716B]">
            {monthData.payments.length} compromisos registrados
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          {/* Completed count */}
          <div className="p-4 rounded-xl bg-[#EBF4EF] border border-[#176B45]/20 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B45]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pagados</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#202522] num-tabular">
              {completedPaymentsCount}
            </div>
            <div className="text-[11px] text-[#68716B]">
              Compromisos ya cancelados
            </div>
          </div>

          {/* Pending count & amount */}
          <div className="p-4 rounded-xl bg-[#FEF7EE] border border-[#F4A340]/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C97E25]">
              <Clock className="w-4 h-4" />
              <span>Pendientes</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#202522] num-tabular">
              {pendingPaymentsCount}
            </div>
            <div className="text-[11px] text-[#C97E25] font-semibold num-tabular">
              Resta: {formatCurrency(pendingPaymentsAmount, preferences.currency)}
            </div>
          </div>
        </div>
      </div>

      {/* Payments List Container */}
      <div className="bg-white rounded-2xl border border-[#E8ECE6] shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E8ECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#202522]">Pagos recurrentes</h2>
            <p className="text-xs text-[#68716B]">
              Toca para marcar o desmarcar cada pago realizado
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-[#F7F8F6] rounded-xl border border-[#E8ECE6]">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white text-[#202522] shadow-2xs font-semibold'
                    : 'text-[#68716B] hover:text-[#202522]'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filter === 'pending'
                    ? 'bg-white text-[#C97E25] shadow-2xs font-semibold'
                    : 'text-[#68716B] hover:text-[#202522]'
                }`}
              >
                Pendientes ({pendingPaymentsCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('paid')}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filter === 'paid'
                    ? 'bg-white text-[#176B45] shadow-2xs font-semibold'
                    : 'text-[#68716B] hover:text-[#202522]'
                }`}
              >
                Pagados ({completedPaymentsCount})
              </button>
            </div>
          </div>
        </div>

        {/* List items or EmptyState */}
        {filteredPayments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Receipt className="w-5 h-5 text-[#176B45]" />}
              title={
                filter === 'all'
                  ? 'No tienes pagos registrados este mes'
                  : filter === 'pending'
                  ? '¡Genial! No tienes pagos pendientes'
                  : 'Aún no has marcado ningún pago como realizado'
              }
              description={
                filter === 'all'
                  ? 'Agrega compromisos como arriendo, internet, seguro o créditos para recordar sus fechas de vencimiento.'
                  : filter === 'pending'
                  ? 'Todos tus compromisos del mes se encuentran al día y pagados.'
                  : 'Cuando pagues una cuenta, márcala aquí para actualizar tus cuentas de inmediato.'
              }
              actionLabel={filter === 'all' ? 'Agregar primer pago' : undefined}
              onAction={filter === 'all' ? addModal.open : undefined}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#E8ECE6]">
            {filteredPayments.map((p) => (
              <PaymentItemRow
                key={p.id}
                payment={p}
                currencyCode={preferences.currency}
                onTogglePaid={togglePaymentPaid}
                onDelete={deletePayment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumb-friendly action in the lower half of screen */}
      <div className="pt-1">
        <button
          type="button"
          onClick={addModal.open}
          className="w-full min-h-[50px] py-3.5 bg-[#176B45] hover:bg-[#125537] text-white text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Agregar nueva obligación o pago</span>
        </button>
      </div>

      {/* Add Recurring Payment Modal */}
      <AddPaymentModal
        isOpen={addModal.isOpen}
        onClose={addModal.close}
        onAdd={addPayment}
        currencySymbol={preferences.currencySymbol}
      />
    </div>
  );
};
