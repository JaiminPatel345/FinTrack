import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';
import {
  BarChart3,
  Users,
  ClipboardList,
  Settings,
  FilePlus,
  FileText,
  ShieldCheck,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles?: Array<'admin' | 'manager' | 'employee'>;
}

export const Sidebar: React.FC = () => {
  const { user } = useAuthContext();

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: 'Dashboard', to: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
      { label: 'My Expenses', to: '/expenses', icon: <FileText className="h-4 w-4" /> },
      { label: 'Create Expense', to: '/expenses/create', icon: <FilePlus className="h-4 w-4" /> },
      {
        label: 'Users',
        to: '/users',
        icon: <Users className="h-4 w-4" />,
        roles: ['admin'],
      },
      {
        label: 'Approval Rules',
        to: '/approval-rules',
        icon: <Settings className="h-4 w-4" />,
        roles: ['admin'],
      },
      {
        label: 'Pending Approvals',
        to: '/pending-approvals',
        icon: <ClipboardList className="h-4 w-4" />,
        roles: ['manager'],
      },
      {
        label: 'Approvals Overview',
        to: '/expenses/approvals',
        icon: <ShieldCheck className="h-4 w-4" />,
        roles: ['manager'],
      },
    ],
    []
  );

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user ? item.roles.includes(user.role) : false;
  });

  return (
    <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
      <div className="px-6 py-6">
        <div className="rounded-xl bg-primary-50 p-4">
          <p className="text-sm font-semibold text-primary-600">Welcome back</p>
          <p className="text-lg font-bold text-primary-700">{user?.name}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              lex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition 
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6 text-xs text-neutral-400">© {new Date().getFullYear()} Expense Management</div>
    </aside>
  );
};
