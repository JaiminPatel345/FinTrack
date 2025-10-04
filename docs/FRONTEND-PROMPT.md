# Frontend Development Prompt - Expense Management System

## Project Overview
Create a complete React.js frontend application for a microservices-based expense management system with TypeScript, Tailwind CSS, and Framer Motion. The application should handle authentication, user management, expense submission with OCR-powered receipt scanning, multi-level approval workflows, and multi-currency support.

---

## Technology Stack

### Core Technologies
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom configuration)
- **Animations**: Framer Motion (subtle, professional animations)
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **File Upload**: React Dropzone
- **Icons**: Lucide React or Heroicons
- **Notifications**: React Hot Toast

### Project Setup Commands
```bash
# Create Vite + React + TypeScript project
npm create vite@latest client -- --template react-ts
cd client

# Install dependencies
npm install axios react-router-dom react-hook-form zod @hookform/resolvers
npm install framer-motion date-fns react-dropzone
npm install lucide-react react-hot-toast

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install dev dependencies
npm install -D @types/node
```

---

## Folder Structure

```
client/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/                        # Images, icons, fonts
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/                    # Reusable components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── SearchableSelect.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── FileUpload.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── SignupForm.tsx
│   │   │   ├── SigninForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   │
│   │   ├── users/
│   │   │   ├── UsersTable.tsx
│   │   │   ├── UserModal.tsx
│   │   │   └── SendPasswordModal.tsx
│   │   │
│   │   ├── expenses/
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseCard.tsx
│   │   │   ├── ReceiptUpload.tsx
│   │   │   ├── StatusTimeline.tsx
│   │   │   └── ExpenseFilters.tsx
│   │   │
│   │   └── approvals/
│   │       ├── ApprovalRulesForm.tsx
│   │       ├── ApprovalsList.tsx
│   │       ├── ApprovalCard.tsx
│   │       ├── ApprovalModal.tsx
│   │       └── ApproverSequence.tsx
│   │
│   ├── pages/                         # Page components
│   │   ├── auth/
│   │   │   ├── Signup.tsx
│   │   │   ├── Signin.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ManagerDashboard.tsx
│   │   │   └── EmployeeDashboard.tsx
│   │   │
│   │   ├── users/
│   │   │   └── UsersManagement.tsx
│   │   │
│   │   ├── expenses/
│   │   │   ├── ExpensesList.tsx
│   │   │   ├── CreateExpense.tsx
│   │   │   ├── EditExpense.tsx
│   │   │   └── ExpenseDetails.tsx
│   │   │
│   │   └── approvals/
│   │       ├── ApprovalRules.tsx
│   │       └── PendingApprovals.tsx
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useUsers.ts
│   │   ├── useExpenses.ts
│   │   ├── useApprovals.ts
│   │   ├── useCurrency.ts
│   │   ├── useNotifications.ts
│   │   ├── useDebounce.ts
│   │   └── useToast.ts
│   │
│   ├── context/                       # React Context
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── NotificationContext.tsx
│   │
│   ├── services/                      # API service calls
│   │   ├── api.ts                     # Axios instance
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── expenses.service.ts
│   │   ├── approvals.service.ts
│   │   ├── currency.service.ts
│   │   └── upload.service.ts
│   │
│   ├── utils/                         # Utility functions
│   │   ├── formatters.ts              # Date, currency formatters
│   │   ├── validators.ts              # Form validators
│   │   ├── constants.ts               # App constants
│   │   └── helpers.ts                 # Helper functions
│   │
│   ├── types/                         # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── expense.types.ts
│   │   ├── approval.types.ts
│   │   ├── currency.types.ts
│   │   └── common.types.ts
│   │
│   ├── styles/                        # Global styles
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── themes.css
│   │
│   ├── App.tsx                        # Main App component
│   ├── main.tsx                       # Entry point
│   └── routes.tsx                     # Route configuration
│
├── .env.example
├── .env
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

---

## Configuration Files

### 1. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#d1fae5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
          dark: '#dc2626',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'strong': '0 10px 40px -5px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 2. .env.example
```env
VITE_API_GATEWAY_URL=http://localhost:5000
VITE_APP_NAME=Expense Management System
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 3. vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

### 4. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@context/*": ["./src/context/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## TypeScript Types

### src/types/auth.types.ts
```typescript
export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  currency: string;
}

export interface SigninFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### src/types/user.types.ts
```typescript
export interface CreateUserFormData {
  name: string;
  email: string;
  role: 'manager' | 'employee';
  managerId?: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: UserListItem[];
    total: number;
  };
}
```

### src/types/expense.types.ts
```typescript
export interface ExpenseFormData {
  description: string;
  amount: number;
  currency: string;
  categoryId: string;
  expenseDate: string;
  paidBy: 'cash' | 'card' | 'company_card';
  gstPercentage?: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
}

export interface Expense {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  description: string;
  amount: number;
  currency: string;
  convertedAmount?: number;
  companyCurrency?: string;
  categoryId: string;
  categoryName: string;
  expenseDate: string;
  paidBy: string;
  gstPercentage?: number;
  remarks?: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  status: 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected';
  ocrProcessed: boolean;
  ocrConfidence?: number;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface OCRResult {
  vendorName?: string;
  date?: string;
  totalAmount?: number;
  currency?: string;
  taxAmount?: number;
  confidence: {
    overall: number;
    vendorName: number;
    date: number;
    amount: number;
  };
}
```

### src/types/approval.types.ts
```typescript
export interface ApprovalRule {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  isManagerApprover: boolean;
  ruleType: 'sequential' | 'percentage' | 'specific_approver' | 'hybrid';
  percentageRequired?: number;
  steps: ApprovalStep[];
  isActive: boolean;
  priority: number;
  createdAt: string;
}

export interface ApprovalStep {
  id: string;
  approvalRuleId: string;
  stepOrder: number;
  approverId?: string;
  approverName?: string;
  roleRequired?: string;
  isAutoApprove: boolean;
}

export interface ExpenseApproval {
  id: string;
  expenseId: string;
  approvalRuleId: string;
  currentStep: number;
  totalSteps: number;
  status: 'pending' | 'approved' | 'rejected';
  startedAt: string;
  completedAt?: string;
  actions: ApprovalAction[];
}

export interface ApprovalAction {
  id: string;
  expenseApprovalId: string;
  stepOrder: number;
  approverId: string;
  approverName: string;
  action: 'pending' | 'approved' | 'rejected';
  comments?: string;
  actionDate?: string;
}

export interface PendingApproval {
  expenseId: string;
  description: string;
  employeeName: string;
  categoryName: string;
  amount: number;
  convertedAmount: number;
  companyCurrency: string;
  expenseDate: string;
  submittedAt: string;
  currentStep: number;
  totalSteps: number;
  receiptUrl?: string;
}
```

### src/types/currency.types.ts
```typescript
export interface Country {
  name: string;
  currency: string;
  currencyName: string;
}

export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  effectiveDate: string;
}

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string;
}

export interface CurrencyConversionResponse {
  convertedAmount: number;
  exchangeRate: number;
}
```

---

## API Services

### src/services/api.ts
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message: string }>) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        toast.error('Session expired. Please login again.');
      } else if (status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (status === 404) {
        toast.error('Resource not found.');
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(data?.message || 'An error occurred.');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### src/services/auth.service.ts
```typescript
import api from './api';
import { 
  SignupFormData, 
  SigninFormData, 
  ForgotPasswordFormData, 
  ResetPasswordFormData,
  AuthResponse 
} from '@types/auth.types';

export const authService = {
  // Signup (Admin creates company)
  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Signin
  signin: async (data: SigninFormData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordFormData) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset Password
  resetPassword: async (token: string, data: ResetPasswordFormData) => {
    const response = await api.post('/auth/reset-password', { token, ...data });
    return response.data;
  },

  // Verify Token
  verifyToken: async () => {
    const response = await api.post('/auth/verify-token');
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
};
```

### src/services/users.service.ts
```typescript
import api from './api';
import { CreateUserFormData, UsersResponse } from '@types/user.types';

export const usersService = {
  // Get all users in company
  getUsers: async (): Promise<UsersResponse> => {
    const response = await api.get('/users');
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user (Admin only)
  createUser: async (data: CreateUserFormData) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: Partial<CreateUserFormData>) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // Deactivate user
  deactivateUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Send password setup email
  sendPasswordEmail: async (id: string) => {
    const response = await api.post(`/users/${id}/send-password`);
    return response.data;
  },

  // Get user's manager
  getManager: async (id: string) => {
    const response = await api.get(`/users/${id}/manager`);
    return response.data;
  },

  // Assign manager
  assignManager: async (userId: string, managerId: string) => {
    const response = await api.post(`/users/${userId}/manager`, { managerId });
    return response.data;
  },
};
```

### src/services/expenses.service.ts
```typescript
import api from './api';
import { ExpenseFormData, Expense } from '@types/expense.types';

export const expensesService = {
  // Get all expenses (filtered by role)
  getExpenses: async (params?: {
    status?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },

  // Get expense by ID
  getExpense: async (id: string) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  // Create expense
  createExpense: async (data: ExpenseFormData) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  // Update expense
  updateExpense: async (id: string, data: Partial<ExpenseFormData>) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  // Delete expense (draft only)
  deleteExpense: async (id: string) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  // Submit expense for approval
  submitExpense: async (id: string) => {
    const response = await api.post(`/expenses/${id}/submit`);
    return response.data;
  },

  // Get expense approval history
  getExpenseHistory: async (id: string) => {
    const response = await api.get(`/expenses/${id}/history`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create category (Admin only)
  createCategory: async (name: string, description?: string) => {
    const response = await api.post('/categories', { name, description });
    return response.data;
  },
};
```

### src/services/approvals.service.ts
```typescript
import api from './api';
import { ApprovalRule, PendingApproval } from '@types/approval.types';

export const approvalsService = {
  // Get all approval rules
  getApprovalRules: async () => {
    const response = await api.get('/approval-rules');
    return response.data;
  },

  // Get approval rule by ID
  getApprovalRule: async (id: string) => {
    const response = await api.get(`/approval-rules/${id}`);
    return response.data;
  },

  // Create approval rule (Admin only)
  createApprovalRule: async (data: Omit<ApprovalRule, 'id' | 'companyId' | 'createdAt'>) => {
    const response = await api.post('/approval-rules', data);
    return response.data;
  },

  // Update approval rule
  updateApprovalRule: async (id: string, data: Partial<ApprovalRule>) => {
    const response = await api.put(`/approval-rules/${id}`, data);
    return response.data;
  },

  // Delete approval rule
  deleteApprovalRule: async (id: string) => {
    const response = await api.delete(`/approval-rules/${id}`);
    return response.data;
  },

  // Get pending approvals for current user
  getPendingApprovals: async () => {
    const response = await api.get('/approvals/pending');
    return response.data;
  },

  // Approve expense
  approveExpense: async (approvalId: string, comments?: string) => {
    const response = await api.post(`/approvals/${approvalId}/approve`, { comments });
    return response.data;
  },

  // Reject expense
  rejectExpense: async (approvalId: string, comments: string) => {
    const response = await api.post(`/approvals/${approvalId}/reject`, { comments });
    return response.data;
  },

  // Get approval details for expense
  getApprovalDetails: async (expenseId: string) => {
    const response = await api.get(`/approvals/${expenseId}`);
    return response.data;
  },
};
```

### src/services/currency.service.ts
```typescript
import api from './api';
import { Country, CurrencyConversionRequest, CurrencyConversionResponse } from '@types/currency.types';

export const currencyService = {
  // Get all countries with currencies
  getCountries: async (): Promise<{ data: Country[] }> => {
    const response = await api.get('/currency/countries');
    return response.data;
  },

  // Convert currency
  convertCurrency: async (data: CurrencyConversionRequest): Promise<{ data: CurrencyConversionResponse }> => {
    const response = await api.post('/currency/convert', data);
    return response.data;
  },

  // Get exchange rates for base currency
  getExchangeRates: async (baseCurrency: string) => {
    const response = await api.get(`/currency/rates/${baseCurrency}`);
    return response.data;
  },
};
```

### src/services/upload.service.ts
```typescript
import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadService = {
  uploadReceipt: async (file: File, companyId: string, expenseId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `expense_management/receipts/${companyId}/${expenseId}`);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
    };
  },
};
```

---

## Custom Hooks

### src/hooks/useAuth.ts
```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/auth.service';
import { User } from '@types/auth.types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authService.verifyToken();
      if (response.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isManager,
    isEmployee,
    isAuthenticated: !!user,
  };
};
```

### src/hooks/useExpenses.ts
```typescript
import { useState, useEffect } from 'react';
import { expensesService } from '@services/expenses.service';
import { Expense, ExpenseFormData } from '@types/expense.types';
import toast from 'react-hot-toast';

interface UseExpensesOptions {
  status?: string;
  categoryId?: string;
  autoFetch?: boolean;
}

export const useExpenses = (options: UseExpensesOptions = {}) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await expensesService.getExpenses({
        status: options.status,
        categoryId: options.categoryId,
      });
      setExpenses(response.data.expenses);
    } catch (err) {
      setError('Failed to fetch expenses');
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: ExpenseFormData) => {
    try {
      setLoading(true);
      const response = await expensesService.createExpense(data);
      toast.success('Expense created successfully');
      await fetchExpenses();
      return response.data.expense;
    } catch (err) {
      toast.error('Failed to create expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseFormData>) => {
    try {
      setLoading(true);
      const response = await expensesService.updateExpense(id, data);
      toast.success('Expense updated successfully');
      await fetchExpenses();
      return response.data.expense;
    } catch (err) {
      toast.error('Failed to update expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await expensesService.deleteExpense(id);
      toast.success('Expense deleted successfully');
      await fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitExpense = async (id: string) => {
    try {
      setLoading(true);
      await expensesService.submitExpense(id);
      toast.success('Expense submitted for approval');
      await fetchExpenses();
    } catch (err) {
      toast.error('Failed to submit expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchExpenses();
    }
  }, [options.status, options.categoryId]);

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    submitExpense,
  };
};
```

### src/hooks/useDebounce.ts
```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

## Context Providers

### src/context/AuthContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@services/auth.service';
import { User, SignupFormData, SigninFormData } from '@types/auth.types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (data: SignupFormData) => Promise<void>;
  signin: (data: SigninFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      const response = await authService.verifyToken();
      if (response.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupFormData) => {
    try {
      const response = await authService.signup(data);
      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const signin = async (data: SigninFormData) => {
    try {
      const response = await authService.signin(data);
      if (response.success) {
        const { user: userData, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    loading,
    signup,
    signin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
```

---

## Component Examples

### src/components/common/Button.tsx
```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 disabled:bg-secondary-300',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 disabled:border-neutral-300 disabled:text-neutral-300',
    danger: 'bg-error text-white hover:bg-error-dark focus:ring-error disabled:bg-error-light',
    success: 'bg-success text-white hover:bg-success-dark focus:ring-success disabled:bg-success-light',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};
```

### src/components/common/SearchableSelect.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useDebounce } from '@hooks/useDebounce';

interface Option {
  value: string;
  label: string;
  meta?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    opt.meta?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-2 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            error ? 'border-error' : 'border-neutral-300'
          } ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'hover:border-primary-400'}`}
        >
          <span className={selectedOption ? 'text-neutral-900' : 'text-neutral-400'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`absolute right-3 top-3 w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-medium max-h-64 overflow-hidden"
            >
              <div className="p-2 border-b border-neutral-200">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                </div>
              </div>

              <div className="overflow-y-auto max-h-48">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-neutral-500 text-center">No results found</div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-primary-50 flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-neutral-900">{option.label}</div>
                        {option.meta && <div className="text-xs text-neutral-500">{option.meta}</div>}
                      </div>
                      {option.value === value && <Check className="w-4 h-4 text-primary-500" />}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
};
```

### src/components/expenses/ReceiptUpload.tsx
```typescript
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadService } from '@services/upload.service';
import toast from 'react-hot-toast';

interface ReceiptUploadProps {
  onUploadComplete: (url: string, publicId: string) => void;
  currentReceiptUrl?: string;
  onRemove?: () => void;
  companyId: string;
  expenseId: string;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
  onUploadComplete,
  currentReceiptUrl,
  onRemove,
  companyId,
  expenseId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentReceiptUrl || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploading(true);
      const { url, publicId } = await uploadService.uploadReceipt(file, companyId, expenseId);
      onUploadComplete(url, publicId);
      toast.success('Receipt uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload receipt');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [companyId, expenseId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
  };

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <img
          src={preview}
          alt="Receipt preview"
          className="w-full h-64 object-cover rounded-lg border-2 border-neutral-200"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-sm text-neutral-600">Uploading receipt...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-12 h-12 text-neutral-400" />
          <p className="text-base font-medium text-neutral-700">
            {isDragActive ? 'Drop the receipt here' : 'Drag & drop receipt image'}
          </p>
          <p className="text-sm text-neutral-500">or click to browse (max 5MB)</p>
        </div>
      )}
    </div>
  );
};
```

---

## Key Implementation Features

### 1. **Country Dropdown with REST Countries API**
Fetch countries from `https://restcountries.com/v3.1/all?fields=name,currencies` in the Signup page and populate SearchableSelect component with virtual scrolling for large lists.

### 2. **OCR Auto-fill Flow**
- Upload receipt → Get Cloudinary URL
- Backend triggers OCR processing via queue
- Poll OCR results endpoint every 2 seconds
- Auto-fill form fields when OCR completes
- Show confidence scores
- Allow manual override

### 3. **Approval Workflow UI**
- **Admin**: Configure rules with drag-drop approver sequence
- **Manager**: View pending approvals queue with approve/reject modals
- **Employee**: See real-time status timeline (Draft → Submitted → 50% Approved → Approved)

### 4. **Currency Conversion Display**
- Show original amount + currency
- Show converted amount in company currency
- Display exchange rate used
- Cache conversion rates

### 5. **Email Integration via SMTP**
Use Nodemailer with Gmail SMTP:
```env
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=app_specific_password
```

### 6. **Framer Motion Animations (Subtle)**
```typescript
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' }
};
```
Apply to page transitions, modal opens, list items.

### 7. **Responsive Design**
- Mobile: Single column, bottom navigation
- Tablet: Collapsible sidebar
- Desktop: Full sidebar, multi-column layouts

### 8. **Error Handling**
- API errors: Show toast notifications
- Form validation: Real-time with Zod + React Hook Form
- Network errors: Retry mechanism with exponential backoff

### 9. **Loading States**
- Skeleton loaders for tables
- Spinner for buttons during actions
- Progress bar for file uploads

### 10. **Security**
- JWT stored in localStorage (consider httpOnly cookies for production)
- Auto-logout on 401 response
- CSRF protection (if needed)
- XSS prevention via React's built-in escaping

---

## Routing Structure

### src/routes.tsx
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import ProtectedRoute from '@components/layout/ProtectedRoute';

// Auth pages
import Signup from '@pages/auth/Signup';
import Signin from '@pages/auth/Signin';
import ForgotPassword from '@pages/auth/ForgotPassword';
import ResetPassword from '@pages/auth/ResetPassword';

// Dashboard pages
import AdminDashboard from '@pages/dashboard/AdminDashboard';
import ManagerDashboard from '@pages/dashboard/ManagerDashboard';
import EmployeeDashboard from '@pages/dashboard/EmployeeDashboard';

// User management
import UsersManagement from '@pages/users/UsersManagement';

// Expenses
import ExpensesList from '@pages/expenses/ExpensesList';
import CreateExpense from '@pages/expenses/CreateExpense';
import EditExpense from '@pages/expenses/EditExpense';
import ExpenseDetails from '@pages/expenses/ExpenseDetails';

// Approvals
import ApprovalRules from '@pages/approvals/ApprovalRules';
import PendingApprovals from '@pages/approvals/PendingApprovals';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/approval-rules"
            element={
              <ProtectedRoute requiredRole="admin">
                <ApprovalRules />
              </ProtectedRoute>
            }
          />

          {/* Manager routes */}
          <Route
            path="/pending-approvals"
            element={
              <ProtectedRoute requiredRole="manager">
                <PendingApprovals />
              </ProtectedRoute>
            }
          />

          {/* Expense routes (all roles) */}
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpensesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses/create"
            element={
              <ProtectedRoute>
                <CreateExpense />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses/:id/edit"
            element={
              <ProtectedRoute>
                <EditExpense />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses/:id"
            element={
              <ProtectedRoute>
                <ExpenseDetails />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Helper component to route based on role
const RoleDashboard = () => {
  const { user } = useAuthContext();
  
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'manager') return <ManagerDashboard />;
  return <EmployeeDashboard />;
};

export default AppRoutes;
```

---

## Summary

This prompt provides a complete blueprint for building the React frontend with:

1. **Complete folder structure** matching the backend architecture
2. **All TypeScript types** for type safety
3. **API services** with Axios and proper error handling
4. **Custom hooks** for reusable logic
5. **Context providers** for global state
6. **Reusable components** with Tailwind CSS + Framer Motion
7. **Routing structure** with role-based access
8. **Configuration files** for Vite, Tailwind, TypeScript
9. **Key features**: OCR integration, currency conversion, approval workflows
10. **SMTP email integration** via Nodemailer on backend

All API calls are clearly documented with endpoints, request/response formats, and error handling. The design uses **custom Tailwind CSS styling** (no Material-UI or Ant Design patterns) with **subtle Framer Motion animations** for a professional, modern look.
