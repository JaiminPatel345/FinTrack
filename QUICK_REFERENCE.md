# Quick Reference Guide

## 🚀 Quick Start Commands

### Setup (One-time)
```bash
# Run setup script
./setup.sh

# Create PostgreSQL database
createdb expense_management

# Run all migrations
cat database/postgres/migrations/*.sql | psql -d expense_management

# Seed default categories
psql -d expense_management -f database/postgres/seeds/categories.sql

# Setup MongoDB
mongosh expense_management database/mongodb/collections/*.js
mongosh expense_management database/mongodb/indexes/*.js
```

### Start Services

#### Docker (Recommended)
```bash
# Start all
docker-compose up -d

# Stop all
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart auth-service
```

#### Manual Development
```bash
# In separate terminals:
yarn dev:gateway      # Port 5000
yarn dev:auth         # Port 5001
yarn dev:user         # Port 5002
yarn dev:expense      # Port 5003
yarn dev:approval     # Port 5004
yarn dev:currency     # Port 5005
yarn dev:notification # Port 5007
yarn dev:queue        # Background workers
```

## 🔍 Health Checks

```bash
# Check all services
curl http://localhost:5000/health  # API Gateway
curl http://localhost:5001/health  # Auth Service
curl http://localhost:5002/health  # User Service
curl http://localhost:5003/health  # Expense Service
curl http://localhost:5004/health  # Approval Service
curl http://localhost:5005/health  # Currency Service
curl http://localhost:5007/health  # Notification Service
```

## 📝 API Examples

### 1. Signup (Create Admin)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin@123",
    "country": "United States",
    "currency": "USD",
    "companyName": "ACME Corp"
  }'
```

### 2. Signin
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

Save the token from response:
```bash
export TOKEN="your_jwt_token_here"
```

### 3. Get All Categories
```bash
curl http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Create Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "category-uuid-here",
    "description": "Business lunch with client",
    "amount": 75.50,
    "currency": "USD",
    "expenseDate": "2024-01-15",
    "paidBy": "credit_card",
    "gstPercentage": 18
  }'
```

### 5. Submit Expense for Approval
```bash
curl -X POST http://localhost:5000/api/expenses/{expense-id}/submit \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Get Pending Approvals (Manager)
```bash
curl http://localhost:5000/api/approvals/pending \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Approve Expense
```bash
curl -X POST http://localhost:5000/api/approvals/{approval-id}/approve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Approved - looks good"
  }'
```

## 🗄️ Database Commands

### PostgreSQL
```bash
# Connect to database
psql -d expense_management

# List tables
\dt

# View table structure
\d users

# Query data
SELECT * FROM users;
SELECT * FROM companies;
SELECT * FROM expenses WHERE status = 'submitted';

# Check user count
SELECT role, COUNT(*) FROM users GROUP BY role;
```

### MongoDB
```bash
# Connect to MongoDB
mongosh expense_management

# List collections
show collections

# View documents
db.audit_logs.find().limit(5).pretty()
db.ocr_results.find({ocr_status: 'completed'})
db.notifications.find({user_id: 'user-uuid', is_read: false})

# Count notifications
db.notifications.countDocuments({is_read: false})
```

### Redis (if using)
```bash
# Connect to Redis
redis-cli

# Check keys
KEYS currency:*

# Get value
GET currency:USD:EUR:2024-01-15

# Clear all keys
FLUSHALL
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check PostgreSQL
pg_isready

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS

# Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# Start MongoDB
sudo systemctl start mongod      # Linux
brew services start mongodb-community # macOS
```

### Reset Database
```bash
# Drop and recreate
dropdb expense_management
createdb expense_management

# Rerun migrations
cat database/postgres/migrations/*.sql | psql -d expense_management
```

### Clear Node Modules
```bash
# Remove all node_modules
find . -name "node_modules" -type d -exec rm -rf {} +

# Reinstall
yarn install:all
```

### View Service Logs
```bash
# Docker
docker-compose logs -f service-name

# Example
docker-compose logs -f auth-service
docker-compose logs -f api-gateway
```

## 📊 Monitoring

### Check Running Services
```bash
# Docker
docker-compose ps

# Manual (check ports)
lsof -i :5000,5001,5002,5003,5004,5005,5006,5007
```

### Database Status
```bash
# PostgreSQL connections
SELECT count(*) FROM pg_stat_activity;

# MongoDB connections
db.serverStatus().connections
```

## 🔧 Development Tips

### Auto-restart on Changes
All services use `nodemon` - they auto-restart when you save files.

### Debug Mode
Add to `.env`:
```
NODE_ENV=development
LOG_LEVEL=debug
```

### VS Code Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Auth Service",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["dev:auth"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 📦 Common Yarn Scripts

```bash
# Install all dependencies
yarn install:all

# Build all services
yarn build:all

# Start specific service in dev mode
yarn dev:gateway
yarn dev:auth
yarn dev:user
# ... etc

# Docker commands
yarn docker:up
yarn docker:down
yarn docker:logs
```

## 🧪 Testing

### Manual API Testing
Use Postman, Insomnia, or Thunder Client (VS Code extension)

### Import Postman Collection
1. Create collection
2. Set environment variable: `BASE_URL = http://localhost:5000`
3. Set authorization: Bearer Token = `{{TOKEN}}`
4. Add requests from API examples above

## 🔐 Environment Variables Checklist

Required in all services:
- ✅ `PORT` - Service port number
- ✅ `NODE_ENV` - development/production
- ✅ `POSTGRES_*` - Database credentials
- ✅ `JWT_SECRET` - Must be same in API Gateway and Auth

Auth Service specific:
- ✅ `GMAIL_USER` - Email for sending
- ✅ `GMAIL_APP_PASSWORD` - Gmail app password
- ✅ `FRONTEND_URL` - For password reset links

Expense Service specific:
- ✅ `CLOUDINARY_*` - File upload credentials

## 📞 Service URLs

| Service | Local | Docker | Purpose |
|---------|-------|--------|---------|
| API Gateway | http://localhost:5000 | http://api-gateway:5000 | Main entry point |
| Auth | http://localhost:5001 | http://auth-service:5001 | Authentication |
| User | http://localhost:5002 | http://user-service:5002 | User management |
| Expense | http://localhost:5003 | http://expense-service:5003 | Expenses |
| Approval | http://localhost:5004 | http://approval-service:5004 | Approvals |
| Currency | http://localhost:5005 | http://currency-service:5005 | Currency |
| OCR | http://localhost:5006 | http://ocr-service:5006 | OCR Processing |
| Notification | http://localhost:5007 | http://notification-service:5007 | Notifications |

## 🎯 Default Credentials

After running signup, you'll have:
- **Email**: admin@example.com
- **Password**: Admin@123
- **Role**: admin
- **Company**: ACME Corp (or your specified name)

## ⚡ Performance Tips

1. **Use Redis** for caching currency rates
2. **Index optimization** - Migrations include proper indexes
3. **Connection pooling** - Already configured in database.ts
4. **Compression** - Enabled in API Gateway
5. **Rate limiting** - Prevents abuse

## 🆘 Getting Help

1. Check [SETUP.md](./SETUP.md) for detailed setup
2. Check [PROJECT_STATUS.md](./PROJECT_STATUS.md) for implementation status
3. Check service logs for errors
4. Verify environment variables
5. Check database connections

---

**Keep this file handy for quick reference! 📌**
