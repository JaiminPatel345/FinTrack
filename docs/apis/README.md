# API Documentation Overview

This directory contains comprehensive API documentation for all microservices in the Expense Management System.

## Services

1. **Auth Service** (Port 5001) - Authentication and authorization
2. **User Service** (Port 5002) - User management and relationships
3. **Expense Service** (Port 5003) - Expense CRUD and line items
4. **Approval Service** (Port 5004) - Approval workflow and rules
5. **Currency Service** (Port 5005) - Currency exchange and conversion
6. **OCR Service** (Port 5006) - Receipt OCR processing
7. **Notification Service** (Port 5007) - Email and in-app notifications
8. **Queue Service** (Port 5008) - Background job processing
9. **API Gateway** (Port 5000) - Main entry point for all services

## Base URL

All requests go through the API Gateway at `http://localhost:5000`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Documentation Files

- `auth-service.md` - Authentication endpoints
- `user-service.md` - User management endpoints
- `expense-service.md` - Expense management endpoints
- `approval-service.md` - Approval workflow endpoints
- `currency-service.md` - Currency conversion endpoints
- `ocr-service.md` - OCR processing endpoints
- `notification-service.md` - Notification endpoints
- `queue-service.md` - Queue management endpoints
