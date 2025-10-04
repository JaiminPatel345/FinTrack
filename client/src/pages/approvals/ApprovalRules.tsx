import React, { useState } from 'react';
import { useApprovalRules } from '@hooks/useApprovals';
import { ApprovalRulesForm } from '@components/approvals/ApprovalRulesForm';
import { ApproverSequence } from '@components/approvals/ApproverSequence';
import { Button } from '@components/common/Button';
import { ApprovalRule } from '@types/approval.types';

export const ApprovalRules: React.FC = () => {
  const { rules, loading, saveRule, deleteRule } = useApprovalRules();
  const [selectedRule, setSelectedRule] = useState<ApprovalRule | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Approval rules</h1>
          <p className="text-sm text-neutral-500">
            Configure sequential, percentage-based, or hybrid approval workflows tailored to spend levels.
          </p>
        </div>
        <Button onClick={() => setSelectedRule(null)}>Create rule</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {loading && <p>Loading rules...</p>}
          {!loading && rules.length === 0 && <p className="text-sm text-neutral-500">No rules configured yet.</p>}
          {rules.map((rule) => (
            <div key={rule.id} className={
ounded-xl border p-4 }>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">{rule.name}</h3>
                  <p className="text-sm text-neutral-500">{rule.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedRule(rule)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteRule(rule.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <ApproverSequence steps={rule.steps} />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-neutral-900">
            {selectedRule ? 'Edit rule' : 'Create a new rule'}
          </h2>
          <p className="text-sm text-neutral-500">
            Define spend thresholds, approver sequences, and escalation logic.
          </p>
          <div className="mt-4">
            <ApprovalRulesForm initialValue={selectedRule ?? undefined} onSubmit={saveRule} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalRules;
