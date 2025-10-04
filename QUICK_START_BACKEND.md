# 🚀 Quick Backend Start Guide

## ⚠️ Prerequisites Check

Before starting the backend, you need these installed:

### 1. PostgreSQL Database
Check if installed:
```powershell
psql --version
```

If NOT installed:
- Download: https://www.postgresql.org/download/windows/
- Or use Docker: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres --name postgres postgres:15`

### 2. Node.js (Already installed ✅)
```powershell
node --version
npm --version
```

---

## 🎯 EASIEST WAY: Run Backend Services

### Step 1: Start PostgreSQL

**Option A - If you have PostgreSQL installed locally:**
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# If not running, start it
Start-Service postgresql-x64-15  # Or your version
```

**Option B - If you have Docker installed:**
```powershell
docker run -d `
  --name expense_postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=expense_management `
  -p 5432:5432 `
  postgres:15-alpine
```

**Option C - If you don't have either:**
Download and install PostgreSQL: https://www.postgresql.org/download/windows/
- During installation, set password to: `postgres`
- Keep default port: `5432`

### Step 2: Create Database & Run Migrations

```powershell
# Connect to PostgreSQL (password: postgres)
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE expense_management;
\c expense_management

# Run migrations (copy-paste each file content or run):
\i D:/hackathon/database/postgres/migrations/001_create_companies.sql
\i D:/hackathon/database/postgres/migrations/002_create_users.sql
\i D:/hackathon/database/postgres/migrations/003_create_manager_relationships.sql
\i D:/hackathon/database/postgres/migrations/004_create_expense_categories.sql
\i D:/hackathon/database/postgres/migrations/005_create_expenses.sql

# Exit
\q
```

### Step 3: Start Auth Service (MOST IMPORTANT)

Open a **new terminal** and run:

```powershell
cd D:\hackathon\server\auth-service
npm run dev
```

You should see:
```
🔐 Auth Service running on port 5001
✅ Database connected successfully
```

### Step 4: Start API Gateway

Open **another terminal** and run:

```powershell
cd D:\hackathon\server\api-gateway
npm run dev
```

You should see:
```
🚪 API Gateway running on port 5000
```

### Step 5: Test the Backend

Open browser or use curl:
```powershell
# Test health endpoint
curl http://localhost:5000/health

# Test auth signup
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Admin\",\"email\":\"admin@test.com\",\"password\":\"Test@123\",\"confirmPassword\":\"Test@123\",\"country\":\"United States\",\"currency\":\"USD\"}'
```

---

## 🎮 Frontend Connection

Now your frontend at http://localhost:3001 can connect to:
- **API Gateway**: http://localhost:5000/api/*
- **Auth endpoints**: http://localhost:5000/api/auth/*

---

## 📝 What Each Service Does

| Service | Port | Purpose | Required? |
|---------|------|---------|-----------|
| **PostgreSQL** | 5432 | Database | ✅ YES |
| **API Gateway** | 5000 | Routes requests | ✅ YES |
| **Auth Service** | 5001 | Signup/Signin/JWT | ✅ YES |
| User Service | 5002 | User management | Later |
| Expense Service | 5003 | Expenses CRUD | Later |
| Approval Service | 5004 | Approvals | Later |
| Currency Service | 5005 | Currency conversion | Later |
| MongoDB | 27017 | OCR & Notifications | Later |

---

## 🔧 Troubleshooting

### Error: "Database connection failed"
**Solution 1:** Check PostgreSQL is running
```powershell
Get-Service postgresql*
```

**Solution 2:** Check connection settings in `server/auth-service/.env`:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres  # Your PostgreSQL password
```

### Error: "Port 5001 already in use"
**Solution:** Kill the process
```powershell
# Find process using port 5001
netstat -ano | findstr :5001

# Kill it (replace PID with actual number)
Stop-Process -Id <PID> -Force
```

### Error: "Cannot find module..."
**Solution:** Install dependencies
```powershell
cd D:\hackathon\server\auth-service
npm install
```

---

## ✅ Verification Checklist

After starting, you should have:

- [x] PostgreSQL running on port 5432
- [x] Database `expense_management` created
- [x] Migrations run successfully
- [x] Auth Service running on port 5001
- [x] API Gateway running on port 5000
- [x] Frontend running on port 3001

Test the complete flow:
1. Go to http://localhost:3001
2. Click "Sign Up"
3. Fill the form and submit
4. Should create account successfully!

---

## 🚀 Next Steps

Once Auth Service works:

1. **Add User Service** (for user management)
2. **Add Expense Service** (for creating expenses)
3. **Add Approval Service** (for approval workflows)
4. **Add Currency Service** (for multi-currency)
5. **Add MongoDB** (for OCR & notifications)

---

## 💡 Pro Tips

**Use PM2 for easier management:**
```powershell
npm install -g pm2

# Start all services
pm2 start D:\hackathon\server\auth-service\src\server.ts --name auth-service
pm2 start D:\hackathon\server\api-gateway\src\server.ts --name api-gateway

# View all
pm2 list

# View logs
pm2 logs

# Stop all
pm2 stop all
```

Good luck! 🎉
