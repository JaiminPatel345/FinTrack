import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '../../services/auth.service';
import { forgotPasswordSchema } from '../../utils/validators';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { showSuccessToast, showErrorToast } from '../../components/common/Toast';
import { getErrorMessage } from '../../utils/helpers';
import { Mail, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setEmailSent(true);
      showSuccessToast(
        'Email sent!',
        'Check your inbox for password reset instructions.'
      );
    } catch (error) {
      showErrorToast('Failed to send email', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>

        <Card>
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Check your email
              </h3>
              <p className="text-gray-600">
                We've sent password reset instructions to your email address.
              </p>
              <Link to="/signin">
                <Button className="mt-4">Back to Sign In</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                isLoading={isLoading}
                loadingText="Sending..."
              >
                <Mail size={18} />
                Send Reset Link
              </Button>

              <Link to="/signin" className="block text-center">
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                  <ArrowLeft size={18} />
                  Back to Sign In
                </Button>
              </Link>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
