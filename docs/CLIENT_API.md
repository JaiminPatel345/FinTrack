# Client API Documentation

**Base URL:** `http://localhost:5000/api`

All API requests go through the API Gateway. The client should only use this base URL.

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [User Management](#user-management)
3. [Expense Categories](#expense-categories)
4. [Expense Management](#expense-management)
5. [Approval Workflow](#approval-workflow)
6. [Currency & Countries](#currency--countries)
7. [OCR Processing](#ocr-processing)

---

## Authentication Flow

### 1. Company Signup (Admin Registration)

**Purpose:** First-time signup creates company and admin user.

**Endpoint:** `POST /api/auth/signup`

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "admin@company.com",
  "password": "SecurePass123!",
  "companyName": "Tech Solutions Inc",
  "country": "United States",
  "currency": "USD"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "admin@company.com",
      "role": "admin",
      "companyId": "660e8400-e29b-41d4-a716-446655440000",
      "companyName": "Tech Solutions Inc",
      "currency": "USD"
    }
  },
  "message": "Account created successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 2. Sign In (Login)

**Purpose:** Login for all users (Admin, Manager, Employee).

**Endpoint:** `POST /api/auth/signin`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "Password123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "user@company.com",
      "role": "employee",
      "companyId": "660e8400-e29b-41d4-a716-446655440000",
      "companyName": "Tech Solutions Inc",
      "currency": "USD"
    }
  },
  "message": "Signed in successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Note:** Store the `token` in localStorage/sessionStorage and include it in all subsequent requests as:
```
Authorization: Bearer <token>
```

---

### 3. Change Password

**Endpoint:** `POST /api/auth/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 4. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@company.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 5. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePassword456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## User Management

### 6. Get All Users (Admin Only)

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "company_id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "employee",
      "is_active": true,
      "created_at": "2024-10-01T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Get User by ID

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "role": "employee",
    "is_active": true,
    "created_at": "2024-10-01T10:00:00.000Z"
  }
}
```

---

### 8. Create User (Admin Only)

**Purpose:** Admin creates Employee or Manager.

**Endpoint:** `POST /api/users`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "role": "employee"
}
```

**Roles:** `employee` | `manager` (Cannot create `admin`)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "employee",
      "is_active": true,
      "created_at": "2024-10-04T10:00:00.000Z"
    },
    "tempPassword": "Xy9#mK2pQ!vZ"
  }
}
```

**Note:** Temporary password is also sent to user's email automatically.

---

### 9. Update User

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Required (Admin or Self)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@company.com",
  "role": "manager"
}
```

**Restrictions:**
- Cannot change role to/from `admin`
- Non-admins can only update their own profile

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "email": "jane.doe@company.com",
    "role": "manager",
    "updated_at": "2024-10-04T11:00:00.000Z"
  }
}
```

---

### 10. Delete User (Deactivate)

**Endpoint:** `DELETE /api/users/:id`

**Authentication:** Required (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Cannot delete admin user"
}
```

---

### 11. Send Password Setup Email

**Purpose:** Admin can resend password to user.

**Endpoint:** `POST /api/users/:id/send-password`

**Authentication:** Required (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password setup email sent",
  "tempPassword": "Xy9#mK2pQ!vZ"
}
```

---

### 12. Get User's Manager

**Endpoint:** `GET /api/users/:id/manager`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Sarah Johnson",
    "email": "sarah@company.com",
    "role": "manager"
  }
}
```

**If no manager:**
```json
{
  "success": true,
  "data": null
}
```

---

### 13. Assign Manager to User

**Endpoint:** `POST /api/users/:id/manager`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "managerId": "770e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Manager assigned successfully"
  }
}
```

---

### 14. Get User's Subordinates

**Purpose:** Get all employees reporting to a manager.

**Endpoint:** `GET /api/users/:id/subordinates`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@company.com",
      "role": "employee",
      "created_at": "2024-10-04T10:30:00.000Z"
    }
  ]
}
```

---

## Expense Categories

### 15. Get All Categories

**Endpoint:** `GET /api/categories`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat-uuid-1",
      "company_id": "company-uuid",
      "name": "Travel",
      "description": "Travel and transportation expenses",
      "is_active": true
    },
    {
      "id": "cat-uuid-2",
      "company_id": "company-uuid",
      "name": "Meals",
      "description": "Food and beverage expenses",
      "is_active": true
    },
    {
      "id": "cat-uuid-3",
      "company_id": "company-uuid",
      "name": "Office Supplies",
      "description": "Office equipment and supplies",
      "is_active": true
    }
  ]
}
```

---

### 16. Create Category (Admin Only)

**Endpoint:** `POST /api/categories`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "Marketing",
  "description": "Marketing and advertising expenses"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "cat-uuid-4",
    "company_id": "company-uuid",
    "name": "Marketing",
    "description": "Marketing and advertising expenses",
    "is_active": true,
    "created_at": "2024-10-04T12:00:00.000Z"
  }
}
```

---

## Expense Management

### 17. Create Expense

**Purpose:** Employee creates expense (draft).

**Endpoint:** `POST /api/expenses`

**Authentication:** Required

**Request Body:**
```json
{
  "categoryId": "cat-uuid-1",
  "description": "Business lunch with client at Taj Hotel",
  "amount": 1250.00,
  "currency": "INR",
  "expenseDate": "2024-10-04",
  "paidBy": "credit_card",
  "gstPercentage": 18,
  "remarks": "Discussed Q4 partnership opportunities",
  "receiptUrl": "https://res.cloudinary.com/..../receipt.jpg",
  "receiptPublicId": "receipts/abc123"
}
```

**Payment Methods:** `cash` | `credit_card` | `debit_card` | `company_card` | `upi` | `net_banking` | `other`

**Automatic Processing:**
- Converts amount to company currency
- Calculates GST amount
- Stores exchange rate

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "user_id": "user-uuid",
    "company_id": "company-uuid",
    "category_id": "cat-uuid-1",
    "description": "Business lunch with client at Taj Hotel",
    "amount": 1250.00,
    "currency": "INR",
    "converted_amount": 14.77,
    "company_currency": "USD",
    "exchange_rate": 84.62,
    "expense_date": "2024-10-04",
    "paid_by": "credit_card",
    "gst_percentage": 18,
    "gst_amount": 225.00,
    "remarks": "Discussed Q4 partnership opportunities",
    "receipt_url": "https://res.cloudinary.com/.../receipt.jpg",
    "status": "draft",
    "created_at": "2024-10-04T12:00:00.000Z"
  }
}
```

---

### 18. Get All Expenses

**Purpose:** List expenses (filtered by role).

**Endpoint:** `GET /api/expenses`

**Authentication:** Required

**Query Parameters:**
- `userId` (optional): Filter by user (Admin only)
- `status` (optional): `draft` | `submitted` | `pending_approval` | `approved` | `rejected`
- `categoryId` (optional): Filter by category
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Example:** `GET /api/expenses?status=pending_approval&startDate=2024-10-01`

**Access Control:**
- **Employee**: Can see only their own expenses
- **Manager**: Can see their team's expenses + their own
- **Admin**: Can see all company expenses

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "expense-uuid",
      "user_id": "user-uuid",
      "category_id": "cat-uuid-1",
      "description": "Business lunch",
      "amount": 1250.00,
      "currency": "INR",
      "converted_amount": 14.77,
      "company_currency": "USD",
      "expense_date": "2024-10-04",
      "status": "pending_approval",
      "name": "John Doe",
      "email": "john@company.com",
      "category_name": "Meals",
      "created_at": "2024-10-04T12:00:00.000Z"
    }
  ]
}
```

---

### 19. Get Expense by ID

**Endpoint:** `GET /api/expenses/:id`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "user_id": "user-uuid",
    "category_id": "cat-uuid-1",
    "description": "Business lunch with client",
    "amount": 1250.00,
    "currency": "INR",
    "converted_amount": 14.77,
    "company_currency": "USD",
    "exchange_rate": 84.62,
    "expense_date": "2024-10-04",
    "paid_by": "credit_card",
    "gst_percentage": 18,
    "gst_amount": 225.00,
    "receipt_url": "https://res.cloudinary.com/.../receipt.jpg",
    "status": "draft",
    "name": "John Doe",
    "email": "john@company.com",
    "category_name": "Meals",
    "created_at": "2024-10-04T12:00:00.000Z"
  }
}
```

---

### 20. Update Expense

**Purpose:** Update draft expense only.

**Endpoint:** `PUT /api/expenses/:id`

**Authentication:** Required

**Request Body (all optional):**
```json
{
  "categoryId": "cat-uuid-2",
  "description": "Updated description",
  "amount": 1500.00,
  "currency": "INR",
  "expenseDate": "2024-10-05",
  "paidBy": "company_card",
  "gstPercentage": 18
}
```

**Note:** Can only update expenses with status `draft`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "description": "Updated description",
    "amount": 1500.00,
    "updated_at": "2024-10-04T13:00:00.000Z"
  }
}
```

---

### 21. Delete Expense

**Endpoint:** `DELETE /api/expenses/:id`

**Authentication:** Required

**Note:** Can only delete draft expenses

**Success Response (200):**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

### 22. Submit Expense for Approval

**Purpose:** Submit draft expense (triggers approval workflow).

**Endpoint:** `POST /api/expenses/:id/submit`

**Authentication:** Required

**Automatic Processing:**
1. Changes status from `draft` to `submitted`
2. Creates approval workflow based on rules
3. If `is_manager_approver = true` → Adds manager as first approver
4. Sends notification to first approver

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "expense-uuid",
    "status": "submitted",
    "submitted_at": "2024-10-04T14:00:00.000Z"
  },
  "message": "Expense submitted for approval"
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Expense not found or already submitted"
}
```

**Error (500):**
```json
{
  "success": false,
  "message": "No matching approval rule found"
}
```

---

### 23. Get Expense Statistics

**Endpoint:** `GET /api/expenses/stats`

**Authentication:** Required

**Query Parameters:**
- `userId` (optional): Get stats for specific user

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total_count": 45,
    "draft_count": 5,
    "pending_count": 10,
    "approved_count": 25,
    "rejected_count": 5,
    "total_amount": 125000.00,
    "avg_amount": 2777.78
  }
}
```

---

## Approval Workflow

### 24. Get Pending Approvals

**Purpose:** Get expenses waiting for my approval.

**Endpoint:** `GET /api/approvals/pending`

**Authentication:** Required

**Used By:** Managers and designated approvers

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "expense_id": "expense-uuid",
      "description": "Business lunch with client",
      "amount": 1250.00,
      "currency": "INR",
      "converted_amount": 14.77,
      "expense_date": "2024-10-04",
      "employee_name": "John Doe",
      "employee_email": "john@company.com",
      "approval_id": "approval-uuid",
      "current_step": 1,
      "total_steps": 3,
      "action_id": "action-uuid",
      "step_order": 1
    }
  ]
}
```

---

### 25. Get Expense Approval History

**Purpose:** View approval history for an expense.

**Endpoint:** `GET /api/approvals/expense/:expenseId`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "action-uuid-1",
      "expense_approval_id": "approval-uuid",
      "step_order": 0,
      "approver_id": "manager-uuid",
      "action": "approved",
      "comments": "Looks good",
      "action_date": "2024-10-04T15:00:00.000Z",
      "name": "Sarah Johnson",
      "email": "sarah@company.com"
    },
    {
      "id": "action-uuid-2",
      "expense_approval_id": "approval-uuid",
      "step_order": 1,
      "approver_id": "finance-uuid",
      "action": "pending",
      "comments": null,
      "action_date": null,
      "name": "Mike Chen",
      "email": "mike@company.com"
    }
  ]
}
```

---

### 26. Approve Expense

**Purpose:** Approve expense at current step.

**Endpoint:** `POST /api/approvals/:actionId/approve`

**Authentication:** Required

**URL Parameters:**
- `actionId`: The approval action ID (from pending approvals)

**Request Body:**
```json
{
  "comments": "Approved - receipt verified"
}
```

**Approval Logic:**
- **Sequential**: Moves to next step or approves if last step
- **Percentage**: Approves if threshold met (e.g., 60%)
- **Specific Approver**: Auto-approves if this approver has `is_auto_approve`
- **Hybrid**: Approves if percentage met OR specific approver approves

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action-uuid",
      "action": "approved",
      "comments": "Approved - receipt verified",
      "action_date": "2024-10-04T16:00:00.000Z"
    },
    "isApproved": false,
    "shouldMoveToNext": true,
    "currentStep": 2
  }
}
```

**When fully approved:**
```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action-uuid",
      "action": "approved",
      "comments": "Final approval",
      "action_date": "2024-10-04T17:00:00.000Z"
    },
    "isApproved": true,
    "shouldMoveToNext": false,
    "currentStep": 3
  }
}
```

---

### 27. Reject Expense

**Purpose:** Reject expense (entire workflow rejected).

**Endpoint:** `POST /api/approvals/:actionId/reject`

**Authentication:** Required

**URL Parameters:**
- `actionId`: The approval action ID

**Request Body:**
```json
{
  "comments": "Missing receipt - please resubmit with proper documentation"
}
```

**Note:** Any rejection immediately rejects the entire expense

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action-uuid",
      "action": "rejected",
      "comments": "Missing receipt - please resubmit with proper documentation",
      "action_date": "2024-10-04T16:30:00.000Z"
    },
    "expenseId": "expense-uuid"
  }
}
```

---

### 28. Get Approval Rules (Admin)

**Purpose:** View all approval rules.

**Endpoint:** `GET /api/approval-rules`

**Authentication:** Required (Admin)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rule-uuid",
      "company_id": "company-uuid",
      "name": "Standard Approval",
      "description": "For expenses under $500",
      "category_id": null,
      "min_amount": null,
      "max_amount": 500.00,
      "rule_type": "sequential",
      "is_manager_approver": true,
      "percentage_required": null,
      "priority": 1,
      "is_active": true,
      "steps": [
        {
          "id": "step-uuid-1",
          "step_order": 1,
          "approver_id": "finance-head-uuid",
          "is_auto_approve": false
        }
      ]
    }
  ]
}
```

---

### 29. Create Approval Rule (Admin)

**Endpoint:** `POST /api/approval-rules`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "name": "High Value Approval",
  "description": "For expenses over $1000",
  "categoryId": null,
  "minAmount": 1000.00,
  "maxAmount": null,
  "ruleType": "hybrid",
  "isManagerApprover": true,
  "percentageRequired": 60,
  "priority": 10,
  "approvers": [
    {
      "approverId": "finance-head-uuid",
      "stepOrder": 1,
      "isAutoApprove": false
    },
    {
      "approverId": "cfo-uuid",
      "stepOrder": 2,
      "isAutoApprove": true
    },
    {
      "approverId": "ceo-uuid",
      "stepOrder": 3,
      "isAutoApprove": false
    }
  ]
}
```

**Rule Types:**
- `sequential`: All approvers in order
- `percentage`: X% must approve
- `specific_approver`: Specific person auto-approves
- `hybrid`: Percentage OR specific approver

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "rule-uuid",
    "company_id": "company-uuid",
    "name": "High Value Approval",
    "rule_type": "hybrid",
    "is_manager_approver": true,
    "percentage_required": 60,
    "priority": 10,
    "is_active": true,
    "created_at": "2024-10-04T18:00:00.000Z"
  }
}
```

---

### 30. Update Approval Rule (Admin)

**Endpoint:** `PUT /api/approval-rules/:id`

**Authentication:** Required (Admin)

**Request Body (all optional):**
```json
{
  "name": "Updated Rule Name",
  "minAmount": 1500.00,
  "maxAmount": 5000.00,
  "ruleType": "sequential",
  "isManagerApprover": false,
  "percentageRequired": null,
  "priority": 5,
  "isActive": true,
  "approvers": [
    {
      "approverId": "new-approver-uuid",
      "stepOrder": 1,
      "isAutoApprove": false
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "rule-uuid",
    "name": "Updated Rule Name",
    "updated_at": "2024-10-04T19:00:00.000Z"
  }
}
```

---

## Currency & Countries

### 31. Get Countries with Currencies

**Purpose:** Get list of countries and their currencies for signup form.

**Endpoint:** `GET /api/currency/countries`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "country": "United States",
      "currency": "USD",
      "currencyName": "US Dollar"
    },
    {
      "country": "India",
      "currency": "INR",
      "currencyName": "Indian Rupee"
    },
    {
      "country": "United Kingdom",
      "currency": "GBP",
      "currencyName": "British Pound"
    }
  ]
}
```

---

### 32. Convert Currency

**Purpose:** Get exchange rate between currencies.

**Endpoint:** `POST /api/currency/convert`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 1000,
  "fromCurrency": "INR",
  "toCurrency": "USD"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "amount": 1000,
    "fromCurrency": "INR",
    "toCurrency": "USD",
    "exchangeRate": 84.62,
    "convertedAmount": 11.82,
    "timestamp": "2024-10-04T20:00:00.000Z"
  }
}
```

---

### 33. Get Exchange Rates

**Purpose:** Get all exchange rates for a base currency.

**Endpoint:** `GET /api/currency/rates/:baseCurrency`

**Authentication:** Required

**Example:** `GET /api/currency/rates/USD`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "baseCurrency": "USD",
    "rates": {
      "INR": 84.62,
      "EUR": 0.92,
      "GBP": 0.79,
      "JPY": 149.50
    },
    "timestamp": "2024-10-04T20:00:00.000Z"
  }
}
```

---

## OCR Processing

### 34. Process Receipt (Extract Text)

**Purpose:** Extract text from receipt image using OCR.

**Endpoint:** `POST /api/ocr/process`

**Authentication:** Required

**Request Body:**
```json
{
  "imageUrl": "https://res.cloudinary.com/.../receipt.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "text": "TAJ HOTEL\nMumbai, India\nDate: 04-10-2024\nBill No: 1234\n\nLunch - 2 Persons\nAmount: Rs. 1250.00\nGST 18%: Rs. 225.00\nTotal: Rs. 1475.00\n\nThank You!",
    "confidence": 0.95,
    "extracted": {
      "amount": 1250.00,
      "gst": 225.00,
      "total": 1475.00,
      "date": "2024-10-04",
      "merchant": "TAJ HOTEL"
    }
  }
}
```

---

## Common Response Patterns

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Forbidden - Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**503 Service Unavailable:**
```json
{
  "success": false,
  "error": "Auth service unavailable"
}
```

---

## Complete User Flow Example

### Flow 1: Admin Onboarding

1. **Signup** → `POST /api/auth/signup` - Creates company + admin
2. **Create Employee** → `POST /api/users` - Add team member
3. **Assign Manager** → `POST /api/users/:id/manager` - Set reporting structure
4. **Create Categories** → `POST /api/categories` - Add expense categories
5. **Create Approval Rule** → `POST /api/approval-rules` - Set approval workflow

### Flow 2: Employee Expense Submission

1. **Login** → `POST /api/auth/signin` - Get auth token
2. **Get Categories** → `GET /api/categories` - List available categories
3. **Upload Receipt** → (Use Cloudinary directly)
4. **Create Expense** → `POST /api/expenses` - Create draft expense
5. **Submit Expense** → `POST /api/expenses/:id/submit` - Triggers approval

### Flow 3: Manager Approval

1. **Login** → `POST /api/auth/signin` - Get auth token
2. **Get Pending** → `GET /api/approvals/pending` - See expenses to approve
3. **View History** → `GET /api/approvals/expense/:id` - Check approval chain
4. **Approve/Reject** → `POST /api/approvals/:actionId/approve` or `/reject`

### Flow 4: Employee Check Status

1. **Login** → `POST /api/auth/signin` - Get auth token
2. **Get My Expenses** → `GET /api/expenses` - Auto-filtered to own expenses
3. **View Approval History** → `GET /api/approvals/expense/:id` - Check status

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response (429):**
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Authentication Header

All authenticated endpoints require:
```
Authorization: Bearer <token>
```

**Example:**
```javascript
fetch('http://localhost:5000/api/users', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'Content-Type': 'application/json'
  }
})
```

---

## Environment Variables

For local development:
- **API Gateway:** `http://localhost:5000`
- **CORS Origin:** `http://localhost:3000` (React app)

For production, update the base URL accordingly.
