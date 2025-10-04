import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Plus } from 'lucide-react';

const UsersManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add User
          </Button>
        </div>

        <Card>
          <p className="text-gray-600">Users management table will be implemented here...</p>
          {/* Users table component will be added here */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersManagement;
