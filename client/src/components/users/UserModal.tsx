import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, CreateUserSchema } from '@utils/validators';
import { Modal } from '@components/common/Modal';
import { Input } from '@components/common/Input';
import { Select } from '@components/common/Select';
import { Button } from '@components/common/Button';
import { UserListItem } from '@types/user.types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserSchema) => Promise<void> | void;
  managers: UserListItem[];
  initialData?: Partial<CreateUserSchema> & { id?: string };
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSubmit, managers, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'employee',
      managerId: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'employee',
        managerId: initialData.managerId || '',
      });
    } else {
      reset({ name: '', email: '', role: 'employee', managerId: '' });
    }
  }, [initialData, reset]);

  const submit = async (data: CreateUserSchema) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.name ? 'Edit user' : 'Invite new user'}
      description="Create new company users and assign manager relationships."
    >
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Input label="Name" placeholder="Jane Doe" error={errors.name?.message} {...register('name')} />
        <Input
          label="Work Email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Select label="Role" error={errors.role?.message} {...register('role')}>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </Select>

        <Select label="Manager" error={errors.managerId?.message} {...register('managerId')}>
          <option value="">No manager</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {initialData?.name ? 'Save changes' : 'Invite user'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
