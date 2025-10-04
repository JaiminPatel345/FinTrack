# Queue Service API Documentation

Base URL: `/queue` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Overview

The Queue Service manages background jobs and asynchronous task processing using Bull queue and Redis.

## Endpoints

### 1. Get Queue Status

Check the status of the queue service.

**Endpoint:** `GET /queue/status`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Queue service is running"
}
```

---

### 2. Add Job to Queue

Add a new background job to the queue.

**Endpoint:** `POST /queue/jobs`

**Authentication:** Required

**Request Body:**
```json
{
  "type": "send_email",
  "data": {
    "to": "user@example.com",
    "subject": "Welcome",
    "body": "Welcome to our service"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Job added to queue"
}
```

---

## Supported Job Types

### 1. Email Jobs

**Type:** `send_email`

**Data:**
```json
{
  "to": "user@example.com",
  "subject": "Email Subject",
  "body": "Email body content",
  "html": "<p>HTML content</p>"
}
```

### 2. Report Generation

**Type:** `generate_report`

**Data:**
```json
{
  "reportType": "expense_summary",
  "userId": 1,
  "startDate": "2024-10-01",
  "endDate": "2024-10-31",
  "format": "pdf"
}
```

### 3. Data Export

**Type:** `export_data`

**Data:**
```json
{
  "exportType": "expenses",
  "userId": 1,
  "filters": {},
  "format": "csv"
}
```

### 4. Notification Batch

**Type:** `send_notifications`

**Data:**
```json
{
  "userIds": [1, 2, 3],
  "notification": {
    "title": "System Update",
    "message": "System will be down for maintenance"
  }
}
```

---

## Job States

Jobs can be in the following states:

- `waiting`: Job is queued and waiting to be processed
- `active`: Job is currently being processed
- `completed`: Job finished successfully
- `failed`: Job failed with an error
- `delayed`: Job is scheduled for later

---

## Job Priority

Jobs can have different priority levels:

- `1`: Critical (highest priority)
- `2`: High
- `3`: Normal (default)
- `4`: Low
- `5`: Very Low (lowest priority)

Example with priority:
```json
{
  "type": "send_email",
  "priority": 1,
  "data": {
    "to": "urgent@example.com",
    "subject": "Urgent"
  }
}
```

---

## Job Options

Additional options for job configuration:

```json
{
  "type": "send_email",
  "data": {...},
  "options": {
    "delay": 5000,  // Delay in milliseconds
    "attempts": 3,  // Number of retry attempts
    "backoff": {
      "type": "exponential",
      "delay": 2000
    },
    "removeOnComplete": true,
    "removeOnFail": false
  }
}
```

---

## Scheduled Jobs

The system automatically runs these scheduled jobs:

### Daily Jobs
- **Currency Rate Updates** - Updates exchange rates (1:00 AM)
- **Report Generation** - Generates daily reports (2:00 AM)
- **Data Cleanup** - Cleans old logs and temp data (3:00 AM)

### Weekly Jobs
- **Weekly Summary** - Sends weekly expense summaries (Monday 9:00 AM)
- **Analytics Update** - Updates analytics data (Sunday 11:00 PM)

### Monthly Jobs
- **Monthly Reports** - Generates monthly reports (1st of month, 9:00 AM)
- **Data Archival** - Archives old data (1st of month, 2:00 AM)

---

## Monitoring & Admin Endpoints (Future)

These endpoints will be added for queue monitoring:

- `GET /queue/stats` - Get queue statistics
- `GET /queue/jobs/:id` - Get specific job details
- `GET /queue/jobs` - List all jobs with filtering
- `DELETE /queue/jobs/:id` - Cancel/remove a job
- `POST /queue/jobs/:id/retry` - Retry a failed job
- `GET /queue/failed` - Get all failed jobs
- `POST /queue/clean` - Clean completed/failed jobs

---

## Error Handling

When a job fails:

1. Job is automatically retried based on `attempts` configuration
2. Failed jobs are logged with error details
3. Notifications sent to admins for critical job failures
4. Failed jobs can be manually retried via admin panel

---

## Data Models

### Job Object
```typescript
{
  id: string;
  type: string;
  data: any;
  priority: number;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress: number;  // 0-100
  attemptsMade: number;
  processedOn?: number;  // Timestamp
  finishedOn?: number;  // Timestamp
  failedReason?: string;
}
```

---

## Best Practices

1. **Use appropriate priority**: Reserve high priority for time-sensitive tasks
2. **Set reasonable timeouts**: Prevent jobs from running indefinitely
3. **Handle failures gracefully**: Implement proper error handling in job processors
4. **Monitor queue health**: Regular check queue length and failed jobs
5. **Clean up old jobs**: Regularly remove completed jobs to save memory

---

## Technology Stack

- **Bull** - Robust queue management
- **Redis** - Job storage and pub/sub
- **Node.js** - Job processors

---

## Future Enhancements

- Queue dashboard for monitoring
- Job scheduling with cron expressions
- Job chaining and workflows
- Rate limiting for job processing
- Job result caching
- Webhook notifications for job completion
