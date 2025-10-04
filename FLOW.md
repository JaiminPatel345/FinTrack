# Expense Management System - Implementation Prompt

## Project Overview
Build a microservices-based expense management system with React.js frontend, Node.js backend services, Python OCR service, and PostgreSQL/MongoDB databases. The system handles multi-currency expenses with configurable approval workflows.

---

## Tech Stack

### Frontend
- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS (custom configuration with brand colors)
- **Animations**: Framer Motion (subtle, non-obvious usage)
- **State Management**: React Context API + Custom Hooks
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Date Handling**: date-fns
- **File Upload**: React Dropzone

### Backend Services
- **API Gateway**: Node.js + Express + TypeScript
- **Auth Service**: Node.js + Express + JWT + bcrypt
- **User Management Service**: Node.js + Express
- **Expense Service**: Node.js + Express
- **Approval Workflow Service**: Node.js + Express
- **Currency Service**: Node.js + Express + node-cron
- **OCR Service**: Python + Flask + Tesseract OCR / EasyOCR
- **Notification Service**: Node.js + Express + Nodemailer
- **Message Queue**: PostgreSQL with pg-boss (job queue)

### Databases
- **PostgreSQL**: Auth, Users, Expenses, Approvals, Currency
- **MongoDB**: Audit Logs, OCR Results, Notifications

### File Storage
- **Cloudinary**: Receipt images in `/expense_management/receipts/` folder

### Email Service
- **Nodemailer**: Gmail SMTP with app password

---

## Folder Structure

```
expense-management-system/
│
├── client/                                 # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── assets/                        # Images, icons, fonts
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   │
│   │   ├── components/                    # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── SearchableSelect.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Loader.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── FileUpload.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── DashboardLayout.tsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   ├── SigninForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── UsersTable.tsx
│   │   │   │   ├── UserModal.tsx
│   │   │   │   └── SendPasswordModal.tsx
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── ExpenseList.tsx
│   │   │   │   ├── ExpenseForm.tsx
│   │   │   │   ├── ExpenseCard.tsx
│   │   │   │   ├── ReceiptUpload.tsx
│   │   │   │   ├── StatusTimeline.tsx
│   │   │   │   └── ExpenseFilters.tsx
│   │   │   │
│   │   │   └── approvals/
│   │   │       ├── ApprovalRulesForm.tsx
│   │   │       ├── ApprovalsList.tsx
│   │   │       ├── ApprovalCard.tsx
│   │   │       ├── ApprovalModal.tsx
│   │   │       └── ApproverSequence.tsx
│   │   │
│   │   ├── pages/                         # Page components
│   │   │   ├── auth/
│   │   │   │   ├── Signup.tsx
│   │   │   │   ├── Signin.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ResetPassword.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ManagerDashboard.tsx
│   │   │   │   └── EmployeeDashboard.tsx
│   │   │   │
│   │   │   ├── users/
│   │   │   │   └── UsersManagement.tsx
│   │   │   │
│   │   │   ├── expenses/
│   │   │   │   ├── ExpensesList.tsx
│   │   │   │   ├── CreateExpense.tsx
│   │   │   │   ├── EditExpense.tsx
│   │   │   │   └── ExpenseDetails.tsx
│   │   │   │
│   │   │   └── approvals/
│   │   │       ├── ApprovalRules.tsx
│   │   │       └── PendingApprovals.tsx
│   │   │
│   │   ├── hooks/                         # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUsers.ts
│   │   │   ├── useExpenses.ts
│   │   │   ├── useApprovals.ts
│   │   │   ├── useCurrency.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useToast.ts
│   │   │
│   │   ├── context/                       # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   │
│   │   ├── services/                      # API service calls
│   │   │   ├── api.ts                     # Axios instance
│   │   │   ├── auth.service.ts
│   │   │   ├── users.service.ts
│   │   │   ├── expenses.service.ts
│   │   │   ├── approvals.service.ts
│   │   │   ├── currency.service.ts
│   │   │   └── upload.service.ts
│   │   │
│   │   ├── utils/                         # Utility functions
│   │   │   ├── formatters.ts              # Date, currency formatters
│   │   │   ├── validators.ts              # Form validators
│   │   │   ├── constants.ts               # App constants
│   │   │   └── helpers.ts                 # Helper functions
│   │   │
│   │   ├── types/                         # TypeScript types (shared)
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── expense.types.ts
│   │   │   ├── approval.types.ts
│   │   │   ├── currency.types.ts
│   │   │   └── common.types.ts
│   │   │
│   │   ├── styles/                        # Global styles
│   │   │   ├── globals.css
│   │   │   ├── animations.css
│   │   │   └── themes.css
│   │   │
│   │   ├── App.tsx                        # Main App component
│   │   ├── main.tsx                       # Entry point
│   │   └── routes.tsx                     # Route configuration
│   │
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── .prettierrc
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                                 # Backend Services
│   │
│   ├── shared/                            # Shared code across services
│   │   ├── types/                         # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── expense.types.ts
│   │   │   ├── approval.types.ts
│   │   │   ├── currency.types.ts
│   │   │   ├── notification.types.ts
│   │   │   └── common.types.ts
│   │   │
│   │   ├── utils/                         # Shared utilities
│   │   │   ├── logger.ts
│   │   │   ├── errors.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── middleware/                    # Shared middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   │
│   │   └── database/                      # Database configs
│   │       ├── postgres.ts
│   │       └── mongodb.ts
│   │
│   ├── api-gateway/                       # API Gateway Service
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── expenses.routes.ts
│   │   │   │   ├── approvals.routes.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── proxy.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── cors.middleware.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── services.config.ts
│   │   │   │   └── proxy.config.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth-service/                      # Authentication Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   └── company.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.ts
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   └── jwt.middleware.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── jwt.util.ts
│   │   │   │   ├── password.util.ts
│   │   │   │   └── email.util.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── database.config.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── user-service/                      # User Management Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── user.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── user.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   └── manager-relationship.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── user.routes.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── expense-service/                   # Expense Management Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── expense.controller.ts
│   │   │   │   └── category.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── expense.service.ts
│   │   │   │   └── category.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── expense.model.ts
│   │   │   │   ├── expense-line-item.model.ts
│   │   │   │   └── category.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── expense.routes.ts
│   │   │   │   └── category.routes.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── approval-service/                  # Approval Workflow Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── approval-rule.controller.ts
│   │   │   │   └── approval.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── approval-rule.service.ts
│   │   │   │   └── approval.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── approval-rule.model.ts
│   │   │   │   ├── approval-step.model.ts
│   │   │   │   ├── expense-approval.model.ts
│   │   │   │   └── approval-action.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   ├── approval-rule.routes.ts
│   │   │   │   └── approval.routes.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── currency-service/                  # Currency Conversion Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── currency.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   └── currency.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── exchange-rate.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── currency.routes.ts
│   │   │   │
│   │   │   ├── jobs/
│   │   │   │   └── sync-rates.job.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ocr-service/                       # OCR Service (Python)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── ocr_controller.py
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── ocr_service.py
│   │   │   │   └── receipt_parser.py
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── ocr_result.py
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── image_processor.py
│   │   │   │   └── text_extractor.py
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── database.py
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── ocr_routes.py
│   │   │   │
│   │   │   ├── app.py
│   │   │   └── server.py
│   │   │
│   │   ├── requirements.txt
│   │   ├── .env.example
│   │   └── README.md
│   │
│   ├── notification-service/              # Notification Service
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── notification.controller.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── email.service.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   └── notification.model.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.ts
│   │   │   │
│   │   │   ├── templates/
│   │   │   │   ├── welcome.html
│   │   │   │   ├── reset-password.html
│   │   │   │   ├── expense-submitted.html
│   │   │   │   ├── expense-approved.html
│   │   │   │   └── expense-rejected.html
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── nodemailer.config.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── queue-service/                     # Message Queue (pg-boss)
│       ├── src/
│       │   ├── workers/
│       │   │   ├── ocr-processor.worker.ts
│       │   │   ├── email.worker.ts
│       │   │   └── approval.worker.ts
│       │   │
│       │   ├── config/
│       │   │   └── queue.config.ts
│       │   │
│       │   ├── app.ts
│       │   └── server.ts
│       │
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── database/                              # Database scripts
│   ├── postgres/
│   │   ├── migrations/
│   │   │   ├── 001_create_companies.sql
│   │   │   ├── 002_create_users.sql
│   │   │   ├── 003_create_manager_relationships.sql
│   │   │   ├── 004_create_expense_categories.sql
│   │   │   ├── 005_create_expenses.sql
│   │   │   ├── 006_create_expense_line_items.sql
│   │   │   ├── 007_create_approval_rules.sql
│   │   │   ├── 008_create_approval_steps.sql
│   │   │   ├── 009_create_expense_approvals.sql
│   │   │   ├── 010_create_approval_actions.sql
│   │   │   ├── 011_create_exchange_rates.sql
│   │   │   └── 012_create_pgboss_tables.sql
│   │   │
│   │   └── seeds/
│   │       ├── categories.sql
│   │       └── test-data.sql
│   │
│   └── mongodb/
│       ├── collections/
│       │   ├── audit_logs.js
│       │   ├── ocr_results.js
│       │   └── notifications.js
│       │
│       └── indexes/
│           ├── audit_logs.indexes.js
│           ├── ocr_results.indexes.js
│           └── notifications.indexes.js
│
├── docs/                                  # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
├── .gitignore
├── docker-compose.yml
├── README.md
└── package.json (root workspace)
```

---

## Database Schema Design

### PostgreSQL Schema

#### 1. Companies Table
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_actions_expense_approval ON approval_actions(expense_approval_id);
CREATE INDEX idx_approval_actions_approver ON approval_actions(approver_id);
CREATE INDEX idx_approval_actions_action ON approval_actions(action);
```

#### 11. Exchange Rates Table
```sql
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    base_currency VARCHAR(3) NOT NULL,
    target_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(15, 6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(base_currency, target_currency, effective_date)
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(base_currency, target_currency);
CREATE INDEX idx_exchange_rates_date ON exchange_rates(effective_date);
```

---

### MongoDB Schema

#### 1. Audit Logs Collection
```javascript
{
    _id: ObjectId,
    company_id: UUID,
    user_id: UUID,
    entity_type: String, // "expense", "user", "approval", "company"
    entity_id: UUID,
    action: String, // "create", "update", "delete", "approve", "reject"
    changes: {
        field_name: {
            old_value: Mixed,
            new_value: Mixed
        }
    },
    ip_address: String,
    user_agent: String,
    timestamp: ISODate,
    metadata: Object
}

// Indexes
db.audit_logs.createIndex({ company_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ user_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ entity_type: 1, entity_id: 1 });
db.audit_logs.createIndex({ timestamp: -1 });
```

#### 2. OCR Results Collection
```javascript
{
    _id: ObjectId,
    expense_id: UUID,
    company_id: UUID,
    user_id: UUID,
    
    // Receipt Image
    receipt_url: String,
    file_name: String,
    file_size: Number,
    
    // OCR Processing
    ocr_status: String, // "pending", "processing", "completed", "failed"
    ocr_provider: String, // "tesseract", "easyocr"
    
    // Extracted Data
    extracted_data: {
        vendor_name: String,
        vendor_address: String,
        date: String,
        total_amount: Number,
        currency: String,
        tax_amount: Number,
        line_items: [
            {
                description: String,
                quantity: Number,
                unit_price: Number,
                amount: Number
            }
        ],
        payment_method: String,
        receipt_number: String
    },
    
    // Confidence Scores
    confidence_scores: {
        overall: Number,
        vendor_name: Number,
        date: Number,
        amount: Number
    },
    
    // Raw OCR Output
    raw_text: String,
    
    // Metadata
    processing_time_ms: Number,
    processed_at: ISODate,
    created_at: ISODate
}

// Indexes
db.ocr_results.createIndex({ expense_id: 1 });
db.ocr_results.createIndex({ company_id: 1, created_at: -1 });
db.ocr_results.createIndex({ ocr_status: 1 });
```

#### 3. Notifications Collection
```javascript
{
    _id: ObjectId,
    company_id: UUID,
    user_id: UUID,
    
    // Notification Details
    type: String, // "expense_submitted", "approval_pending", "expense_approved", "expense_rejected", "password_reset"
    title: String,
    message: String,
    
    // Related Entity
    entity_type: String, // "expense", "approval"
    entity_id: UUID,
    
    // Channel
    channels: [String], // ["in_app", "email"]
    
    // Status
    is_read: Boolean,
    read_at: ISODate,
    
    // Delivery Status
    email_sent: Boolean,
    email_sent_at: ISODate,
    email_error: String,
    
    // Metadata
    priority: String, // "low", "medium", "high"
    created_at: ISODate,
    expires_at: ISODate
}

// Indexes
db.notifications.createIndex({ user_id: 1, created_at: -1 });
db.notifications.createIndex({ user_id: 1, is_read: 1 });
db.notifications.createIndex({ created_at: -1 });
db.notifications.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }); // TTL index
```

---

## Core Features Implementation

### 1. Authentication & User Management

#### Signup Flow
1. User fills: Name, Email, Password, Confirm Password, Country (searchable dropdown)
2. Fetch countries from `https://restcountries.com/v3.1/all?fields=name,currencies`
3. Create Company with selected country's currency
4. Create Admin user with hashed password (bcrypt)
5. Send welcome email via Nodemailer
6. Auto-login with JWT token

#### Signin Flow
1. User enters Email, Password
2. Validate credentials
3. Generate JWT token (24h expiry)
4. Return user data + token
5. Store token in localStorage (client)

#### Forgot Password Flow
1. User enters email
2. Generate reset token (UUID) + expiry (1 hour)
3. Store in `users.reset_token` and `users.reset_token_expiry`
4. Send reset link via email: `http://frontend-url/reset-password?token={reset_token}`
5. User clicks link, enters new password
6. Validate token & expiry
7. Update password, clear token

#### User Management (Admin Only)
- View all users in company
- Create new user (Employee/Manager)
- Assign manager to employee
- Send password setup email (contains temp password or setup link)
- Change user roles
- Deactivate users (soft delete with `is_active = false`)

---

### 2. Expense Submission (Employee)

#### Create Expense Flow
1. **Receipt Upload**
   - User uploads receipt image via drag-drop or file picker
   - Upload to Cloudinary: `/expense_management/receipts/{company_id}/{expense_id}/`
   - Store `receipt_url` and `receipt_public_id`
   - Trigger OCR processing (async via queue)

2. **OCR Processing**
   - Queue job: `ocr-process`
   - Python service extracts: vendor, date, amount, currency, line items
   - Store results in MongoDB `ocr_results` collection
   - Update expense with extracted data
   - Set `ocr_processed = true` and `ocr_confidence` score

3. **Form Filling**
   - Auto-fill from OCR: Description, Amount, Currency, Date
   - User can edit/override OCR data
   - Additional fields: Category, Paid By, GST%, Remarks

4. **Currency Conversion**
   - If expense currency ≠ company currency
   - Fetch exchange rate from Currency Service
   - Calculate `converted_amount = amount × exchange_rate`
   - Store both original and converted amounts

5. **Save as Draft**
   - Status: `draft`
   - User can edit anytime

6. **Submit for Approval**
   - Validate all required fields
   - Status: `submitted`
   - Set `submitted_at` timestamp
   - Trigger approval workflow
   - Send notification to first approver
   - Create audit log entry

#### View Expense History
- Filter by status: All, Draft, Submitted, Pending Approval, Approved, Rejected
- Show timeline: Draft → Submitted → 50% Approved → 100% Approved
- Display in table: Description, Date, Category, Amount (company currency), Status
- Click to view details with approval history

---

### 3. Approval Workflow

#### Define Approval Rules (Admin)
1. **Rule Configuration**
   - Name: e.g., "Approval rule for miscellaneous expenses"
   - Description: Custom text explaining rule
   - Category: Optional (specific category or all)
   - Amount Threshold: Min/Max amount range

2. **Manager Approval Toggle**
   - "Is manager an approver?" (Yes/No)
   - If Yes: First approver is employee's manager from `manager_relationships`

3. **Sequential Approvers**
   - Add approvers in sequence (Step 1, 2, 3...)
   - Each step: Select user or role
   - Reorder steps with drag-drop or up/down buttons

4. **Percentage Rule**
   - Set minimum approval percentage (e.g., 60%)
   - If met, expense auto-approves

5. **Specific Approver Rule**
   - Mark specific approver (e.g., CFO) as auto-approve
   - If they approve, skip remaining steps

6. **Hybrid Rule**
   - Combine both: 60% OR CFO approves → Auto-approve

#### Approval Execution Flow
1. **On Expense Submit**
   - Find matching approval rule (by category, amount, priority)
   - Create `expense_approvals` record
   - Set `total_steps` based on rule configuration
   - If `is_manager_approver = true`: Add manager as Step 1
   - Add configured approvers as subsequent steps
   - Create `approval_actions` records for each step (status: pending)

2. **Approval Request to First Approver**
   - Send notification (in-app + email)
   - Add to their "Approvals to Review" queue

3. **Manager/Approver Actions**
   - View expense details
   - See amount in company currency (converted)
   - See approval history (who approved, when, comments)
   - Action: Approve or Reject with optional comments

4. **On Approve**
   - Update `approval_actions.action = 'approved'`
   - Update `approval_actions.action_date`
   - Check if more approvers needed:
     - **Sequential**: Move to next step, notify next approver
     - **Percentage**: Calculate approval percentage
       - If ≥ threshold: Mark expense as approved
       - Else: Continue
     - **Specific Approver**: If auto-approve user approved, complete
     - **Hybrid**: Check both conditions
   - If all approvers done or threshold met:
     - Update `expense_approvals.status = 'approved'`
     - Update `expenses.status = 'approved'`
     - Set `expense_approvals.completed_at`
     - Send notification to employee
     - Remove from all pending queues
     - Create audit log

5. **On Reject**
   - Update `approval_actions.action = 'rejected'`
   - Update `approval_actions.comments`
   - Update `expense_approvals.status = 'rejected'`
   - Update `expenses.status = 'rejected'`
   - Send notification to employee with reason
   - Remove from all pending queues
   - Create audit log

#### Pending Approvals (Manager View)
- Show all expenses waiting for their approval
- Table columns: Description, Employee Name, Category, Amount (converted), Status, Actions
- Filter by category, date range
- Sort by submission date
- Action buttons: Approve, Reject (opens modal for comments)

---

### 4. Currency Service

#### Fetch Exchange Rates
- Cron job runs daily at 00:00 UTC
- Fetch rates from `https://api.exchangerate-api.com/v4/latest/{company_currency}`
- Store in `exchange_rates` table
- Cache in Redis (key: `currency:{base}:{target}`, TTL: 24h)

#### Convert Amount
- API endpoint: `POST /currency/convert`
- Body: `{ amount, from_currency, to_currency, date }`
- Logic:
  1. Check Redis cache
  2. If not found, query `exchange_rates` table for date
  3. If not in DB, fetch from external API
  4. Calculate: `converted_amount = amount × rate`
  5. Return converted amount + rate

---

### 5. Notification Service

#### Email Templates (HTML)
- Welcome email (on signup)
- Password reset email (with link)
- Password setup email (for new users)
- Expense submitted (to first approver)
- Expense approved (to employee)
- Expense rejected (to employee with reason)
- Approval reminder (if pending > 3 days)

#### Nodemailer Configuration
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});
```

#### Send Email Flow
1. Queue job: `send-email` with payload
2. Worker picks job from queue
3. Render HTML template with data
4. Send via Nodemailer
5. Store notification in MongoDB
6. Update delivery status (sent/failed)
7. Create audit log

#### In-App Notifications
- Real-time via polling (every 30s) or WebSocket (optional)
- Fetch unread notifications: `GET /notifications?is_read=false`
- Mark as read: `PATCH /notifications/:id/read`
- Show badge count on header icon

---

## UI Design Requirements

### Color Palette (Custom Brand Colors)
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary
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
          500: '#a855f7', // Main secondary
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
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
      },
    },
  },
}
```

### Animation Guidelines (Subtle Framer Motion)
```javascript
// Use subtle, professional animations
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" }
};

const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4 }
};

const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.2 }
};

// Avoid: Heavy bounces, spins, complex 3D transforms
// Do: Simple fades, slides, scales with easeOut
```

### Component Styling Principles
1. **No Library-Specific Patterns**
   - Don't use Material-UI paper/card patterns
   - Don't use Ant Design's bordered style
   - Don't use Chakra's colorScheme prop pattern
   - Create custom, unique component styles

2. **Custom Design Elements**
   - Rounded corners: Use `rounded-xl` (12px) for cards
   - Borders: Use `border border-neutral-200` with subtle shadows
   - Hover states: Subtle scale(1.02) + shadow increase
   - Focus states: Custom ring color matching brand
   - Buttons: Gradient backgrounds with hover effects

3. **Typography**
   - Headings: `font-display` (Poppins)
   - Body: `font-sans` (Inter)
   - Sizes: Use consistent scale (text-sm, text-base, text-lg, text-xl, text-2xl)

4. **Spacing**
   - Consistent padding: `p-4, p-6, p-8`
   - Card spacing: `space-y-6`
   - Form fields: `space-y-4`

5. **Interactive Elements**
   - Buttons: Smooth color transitions (duration-200)
   - Inputs: Border color change on focus
   - Tables: Row hover with background color change
   - Modals: Backdrop blur effect

---

## API Endpoints

### Authentication Service
```
POST   /api/auth/signup                # Admin signup
POST   /api/auth/signin                # User signin
POST   /api/auth/forgot-password       # Request password reset
POST   /api/auth/reset-password        # Reset password with token
POST   /api/auth/verify-token          # Verify JWT token
POST   /api/auth/refresh-token         # Refresh JWT token
```

### User Service
```
GET    /api/users                      # Get all users (Admin)
GET    /api/users/:id                  # Get user by ID
POST   /api/users                      # Create user (Admin)
PUT    /api/users/:id                  # Update user
DELETE /api/users/:id                  # Deactivate user
POST   /api/users/:id/send-password    # Send password setup email
GET    /api/users/:id/manager          # Get user's manager
POST   /api/users/:id/manager          # Assign manager
```

### Expense Service
```
GET    /api/expenses                   # Get all expenses (filtered by role)
GET    /api/expenses/:id               # Get expense by ID
POST   /api/expenses                   # Create expense
PUT    /api/expenses/:id               # Update expense
DELETE /api/expenses/:id               # Delete expense (draft only)
POST   /api/expenses/:id/submit        # Submit for approval
GET    /api/expenses/:id/history       # Get approval history
POST   /api/expenses/upload-receipt    # Upload receipt to Cloudinary
GET    /api/categories                 # Get expense categories
POST   /api/categories                 # Create category (Admin)
```

### Approval Service
```
GET    /api/approval-rules             # Get all approval rules
GET    /api/approval-rules/:id         # Get rule by ID
POST   /api/approval-rules             # Create approval rule (Admin)
PUT    /api/approval-rules/:id         # Update approval rule
DELETE /api/approval-rules/:id         # Delete approval rule
GET    /api/approvals/pending          # Get pending approvals for user
POST   /api/approvals/:id/approve      # Approve expense
POST   /api/approvals/:id/reject       # Reject expense
GET    /api/approvals/:expenseId       # Get approval details
```

### Currency Service
```
GET    /api/currency/countries         # Get all countries with currencies
GET    /api/currency/rates             # Get all exchange rates
POST   /api/currency/convert           # Convert amount between currencies
GET    /api/currency/rates/:base       # Get rates for base currency
```

### OCR Service
```
POST   /api/ocr/process                # Process receipt image
GET    /api/ocr/result/:expenseId      # Get OCR result
```

### Notification Service
```
GET    /api/notifications              # Get user notifications
GET    /api/notifications/unread       # Get unread count
PATCH  /api/notifications/:id/read     # Mark as read
DELETE /api/notifications/:id          # Delete notification
```

---

## Environment Variables

### Client (.env)
```env
VITE_API_GATEWAY_URL=http://localhost:5000
VITE_APP_NAME=Expense Management
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### API Gateway (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h

# Service URLs
AUTH_SERVICE_URL=http://localhost:5001
USER_SERVICE_URL=http://localhost:5002
EXPENSE_SERVICE_URL=http://localhost:5003
APPROVAL_SERVICE_URL=http://localhost:5004
CURRENCY_SERVICE_URL=http://localhost:5005
OCR_SERVICE_URL=http://localhost:5006
NOTIFICATION_SERVICE_URL=http://localhost:5007
```

### Auth Service (.env)
```env
PORT=5001
NODE_ENV=development

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_auth
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h

# Email (Nodemailer)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Other Services (.env)
```env
# Similar pattern for each service
PORT=50XX
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_xxx
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# MongoDB (for services using it)
MONGODB_URI=mongodb://localhost:27017/expense_xxx

# External APIs
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest
COUNTRIES_API=https://restcountries.com/v3.1/all

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### OCR Service (.env)
```env
PORT=5006
FLASK_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/expense_ocr

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Implementation Steps

### Phase 1: Setup & Infrastructure
1. Initialize mono-repo with workspaces
2. Setup PostgreSQL database and run migrations
3. Setup MongoDB and create collections with indexes
4. Configure Cloudinary account and folder structure
5. Setup pg-boss for message queue
6. Create shared types folder with all TypeScript interfaces

### Phase 2: Backend Services
1. **API Gateway**
   - Setup Express server with TypeScript
   - Configure routes and proxy middleware
   - Add authentication middleware (JWT verification)
   - Add rate limiting and CORS

2. **Auth Service**
   - Implement signup (company + admin creation)
   - Implement signin (JWT generation)
   - Implement forgot/reset password with email
   - Fetch countries from REST Countries API

3. **User Service**
   - CRUD operations for users
   - Manager-employee relationship management
   - Send password setup emails

4. **Expense Service**
   - CRUD for expenses
   - Receipt upload to Cloudinary
   - Trigger OCR processing via queue
   - Category management

5. **Approval Service**
   - Approval rules CRUD
   - Approval workflow execution
   - Sequential/percentage/hybrid logic
   - Approve/reject actions

6. **Currency Service**
   - Fetch and cache exchange rates
   - Currency conversion logic
   - Cron job for daily rate updates

7. **OCR Service (Python)**
   - Flask API setup
   - Tesseract/EasyOCR integration
   - Receipt parsing logic
   - Store results in MongoDB

8. **Notification Service**
   - Email sending via Nodemailer
   - HTML email templates
   - In-app notification storage
   - Queue workers for async sending

9. **Queue Service**
   - Setup pg-boss workers
   - OCR processing worker
   - Email sending worker
   - Approval notification worker

### Phase 3: Frontend Development
1. **Setup React App**
   - Vite + TypeScript + Tailwind
   - Configure custom Tailwind theme
   - Setup folder structure
   - Install dependencies (framer-motion, react-hook-form, zod, axios, etc.)

2. **Authentication Pages**
   - Signup form with searchable country dropdown
   - Signin form
   - Forgot password form
   - Reset password form
   - Auth context and protected routes

3. **Dashboard Layout**
   - Header with user menu and notifications
   - Sidebar with role-based navigation
   - Main content area
   - Responsive design

4. **User Management (Admin)**
   - Users table with filters
   - Create/edit user modal
   - Assign manager functionality
   - Send password email button

5. **Expense Management (Employee)**
   - Expense list with status filters
   - Create expense form with receipt upload
   - OCR-powered auto-fill
   - Status timeline component
   - Expense history view

6. **Approval Management (Admin)**
   - Approval rules configuration form
   - Sequential approver management
   - Percentage/specific approver options
   - Manager toggle

7. **Pending Approvals (Manager)**
   - Approval queue table
   - Approve/reject modal with comments
   - Currency conversion display
   - Real-time updates after action

8. **Notifications**
   - Notification dropdown in header
   - Unread badge count
   - Mark as read functionality
   - Toast notifications for actions

### Phase 4: Integration & Testing
1. Connect frontend to backend APIs
2. Test all user flows end-to-end
3. Test approval workflows (sequential, percentage, hybrid)
4. Test OCR accuracy and auto-fill
5. Test currency conversions
6. Test email sending
7. Handle error cases and edge cases

### Phase 5: Polish & Optimization
1. Add loading states and skeletons
2. Optimize API calls with caching
3. Add pagination for large lists
4. Improve error messages
5. Add form validation feedback
6. Optimize images and assets
7. Test responsive design on all devices

---

## Key Implementation Notes

### Searchable Country Dropdown
```typescript
// Fetch countries on component mount
const [countries, setCountries] = useState([]);
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(country => ({
        name: country.name.common,
        currency: Object.keys(country.currencies)[0],
        currencyName: Object.values(country.currencies)[0].name
      }));
      setCountries(formatted);
    });
}, []);

// Filter countries based on search
const filteredCountries = countries.filter(c =>
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Implement virtual scrolling for large list (react-window)
```

### OCR Processing with Queue
```typescript
// In Expense Service (after receipt upload)
await queueService.publishJob('ocr-process', {
  expenseId,
  receiptUrl,
  companyId,
  userId
});

// In OCR Worker
async function processOCR(job) {
  const { expenseId, receiptUrl } = job.data;
  
  // Download image from Cloudinary
  const image = await downloadImage(receiptUrl);
  
  // Process with OCR
  const result = await ocrService.extractText(image);
  
  // Parse receipt data
  const parsed = await receiptParser.parse(result.text);
  
  // Store in MongoDB
  await ocrResultModel.create({
    expense_id: expenseId,
    extracted_data: parsed,
    confidence_scores: result.confidence,
    raw_text: result.text
  });
  
  // Update expense with extracted data
  await expenseService.updateFromOCR(expenseId, parsed);
}
```

### Approval Workflow Logic
```typescript
async function handleApprove(approvalActionId, approverId, comments) {
  // Update approval action
  await approvalActionModel.update(approvalActionId, {
    action: 'approved',
    action_date: new Date(),
    comments
  });
  
  // Get approval instance
  const approval = await expenseApprovalModel.findById(approvalActionId);
  const rule = await approvalRuleModel.findById(approval.approval_rule_id);
  
  // Check rule type
  if (rule.rule_type === 'sequential') {
    // Move to next step
    if (approval.current_step < approval.total_steps) {
      await expenseApprovalModel.update(approval.id, {
        current_step: approval.current_step + 1
      });
      // Notify next approver
      await notifyNextApprover(approval);
    } else {
      // All steps complete
      await markExpenseApproved(approval.expense_id);
    }
  } else if (rule.rule_type === 'percentage') {
    // Calculate approval percentage
    const totalActions = await approvalActionModel.countByApproval(approval.id);
    const approvedActions = await approvalActionModel.countApproved(approval.id);
    const percentage = (approvedActions / totalActions) * 100;
    
    if (percentage >= rule.percentage_required) {
      await markExpenseApproved(approval.expense_id);
    }
  } else if (rule.rule_type === 'specific_approver') {
    // Check if approver has auto-approve permission
    const step = await approvalStepModel.findByApprover(approverId);
    if (step.is_auto_approve) {
      await markExpenseApproved(approval.expense_id);
    }
  } else if (rule.rule_type === 'hybrid') {
    // Check both conditions
    // ... implement hybrid logic
  }
}
```

### Currency Conversion
```typescript
async function convertCurrency(amount, fromCurrency, toCurrency, date = new Date()) {
  // Check Redis cache
  const cacheKey = `currency:${fromCurrency}:${toCurrency}:${date.toISOString().split('T')[0]}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return {
      converted_amount: amount * parseFloat(cached),
      exchange_rate: parseFloat(cached)
    };
  }
  
  // Query database
  const rate = await exchangeRateModel.findByDate(fromCurrency, toCurrency, date);
  
  if (rate) {
    // Cache for 24 hours
    await redis.setex(cacheKey, 86400, rate.rate.toString());
    return {
      converted_amount: amount * rate.rate,
      exchange_rate: rate.rate
    };
  }
  
  // Fetch from external API
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const data = await response.json();
  const fetchedRate = data.rates[toCurrency];
  
  // Store in database
  await exchangeRateModel.create({
    base_currency: fromCurrency,
    target_currency: toCurrency,
    rate: fetchedRate,
    effective_date: date
  });
  
  // Cache
  await redis.setex(cacheKey, 86400, fetchedRate.toString());
  
  return {
    converted_amount: amount * fetchedRate,
    exchange_rate: fetchedRate
  };
}
```

---

## Message Queue with pg-boss (PostgreSQL-based)

### Setup pg-boss
```typescript
// shared/queue/queue.config.ts
import PgBoss from 'pg-boss';

const boss = new PgBoss({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  schema: 'pgboss' // Separate schema for queue tables
});

boss.on('error', error => console.error('PgBoss error:', error));

export async function startQueue() {
  await boss.start();
  console.log('PgBoss queue started');
}

export async function stopQueue() {
  await boss.stop();
  console.log('PgBoss queue stopped');
}

export default boss;
```

### Define Job Types
```typescript
// shared/types/queue.types.ts
export enum JobType {
  OCR_PROCESS = 'ocr-process',
  SEND_EMAIL = 'send-email',
  APPROVAL_NOTIFICATION = 'approval-notification',
  CURRENCY_SYNC = 'currency-sync',
}

export interface OCRProcessJob {
  expenseId: string;
  receiptUrl: string;
  companyId: string;
  userId: string;
}

export interface SendEmailJob {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface ApprovalNotificationJob {
  expenseId: string;
  approverId: string;
  type: 'pending' | 'approved' | 'rejected';
}
```

### Publish Jobs
```typescript
// In Expense Service (after receipt upload)
import boss from '@/shared/queue/queue.config';
import { JobType, OCRProcessJob } from '@/shared/types/queue.types';

async function triggerOCRProcessing(expenseId: string, receiptUrl: string) {
  const jobData: OCRProcessJob = {
    expenseId,
    receiptUrl,
    companyId: req.user.companyId,
    userId: req.user.id
  };
  
  await boss.send(JobType.OCR_PROCESS, jobData, {
    retryLimit: 3,
    retryDelay: 60, // 1 minute
    expireInSeconds: 3600 // 1 hour
  });
}
```

### Worker Implementation
```typescript
// queue-service/src/workers/ocr-processor.worker.ts
import boss from '@/shared/queue/queue.config';
import { JobType, OCRProcessJob } from '@/shared/types/queue.types';
import axios from 'axios';

export async function startOCRWorker() {
  await boss.work<OCRProcessJob>(
    JobType.OCR_PROCESS,
    { teamSize: 5, teamConcurrency: 2 },
    async (job) => {
      const { expenseId, receiptUrl, companyId, userId } = job.data;
      
      try {
        console.log(`Processing OCR for expense: ${expenseId}`);
        
        // Call OCR service
        const response = await axios.post(
          `${process.env.OCR_SERVICE_URL}/api/ocr/process`,
          { expenseId, receiptUrl, companyId, userId }
        );
        
        console.log(`OCR completed for expense: ${expenseId}`);
        return response.data;
      } catch (error) {
        console.error(`OCR failed for expense: ${expenseId}`, error);
        throw error; // Will trigger retry
      }
    }
  );
  
  console.log('OCR worker started');
}
```

```typescript
// queue-service/src/workers/email.worker.ts
import boss from '@/shared/queue/queue.config';
import { JobType, SendEmailJob } from '@/shared/types/queue.types';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function startEmailWorker() {
  await boss.work<SendEmailJob>(
    JobType.SEND_EMAIL,
    { teamSize: 3, teamConcurrency: 5 },
    async (job) => {
      const { to, subject, template, data } = job.data;
      
      try {
        const html = renderTemplate(template, data);
        
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to,
          subject,
          html
        });
        
        console.log(`Email sent to: ${to}`);
      } catch (error) {
        console.error(`Email failed to: ${to}`, error);
        throw error;
      }
    }
  );
  
  console.log('Email worker started');
}

function renderTemplate(templateName: string, data: Record<string, any>): string {
  // Load and render HTML template
  const fs = require('fs');
  const path = require('path');
  const templatePath = path.join(__dirname, '../../templates', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf8');
  
  // Simple template replacement
  Object.keys(data).forEach(key => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
  });
  
  return html;
}
```

---
