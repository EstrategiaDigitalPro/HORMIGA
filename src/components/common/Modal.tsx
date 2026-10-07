import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  variant?: 'center' | 'bottom-sheet';
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
  variant = 'center',
  showCloseButton = true,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const containerClasses =
    variant === 'bottom-sheet'
      ? 'flex items-end sm:items-center justify-center p-0 sm:p-4'
      : 'flex items-center justify-center p-4';

  const cardClasses =
    variant === 'bottom-sheet'
      ? `w-full ${maxWidth} bg-white rounded-t-3xl sm:rounded-2xl shadow-xl border border-[#E8ECE6] overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200`
      : `w-full ${maxWidth} bg-white rounded-2xl shadow-xl border border-[#E8ECE6] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150`;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity ${containerClasses}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={cardClasses}>
        {(title || showCloseButton) && (
          <div
            className={
              variant === 'bottom-sheet'
                ? 'flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#E8ECE6]'
                : 'flex items-center justify-between pb-2 border-b border-[#E8ECE6]/60'
            }
          >
            <div>
              {typeof title === 'string' ? (
                <h3 className="text-base font-bold text-[#202522]">{title}</h3>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-xs text-[#68716B] mt-0.5">{subtitle}</p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#68716B] hover:text-[#202522] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
