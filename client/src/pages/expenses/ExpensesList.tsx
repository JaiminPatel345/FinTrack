import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchExpenses } from '../../store/slices/expensesSlice';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Loader } from '../../components/common/Loader';
import { StatusBadge } from '../../components/common/Badge';
import { Select } from '../../components/common/Select';
import { Plus, Search } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import type { Expense } from '../../types/expense.types';

const ExpensesList = () => {
  const dispatch = useAppDispatch();
  const { expenses, isLoading } = useAppSelector((state) => state.expenses);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchExpenses({ status: statusFilter || undefined }));
  }, [dispatch, statusFilter]);

  const columns = [
    {
      header: 'Description',
      accessor: (row: Expense) => row.description,
    },
    {
      header: 'Amount',
      accessor: (row: Expense) => formatCurrency(row.convertedAmount, row.companyCurrency),
    },
    {
      header: 'Category',
      accessor: (row: Expense) => row.categoryName,
    },
    {
      header: 'Date',
      accessor: (row: Expense) => formatDate(row.date),
    },
    {
      header: 'Status',
      accessor: (row: Expense) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row: Expense) => (
        <Link to={`/expenses/${row.id}`}>
          <Button size="sm" variant="ghost">
            View
          </Button>
        </Link>
      ),
    },
  ];

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
          <Link to="/expenses/create">
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Create Expense
            </Button>
          </Link>
        </div>

        <Card>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <Select
              placeholder="All Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'pending_approval', label: 'Pending Approval' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <Table
              data={filteredExpenses}
              columns={columns}
              emptyMessage="No expenses found"
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExpensesList;
