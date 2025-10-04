import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/auth.service';
import { resetPasswordSchema } from '../../utils/validators';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { showSuccessToast, showErrorToast } from '../../components/common/Toast';
import { getErrorMessage } from '../../utils/helpers';
import { Lock } from 'lucide-react';
import { z } from 'zod';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      showErrorToast('Invalid token', 'Password reset token is missing.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ ...data, token });
      showSuccessToast(
        'Password reset successful!',
        'You can now sign in with your new password.'
      );
      navigate('/signin');
    } catch (error) {
      showErrorToast('Failed to reset password', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card>
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Invalid Link</h3>
            <p className="text-gray-600">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button>Request New Link</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              {...register('password')}
              error={errors.password?.message}
              helperText="Must be at least 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter new password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
            />

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              isLoading={isLoading}
              loadingText="Resetting..."
            >
              <Lock size={18} />
              Reset Password
            </Button>

            <Link to="/signin" className="block text-center">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
