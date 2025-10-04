import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useLazyGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useSubmitExpenseMutation,
} from '@store/api/expensesApi';
import type { Expense, ExpenseFormData } from '@types/expense.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

interface UseExpensesOptions {
  status?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

export const useExpenses = (options: UseExpensesOptions = {}) => {
  const { notifyError, notifySuccess } = useNotificationContext();
  const [queryParams, setQueryParams] = useState(() => ({
    status: options.status,
    categoryId: options.categoryId,
    startDate: options.startDate,
    endDate: options.endDate,
  }));

  const [fetchExpensesTrigger, { data, isFetching, isLoading, isUninitialized }] = useLazyGetExpensesQuery();
  const [createExpenseMutation, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpenseMutation, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpenseMutation, { isLoading: isDeleting }] = useDeleteExpenseMutation();
  const [submitExpenseMutation, { isLoading: isSubmitting }] = useSubmitExpenseMutation();

  const [error, setError] = useState<string | null>(null);

  const triggerFetch = useCallback(
    async (params = queryParams) => {
      try {
        setError(null);
        await fetchExpensesTrigger(params).unwrap();
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [fetchExpensesTrigger, notifyError, queryParams],
  );

  useEffect(() => {
    const nextParams = {
      status: options.status,
      categoryId: options.categoryId,
      startDate: options.startDate,
      endDate: options.endDate,
    };
    setQueryParams(nextParams);
    if (options.autoFetch !== false) {
      triggerFetch(nextParams).catch(() => undefined);
    }
  }, [options.status, options.categoryId, options.startDate, options.endDate, options.autoFetch, triggerFetch]);

  const refetch = useCallback(() => triggerFetch(queryParams), [triggerFetch, queryParams]);

  const safeMutation = useCallback(
    async <T,>(mutation: () => Promise<T>, successMessage: string) => {
      try {
        setError(null);
        const result = await mutation();
        notifySuccess(successMessage);
        await refetch();
        return result;
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
        notifyError(message);
        throw err;
      }
    },
    [notifyError, notifySuccess, refetch],
  );

  const createExpense = useCallback(
    (payload: ExpenseFormData) => safeMutation(() => createExpenseMutation(payload).unwrap(), 'Expense created successfully'),
    [createExpenseMutation, safeMutation],
  );

  const updateExpense = useCallback(
    (id: string, payload: Partial<ExpenseFormData>) =>
      safeMutation(() => updateExpenseMutation({ id, data: payload }).unwrap(), 'Expense updated successfully'),
    [safeMutation, updateExpenseMutation],
  );

  const deleteExpense = useCallback(
    (id: string) => safeMutation(() => deleteExpenseMutation(id).unwrap(), 'Expense deleted successfully'),
    [deleteExpenseMutation, safeMutation],
  );

  const submitExpense = useCallback(
    (id: string) => safeMutation(() => submitExpenseMutation(id).unwrap(), 'Expense submitted for approval'),
    [safeMutation, submitExpenseMutation],
  );

  const expenses: Expense[] = useMemo(() => data?.expenses ?? [], [data?.expenses]);

  const loading =
    isFetching ||
    isLoading ||
    isCreating ||
    isUpdating ||
    isDeleting ||
    isSubmitting ||
    (!data && !error && !isUninitialized && isFetching);

  return {
    expenses,
    loading,
    error,
    fetchExpenses: refetch,
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
  };
};
