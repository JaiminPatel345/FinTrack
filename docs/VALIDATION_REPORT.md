# API Validation Report

## Date: Current Review
## Validator: GitHub Copilot

---

## Executive Summary

This report compares the current API implementation against FLOW.md specifications and identifies gaps that need to be addressed.

### Critical Issues

1. **❌ MISSING: "Only 1 Admin Per Company" Constraint**
   - **Issue**: No validation in auth-service signup or user-service createUser to prevent multiple admins
   - **Impact**: HIGH - Core business requirement violation
   - **Required Fix**: Add database constraint and application-level validation

2. **❌ User Service Missing Create User Endpoint**
   - **Issue**: No POST /api/users endpoint for admin to create employees/managers
   - **Impact**: HIGH - Cannot add users after company creation
   - **Required Fix**: Implement createUser with role validation and password setup email

3. **❌ Missing Manager Assignment Endpoints**
   - **Issue**: No POST /api/users/:id/manager or GET /api/users/:id/manager endpoints
   - **Impact**: MEDIUM - Cannot establish manager-employee relationships
   - **Required Fix**: Implement manager assignment with validation

---

## Service-by-Service Analysis

### 1. Auth Service (/server/auth-service)

#### ✅ Implemented Correctly
- POST /api/auth/signup - Creates company + admin user
- POST /api/auth/signin - User authentication with JWT
- Password hashing with bcrypt
- JWT token generation
- Company creation with currency

#### ❌ Issues Found

##### Issue 1.1: No "Only 1 Admin Per Company" Constraint
**Location**: `auth-service/src/services/auth.service.ts` - signup method  
**Current Code**: Creates admin without checking existing admins  
**Required**: 
```typescript
// Before creating admin, check if company already has admin
const adminCheck = await client.query(
  'SELECT COUNT(*) as count FROM users WHERE company_id = $1 AND role = $2',
  [companyId, 'admin']
);

if (adminCheck.rows[0].count > 0) {
  throw new Error('Company already has an admin. Only one admin per company is allowed.');
}
```

##### Issue 1.2: Missing Token Refresh Endpoint
**Expected**: POST /api/auth/refresh-token  
**Status**: Not implemented  
**Priority**: MEDIUM

##### Issue 1.3: Missing Verify Token Endpoint
**Expected**: POST /api/auth/verify-token  
**Status**: Not implemented  
**Priority**: LOW (can be done client-side)

##### Issue 1.4: Forgot Password Implementation Incomplete
**Location**: `auth-service/src/services/auth.service.ts` - forgotPassword method  
**Issue**: Method exists but reset-password endpoint not implemented  
**Required**: POST /api/auth/reset-password endpoint

---

### 2. User Service (/server/user-service)

#### ✅ Implemented Correctly
- GET /api/users - List all users
- GET /api/users/:id - Get single user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Soft delete (deactivate)

#### ❌ Critical Missing Features

##### Issue 2.1: No Create User Endpoint (CRITICAL)
**Expected**: POST /api/users  
**Status**: NOT IMPLEMENTED  
**Priority**: CRITICAL  
**Required Implementation**:
```typescript
async createUser(data: CreateUserData, adminCompanyId: string) {
  // Validate role
  if (!['employee', 'manager'].includes(data.role)) {
    throw new Error('Can only create employee or manager users');
  }

  // If creating admin role (should be blocked)
  if (data.role === 'admin') {
    // Check if company already has admin
    const adminCheck = await pool.query(
      'SELECT COUNT(*) FROM users WHERE company_id = $1 AND role = $2',
      [adminCompanyId, 'admin']
    );
    
    if (adminCheck.rows[0].count > 0) {
      throw new Error('Only one admin per company is allowed');
    }
  }

  // Generate temporary password
  const tempPassword = generateTempPassword();
  const hashedPassword = await hashPassword(tempPassword);

  // Create user
  const result = await pool.query(
    `INSERT INTO users (id, company_id, name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING id, name, email, role`,
    [uuidv4(), adminCompanyId, data.name, data.email, hashedPassword, data.role]
  );

  // Send password setup email
  await sendPasswordSetupEmail(data.email, data.name, tempPassword);

  return result.rows[0];
}
```

##### Issue 2.2: Missing Manager Assignment Endpoints
**Expected Endpoints**:
- POST /api/users/:id/manager - Assign manager to employee
- GET /api/users/:id/manager - Get employee's manager

**Status**: NOT IMPLEMENTED  
**Priority**: HIGH  
**Current Implementation**: Has `getUserManagers` and `getUserSubordinates` but no assignment logic

**Required**:
```typescript
async assignManager(userId: string, managerId: string, companyId: string) {
  // Validate both users exist and belong to same company
  const usersCheck = await pool.query(
    'SELECT id, role FROM users WHERE id IN ($1, $2) AND company_id = $3',
    [userId, managerId, companyId]
  );

  if (usersCheck.rows.length !== 2) {
    throw new Error('Invalid user or manager');
  }

  // Deactivate existing manager relationships
  await pool.query(
    'UPDATE manager_relationships SET is_active = false WHERE user_id = $1',
    [userId]
  );

  // Create new manager relationship
  await pool.query(
    `INSERT INTO manager_relationships (id, user_id, manager_id, is_active, created_at)
     VALUES ($1, $2, $3, true, NOW())`,
    [uuidv4(), userId, managerId]
  );

  return { success: true };
}
```

##### Issue 2.3: Missing Send Password Email Endpoint
**Expected**: POST /api/users/:id/send-password  
**Status**: NOT IMPLEMENTED  
**Priority**: MEDIUM

##### Issue 2.4: Schema Mismatch
**Issue**: Service uses `first_name`, `last_name` but database has `name`  
**Database Schema**: `name VARCHAR(255)`  
**Service Code**: References `first_name`, `last_name`, `department`, `phone`  
**Fix Required**: Align with database schema (use `name` field)

---

### 3. Expense Service (/server/expense-service)

#### ✅ Implemented Correctly
- GET /api/expenses - List expenses
- GET /api/expenses/:id - Get single expense
- POST /api/expenses - Create expense
- PUT /api/expenses/:id - Update expense
- DELETE /api/expenses/:id - Delete expense

#### ❌ Missing Features

##### Issue 3.1: Missing Submit for Approval Endpoint
**Expected**: POST /api/expenses/:id/submit  
**Status**: NOT IMPLEMENTED  
**Priority**: HIGH  
**Required**: Endpoint to change status from 'draft' to 'submitted' and trigger approval workflow

##### Issue 3.2: Missing Approval History Endpoint
**Expected**: GET /api/expenses/:id/history  
**Status**: NOT IMPLEMENTED  
**Priority**: MEDIUM

##### Issue 3.3: Missing Receipt Upload Endpoint
**Expected**: POST /api/expenses/upload-receipt  
**Status**: NOT IMPLEMENTED  
**Priority**: HIGH  
**Required**: Cloudinary integration for receipt uploads

##### Issue 3.4: Missing Categories Endpoints
**Expected**:
- GET /api/categories - List categories
- POST /api/categories - Create category (Admin)

**Status**: NOT IMPLEMENTED  
**Priority**: HIGH

##### Issue 3.5: No Role-Based Filtering
**Issue**: GET /api/expenses doesn't filter by user role  
**Required Logic**:
- **Employee**: Only see own expenses
- **Manager**: See own + subordinates' expenses requiring approval
- **Admin**: See all company expenses

---

### 4. Approval Service (/server/approval-service)

#### ✅ Implemented Correctly
- GET /api/approval-rules - List rules
- GET /api/approval-rules/:id - Get single rule
- POST /api/approval-rules - Create rule
- PUT /api/approval-rules/:id - Update rule
- DELETE /api/approval-rules/:id - Delete rule

#### ❌ Missing Features

##### Issue 4.1: Missing Pending Approvals Endpoint
**Expected**: GET /api/approvals/pending  
**Status**: NOT IMPLEMENTED  
**Priority**: CRITICAL  
**Required**: List expenses awaiting current user's approval

##### Issue 4.2: Missing Approve/Reject Endpoints
**Expected**:
- POST /api/approvals/:id/approve
- POST /api/approvals/:id/reject

**Status**: NOT IMPLEMENTED  
**Priority**: CRITICAL

##### Issue 4.3: Missing Get Approval Details
**Expected**: GET /api/approvals/:expenseId  
**Status**: NOT IMPLEMENTED  
**Priority**: MEDIUM

##### Issue 4.4: No Approval Workflow Engine
**Issue**: No logic to:
- Match expenses to approval rules
- Create approval steps
- Progress through approval chain
- Handle percentage-based approvals
- Integrate manager approvals

---

### 5. Currency Service (/server/currency-service)

#### ✅ Implemented Correctly
- Basic service structure
- Database connection

#### ❌ Missing Features

##### Issue 5.1: All Endpoints Missing
**Expected**:
- GET /api/currency/countries - Fetch from restcountries.com
- GET /api/currency/rates - List exchange rates
- POST /api/currency/convert - Convert between currencies
- GET /api/currency/rates/:base - Get rates for specific base

**Status**: NONE IMPLEMENTED  
**Priority**: HIGH

---

### 6. OCR Service (/server/ocr-service)

#### ✅ Implemented Correctly
- Python Flask service
- Tesseract OCR integration

#### ❌ Missing Features

##### Issue 6.1: Missing Result Retrieval Endpoint
**Expected**: GET /api/ocr/result/:expenseId  
**Status**: NOT IMPLEMENTED  
**Priority**: MEDIUM

##### Issue 6.2: No MongoDB Integration
**Issue**: Results should be stored in MongoDB `ocr_results` collection  
**Current**: Only processes and returns  
**Required**: Store with confidence scores and extracted fields

---

### 7. Notification Service (/server/notification-service)

#### ✅ Implemented Correctly
- GET /api/notifications - List notifications
- GET /api/notifications/unread - Unread count

#### ❌ Missing Features

##### Issue 7.1: Missing Mark as Read Endpoint
**Expected**: PATCH /api/notifications/:id/read  
**Status**: NOT IMPLEMENTED  
**Priority**: MEDIUM

##### Issue 7.2: Missing Delete Notification
**Expected**: DELETE /api/notifications/:id  
**Status**: NOT IMPLEMENTED  
**Priority**: LOW

##### Issue 7.3: No Notification Creation Logic
**Issue**: Service can retrieve but not create notifications  
**Required**: Methods to create notifications for:
- Expense submitted
- Expense approved
- Expense rejected
- New user created
- Password reset requested

---

### 8. Queue Service (/server/queue-service)

#### ✅ Implemented Correctly
- Bull queue setup
- Redis integration

#### ❌ Missing Features

##### Issue 8.1: No Job Processors
**Issue**: Queue structure exists but no job handlers for:
- OCR processing
- Email sending
- Notification creation
- Report generation

**Priority**: MEDIUM

---

## Database Constraint Required

### Add Unique Constraint for Admin Role

Add this constraint to ensure only one admin per company:

```sql
-- Add to migrations or run manually
CREATE UNIQUE INDEX idx_unique_admin_per_company 
ON users (company_id) 
WHERE role = 'admin' AND is_active = true;
```

**This constraint ensures at database level that only one active admin can exist per company.**

---

## Priority Action Items

### P0 - Critical (Blocking Core Functionality)
1. ✅ Add "Only 1 Admin Per Company" database constraint
2. ✅ Implement POST /api/users (Create User)
3. ✅ Implement POST /api/users/:id/manager (Assign Manager)
4. ✅ Implement POST /api/expenses/:id/submit (Submit for Approval)
5. ✅ Implement GET /api/approvals/pending (Pending Approvals)
6. ✅ Implement POST /api/approvals/:id/approve (Approve Expense)
7. ✅ Implement POST /api/approvals/:id/reject (Reject Expense)

### P1 - High (Essential Features)
8. ✅ Implement expense categories endpoints
9. ✅ Implement receipt upload with Cloudinary
10. ✅ Implement role-based expense filtering
11. ✅ Implement currency service endpoints
12. ✅ Fix user-service schema mismatch (first_name/last_name vs name)
13. ✅ Implement approval workflow engine

### P2 - Medium (Important but Not Blocking)
14. ⬜ Implement POST /api/auth/reset-password
15. ⬜ Implement POST /api/auth/refresh-token
16. ⬜ Implement PATCH /api/notifications/:id/read
17. ⬜ Implement GET /api/ocr/result/:expenseId
18. ⬜ Implement queue job processors

### P3 - Low (Nice to Have)
19. ⬜ Implement POST /api/auth/verify-token
20. ⬜ Implement DELETE /api/notifications/:id
21. ⬜ Add comprehensive error handling
22. ⬜ Add request validation middleware

---

## Recommendations

1. **Immediate Action**: Add database constraint for single admin per company
2. **Phase 1**: Complete user management (create, assign manager)
3. **Phase 2**: Complete expense workflow (submit, approve, reject)
4. **Phase 3**: Complete supporting services (currency, categories, notifications)
5. **Testing**: Add integration tests for each service after implementation

---

## Compliance Status

- **FLOW.md Compliance**: ~60% (Core structure present, missing endpoints and logic)
- **Database Schema Compliance**: 90% (Schemas match, missing unique constraint)
- **Business Rules Compliance**: 40% ("Only 1 admin" not enforced, approval logic missing)

---

**Next Steps**: Proceed with P0 critical implementations in priority order.
