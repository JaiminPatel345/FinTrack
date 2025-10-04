import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white px-6 py-4 text-sm text-neutral-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>Expense Management System · Built for multi-level approval workflows.</span>
        <div className="space-x-4">
          <a href="#" className="hover:text-primary-500">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary-500">
            Terms
          </a>
          <a href="mailto:support@example.com" className="hover:text-primary-500">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};
