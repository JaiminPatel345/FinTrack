import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '@components/auth/ResetPasswordForm';

export const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token');

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-soft">
          <h1 className="text-xl font-semibold text-neutral-900">Invalid reset link</h1>
          <p className="mt-2 text-sm text-neutral-500">
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <a href="/forgot-password" className="mt-4 inline-block text-sm text-primary-600">Request new link</a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-soft">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Choose a new password</h1>
          <p className="text-sm text-neutral-500">Enter and confirm your new password to secure your account.</p>
        </div>
        <ResetPasswordForm token={token} />
        <p className="text-center text-sm text-neutral-500">
          Remembered it? <a href="/signin" className="text-primary-600 hover:text-primary-700">Back to sign in</a>.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
