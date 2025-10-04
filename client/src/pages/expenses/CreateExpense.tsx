import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateExpense = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/expenses">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Expense</h1>
        </div>

        <Card>
          <p className="text-gray-600">Expense creation form will be implemented here...</p>
          {/* Expense form component will be added here */}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateExpense;
