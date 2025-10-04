import React from 'react';
import { SignupForm } from '@components/auth/SignupForm';

export const Signup: React.FC = () => {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-gradient-to-br from-primary-500 to-secondary-500 md:flex md:flex-col md:justify-between md:p-10">
        <div>
          <h1 className="text-3xl font-bold text-white">Expense Management System</h1>
          <p className="mt-4 max-w-md text-white/80">
            Create your company workspace, invite finance teams, and automate receipts, approvals, and reimbursements.
          </p>
        </div>
        <p className="text-sm text-white/60">Built for modern finance teams with multi-level approvals.</p>
      </div>
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900">Create your company account</h2>
          <p className="text-sm text-neutral-500">
            Already onboarded? <a href="/signin" className="text-primary-600 hover:text-primary-700">Sign in instead</a>.
          </p>
          <SignupForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
