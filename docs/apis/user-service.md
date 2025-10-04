# User Service API Documentation

Base URL: `/users` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Important: User Management Flow

### Creating Users:
1. **Admin Registration**: Done through Auth Service `/auth/signup` (creates company + first admin)
2. **Employee/Manager Creation**: Done by Admin through this service's POST `/users` endpoint
3. **Password Distribution**: Admin uses POST `/users/:id/send-password` to send credentials via email

### Roles:
- **Admin**: Only 1 per company, created during signup, cannot be deleted
- **Manager**: Can be assigned employees, created by admin
- **Employee**: Regular user, can have a manager assigned

---

## Endpoints

### 1. Create User (Employee/Manager)

**Purpose**: Admin creates a new employee or manager in the company.

**Endpoint:** `POST /users`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "role": "employee"
}
```

**Optional: Assign Manager During Creation**
```json
{
  "name": "Jane Smith",
  "email": "jane@company.com",
  "role": "employee",
  "managerId": "manager-uuid-here"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email, must be unique
- `role`: Required, either `employee` or `manager` (cannot create `admin`)
- `managerId`: Optional UUID, must be a valid user ID in the same company

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "company_id": "company-uuid",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "employee",
      "is_active": true,
      "created_at": "2024-10-04T10:30:00.000Z"
    },
    "tempPassword": "Xy9k#mP2qL5n"
  },
  "message": "User created successfully. Temporary password provided."
}
```

**Important Notes:**
- A random secure password is automatically generated
- The `tempPassword` is returned in the response (Admin should send this via the send-password endpoint)
- User must change password on first login (implement client-side)

**Error Responses:**

400 Bad Request - Invalid role:
```json
{
  "success": false,
  "message": "Can only create employee or manager users. Admin users are created during company signup."
}
```

400 Bad Request - Email exists:
```json
{
  "success": false,
  "message": "Email already exists"
}
```

403 Forbidden - Not admin:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 2. Get All Users

Get all users in the company.

**Endpoint:** `GET /users`

**Authentication:** Required (Admin only)

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "company_id": "company-uuid",
      "name": "John Doe",
      "email": "john@company.com",
      "role": "admin",
      "is_active": true,
      "created_at": "2024-10-04T10:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "company_id": "company-uuid",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "employee",
      "is_active": true,
      "created_at": "2024-10-04T10:30:00.000Z"
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

### 3. Get User by ID

Get a specific user's details.

**Endpoint:** `GET /users/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (UUID): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "company_id": "company-uuid",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "employee",
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

### 4. Send Password to User

**Purpose**: Admin sends/resends password credentials to a user via email.

**Endpoint:** `POST /users/:id/send-password`

**Authentication:** Required (Admin only)

**Use Cases:**
- After creating a new user
- When user forgets password and requests reset
- When admin needs to reset a user's password

**URL Parameters:**
- `id` (UUID): User ID

**Request Body:** None

**Success Response (200):**
```json
{
  "success": true,
  "tempPassword": "Xy9k#mP2qL5n",
  "message": "Password setup email sent"
}
```

**Process:**
1. Generates a new random secure password (12 characters, alphanumeric + special chars)
2. Updates user's password in database (hashed with bcrypt)
3. Sends email to user with:
   - Their username (email)
   - Temporary password
   - Link to signin page
   - Instructions to change password on first login

**Email Content (Example):**
```
Subject: Your Account Credentials - Acme Corporation

Hello Jane Smith,

Your account has been created/reset. Here are your login credentials:

Email: jane@company.com
Temporary Password: Xy9k#mP2qL5n

Please sign in at: https://app.company.com/signin

For security, please change your password after your first login.

Best regards,
Acme Corporation Team
```

**Error Responses:**

403 Forbidden - Not admin:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

404 Not Found:
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### 5. Update User

Update user profile.

**Endpoint:** `PUT /users/:id`

**Authentication:** Required

**Authorization:**
- Users can update their own profile
- Admin can update any user's profile

**URL Parameters:**
- `id` (UUID): User ID

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.new@company.com",
  "role": "manager"
}
```

**All fields are optional.**

**Validation Rules:**
- `name`: 2-100 characters
- `email`: Valid email format, must be unique
- `role`: Can change between `employee` and `manager` only (cannot change to/from `admin`)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "company_id": "company-uuid",
    "name": "John Doe Updated",
    "email": "john.new@company.com",
    "role": "manager",
    "is_active": true,
    "created_at": "2024-10-04T10:30:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - Trying to change to admin:
```json
{
  "success": false,
  "message": "Cannot change user role to admin. Only one admin per company is allowed."
}
```

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 7. Delete (Deactivate) User

**Purpose**: Deactivate a user account (soft delete).

**Endpoint:** `DELETE /users/:id`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (UUID): User ID

**Business Rules:**
- Cannot delete admin users
- Sets `is_active = false` (soft delete)
- User can no longer sign in
- Historical data is preserved

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

**Error Responses:**

400 Bad Request - Trying to delete admin:
```json
{
  "success": false,
  "message": "Cannot delete admin user"
}
```

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Manager-Employee Relationships

### 8. Get User's Manager

Get the manager assigned to a user.

**Endpoint:** `GET /users/:id/manager`

**Authentication:** Required

**URL Parameters:**
- `id` (UUID): User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "manager-uuid",
    "name": "Sarah Johnson",
    "email": "sarah@company.com",
    "role": "manager"
  }
}
```

**Success Response (200) - No manager assigned:**
```json
{
  "success": true,
  "data": null
}
```

---

### 9. Assign Manager to User

**Purpose**: Admin assigns a manager to an employee.

**Endpoint:** `POST /users/:id/manager`

**Authentication:** Required (Admin only)

**URL Parameters:**
- `id` (UUID): Employee's user ID

**Request Body:**
```json
{
  "managerId": "manager-uuid-here"
}
```

**Validation Rules:**
- Both user and manager must exist in the same company
- Manager must be an active user
- User cannot be their own manager
- Deactivates any previous manager relationship for this user

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

**Error Responses:**

400 Bad Request - Self assignment:
```json
{
  "success": false,
  "message": "User cannot be their own manager"
}
```

400 Bad Request - Invalid users:
```json
{
  "success": false,
  "message": "Invalid user or manager"
}
```

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 10. Get User's Subordinates

Get all employees reporting to a manager.

**Endpoint:** `GET /users/:id/subordinates`

**Authentication:** Required

**URL Parameters:**
- `id` (UUID): Manager's user ID

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "employee-uuid-1",
      "name": "John Doe",
      "email": "john@company.com",
      "role": "employee",
      "created_at": "2024-10-04T10:30:00.000Z"
    },
    {
      "id": "employee-uuid-2",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "role": "employee",
      "created_at": "2024-10-04T11:00:00.000Z"
    }
  ]
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
