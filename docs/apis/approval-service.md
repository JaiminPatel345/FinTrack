# Approval Service API Documentation

Base URL: `/approvals` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Endpoints

### 1. Create Approval Workflow

**Purpose**: Create approval workflow when expense is submitted (called by expense-service).

**Endpoint:** `POST /approvals/create-workflow`

**Authentication:** Not required (internal service call)

**Request Body:**
```json
{
  "expenseId": "expense-uuid",
  "userId": "user-uuid",
  "companyId": "company-uuid"
}
```

**Business Logic:**
1. Finds matching approval rule based on:
   - Category (if specified)
   - Amount range (min_amount, max_amount)
   - Priority (highest priority rule wins)
2. If `is_manager_approver = true`, adds employee's manager as Step 0
3. Adds configured approvers from `approval_steps` table
4. Creates `expense_approval` record with total_steps and current_step
5. Creates `approval_actions` for each approver (status: pending)
6. Updates expense status to `pending_approval`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "expenseApprovalId": "approval-uuid",
    "rule": {
      "id": "rule-uuid",
      "name": "Standard Approval",
      "rule_type": "sequential",
      "is_manager_approver": true
    },
    "steps": [
      {
        "step_order": 0,
        "approver_id": "manager-uuid"
      },
      {
        "step_order": 1,
        "approver_id": "finance-head-uuid"
      }
    ],
    "currentStep": 1
  }
}
```

---

### 2. Get Pending Approvals

Get all pending approvals for the logged-in user.

**Endpoint:** `GET /approvals/pending`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "expense_id": "expense-uuid",
      "description": "Business Lunch",
      "amount": 125.50,
      "currency": "INR",
      "converted_amount": 1.48,
      "expense_date": "2024-10-03",
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

### 2. Get Expense Approvals

Get all approvals for a specific expense.

**Endpoint:** `GET /approvals/expense/:expenseId`

**Authentication:** Required

**URL Parameters:**
- `expenseId` (number): Expense ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "expense_id": 5,
      "approver_id": 2,
      "status": "approved",
      "step_order": 1,
      "comments": "Approved",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "email": "sarah@example.com",
      "approved_at": "2024-10-04T14:00:00.000Z",
      "created_at": "2024-10-04T12:00:00.000Z"
    }
  ]
}
```

---

### 4. Approve Expense

**Purpose**: Approve an expense at current approval step.

**Endpoint:** `POST /approvals/:id/approve`

**Authentication:** Required

**URL Parameters:**
- `id` (UUID): Approval Action ID (not expense ID)

**Request Body:**
```json
{
  "comments": "Looks good, approved"
}
```

**Approval Logic by Rule Type:**

**Sequential:**
- If current step approves → Move to next step
- If last step approves → Expense approved

**Percentage (e.g., 60% required):**
- Calculate: (approved_count / total_steps) × 100
- If percentage >= required → Expense approved

**Specific Approver:**
- If this approver has `is_auto_approve = true` → Expense auto-approved

**Hybrid (Percentage OR Specific Approver):**
- If percentage >= required → Expense approved
- OR if specific approver approves → Expense auto-approved

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action-uuid",
      "action": "approved",
      "comments": "Looks good, approved",
      "action_date": "2024-10-04T14:30:00.000Z"
    },
    "isApproved": false,
    "shouldMoveToNext": true,
    "currentStep": 2
  }
}
```

---

### 5. Reject Expense

**Purpose**: Reject an expense (immediately rejects entire workflow).

**Endpoint:** `POST /approvals/:id/reject`

**Authentication:** Required

**URL Parameters:**
- `id` (UUID): Approval Action ID

**Request Body:**
```json
{
  "comments": "Missing receipt, please resubmit"
}
```

**Business Logic:**
- Any rejection immediately rejects the entire expense
- No further approvals needed after rejection
- Updates expense status to `rejected`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action-uuid",
      "action": "rejected",
      "comments": "Missing receipt, please resubmit",
      "action_date": "2024-10-04T14:30:00.000Z"
    },
    "expenseId": "expense-uuid"
  }
}
```

---

### 5. Get Approval History

Get complete approval history for an expense.

**Endpoint:** `GET /approvals/expense/:expenseId/history`

**Authentication:** Required

**URL Parameters:**
- `expenseId` (number): Expense ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "approval_id": 1,
      "approver_id": 2,
      "action": "approved",
      "comments": "Approved",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "email": "sarah@example.com",
      "step_order": 1,
      "created_at": "2024-10-04T14:00:00.000Z"
    }
  ]
}
```

---

## Approval Rules (Admin Only)

### 6. Get Approval Rules

Get all approval rules for the company.

**Endpoint:** `GET /approvals/rules`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "company_id": 1,
      "name": "Standard Approval",
      "description": "Requires manager approval for expenses under $500",
      "min_amount": 0,
      "max_amount": 500,
      "currency": "USD",
      "requires_manager_approval": true,
      "requires_finance_approval": false,
      "priority": 1,
      "is_active": true,
      "created_at": "2024-10-01T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Create Approval Rule

Create a new approval rule (Admin only).

**Endpoint:** `POST /approvals/rules`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "High Value Approval",
  "description": "Requires both manager and finance approval for expenses over $500",
  "minAmount": 500,
  "maxAmount": 10000,
  "currency": "USD",
  "requiresManagerApproval": true,
  "requiresFinanceApproval": true,
  "priority": 2
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "company_id": 1,
    "name": "High Value Approval",
    "description": "Requires both manager and finance approval for expenses over $500",
    "min_amount": 500,
    "max_amount": 10000,
    "currency": "USD",
    "requires_manager_approval": true,
    "requires_finance_approval": true,
    "priority": 2,
    "is_active": true
  }
}
```

---

### 8. Update Approval Rule

Update an approval rule (Admin only).

**Endpoint:** `PUT /approvals/rules/:id`

**Authentication:** Required (Admin role)

**URL Parameters:**
- `id` (number): Rule ID

**Request Body (all fields optional):**
```json
{
  "name": "Updated Rule Name",
  "maxAmount": 15000,
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Updated Rule Name",
    "max_amount": 15000,
    "is_active": true
  }
}
```

---

## Data Models

### Approval Object
```typescript
{
  id: number;
  expense_id: number;
  approver_id: number;
  status: 'pending' | 'approved' | 'rejected';
  step_order: number;
  comments?: string;
  approved_at?: string;
  created_at: string;
}
```

### Approval Rule Object
```typescript
{
  id: number;
  company_id: number;
  name: string;
  description?: string;
  min_amount: number;
  max_amount: number;
  currency: string;
  requires_manager_approval: boolean;
  requires_finance_approval: boolean;
  priority: number;
  is_active: boolean;
  created_at: string;
}
```
