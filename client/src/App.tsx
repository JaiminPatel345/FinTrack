import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux.ts';
import { Toaster } from './components/common/Toaster.tsx';

// Auth Pages
import Signin from './pages/auth/Signin.tsx';
import Signup from './pages/auth/Signup.tsx';
import ForgotPassword from './pages/auth/ForgotPassword.tsx';
import ResetPassword from './pages/auth/ResetPassword.tsx';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard.tsx';

// Expenses
import ExpensesList from './pages/expenses/ExpensesList.tsx';
import CreateExpense from './pages/expenses/CreateExpense.tsx';
import ExpenseDetails from './pages/expenses/ExpenseDetails.tsx';

// Users
import UsersManagement from './pages/users/UsersManagement.tsx';

// Approvals
import PendingApprovals from './pages/approvals/PendingApprovals.tsx';
import ApprovalRules from './pages/approvals/ApprovalRules.tsx';

import type { RootState } from './store/index.ts';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><Signin /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Expenses */}
          <Route path="/expenses" element={<ProtectedRoute><ExpensesList /></ProtectedRoute>} />
          <Route path="/expenses/create" element={<ProtectedRoute><CreateExpense /></ProtectedRoute>} />
          <Route path="/expenses/:id" element={<ProtectedRoute><ExpenseDetails /></ProtectedRoute>} />
          
          {/* Users */}
          <Route path="/users" element={<ProtectedRoute><UsersManagement /></ProtectedRoute>} />
          
          {/* Approvals */}
          <Route path="/approvals" element={<ProtectedRoute><PendingApprovals /></ProtectedRoute>} />
          <Route path="/approval-rules" element={<ProtectedRoute><ApprovalRules /></ProtectedRoute>} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
