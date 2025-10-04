import React from 'react';
import { ApprovalStep } from '@types/approval.types';
import { Badge } from '@components/common/Badge';

interface ApproverSequenceProps {
  steps: ApprovalStep[];
}

export const ApproverSequence: React.FC<ApproverSequenceProps> = ({ steps }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {steps.map((step) => (
        <div key={step.id ?? step.stepOrder} className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-soft">
          <p className="text-sm font-semibold text-neutral-800">Step {step.stepOrder}</p>
          <p className="text-sm text-neutral-500">
            {step.approverName || step.roleRequired || 'Auto approval'}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {step.isAutoApprove && <Badge variant="success">Auto</Badge>}
            {step.roleRequired && <Badge variant="info">{step.roleRequired}</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
};
