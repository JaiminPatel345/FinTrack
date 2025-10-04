import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Plus } from 'lucide-react';

const ApprovalRules = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Approval Rules</h1>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Create Rule
          </Button>
        </div>

        <Card>
          <p className="text-gray-600">Approval rules management will be implemented here...</p>
          {/* Approval rules component will be added here */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApprovalRules;
