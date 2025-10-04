# User Service API Documentation

Base URL: `/users` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Endpoints

### 1. Get All Users

Get all users in the company.

**Endpoint:** `GET /users`

**Authentication:** Required

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "employee",
      "department": "Engineering",
      "phone": "+1234567890",
      "is_active": true,
      "created_at": "2024-10-04T10:30:00.000Z"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "manager",
      "department": "Engineering",
      "phone": "+1234567891",
      "is_active": true,
      "created_at": "2024-10-04T11:00:00.000Z"
    }
  ]
}
```

---

### 2. Get User by ID

Get a specific user's details.

**Endpoint:** `GET /users/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (number): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "employee",
    "department": "Engineering",
    "phone": "+1234567890",
    "is_active": true,
    "created_at": "2024-10-04T10:30:00.000Z"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 3. Update User

Update user profile (users can only update their own profile unless admin).

**Endpoint:** `PUT /users/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (number): User ID

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "department": "Product"
}
```

**All fields are optional.**

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "employee",
    "department": "Product",
    "phone": "+1234567890",
    "is_active": true,
    "created_at": "2024-10-04T10:30:00.000Z"
  }
}
```

**Error Responses:**

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 4. Delete (Deactivate) User

Deactivate a user account (Admin only).

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required (Admin role)

**URL Parameters:**
- `id` (number): User ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

**Error Responses:**

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 5. Get User's Managers

Get all managers for a user.

**Endpoint:** `GET /users/:id/managers`

**Authentication:** Required

**URL Parameters:**
- `id` (number): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "email": "manager@example.com",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "role": "manager",
      "department": "Engineering"
    }
  ]
}
```

---

### 6. Get User's Subordinates

Get all direct reports for a manager.

**Endpoint:** `GET /users/:id/subordinates`

**Authentication:** Required

**URL Parameters:**
- `id` (number): Manager's User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "employee",
      "department": "Engineering"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "employee",
      "department": "Engineering"
    }
  ]
}
```

---

### 7. Assign Manager to User

Create a manager-subordinate relationship.

**Endpoint:** `POST /users/:id/managers`

**Authentication:** Required (Admin or Manager)

**URL Parameters:**
- `id` (number): Subordinate's User ID

**Request Body:**
```json
{
  "managerId": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "manager_id": 5,
    "created_at": "2024-10-04T12:00:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Manager ID is required"
}
```

```json
{
  "success": false,
  "message": "Invalid user or manager"
}
```

---

### 8. Remove Manager from User

Remove a manager-subordinate relationship.

**Endpoint:** `DELETE /users/:id/managers/:managerId`

**Authentication:** Required (Admin or Manager)

**URL Parameters:**
- `id` (number): Subordinate's User ID
- `managerId` (number): Manager's User ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Manager removed successfully"
}
```

---

### 9. Get Users by Role

Filter users by role.

**Endpoint:** `GET /users/role?role=manager`

**Authentication:** Required

**Query Parameters:**
- `role` (string): Role to filter by (`employee`, `manager`, `finance`, `admin`)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "email": "manager@example.com",
      "first_name": "Sarah",
      "last_name": "Johnson",
      "role": "manager",
      "department": "Engineering"
    }
  ]
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Role is required"
}
```

---

### 10. Get Users by Department

Filter users by department.

**Endpoint:** `GET /users/department?department=Engineering`

**Authentication:** Required

**Query Parameters:**
- `department` (string): Department name

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "employee",
      "department": "Engineering"
    },
    {
      "id": 2,
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "role": "manager",
      "department": "Engineering"
    }
  ]
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Department is required"
}
```

---

## Data Models

### User Object
```typescript
{
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'employee' | 'manager' | 'finance' | 'admin';
  department?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}
```

### Manager Relationship Object
```typescript
{
  id: number;
  user_id: number;
  manager_id: number;
  is_active: boolean;
  created_at: string;
}
```
