import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseSchema } from '@utils/validators';
import { ExpenseFormData, Category } from '@types/expense.types';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Button } from '@components/common/Button';
import { FileUpload } from '@components/common/FileUpload';
import { useNotifications } from '@hooks/useNotifications';

interface ExpenseFormProps {
  categories: Category[];
  initialValues?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void> | void;
  submitting?: boolean;
  onReceiptSelected?: (file: File) => Promise<{ url: string; publicId: string }>;
  loadingCategories?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  categories,
  initialValues,
  onSubmit,
  submitting = false,
  onReceiptSelected,
  loadingCategories = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ExpenseSchema>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: '',
      amount: 0,
      currency: '',
      categoryId: '',
      expenseDate: '',
      paidBy: 'card',
      gstPercentage: undefined,
      remarks: '',
      receiptUrl: '',
      receiptPublicId: '',
    },
  });
  const { notifyError, notifySuccess } = useNotifications();

  useEffect(() => {
    if (initialValues) {
      reset({
        description: initialValues.description ?? '',
        amount: initialValues.amount ?? 0,
        currency: initialValues.currency ?? '',
        categoryId: initialValues.categoryId ?? '',
        expenseDate: initialValues.expenseDate ?? '',
        paidBy: (initialValues.paidBy as ExpenseSchema['paidBy']) ?? 'card',
        gstPercentage: initialValues.gstPercentage,
        remarks: initialValues.remarks ?? '',
        receiptUrl: initialValues.receiptUrl ?? '',
      });
    }
  }, [initialValues, reset]);

  const handleReceiptUpload = async (file: File) => {
    if (!onReceiptSelected) return;
    try {
      const { url, publicId } = await onReceiptSelected(file);
      setValue('receiptUrl', url);
      setValue('receiptPublicId', publicId);
      notifySuccess('Receipt uploaded');
    } catch (error) {
      notifyError('Failed to upload receipt');
    }
  };

  const submit = async (data: ExpenseSchema) => {
    const payload: ExpenseFormData = {
      ...data,
      amount: Number(data.amount),
    } as ExpenseFormData;

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <Input
        label="Expense description"
        placeholder="Taxi ride to client meeting"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="number"
          step="0.01"
          label="Amount"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
        <Input label="Currency" placeholder="USD" error={errors.currency?.message} {...register('currency')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Category" error={errors.categoryId?.message} disabled={loadingCategories} {...register('categoryId')}>
          <option value="">{loadingCategories ? 'Loading categories...' : 'Select category'}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input type="date" label="Expense date" error={errors.expenseDate?.message} {...register('expenseDate')} />
      </div>

      <Select label="Paid by" error={errors.paidBy?.message} {...register('paidBy')}>
        <option value="cash">Cash</option>
        <option value="card">Personal card</option>
        <option value="company_card">Company card</option>
      </Select>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="number"
          step="0.01"
          label="GST (%)"
          error={errors.gstPercentage?.message}
          {...register('gstPercentage', { valueAsNumber: true })}
        />
        <Input
          label="Remarks"
          placeholder="Optional notes"
          error={errors.remarks?.message}
          {...register('remarks')}
        />
      </div>

      {onReceiptSelected && (
        <div>
          <p className="label mb-2">Receipt</p>
          <FileUpload onFileSelected={handleReceiptUpload} disabled={isSubmitting || submitting} />
        </div>
      )}

      <Button type="submit" loading={isSubmitting || submitting}>
        Save expense
      </Button>
    </form>
  );
};
