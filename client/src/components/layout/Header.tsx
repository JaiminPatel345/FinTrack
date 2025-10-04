import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notifications);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Expense Manager
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link to="/notifications" className="relative">
              <Button variant="ghost" className="relative">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1">
                    <Badge colorScheme="red" className="text-xs px-1.5 py-0.5">
                      {unreadCount}
                    </Badge>
                  </span>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <User size={20} className="text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              colorScheme="red"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
