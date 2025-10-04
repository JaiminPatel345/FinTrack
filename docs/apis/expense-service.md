# Expense Service API Documentation

Base URL: `/expenses` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Endpoints

### 1. Create Expense

Create a new expense.

**Endpoint:** `POST /expenses`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Business Lunch with Client",
  "description": "Discussed Q4 partnership opportunities",
  "totalAmount": 125.50,
  "currency": "USD",
  "category": "meals",
  "date": "2024-10-04"
}
```

**Validation Rules:**
- `title`: Required, 3-200 characters
- `description`: Optional, max 1000 characters
- `totalAmount`: Required, positive number
- `currency`: Required, 3-letter currency code
- `category`: Required, valid category (from expense_categories table)
- `date`: Required, ISO date format
- `status`: Auto-set to 'draft'

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "company_id": 1,
    "title": "Business Lunch with Client",
    "description": "Discussed Q4 partnership opportunities",
    "total_amount": 125.50,
    "currency": "USD",
    "category": "meals",
    "date": "2024-10-04",
    "status": "draft",
    "created_at": "2024-10-04T12:00:00.000Z",
    "updated_at": "2024-10-04T12:00:00.000Z"
  }
}
```

---

### 2. Get All Expenses

Get expenses (filtered by user role).

**Endpoint:** `GET /expenses`

**Authentication:** Required

**Query Parameters:**
- `userId` (number, optional): Filter by user ID (admins only)
- `status` (string, optional): Filter by status (`draft`, `pending`, `approved`, `rejected`)
- `category` (string, optional): Filter by category
- `startDate` (string, optional): Filter from date (ISO format)
- `endDate` (string, optional): Filter to date (ISO format)

**Example:** `GET /expenses?status=pending&startDate=2024-10-01&endDate=2024-10-31`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "company_id": 1,
      "title": "Business Lunch with Client",
      "description": "Discussed Q4 partnership opportunities",
      "total_amount": 125.50,
      "currency": "USD",
      "category": "meals",
      "date": "2024-10-04",
      "status": "pending",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "created_at": "2024-10-04T12:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Expense by ID

Get detailed expense information.

**Endpoint:** `GET /expenses/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "company_id": 1,
    "title": "Business Lunch with Client",
    "description": "Discussed Q4 partnership opportunities",
    "total_amount": 125.50,
    "currency": "USD",
    "category": "meals",
    "date": "2024-10-04",
    "status": "pending",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "created_at": "2024-10-04T12:00:00.000Z",
    "updated_at": "2024-10-04T12:30:00.000Z",
    "submitted_at": "2024-10-04T12:30:00.000Z"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "message": "Expense not found"
}
```

---

### 4. Update Expense

Update expense details (only draft expenses can be updated).

**Endpoint:** `PUT /expenses/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID

**Request Body (all fields optional):**
```json
{
  "title": "Updated Business Lunch",
  "description": "Updated description",
  "totalAmount": 150.00,
  "currency": "USD",
  "category": "meals",
  "date": "2024-10-04"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Business Lunch",
    "total_amount": 150.00,
    "updated_at": "2024-10-04T13:00:00.000Z"
  }
}
```

---

### 5. Delete Expense

Delete an expense.

**Endpoint:** `DELETE /expenses/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

### 6. Submit Expense for Approval

Submit a draft expense for approval.

**Endpoint:** `POST /expenses/:id/submit`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending",
    "submitted_at": "2024-10-04T14:00:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Expense not found or already submitted"
}
```

---

### 7. Get Expense Statistics

Get expense statistics for user or company.

**Endpoint:** `GET /expenses/stats`

**Authentication:** Required

**Query Parameters:**
- `userId` (number, optional): Get stats for specific user

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total_count": "25",
    "draft_count": "3",
    "pending_count": "8",
    "approved_count": "12",
    "rejected_count": "2",
    "total_amount": "5432.50",
    "avg_amount": "217.30"
  }
}
```

---

## Line Items Endpoints

### 8. Add Line Item

Add a line item to an expense.

**Endpoint:** `POST /expenses/:id/line-items`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID

**Request Body:**
```json
{
  "description": "Appetizers",
  "amount": 25.50,
  "category": "food",
  "quantity": 2
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "expense_id": 1,
    "description": "Appetizers",
    "amount": 25.50,
    "category": "food",
    "quantity": 2,
    "created_at": "2024-10-04T15:00:00.000Z"
  }
}
```

---

### 9. Get Line Items

Get all line items for an expense.

**Endpoint:** `GET /expenses/:id/line-items`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "expense_id": 1,
      "description": "Appetizers",
      "amount": 25.50,
      "category": "food",
      "quantity": 2,
      "created_at": "2024-10-04T15:00:00.000Z"
    },
    {
      "id": 2,
      "expense_id": 1,
      "description": "Main Course",
      "amount": 75.00,
      "category": "food",
      "quantity": 2,
      "created_at": "2024-10-04T15:05:00.000Z"
    }
  ]
}
```

---

### 10. Update Line Item

Update a line item.

**Endpoint:** `PUT /expenses/:id/line-items/:lineItemId`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID
- `lineItemId` (number): Line Item ID

**Request Body (all fields optional):**
```json
{
  "description": "Updated Appetizers",
  "amount": 30.00,
  "category": "food",
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "expense_id": 1,
    "description": "Updated Appetizers",
    "amount": 30.00,
    "category": "food",
    "quantity": 3
  }
}
```

---

### 11. Delete Line Item

Delete a line item.

**Endpoint:** `DELETE /expenses/:id/line-items/:lineItemId`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Expense ID
- `lineItemId` (number): Line Item ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Line item deleted successfully"
}
```

---

## Data Models

### Expense Object
```typescript
{
  id: number;
  user_id: number;
  company_id: number;
  title: string;
  description?: string;
  total_amount: number;
  currency: string;
  category: string;
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
  submitted_at?: string;
  approved_at?: string;
}
```

### Line Item Object
```typescript
{
  id: number;
  expense_id: number;
  description: string;
  amount: number;
  category: string;
  quantity: number;
  created_at: string;
}
```

### Expense Status Flow
```
draft → pending → approved
              → rejected
```
