# Backend Setup & Running Guide

## 🎯 Quick Start (Recommended)

### Option 1: Using Docker Compose (Easiest)

This will start all services (databases + microservices) automatically:

```bash
# From the root directory (d:\hackathon)
docker-compose up -d

# Check if all services are running
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services will be available at:**
- API Gateway: http://localhost:5000
- Auth Service: http://localhost:5001
- User Service: http://localhost:5002
- Expense Service: http://localhost:5003
- Approval Service: http://localhost:5004
- Currency Service: http://localhost:5005
- OCR Service: http://localhost:5006
- Notification Service: http://localhost:5007
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

---

## Option 2: Manual Setup (For Development)

### Step 1: Start Databases

#### Using Docker (Recommended for databases only):
```bash
# Start only PostgreSQL
docker run -d \
  --name expense_postgres \
  -e POSTGRES_DB=expense_management \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  postgres:15-alpine

# Start only MongoDB
docker run -d \
  --name expense_mongodb \
  -p 27017:27017 \
  mongo:7

# Start only Redis
docker run -d \
  --name expense_redis \
  -p 6379:6379 \
  redis:7-alpine
```

#### OR Install Locally:
- **PostgreSQL 15**: https://www.postgresql.org/download/
- **MongoDB 7**: https://www.mongodb.com/try/download/community
- **Redis 7**: https://redis.io/download/

### Step 2: Run Database Migrations

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost -d expense_management

# Run migrations (in PostgreSQL shell)
\i database/postgres/migrations/001_create_companies.sql
\i database/postgres/migrations/002_create_users.sql
\i database/postgres/migrations/003_create_manager_relationships.sql
\i database/postgres/migrations/004_create_expense_categories.sql
\i database/postgres/migrations/005_create_expenses.sql
\i database/postgres/migrations/006_create_expense_line_items.sql
\i database/postgres/migrations/007_create_approval_rules.sql
\i database/postgres/migrations/008_create_approval_steps.sql
\i database/postgres/migrations/009_create_expense_approvals.sql
\i database/postgres/migrations/010_create_approval_actions.sql
\i database/postgres/migrations/011_create_exchange_rates.sql

# Exit PostgreSQL
\q
```

### Step 3: Configure Environment Variables

Create `.env` files for each service (or copy from `.env.example`):

#### API Gateway (.env)
```bash
cd server/api-gateway
cp .env.example .env
```

Edit `server/api-gateway/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this

# Service URLs
AUTH_SERVICE_URL=http://localhost:5001
USER_SERVICE_URL=http://localhost:5002
EXPENSE_SERVICE_URL=http://localhost:5003
APPROVAL_SERVICE_URL=http://localhost:5004
CURRENCY_SERVICE_URL=http://localhost:5005
OCR_SERVICE_URL=http://localhost:5006
NOTIFICATION_SERVICE_URL=http://localhost:5007
```

#### Auth Service (.env)
```bash
cd ../auth-service
cp .env.example .env
```

Edit `server/auth-service/.env`:
```env
PORT=5001
NODE_ENV=development

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# JWT
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRY=24h

# Email (Nodemailer)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Repeat for other services (user-service, expense-service, etc.)

### Step 4: Install Dependencies

Install dependencies for all services:

```bash
# API Gateway
cd server/api-gateway
npm install

# Auth Service
cd ../auth-service
npm install

# Repeat for other services...
# Or use a script to install all at once:
```

Create `install-all.sh` in root:
```bash
#!/bin/bash
echo "Installing dependencies for all services..."

cd server/api-gateway && npm install && cd ../..
cd server/auth-service && npm install && cd ../..
# Add other services...

echo "All dependencies installed!"
```

### Step 5: Start All Services

You'll need multiple terminal windows (or use a process manager like `pm2`):

#### Terminal 1 - API Gateway:
```bash
cd server/api-gateway
npm run dev
```

#### Terminal 2 - Auth Service:
```bash
cd server/auth-service
npm run dev
```

#### Terminal 3 - User Service:
```bash
cd server/user-service
npm run dev
```

#### Terminal 4 - Expense Service:
```bash
cd server/expense-service
npm run dev
```

#### Terminal 5 - Approval Service:
```bash
cd server/approval-service
npm run dev
```

#### Terminal 6 - Currency Service:
```bash
cd server/currency-service
npm run dev
```

#### Terminal 7 - OCR Service:
```bash
cd server/ocr-service
pip install -r requirements.txt
python src/server.py
```

#### Terminal 8 - Notification Service:
```bash
cd server/notification-service
npm run dev
```

---

## Option 3: Using PM2 (Process Manager)

Install PM2 globally:
```bash
npm install -g pm2
```

Create `ecosystem.config.js` in root:
```javascript
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      cwd: './server/api-gateway',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'auth-service',
      cwd: './server/auth-service',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'user-service',
      cwd: './server/user-service',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'expense-service',
      cwd: './server/expense-service',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'approval-service',
      cwd: './server/approval-service',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'currency-service',
      cwd: './server/currency-service',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'notification-service',
      cwd: './server/notification-service',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};
```

Start all services:
```bash
pm2 start ecosystem.config.js

# View status
pm2 status

# View logs
pm2 logs

# Stop all
pm2 stop all

# Delete all
pm2 delete all
```

---

## 🧪 Testing the Backend

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Test Auth Service (Signup)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "Test@123",
    "confirmPassword": "Test@123",
    "country": "United States",
    "currency": "USD"
  }'
```

### 3. Test Auth Service (Signin)
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Test@123"
  }'
```

---

## 📋 Troubleshooting

### Database Connection Issues:
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check PostgreSQL logs
docker logs expense_postgres

# Connect to PostgreSQL manually
docker exec -it expense_postgres psql -U postgres -d expense_management
```

### Service Not Starting:
```bash
# Check if port is in use
netstat -ano | findstr :5001

# Kill process on port (Windows PowerShell)
Stop-Process -Id <PID> -Force

# Check service logs
cd server/auth-service
npm run dev
```

### Clear All Docker Containers:
```bash
# Stop and remove all containers
docker-compose down -v

# Remove all volumes (CAUTION: Deletes all data)
docker volume prune -f

# Start fresh
docker-compose up -d
```

---

## 🚀 Recommended Development Workflow

1. **Start databases** using Docker:
   ```bash
   docker-compose up -d postgres mongodb redis
   ```

2. **Run migrations** (first time only)

3. **Start all microservices** using PM2:
   ```bash
   pm2 start ecosystem.config.js
   ```

4. **Start frontend**:
   ```bash
   cd client
   npm run dev
   ```

5. **Monitor logs**:
   ```bash
   pm2 logs
   ```

---

## 📊 Service Architecture

```
Frontend (React)
    ↓
API Gateway :5000
    ↓
    ├─→ Auth Service :5001 → PostgreSQL
    ├─→ User Service :5002 → PostgreSQL
    ├─→ Expense Service :5003 → PostgreSQL + MongoDB
    ├─→ Approval Service :5004 → PostgreSQL
    ├─→ Currency Service :5005 → PostgreSQL + Redis
    ├─→ OCR Service :5006 → MongoDB
    └─→ Notification Service :5007 → MongoDB
```

---

## 🔑 Important Notes

- **Default Database Credentials**: 
  - PostgreSQL: `postgres` / `postgres123`
  - MongoDB: No authentication in dev mode
  
- **JWT Secret**: Change `JWT_SECRET` in production!

- **Email Setup**: Update Gmail credentials for password reset emails

- **Ports**: Make sure ports 5000-5007, 5432, 27017, 6379 are available

---

Good luck! 🎉
