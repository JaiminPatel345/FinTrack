import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseForm } from '@components/expenses/ExpenseForm';
import { Category, ExpenseFormData, Expense } from '@types/expense.types';
import { useNotifications } from '@hooks/useNotifications';
import {
  useGetExpenseQuery,
  useGetCategoriesQuery,
  useUpdateExpenseMutation,
} from '@store/api/expensesApi';
import { handleApiError } from '@utils/helpers';

export const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notifyError, notifySuccess } = useNotifications();

  const { data: expense, isFetching: isLoadingExpense } = useGetExpenseQuery(id!, {
    skip: !id,
  });
  const { data: categoryResponse, isFetching: isLoadingCategories } = useGetCategoriesQuery();
  const [updateExpenseMutation, { isLoading: isUpdating }] = useUpdateExpenseMutation();

  const categories = useMemo<Category[]>(() => categoryResponse?.categories ?? [], [categoryResponse?.categories]);

  const handleSubmit = async (data: ExpenseFormData) => {
    if (!id) return;
    try {
      await updateExpenseMutation({ id, data }).unwrap();
      notifySuccess('Expense updated');
      navigate('/expenses');
    } catch (error) {
      notifyError(handleApiError(error));
    }
  };

  if (!id || isLoadingExpense || !expense) {
    return <p>Loading expense...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Edit expense</h1>
        <p className="text-sm text-neutral-500">Adjust details and resubmit for approval if required.</p>
      </div>
      <ExpenseForm
        categories={categories}
        onSubmit={handleSubmit}
        submitting={isUpdating}
        initialValues={expense as Expense}
        loadingCategories={isLoadingCategories}
      />
    </div>
  );
};

export default EditExpense;
