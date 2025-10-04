# Setup Guide - Expense Management System Backend

This guide will help you set up and run the expense management system backend on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Yarn** >= 1.22.0 ([Install](https://classic.yarnpkg.com/en/docs/install))
- **PostgreSQL** >= 15 ([Download](https://www.postgresql.org/download/))
- **MongoDB** >= 7 ([Download](https://www.mongodb.com/try/download/community))
- **Redis** >= 7 (Optional, for caching) ([Download](https://redis.io/download))
- **Python** >= 3.9 (for OCR service) ([Download](https://www.python.org/downloads/))
- **Git** ([Download](https://git-scm.com/downloads))

## Quick Start

### 1. Clone and Navigate to Project

```bash
cd hackathon
```

### 2. Run Setup Script

```bash
./setup.sh
```

This script will:
- Check prerequisites
- Install all dependencies
- Create .env files from templates

### 3. Configure Environment Variables

Update the `.env` file in each service directory with your credentials:

#### Required Configuration

**Auth Service** (`server/auth-service/.env`):
```env
PORT=5001
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=expense_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

JWT_SECRET=your_strong_random_secret_key_here
JWT_EXPIRY=24h

GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

FRONTEND_URL=http://localhost:3000
```

**API Gateway** (`server/api-gateway/.env`):
```env
PORT=5000
JWT_SECRET=same_as_auth_service
CORS_ORIGIN=http://localhost:3000
```

### 4. Set Up Databases

#### PostgreSQL

```bash
# Create database
createdb expense_management

# Run migrations in order
cd database/postgres/migrations

psql -d expense_management -f 001_create_companies.sql
psql -d expense_management -f 002_create_users.sql
psql -d expense_management -f 003_create_manager_relationships.sql
psql -d expense_management -f 004_create_expense_categories.sql
psql -d expense_management -f 005_create_expenses.sql
psql -d expense_management -f 006_create_expense_line_items.sql
psql -d expense_management -f 007_create_approval_rules.sql
psql -d expense_management -f 008_create_approval_steps.sql
psql -d expense_management -f 009_create_expense_approvals.sql
psql -d expense_management -f 010_create_approval_actions.sql
psql -d expense_management -f 011_create_exchange_rates.sql

# Seed default categories
cd ../seeds
psql -d expense_management -f categories.sql
```

Or run all at once:
```bash
cat database/postgres/migrations/*.sql | psql -d expense_management
psql -d expense_management -f database/postgres/seeds/categories.sql
```

#### MongoDB

```bash
# Create collections and indexes
mongosh expense_management database/mongodb/collections/audit_logs.js
mongosh expense_management database/mongodb/collections/ocr_results.js
mongosh expense_management database/mongodb/collections/notifications.js

mongosh expense_management database/mongodb/indexes/audit_logs.indexes.js
mongosh expense_management database/mongodb/indexes/ocr_results.indexes.js
mongosh expense_management database/mongodb/indexes/notifications.js
```

### 5. Start Services

#### Option A: Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option B: Manual Start (Development)

Open 8 separate terminal windows/tabs:

```bash
# Terminal 1 - API Gateway
yarn dev:gateway

# Terminal 2 - Auth Service  
yarn dev:auth

# Terminal 3 - User Service
yarn dev:user

# Terminal 4 - Expense Service
yarn dev:expense

# Terminal 5 - Approval Service
yarn dev:approval

# Terminal 6 - Currency Service
yarn dev:currency

# Terminal 7 - Notification Service
yarn dev:notification

# Terminal 8 - Queue Service
yarn dev:queue
```

### 6. Verify Installation

Check if all services are running:

```bash
# API Gateway
curl http://localhost:5000/health

# Auth Service
curl http://localhost:5001/health

# User Service
curl http://localhost:5002/health

# Expense Service
curl http://localhost:5003/health

# Approval Service
curl http://localhost:5004/health

# Currency Service
curl http://localhost:5005/health

# Notification Service
curl http://localhost:5007/health
```

All should return:
```json
{
  "success": true,
  "message": "Service is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Service Ports

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 5000 | Main entry point for all APIs |
| Auth Service | 5001 | Authentication and authorization |
| User Service | 5002 | User management |
| Expense Service | 5003 | Expense CRUD operations |
| Approval Service | 5004 | Approval workflows |
| Currency Service | 5005 | Currency conversion |
| OCR Service | 5006 | Receipt OCR processing |
| Notification Service | 5007 | Email and in-app notifications |

## Testing the API

### 1. Sign Up (Create Admin Account)

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "Admin@123",
    "country": "United States",
    "currency": "USD",
    "companyName": "My Company"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "companyId": "uuid",
      "companyName": "My Company",
      "currency": "USD"
    }
  }
}
```

### 2. Sign In

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

### 3. Create an Expense (with Bearer Token)

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "categoryId": "category-uuid",
    "description": "Business lunch",
    "amount": 50.00,
    "currency": "USD",
    "expenseDate": "2024-01-15",
    "paidBy": "credit_card",
    "gstPercentage": 18
  }'
```

## Gmail App Password Setup

To enable email sending:

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Add it to your `.env` file as `GMAIL_APP_PASSWORD`

## Cloudinary Setup

For file uploads:

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from Dashboard
3. Add to `.env` files:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Troubleshooting

### PostgreSQL Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL
# macOS (with Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
# Use Services app to start PostgreSQL service
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Start MongoDB
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Use Services app to start MongoDB service
```

### Port Already in Use

```bash
# Find process using port 5000 (or any other)
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### JWT Token Errors

Ensure `JWT_SECRET` is the same in:
- API Gateway `.env`
- Auth Service `.env`

### Database Permission Errors

```bash
# Grant all privileges to user
psql -d expense_management -c "GRANT ALL PRIVILEGES ON DATABASE expense_management TO postgres;"
psql -d expense_management -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;"
psql -d expense_management -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;"
```

## Development Tips

### Watching Logs

```bash
# Docker Compose
docker-compose logs -f service-name

# Manual (use PM2 or similar)
yarn global add pm2
pm2 start yarn --name "api-gateway" -- dev:gateway
pm2 logs api-gateway
```

### Database GUI Tools

- **PostgreSQL**: [pgAdmin](https://www.pgadmin.org/), [DBeaver](https://dbeaver.io/)
- **MongoDB**: [MongoDB Compass](https://www.mongodb.com/products/compass)

### API Testing Tools

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

### Hot Reload

All services use `nodemon` for auto-restart on file changes during development.

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Need Help?

- Check the [README.md](./README.md) for architecture overview
- Review [FLOW.md](./FLOW.md) for detailed specifications
- Create an issue on GitHub
- Contact the development team

## Next Steps

Once your backend is running:

1. ✅ Test all API endpoints
2. ✅ Set up the frontend (client/)
3. ✅ Configure Cloudinary for file uploads
4. ✅ Set up email templates
5. ✅ Configure approval workflows
6. ✅ Test OCR functionality
7. ✅ Deploy to production

---

**Happy coding! 🚀**
