import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Expense } from '@types/expense.types';
import { ExpenseCard } from './ExpenseCard';
import { Loader } from '@components/common/Loader';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  onEdit?: (expense: Expense) => void;
  onSubmit?: (expenseId: string) => void;
  onDelete?: (expenseId: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, loading, onEdit, onSubmit, onDelete }) => {
  if (loading) {
    return <Loader label="Loading expenses" />;
  }

  if (expenses.length === 0) {
    return (
      <div className="card text-center text-neutral-500">
        <h3 className="text-lg font-semibold text-neutral-800">No expenses yet</h3>
        <p className="mt-2 text-sm">
          Track business spend by adding your first expense. Upload receipts and submit for approval in minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onSubmit={onSubmit}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
