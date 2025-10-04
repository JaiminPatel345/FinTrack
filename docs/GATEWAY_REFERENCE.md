# API Gateway - Quick Reference

## Gateway Configuration

**Base URL:** `http://localhost:5000`

The API Gateway routes all client requests to the appropriate microservices.

---

## Service Routing

| Client Endpoint | Proxied To | Service Port | Description |
|----------------|------------|--------------|-------------|
| `/api/auth/*` | Auth Service | 5001 | Authentication & password management |
| `/api/users/*` | User Service | 5002 | User CRUD & manager relationships |
| `/api/expenses/*` | Expense Service | 5003 | Expense management |
| `/api/categories/*` | Expense Service | 5003 | Expense categories |
| `/api/approvals/*` | Approval Service | 5004 | Approval workflow |
| `/api/approval-rules/*` | Approval Service | 5004 | Approval rule configuration |
| `/api/currency/*` | Currency Service | 5005 | Currency conversion & rates |
| `/api/ocr/*` | OCR Service | 5006 | Receipt text extraction |

---

## Example URL Transformations

**Client calls:**
```
GET http://localhost:5000/api/users/123
```

**Gateway forwards to:**
```
GET http://localhost:5002/users/123
```

**Client calls:**
```
POST http://localhost:5000/api/expenses/456/submit
```

**Gateway forwards to:**
```
POST http://localhost:5003/expenses/456/submit
```

---

## Features

### 1. Security
- ✅ Helmet.js for HTTP headers security
- ✅ CORS configured for frontend origin
- ✅ Request compression with gzip
- ✅ JSON body parsing (10MB limit)

### 2. Rate Limiting
- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- Prevents DDoS and abuse

### 3. Error Handling
- Service unavailable errors (503) when microservice is down
- Consistent error response format
- Request logging

### 4. Health Check
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "success": true,
  "message": "API Gateway is healthy",
  "timestamp": "2024-10-04T12:00:00.000Z"
}
```

---

## Starting the Gateway

### Development Mode
```bash
cd server/api-gateway
yarn dev
```

### Production Mode
```bash
cd server/api-gateway
yarn build
yarn start
```

### Via Docker
```bash
docker compose up api-gateway
```

---

## Environment Variables

Create `.env` file in `server/api-gateway/`:

```env
# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Service URLs (for Docker)
AUTH_SERVICE_URL=http://auth-service:5001
USER_SERVICE_URL=http://user-service:5002
EXPENSE_SERVICE_URL=http://expense-service:5003
APPROVAL_SERVICE_URL=http://approval-service:5004
CURRENCY_SERVICE_URL=http://currency-service:5005
OCR_SERVICE_URL=http://ocr-service:5006
NOTIFICATION_SERVICE_URL=http://notification-service:5007
```

---

## Testing the Gateway

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Test Auth (No Token)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!",
    "companyName": "Test Company",
    "country": "United States",
    "currency": "USD"
  }'
```

### 3. Test Protected Route (With Token)
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test 404
```bash
curl http://localhost:5000/api/invalid-route
```

Response:
```json
{
  "success": false,
  "error": "Route not found",
  "path": "/api/invalid-route"
}
```

---

## Troubleshooting

### Gateway not starting
1. Check if port 5000 is available:
   ```bash
   lsof -i :5000
   ```

2. Check if all dependencies are installed:
   ```bash
   cd server/api-gateway
   yarn install
   ```

### Service unavailable errors (503)
1. Check if microservices are running:
   ```bash
   docker compose ps
   # or
   lsof -i :5001,5002,5003,5004,5005,5006,5007
   ```

2. Verify service URLs in `.env` or environment variables

### CORS errors in browser
1. Check `CORS_ORIGIN` matches your frontend URL
2. Ensure frontend sends credentials:
   ```javascript
   fetch('http://localhost:5000/api/users', {
     credentials: 'include',
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```

### Rate limit exceeded
Wait 15 minutes or restart the gateway to reset counters.

---

## Client Integration Example

### React/JavaScript
```javascript
// api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Auth
  signup: (data) => 
    fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  signin: (data) => 
    fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  // Protected requests
  getExpenses: (token, filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return fetch(`${API_BASE_URL}/expenses?${query}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
  },

  createExpense: (token, data) =>
    fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  submitExpense: (token, expenseId) =>
    fetch(`${API_BASE_URL}/expenses/${expenseId}/submit`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()),

  // Approvals
  getPendingApprovals: (token) =>
    fetch(`${API_BASE_URL}/approvals/pending`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()),

  approveExpense: (token, actionId, comments) =>
    fetch(`${API_BASE_URL}/approvals/${actionId}/approve`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comments })
    }).then(res => res.json())
};
```

### Usage in Components
```javascript
// Login Component
const handleLogin = async (email, password) => {
  try {
    const result = await api.signin({ email, password });
    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Expense List Component
useEffect(() => {
  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    const result = await api.getExpenses(token, { 
      status: 'pending_approval' 
    });
    if (result.success) {
      setExpenses(result.data);
    }
  };
  fetchExpenses();
}, []);
```

---

## Production Deployment

### Using Docker Compose
```yaml
# docker-compose.yml
api-gateway:
  build:
    context: .
    dockerfile: ./server/api-gateway/Dockerfile
  ports:
    - "5000:5000"
  environment:
    - NODE_ENV=production
    - PORT=5000
    - CORS_ORIGIN=https://your-frontend-domain.com
    - AUTH_SERVICE_URL=http://auth-service:5001
    - USER_SERVICE_URL=http://user-service:5002
    # ... other service URLs
  depends_on:
    - auth-service
    - user-service
    - expense-service
    - approval-service
    - currency-service
  restart: unless-stopped
```

### Nginx Reverse Proxy (Optional)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring

### Log Proxy Errors
Check console output for service proxy errors:
```
Auth Service Proxy Error: connect ECONNREFUSED 127.0.0.1:5001
User Service Proxy Error: connect ECONNREFUSED 127.0.0.1:5002
```

### Check Service Health
Create a script to ping all services:
```bash
#!/bin/bash
services=(
  "http://localhost:5001/health"
  "http://localhost:5002/health"
  "http://localhost:5003/health"
  "http://localhost:5004/health"
  "http://localhost:5005/health"
)

for service in "${services[@]}"; do
  echo "Checking $service"
  curl -s $service | jq
done
```

---

## Summary

✅ **Single Entry Point**: Client only needs to know `http://localhost:5000/api`  
✅ **Service Discovery**: Gateway routes to correct microservice  
✅ **Security**: CORS, rate limiting, helmet protection  
✅ **Error Handling**: Graceful 503 when services are down  
✅ **Scalable**: Can add more services without client changes  

All client API documentation is in **`docs/CLIENT_API.md`**
