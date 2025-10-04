import React, { useState } from 'react';
import { PendingApproval } from '@types/approval.types';
import { Card } from '@components/common/Card';
import { formatCurrency, formatDate } from '@utils/formatters';
import { Button } from '@components/common/Button';
import { StatusTimeline, TimelineStep } from '@components/expenses/StatusTimeline';
import { downloadFile } from '@utils/helpers';

interface ApprovalCardProps {
  approval: PendingApproval;
  onApprove: (approvalId: string, comments?: string) => Promise<void> | void;
  onReject: (approvalId: string, comments: string) => Promise<void> | void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ approval, onApprove, onReject }) => {
  const [comments, setComments] = useState('');

  const timeline: TimelineStep[] = [
    {
      title: 'Expense submitted',
      description: approval.employeeName,
      status: 'completed',
      timestamp: formatDate(approval.submittedAt),
    },
    {
      title: 'Manager review',
      description: Step  of ,
      status: 'current',
    },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{approval.description}</h3>
          <p className="text-sm text-neutral-500">
            {approval.employeeName} · {approval.categoryName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-neutral-900">
            {formatCurrency(approval.amount, approval.companyCurrency)}
          </p>
          <p className="text-xs text-neutral-500">
            Original: {formatCurrency(approval.convertedAmount, approval.companyCurrency)}
          </p>
        </div>
      </div>

      {approval.receiptUrl && (
        <button
          onClick={() => downloadFile(approval.receiptUrl!, expense--receipt)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Download receipt
        </button>
      )}

      <StatusTimeline steps={timeline} />

      <textarea
        value={comments}
        onChange={(event) => setComments(event.target.value)}
        placeholder="Add approval or rejection comments"
        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
      />

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="danger" onClick={() => onReject(approval.approvalId ?? approval.expenseId, comments)}>
          Reject
        </Button>
        <Button onClick={() => onApprove(approval.approvalId ?? approval.expenseId, comments)}>Approve</Button>
      </div>
    </Card>
  );
};
