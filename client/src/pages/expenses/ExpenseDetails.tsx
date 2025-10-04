import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { Badge } from '@components/common/Badge';
import { StatusTimeline } from '@components/expenses/StatusTimeline';
import { formatCurrency, formatDate, formatStatus } from '@utils/formatters';
import { useGetExpenseQuery } from '@store/api/expensesApi';

export const ExpenseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: expense, isFetching } = useGetExpenseQuery(id!, { skip: !id });

  const steps = useMemo(() => {
    if (!expense) return [];
    return [
      {
        title: 'Draft created',
        description: expense.userName,
        status: 'completed' as const,
        timestamp: formatDate(expense.createdAt),
      },
      {
        title: formatStatus(expense.status),
        description: expense.remarks,
        status: expense.status === 'approved' ? 'completed' : expense.status === 'rejected' ? 'rejected' : 'current',
        timestamp: expense.submittedAt ? formatDate(expense.submittedAt) : undefined,
      },
    ];
  }, [expense]);

  if (!expense || isFetching) {
    return <p>Loading expense...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Expense details</h1>
          <p className="text-sm text-neutral-500">Expense ID: {expense.id}</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">{expense.description}</h2>
            <p className="text-sm text-neutral-500">
              {expense.categoryName} • {formatDate(expense.expenseDate)}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="info">{formatStatus(expense.status)}</Badge>
              <span className="text-sm text-neutral-500">Paid by {expense.paidBy}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-neutral-900">
              {formatCurrency(expense.amount, expense.currency)}
            </p>
            {expense.convertedAmount && (
              <p className="text-xs text-neutral-500">
                {formatCurrency(expense.convertedAmount, expense.companyCurrency)}
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-neutral-900">Approval timeline</h3>
        <StatusTimeline steps={steps} />
      </Card>
    </div>
  );
};

export default ExpenseDetails;
