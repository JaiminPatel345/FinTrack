import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { fetchExpenses } from '../../store/slices/expensesSlice';
import { fetchPendingApprovals } from '../../store/slices/approvalsSlice';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { StatusBadge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import {
  DollarSign,
  Receipt,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { expenses, isLoading: expensesLoading } = useAppSelector((state) => state.expenses);
  const { pendingApprovals, isLoading: approvalsLoading } = useAppSelector(
    (state) => state.approvals
  );

  useEffect(() => {
    dispatch(fetchExpenses({ limit: 5 }));
    if (user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MANAGER) {
      dispatch(fetchPendingApprovals());
    }
  }, [dispatch, user?.role]);

  // Calculate stats
  const totalExpenses = expenses.length;
  const pendingCount = expenses.filter((e) => e.status === 'pending_approval').length;
  const approvedCount = expenses.filter((e) => e.status === 'approved').length;
  const totalAmount = expenses.reduce((sum, e) => sum + e.convertedAmount, 0);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const isManager = user?.role === USER_ROLES.MANAGER;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Here's your expense overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalExpenses}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalAmount, user?.currency)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {pendingCount}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {approvedCount}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card
          title="Recent Expenses"
          headerAction={
            <Link to="/expenses">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          {expensesLoading ? (
            <Loader />
          ) : expenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">No expenses yet</p>
              <Link to="/expenses/create">
                <Button className="mt-4">Create Your First Expense</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenses.slice(0, 5).map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {expense.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(expense.convertedAmount, expense.companyCurrency)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={expense.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pending Approvals (Admin/Manager Only) */}
        {(isAdmin || isManager) && (
          <Card
            title="Pending Approvals"
            headerAction={
              <Link to="/approvals">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            }
          >
            {approvalsLoading ? (
              <Loader />
            ) : pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-600">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Expense ID: {approval.expenseId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Step {approval.currentStep} of {approval.totalSteps}
                      </p>
                    </div>
                    <Link to={`/approvals/${approval.id}`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/expenses/create">
              <Button className="w-full flex items-center justify-center gap-2">
                <Receipt size={18} />
                Create Expense
              </Button>
            </Link>
            {isAdmin && (
              <>
                <Link to="/users">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Users size={18} />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/approval-rules">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approval Rules
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
