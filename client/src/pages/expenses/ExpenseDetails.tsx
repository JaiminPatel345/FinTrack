import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { expensesService } from '@services/expenses.service';
import { Expense } from '@types/expense.types';
import { Card } from '@components/common/Card';
import { Button } from '@components/common/Button';
import { formatCurrency, formatDate, formatStatus } from '@utils/formatters';
import { Badge } from '@components/common/Badge';
import { StatusTimeline } from '@components/expenses/StatusTimeline';

export const ExpenseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const response = await expensesService.getExpense(id);
      setExpense(response.data.expense ?? response.data);
    };
    load();
  }, [id]);

  if (!expense) {
    return <p>Loading expense...</p>;
  }

  const steps = [
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
              {expense.categoryName} · {formatDate(expense.expenseDate)}
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
