import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { authService } from '@services/auth.service';
import { useNotificationContext } from '@context/NotificationContext';

export const ForgotPasswordForm: React.FC = () => {
  const { notifySuccess, notifyError } = useNotificationContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await authService.forgotPassword(data);
      notifySuccess('We have sent a password reset link to your email.');
      reset();
    } catch (err) {
      notifyError('Unable to start the password reset process.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Work Email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Send reset instructions
      </Button>
    </form>
  );
};
