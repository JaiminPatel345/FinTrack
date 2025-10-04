import React from 'react';
import { ForgotPasswordForm } from '@components/auth/ForgotPasswordForm';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-soft">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Reset your password</h1>
          <p className="text-sm text-neutral-500">
            Enter the email associated with your workspace. We will email you a secure password reset link.
          </p>
        </div>
        <ForgotPasswordForm />
        <p className="text-center text-sm text-neutral-500">
          Remembered it? <a href="/signin" className="text-primary-600 hover:text-primary-700">Back to sign in</a>.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
