# Auth Service API Documentation

Base URL: `/auth` (via API Gateway at `http://localhost:5000`)

## Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Acme Corp",
  "role": "employee",
  "department": "Engineering",
  "phone": "+1234567890"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, at least one uppercase, one lowercase, one number
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `companyName`: Required for first user, 2-100 characters
- `role`: Optional, one of: `employee`, `manager`, `finance`, `admin` (default: `employee`)
- `department`: Optional, 2-50 characters
- `phone`: Optional, valid phone format

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "companyId": 1,
      "department": "Engineering",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2024-10-04T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "company": {
      "id": 1,
      "name": "Acme Corp"
    }
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

```json
{
  "success": false,
  "message": "Password does not meet requirements"
}
```

---

### 2. Login

Authenticate and get JWT token.

**Endpoint:** `POST /auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "employee",
      "companyId": 1,
      "department": "Engineering",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

403 Forbidden:
```json
{
  "success": false,
  "message": "Account is deactivated"
}
```

---

### 3. Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Authentication:** Required (JWT Bearer token)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "employee",
    "companyId": 1,
    "companyName": "Acme Corp",
    "department": "Engineering",
    "phone": "+1234567890",
    "isActive": true,
    "createdAt": "2024-10-04T10:30:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 4. Logout

Logout and invalidate token (client-side token removal).

**Endpoint:** `POST /auth/logout`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Change Password

Change user's password.

**Endpoint:** `POST /auth/change-password`

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

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

```json
{
  "success": false,
  "message": "New password does not meet requirements"
}
```

---

### 6. Forgot Password

Request password reset (sends email with reset link).

**Endpoint:** `POST /auth/forgot-password`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Note:** Always returns success even if email doesn't exist (security best practice).

---

### 7. Reset Password

Reset password using reset token from email.

**Endpoint:** `POST /auth/reset-password`

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

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

---

## Data Models

### User Object
```typescript
{
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'employee' | 'manager' | 'finance' | 'admin';
  companyId: number;
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
```

### JWT Token Payload
```typescript
{
  userId: number;
  email: string;
  companyId: number;
  role: string;
  iat: number;  // Issued at
  exp: number;  // Expires at
}
```
