import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';

const PendingApprovals = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>

        <Card>
          <p className="text-gray-600">Pending approvals list will be implemented here...</p>
          {/* Approvals list component will be added here */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PendingApprovals;
