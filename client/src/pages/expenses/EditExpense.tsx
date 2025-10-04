import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseForm } from '@components/expenses/ExpenseForm';
import { Category, ExpenseFormData, Expense } from '@types/expense.types';
import { expensesService } from '@services/expenses.service';
import { useNotifications } from '@hooks/useNotifications';

export const EditExpense: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { notifyError, notifySuccess } = useNotifications();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [expenseResponse, categoriesResponse] = await Promise.all([
          expensesService.getExpense(id),
          expensesService.getCategories(),
        ]);
        setExpense(expenseResponse.data.expense ?? expenseResponse.data);
        setCategories(categoriesResponse.data.categories ?? categoriesResponse.data);
      } catch (error) {
        notifyError('Failed to load expense');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, notifyError]);

  const handleSubmit = async (data: ExpenseFormData) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await expensesService.updateExpense(id, data);
      notifySuccess('Expense updated');
      navigate(/expenses/);
    } catch (error) {
      notifyError('Failed to update expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !expense) {
    return <p>Loading expense...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Edit expense</h1>
        <p className="text-sm text-neutral-500">Adjust details and resubmit for approval if required.</p>
      </div>
      <ExpenseForm categories={categories} onSubmit={handleSubmit} submitting={submitting} initialValues={expense} />
    </div>
  );
};

export default EditExpense;
