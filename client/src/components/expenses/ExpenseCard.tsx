import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { formatCurrency, formatDate, formatStatus } from '@utils/formatters';
import { Expense } from '@types/expense.types';
import { DownloadCloud } from 'lucide-react';
import { downloadFile } from '@utils/helpers';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onSubmit?: (expenseId: string) => void;
  onDelete?: (expenseId: string) => void;
}

const statusVariantMap: Record<Expense['status'], 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  submitted: 'info',
  pending_approval: 'warning',
  approved: 'success',
  rejected: 'danger',
};

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onEdit, onSubmit, onDelete }) => {
  return (
    <motion.div
      layout
      className="card space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{expense.description}</h3>
          <p className="text-sm text-neutral-500">
            {formatDate(expense.expenseDate)} · {expense.categoryName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-neutral-900">
            {formatCurrency(expense.amount, expense.currency)}
          </p>
          {expense.convertedAmount && expense.companyCurrency && (
            <p className="text-xs text-neutral-500">
              {formatCurrency(expense.convertedAmount, expense.companyCurrency)}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Badge variant={statusVariantMap[expense.status]}>{formatStatus(expense.status)}</Badge>
        <span>Paid by: {expense.paidBy}</span>
        {expense.gstPercentage && <span>GST: {expense.gstPercentage}%</span>}
        <span>Owner: {expense.userName}</span>
      </div>

      {expense.receiptUrl && (
        <button
          onClick={() => downloadFile(expense.receiptUrl!, eceipt-.pdf)}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:border-primary-300 hover:text-primary-600"
        >
          <DownloadCloud className="h-4 w-4" />
          Download receipt
        </button>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-400">
        <span>Created {formatDate(expense.createdAt)}</span>
        {expense.submittedAt && <span>Submitted {formatDate(expense.submittedAt)}</span>}
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(expense)}>
            Edit
          </Button>
        )}
        {onDelete && expense.status === 'draft' && (
          <Button variant="danger" size="sm" onClick={() => onDelete(expense.id)}>
            Delete
          </Button>
        )}
        {onSubmit && expense.status === 'draft' && (
          <Button size="sm" onClick={() => onSubmit(expense.id)}>
            Submit for approval
          </Button>
        )}
      </div>
    </motion.div>
  );
};
