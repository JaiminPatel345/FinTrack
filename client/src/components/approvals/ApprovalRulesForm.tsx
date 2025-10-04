import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Button } from '@components/common/Button';
import { ApprovalRule } from '@types/approval.types';

interface ApprovalRulesFormProps {
  initialValue?: Partial<ApprovalRule>;
  onSubmit: (data: Partial<ApprovalRule>) => Promise<void> | void;
  submitting?: boolean;
}

type ApprovalRuleFormValues = Partial<ApprovalRule> & {
  isManagerApprover?: boolean | string;
  isActive?: boolean | string;
};

const defaultValues: ApprovalRuleFormValues = {
  name: '',
  description: '',
  minAmount: undefined,
  maxAmount: undefined,
  ruleType: 'sequential',
  isManagerApprover: true,
  percentageRequired: undefined,
  isActive: true,
  priority: 1,
};

export const ApprovalRulesForm: React.FC<ApprovalRulesFormProps> = ({ initialValue, onSubmit, submitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ApprovalRuleFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...initialValue,
    });
  }, [initialValue, reset]);

  const submit = (values: ApprovalRuleFormValues) => {
    const payload: Partial<ApprovalRule> = {
      ...values,
      isManagerApprover: String(values.isManagerApprover) !== 'false',
      isActive: String(values.isActive) !== 'false',
      minAmount: values.minAmount ? Number(values.minAmount) : undefined,
      maxAmount: values.maxAmount ? Number(values.maxAmount) : undefined,
      percentageRequired: values.percentageRequired ? Number(values.percentageRequired) : undefined,
      priority: values.priority ? Number(values.priority) : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input label="Rule name" placeholder="Expenses above " {...register('name', { required: true })} />
      <Input label="Description" placeholder="Short description" {...register('description')} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input type="number" label="Minimum amount" step="0.01" {...register('minAmount')} />
        <Input type="number" label="Maximum amount" step="0.01" {...register('maxAmount')} />
      </div>

      <Select label="Workflow type" {...register('ruleType')}>
        <option value="sequential">Sequential approvers</option>
        <option value="percentage">Percentage approvers</option>
        <option value="specific_approver">Specific approver</option>
        <option value="hybrid">Hybrid</option>
      </Select>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Include manager" {...register('isManagerApprover')}>
          <option value="true">Yes, include direct manager</option>
          <option value="false">No</option>
        </Select>
        <Input type="number" label="Priority" {...register('priority')} />
      </div>

      <Input
        type="number"
        label="Percentage required"
        helperText="Required when using percentage or hybrid workflows"
        {...register('percentageRequired')}
      />

      <Select label="Status" {...register('isActive')}>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </Select>

      <Button type="submit" loading={isSubmitting || submitting}>
        Save approval rule
      </Button>
    </form>
  );
};
