import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { useNotificationContext } from '@context/NotificationContext';
import { useForgotPasswordMutation } from '@store/api/authApi';
import { handleApiError } from '@utils/helpers';

export const ForgotPasswordForm: React.FC = () => {
  const { notifySuccess, notifyError } = useNotificationContext();
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await forgotPasswordMutation(data).unwrap();
      notifySuccess('We have sent a password reset link to your email.');
      reset();
    } catch (err) {
      notifyError(handleApiError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Work Email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
      <Button type="submit" className="w-full" loading={isLoading}>
        Send reset instructions
      </Button>
    </form>
  );
};
