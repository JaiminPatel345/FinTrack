import React from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuthContext } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuthContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Expense Management System</h1>
        <p className="text-sm text-neutral-500">Track expenses and approvals with confidence.</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-full border border-neutral-200 p-2 text-neutral-500 hover:text-primary-500"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1">
          <div>
            <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-full bg-primary-500 p-2 text-white hover:bg-primary-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
