# Auth Service API Documentation

Base URL: `/auth` (via API Gateway at `http://localhost:5000`)

## Important: Authentication Flow

### User Roles & Registration:
- **Admin**: Only 1 admin per company. Admin is created during company signup.
- **Employee/Manager**: Created by admin through User Service (not through auth/register).
- **Signin**: All users (Admin, Manager, Employee) use the same signin endpoint.

---

## Endpoints

### 1. Company Signup (Admin Registration)

**Purpose**: Register a new company with its first admin user. This is the ONLY way to create an admin user.

**Endpoint:** `POST /auth/signup`

**Authentication:** Not required

**Business Rules:**
- Creates both company and admin user in a single transaction
- Only ONE admin per company allowed (enforced by database constraint)
- Admin role cannot be assigned through any other endpoint
- This endpoint is used ONLY for initial company setup

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "admin@company.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "country": "United States",
  "companyName": "Acme Corporation"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format, must be unique across all users
- `password`: Required, minimum 8 characters, at least one uppercase, one lowercase, one number
- `confirmPassword`: Required, must match password
- `country`: Required, must be a valid country name (fetched from restcountries.com API)
- `companyName`: Optional, defaults to "{name}'s Company" if not provided

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "admin@company.com",
      "role": "admin",
      "companyId": "company-uuid",
      "companyName": "Acme Corporation",
      "currency": "USD"
    }
  },
  "message": "Company and admin user created successfully"
}
```

**Error Responses:**

400 Bad Request - Email exists:
```json
{
  "success": false,
  "message": "Email already exists"
}
```

400 Bad Request - Password mismatch:
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

400 Bad Request - Invalid country:
```json
{
  "success": false,
  "message": "Invalid country selected"
}
```

---

### 2. Signin (Login)

**Purpose**: Authenticate any user (Admin, Manager, or Employee) and get JWT token.

**Endpoint:** `POST /auth/signin`

**Authentication:** Not required

**Used By:** All users (Admin, Manager, Employee)

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "UserPassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "user@company.com",
      "role": "employee",
      "companyId": "company-uuid",
      "companyName": "Acme Corporation",
      "currency": "USD"
    }
  }
}
```

**Response Fields:**
- `token`: JWT token valid for 24 hours
- `user.role`: One of `admin`, `manager`, or `employee`
- `currency`: Company's base currency code (e.g., USD, EUR, INR)

**Error Responses:**

401 Unauthorized - Invalid credentials:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

403 Forbidden - Account deactivated:
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
  id: string;              // UUID
  email: string;
  name: string;            // Full name
  role: 'employee' | 'manager' | 'admin';
  company_id: string;      // UUID
  currency: string;        // e.g., "USD", "EUR", "INR"
  is_active: boolean;
  created_at: string;      // ISO 8601 timestamp
  updated_at?: string;     // ISO 8601 timestamp
}
```

### JWT Token Payload
```typescript
{
  userId: string;          // UUID
  email: string;
  companyId: string;       // UUID
  role: 'employee' | 'manager' | 'admin';
  currency: string;
  iat: number;             // Issued at (Unix timestamp)
  exp: number;             // Expires at (Unix timestamp, 24h from issue)
}
```

### Company Object
```typescript
{
  id: string;              // UUID
  name: string;
  currency: string;        // e.g., "USD", "EUR", "INR"
  is_active: boolean;
  created_at: string;      // ISO 8601 timestamp
  updated_at?: string;     // ISO 8601 timestamp
}
```
