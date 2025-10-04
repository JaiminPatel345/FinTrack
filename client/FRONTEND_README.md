# Expense Management System - Frontend

A modern, full-featured React frontend for the Expense Management System with multi-currency support, OCR receipt processing, and configurable approval workflows.

## 🎯 Features Implemented

### ✅ Authentication & Authorization
- **Signup** with country selection and auto-currency detection
- **Signin** with JWT token management
- **Forgot Password** flow with email reset link
- **Reset Password** with token validation
- Role-based access control (Admin, Manager, Employee)
- Protected routes and public routes

### ✅ Dashboard
- Role-specific dashboard views
- Expense statistics cards (Total, Amount, Pending, Approved)
- Recent expenses list
- Pending approvals (for Managers/Admins)
- Quick action buttons

### ✅ Expense Management
- List all expenses with filters
- Search functionality
- Status filtering
- Create expense (placeholder - ready for form)
- View expense details
- Submit for approval workflow

### ✅ User Management (Admin only)
- User listing
- Add new users
- Placeholder for full CRUD operations

### ✅ Approval System
- Pending approvals view (Manager/Admin)
- Approval rules management (Admin)
- Placeholders for approval workflow UI

### ✅ UI Components (Chakra UI v3)
- **Button** - With loading states and animations
- **Input** - With labels, errors, and helper text
- **Select** - Native select with Chakra styling
- **SearchableSelect** - For country selection
- **Modal** - Animated dialog with Framer Motion
- **Table** - Generic table component
- **Card** - Flexible card component
- **Badge** - Status badges with color schemes
- **Loader** - Loading spinners
- **Toast** - Notifications system
- **FileUpload** - Drag & drop file uploader

### ✅ Layout Components
- **Header** - With user info, notifications, and logout
- **Sidebar** - Role-based navigation menu
- **DashboardLayout** - Complete layout wrapper

### ✅ Services Layer
- **API Client** - Axios with interceptors for auth tokens
- **Auth Service** - Signup, signin, forgot/reset password
- **Users Service** - User CRUD operations
- **Expenses Service** - Expense management
- **Approvals Service** - Approval rules and workflow
- **Currency Service** - Exchange rates and conversion
- **Upload Service** - File upload to Cloudinary
- **Notification Service** - In-app notifications
- **Countries Service** - Fetch countries from REST Countries API

### ✅ State Management (Redux Toolkit)
- **Auth Slice** - User authentication state
- **Users Slice** - Users management
- **Expenses Slice** - Expenses data
- **Approvals Slice** - Approval rules and pending approvals
- **Notifications Slice** - Notifications system

### ✅ Utilities
- **Constants** - App-wide constants (roles, status, categories)
- **Formatters** - Date, currency, number formatting
- **Validators** - Zod schemas for form validation
- **Helpers** - LocalStorage, debounce, error handling, etc.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **UI Library**: Chakra UI v3
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Icons**: Lucide React
- **Date Utils**: date-fns

## 📁 Project Structure

```
client/src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── SearchableSelect.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Loader.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Toast.tsx
│   │   └── Toaster.tsx
│   └── layout/          # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── DashboardLayout.tsx
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   │   ├── Signin.tsx
│   │   ├── Signup.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── dashboard/       # Dashboard
│   │   └── Dashboard.tsx
│   ├── expenses/        # Expense pages
│   │   ├── ExpensesList.tsx
│   │   ├── CreateExpense.tsx
│   │   └── ExpenseDetails.tsx
│   ├── users/           # User management
│   │   └── UsersManagement.tsx
│   └── approvals/       # Approvals
│       ├── PendingApprovals.tsx
│       └── ApprovalRules.tsx
├── services/            # API services
│   ├── apiClient.ts
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── expenses.service.ts
│   ├── approvals.service.ts
│   ├── currency.service.ts
│   ├── upload.service.ts
│   ├── notification.service.ts
│   └── countries.service.ts
├── store/               # Redux store
│   ├── index.ts
│   └── slices/
│       ├── authSlice.ts
│       ├── usersSlice.ts
│       ├── expensesSlice.ts
│       ├── approvalsSlice.ts
│       └── notificationsSlice.ts
├── types/               # TypeScript types
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── expense.types.ts
│   ├── approval.types.ts
│   ├── currency.types.ts
│   ├── notification.types.ts
│   └── common.types.ts
├── utils/               # Utility functions
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── hooks/               # Custom hooks
│   └── redux.ts
├── App.tsx              # Main app component
├── main.tsx             # Entry point
├── index.css            # Global styles
└── theme.ts             # Chakra UI theme

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd client
npm install
```

2. Set up environment variables:
```bash
# .env file should already exist with:
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Expense Management System
VITE_APP_VERSION=1.0.0
```

3. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Base URL
Update `VITE_API_BASE_URL` in `.env` to point to your backend API.

### Cloudinary Setup
Update the Cloudinary configuration in `src/services/upload.service.ts`:
- Replace `YOUR_CLOUD_NAME` with your actual Cloudinary cloud name
- Set up upload preset in Cloudinary dashboard

## 🎨 Customization

### Theme
Chakra UI theme is configured in `src/theme.ts`. You can customize colors, fonts, and other design tokens there.

### Constants
App-wide constants (roles, status, categories) are defined in `src/utils/constants.ts`.

## 📝 Next Steps to Complete

### High Priority
1. **Expense Form** - Complete form with receipt upload and OCR integration
2. **User Management** - Full CRUD with user creation modal
3. **Approval Workflow UI** - Approve/reject with comments
4. **Approval Rules Form** - Create/edit approval rules with step configuration

### Medium Priority
5. **Receipt Preview** - Image viewer modal
6. **Export Reports** - PDF/CSV export functionality
7. **Notifications Panel** - Full notifications page
8. **Profile Settings** - User profile update

### Nice to Have
9. **Advanced Filters** - Date range picker, category multi-select
10. **Bulk Operations** - Bulk approval/rejection
11. **Dashboard Charts** - Expense trends visualization
12. **Mobile Responsive** - Enhanced mobile experience

## 🔗 API Integration

All services are ready to connect to the backend API. Ensure your backend is running and the endpoints match the service method calls.

### Authentication Flow
1. User signs up → POST `/api/auth/signup`
2. Token stored in localStorage
3. Token added to all requests via Axios interceptor
4. 401 responses auto-redirect to login

### Error Handling
- All API errors are caught and displayed via toast notifications
- Network errors show user-friendly messages
- Form validation errors shown inline

## 🧪 TypeScript

The project uses strict TypeScript configuration:
- All types are defined in `src/types/`
- Service responses are typed
- Redux state is fully typed
- Form data is validated with Zod schemas

## 📦 Dependencies

### Core
- react: ^19.1.1
- react-dom: ^19.1.1
- react-router-dom: ^7.9.3
- typescript: ~5.9.3

### UI & Styling
- @chakra-ui/react: ^3.27.0
- framer-motion: ^12.23.22
- tailwindcss: ^4.1.14
- lucide-react: ^0.544.0

### State & Forms
- @reduxjs/toolkit: ^2.9.0
- react-redux: ^9.2.0
- react-hook-form: ^7.64.0
- zod: ^4.1.11

### Utilities
- axios: ^1.12.2
- date-fns: ^4.1.0
- react-dropzone: ^14.3.8

## 📄 License

This project is part of the Expense Management System.

---

**Built with ❤️ using React, TypeScript, and Chakra UI**
