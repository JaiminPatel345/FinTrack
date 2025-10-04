import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { useNotificationContext } from '@context/NotificationContext';
import { useResetPasswordMutation } from '@store/api/authApi';
import { handleApiError } from '@utils/helpers';

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const { notifySuccess, notifyError } = useNotificationContext();
  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      await resetPasswordMutation({ token, ...data }).unwrap();
      notifySuccess('Your password has been updated. You can now sign in.');
      reset();
    } catch (err) {
      notifyError(handleApiError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="password"
        label="New Password"
        placeholder="Enter a secure password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        type="password"
        label="Confirm Password"
        placeholder="Re-enter the new password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" className="w-full" loading={isLoading}>
        Reset Password
      </Button>
    </form>
  );
};
