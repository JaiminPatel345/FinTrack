# Approval Service API Documentation

Base URL: `/approvals` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Endpoints

### 1. Get Pending Approvals

Get all pending approvals for the logged-in user.

**Endpoint:** `GET /approvals/pending`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "expense_id": 5,
      "approver_id": 2,
      "status": "pending",
      "step_order": 1,
      "title": "Business Lunch",
      "total_amount": 125.50,
      "currency": "USD",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-10-04T12:00:00.000Z"
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

### 3. Approve Expense

Approve an expense.

**Endpoint:** `POST /approvals/:id/approve`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Approval ID

**Request Body:**
```json
{
  "comments": "Looks good, approved"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "expense_id": 5,
    "status": "approved",
    "comments": "Looks good, approved",
    "approved_at": "2024-10-04T14:30:00.000Z"
  }
}
```

---

### 4. Reject Expense

Reject an expense.

**Endpoint:** `POST /approvals/:id/reject`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Approval ID

**Request Body:**
```json
{
  "comments": "Missing receipt, please resubmit"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "expense_id": 5,
    "status": "rejected",
    "comments": "Missing receipt, please resubmit",
    "approved_at": "2024-10-04T14:30:00.000Z"
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
