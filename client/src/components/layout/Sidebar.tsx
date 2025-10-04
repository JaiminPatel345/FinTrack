import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import {
  LayoutDashboard,
  Receipt,
  Users,
  CheckCircle,
  Settings,
  FileText,
} from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE],
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: <Receipt size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE],
  },
  {
    name: 'Approvals',
    path: '/approvals',
    icon: <CheckCircle size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
  {
    name: 'Users',
    path: '/users',
    icon: <Users size={20} />,
    roles: [USER_ROLES.ADMIN],
  },
  {
    name: 'Approval Rules',
    path: '/approval-rules',
    icon: <Settings size={20} />,
    roles: [USER_ROLES.ADMIN],
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: <FileText size={20} />,
    roles: [USER_ROLES.ADMIN, USER_ROLES.MANAGER],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen">
      <nav className="mt-6">
        <div className="px-4 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
