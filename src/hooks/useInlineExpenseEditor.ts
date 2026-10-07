import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export function useInlineExpenseEditor() {
  const { updateExpense } = useFinance();
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');

  const startEditing = (id: string, currentName: string) => {
    setEditingExpenseId(id);
    setEditingName(currentName);
  };

  const cancelEditing = () => {
    setEditingExpenseId(null);
    setEditingName('');
  };

  const saveEditing = (id: string) => {
    const trimmed = editingName.trim();
    if (trimmed) {
      updateExpense(id, { description: trimmed });
    }
    setEditingExpenseId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      saveEditing(id);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return {
    editingExpenseId,
    editingName,
    setEditingName,
    startEditing,
    cancelEditing,
    saveEditing,
    handleKeyDown,
  };
}
