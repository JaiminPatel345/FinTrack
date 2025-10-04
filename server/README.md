# Expense Management System - Backend

A comprehensive microservices-based expense management system built with Node.js, TypeScript, PostgreSQL, MongoDB, and Python.

## 🏗️ Architecture

### Tech Stack
- **API Gateway**: Node.js + Express + Proxy Middleware
- **Auth Service**: Node.js + JWT + bcrypt
- **User Service**: Node.js + PostgreSQL
- **Expense Service**: Node.js + PostgreSQL + Cloudinary
- **Approval Service**: Node.js + PostgreSQL (Sequential/Percentage/Hybrid workflows)
- **Currency Service**: Node.js + PostgreSQL + Redis + External API
- **OCR Service**: Python + Flask + Tesseract/EasyOCR + MongoDB
- **Notification Service**: Node.js + Nodemailer + MongoDB
- **Queue Service**: pg-boss (PostgreSQL-based queue)

### Databases
- **PostgreSQL**: Primary relational database for users, expenses, approvals, etc.
- **MongoDB**: Document store for audit logs, OCR results, and notifications
- **Redis**: Caching layer for currency rates and frequently accessed data

## 📁 Project Structure

```
server/
├── shared/                      # Shared types, utilities, middleware
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Common utilities (logger, errors, validators)
│   ├── middleware/              # Shared middleware (auth, validation, error handling)
│   └── database/                # Database connection configs
├── api-gateway/                 # API Gateway service (Port 5000)
├── auth-service/                # Authentication service (Port 5001)
├── user-service/                # User management service (Port 5002)
├── expense-service/             # Expense management service (Port 5003)
├── approval-service/            # Approval workflow service (Port 5004)
├── currency-service/            # Currency conversion service (Port 5005)
├── ocr-service/                 # OCR processing service (Port 5006)
├── notification-service/        # Notification service (Port 5007)
└── queue-service/               # Message queue workers

database/
├── postgres/
│   ├── migrations/              # SQL migration scripts
│   └── seeds/                   # Seed data
└── mongodb/
    ├── collections/             # MongoDB collection schemas
    └── indexes/                 # MongoDB indexes
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 15
- MongoDB >= 7
- Redis >= 7
- Python >= 3.9 (for OCR service)

### Installation

1. **Clone the repository**
   ```bash
   cd hackathon
   ```

2. **Install dependencies**
   ```bash
   yarn install:all
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` in each service directory and update with your values.

4. **Start databases**
   ```bash
   # Using Docker Compose
   docker-compose up -d postgres mongodb redis

   # Or install locally
   ```

5. **Run database migrations**
   ```bash
   # PostgreSQL migrations
   psql -h localhost -U postgres -d expense_management -f database/postgres/migrations/001_create_companies.sql
   psql -h localhost -U postgres -d expense_management -f database/postgres/migrations/002_create_users.sql
   # ... run all migration files in order

   # MongoDB collections and indexes
   mongosh expense_management database/mongodb/collections/audit_logs.js
   mongosh expense_management database/mongodb/collections/ocr_results.js
   mongosh expense_management database/mongodb/collections/notifications.js
   mongosh expense_management database/mongodb/indexes/audit_logs.indexes.js
   mongosh expense_management database/mongodb/indexes/ocr_results.indexes.js
   mongosh expense_management database/mongodb/indexes/notifications.indexes.js
   ```

6. **Seed default categories**
   ```bash
   psql -h localhost -U postgres -d expense_management -f database/postgres/seeds/categories.sql
   ```

### Running Services

#### Development Mode (Individual Services)
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

#### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Create admin account
- `POST /signin` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /verify-token` - Verify JWT token

### Users (`/api/users`)
- `GET /` - Get all users (Admin)
- `GET /:id` - Get user by ID
- `POST /` - Create user (Admin)
- `PUT /:id` - Update user
- `DELETE /:id` - Deactivate user
- `GET /:id/manager` - Get user's manager
- `POST /:id/manager` - Assign manager

### Expenses (`/api/expenses`)
- `GET /` - Get all expenses (filtered by role)
- `GET /:id` - Get expense by ID
- `POST /` - Create expense
- `PUT /:id` - Update expense
- `DELETE /:id` - Delete expense (draft only)
- `POST /:id/submit` - Submit for approval
- `GET /:id/history` - Get approval history

### Categories (`/api/categories`)
- `GET /` - Get all categories
- `POST /` - Create category (Admin)

### Approvals (`/api/approvals`)
- `GET /pending` - Get pending approvals
- `POST /:id/approve` - Approve expense
- `POST /:id/reject` - Reject expense
- `GET /:expenseId` - Get approval details

### Approval Rules (`/api/approval-rules`)
- `GET /` - Get all rules
- `GET /:id` - Get rule by ID
- `POST /` - Create rule (Admin)
- `PUT /:id` - Update rule
- `DELETE /:id` - Delete rule

### Currency (`/api/currency`)
- `GET /countries` - Get countries with currencies
- `GET /rates` - Get exchange rates
- `POST /convert` - Convert amount between currencies

### OCR (`/api/ocr`)
- `POST /process` - Process receipt image
- `GET /result/:expenseId` - Get OCR result

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `GET /unread` - Get unread count
- `PATCH /:id/read` - Mark as read
- `DELETE /:id` - Delete notification

## 🔐 Environment Variables

Each service requires specific environment variables. See `.env.example` in each service directory.

### Key Environment Variables
- `JWT_SECRET` - Secret key for JWT tokens
- `POSTGRES_*` - PostgreSQL connection details
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection URL
- `CLOUDINARY_*` - Cloudinary credentials for file uploads
- `GMAIL_*` - Gmail SMTP credentials for email sending
- `FRONTEND_URL` - Frontend application URL

## 📊 Database Schema

### PostgreSQL Tables
1. `companies` - Company information
2. `users` - User accounts
3. `manager_relationships` - Manager-employee relationships
4. `expense_categories` - Expense categories
5. `expenses` - Expense records
6. `expense_line_items` - Itemized expense details
7. `approval_rules` - Approval workflow rules
8. `approval_steps` - Approval steps configuration
9. `expense_approvals` - Expense approval instances
10. `approval_actions` - Individual approval actions
11. `exchange_rates` - Currency exchange rates

### MongoDB Collections
1. `audit_logs` - Audit trail for all actions
2. `ocr_results` - OCR processing results
3. `notifications` - User notifications

## 🧪 Testing

```bash
# Unit tests
yarn test

# Integration tests
yarn test:integration

# E2E tests
yarn test:e2e
```

## 📝 Key Features

### ✅ Implemented Features
- Multi-company support with isolated data
- Role-based access control (Admin, Manager, Employee)
- JWT-based authentication
- Password reset via email
- User management with manager relationships
- Multi-currency expense support
- Automatic currency conversion
- Receipt upload to Cloudinary
- OCR text extraction from receipts
- Configurable approval workflows:
  - Sequential approval
  - Percentage-based approval
  - Specific approver auto-approve
  - Hybrid workflows
- Email notifications
- In-app notifications
- Audit logging
- Database connection pooling
- Error handling and validation

### 🔄 Approval Workflow Types

1. **Sequential**: Expenses go through approvers in order
2. **Percentage**: Approval when X% of approvers approve
3. **Specific Approver**: Auto-approve when specific user (e.g., CFO) approves
4. **Hybrid**: Combination of percentage OR specific approver

## 🛠️ Development

### Code Style
- TypeScript with strict mode
- ESLint for linting
- Prettier for formatting
- Consistent naming conventions

### Best Practices
- Use environment variables for configuration
- Implement proper error handling
- Log all important actions
- Validate all inputs
- Use transactions for multi-step operations
- Index database columns properly
- Cache frequently accessed data

## 📦 Deployment

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Configure production database credentials
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Review and update environment variables
- [ ] Build optimized Docker images
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

- [ ] WebSocket support for real-time updates
- [ ] Advanced reporting and analytics
- [ ] Budget tracking
- [ ] Mobile app integration
- [ ] Multi-language support
- [ ] Advanced audit trail with timeline view
- [ ] Integration with accounting software
