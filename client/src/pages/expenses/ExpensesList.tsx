import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseList } from '@components/expenses/ExpenseList';
import { ExpenseFilters } from '@components/expenses/ExpenseFilters';
import { Button } from '@components/common/Button';
import { useExpenses } from '@hooks/useExpenses';
import { useGetCategoriesQuery } from '@store/api/expensesApi';
import type { Category } from '@types/expense.types';

export const ExpensesList: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = useMemo<Category[]>(() => categoriesResponse?.categories ?? [], [categoriesResponse?.categories]);

  const { expenses, loading, submitExpense, deleteExpense } = useExpenses({
    status,
    categoryId,
    startDate,
    endDate,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Expenses</h1>
          <p className="text-sm text-neutral-500">Filter, submit, and review all expenses across statuses.</p>
        </div>
        <Button onClick={() => navigate('/expenses/create')}>Create expense</Button>
      </div>

      <ExpenseFilters
        categories={categories}
        status={status}
        onStatusChange={setStatus}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        startDate={startDate}
        endDate={endDate}
        onDateChange={({ startDate: start, endDate: end }) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

      <ExpenseList
        expenses={expenses}
        loading={loading}
        onSubmit={submitExpense}
        onDelete={deleteExpense}
        onEdit={(expense) => navigate(`/expenses/${expense.id}/edit`)}
      />
    </div>
  );
};

export default ExpensesList;
