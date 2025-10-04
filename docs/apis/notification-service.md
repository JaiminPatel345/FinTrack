# Notification Service API Documentation

Base URL: `/notifications` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Endpoints

### 1. Get User Notifications

Get all notifications for the logged-in user.

**Endpoint:** `GET /notifications`

**Authentication:** Required

**Query Parameters:**
- `read` (boolean, optional): Filter by read status (`true`, `false`)
- `type` (string, optional): Filter by notification type
- `limit` (number, optional): Limit number of results (default: 50)

**Example:** `GET /notifications?read=false&limit=20`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "6527a1b2c3d4e5f6a7b8c9d0",
      "userId": 1,
      "type": "expense_approved",
      "title": "Expense Approved",
      "message": "Your expense 'Business Lunch' has been approved",
      "relatedId": 5,
      "relatedType": "expense",
      "read": false,
      "createdAt": "2024-10-04T14:00:00.000Z",
      "updatedAt": "2024-10-04T14:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Unread Count

Get count of unread notifications.

**Endpoint:** `GET /notifications/unread/count`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

### 3. Mark Notification as Read

Mark a specific notification as read.

**Endpoint:** `PUT /notifications/:id/read`

**Authentication:** Required

**URL Parameters:**
- `id` (string): Notification ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

### 4. Mark All as Read

Mark all notifications as read for the user.

**Endpoint:** `PUT /notifications/read-all`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "5 notifications marked as read"
}
```

---

### 5. Delete Notification

Delete a notification.

**Endpoint:** `DELETE /notifications/:id`

**Authentication:** Required

**URL Parameters:**
- `id` (string): Notification ID (MongoDB ObjectId)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

### 6. Send Test Notification

Send a test notification (for testing purposes).

**Endpoint:** `POST /notifications/test`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Test Notification",
  "message": "This is a test notification"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "6527a1b2c3d4e5f6a7b8c9d1",
    "userId": 1,
    "type": "test",
    "title": "Test Notification",
    "message": "This is a test notification",
    "read": false,
    "createdAt": "2024-10-04T15:00:00.000Z",
    "updatedAt": "2024-10-04T15:00:00.000Z"
  }
}
```

---

## Notification Types

The system automatically sends notifications for these events:

- `expense_submitted` - When user submits expense for approval
- `expense_approved` - When expense is approved
- `expense_rejected` - When expense is rejected
- `approval_required` - When user needs to approve an expense
- `comment_added` - When someone comments on an expense
- `status_changed` - When expense status changes

---

## Data Models

### Notification Object
```typescript
{
  _id: string;  // MongoDB ObjectId
  userId: number;
  type: string;
  title: string;
  message: string;
  relatedId?: number;  // ID of related entity (expense, approval, etc.)
  relatedType?: string;  // Type of related entity
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## Email Notifications

Notifications can also be sent via email if configured. Email settings:

- SMTP configuration in environment variables
- Automatic email for critical notifications
- Users can configure email preferences (future feature)

---

## WebSocket Support (Future)

Real-time notification delivery will be added using WebSocket connections:
- Subscribe to notification channel on login
- Receive instant notifications without polling
- Live unread count updates
