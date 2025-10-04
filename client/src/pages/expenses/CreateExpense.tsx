import React, { useEffect, useState } from 'react';
import { ExpenseForm } from '@components/expenses/ExpenseForm';
import { Category, ExpenseFormData } from '@types/expense.types';
import { expensesService } from '@services/expenses.service';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@hooks/useNotifications';

export const CreateExpense: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useNotifications();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await expensesService.getCategories();
        setCategories(response.data.categories ?? response.data);
      } catch (error) {
        notifyError('Failed to load categories');
      }
    };
    load();
  }, [notifyError]);

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      setSubmitting(true);
      const response = await expensesService.createExpense(data);
      notifySuccess('Expense created');
      const expense = response.data.expense ?? response.data;
      navigate(/expenses/);
    } catch (error) {
      notifyError('Failed to create expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">New expense</h1>
        <p className="text-sm text-neutral-500">Capture spend details, attach receipts, and submit for approval.</p>
      </div>
      <ExpenseForm categories={categories} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
};

export default CreateExpense;
