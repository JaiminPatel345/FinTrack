import React from 'react';
import { SigninForm } from '@components/auth/SigninForm';

export const Signin: React.FC = () => {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary-500 to-secondary-500 md:flex md:flex-col md:justify-between md:p-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-4 max-w-md text-white/80">
            Manage expenses, approvals, and reimbursements with a unified, real-time workspace.
          </p>
        </div>
        <p className="text-sm text-white/60">Secure SSO-ready platform for finance teams.</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Sign in to your workspace</h2>
          <SigninForm />
          <div className="space-y-2 text-sm text-neutral-500">
            <p>
              Forgot your password? <a href="/forgot-password" className="text-primary-600 hover:text-primary-700">Reset it</a>.
            </p>
            <p>
              First time here? <a href="/signup" className="text-primary-600 hover:text-primary-700">Book a workspace</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
