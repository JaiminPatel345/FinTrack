import React, { useMemo } from 'react';
import { ExpenseForm } from '@components/expenses/ExpenseForm';
import { Category, ExpenseFormData } from '@types/expense.types';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@hooks/useNotifications';
import { useCreateExpenseMutation, useGetCategoriesQuery } from '@store/api/expensesApi';
import { handleApiError } from '@utils/helpers';

export const CreateExpense: React.FC = () => {
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useNotifications();

  const { data: categoryResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [createExpenseMutation, { isLoading: isCreating }] = useCreateExpenseMutation();

  const categories = useMemo<Category[]>(() => categoryResponse?.categories ?? [], [categoryResponse?.categories]);

  const handleSubmit = async (data: ExpenseFormData) => {
    try {
      await createExpenseMutation(data).unwrap();
      notifySuccess('Expense created');
      navigate('/expenses');
    } catch (error) {
      notifyError(handleApiError(error));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">New expense</h1>
        <p className="text-sm text-neutral-500">Capture spend details, attach receipts, and submit for approval.</p>
      </div>
      <ExpenseForm categories={categories} onSubmit={handleSubmit} submitting={isCreating} loadingCategories={isLoadingCategories} />
    </div>
  );
};

export default CreateExpense;
