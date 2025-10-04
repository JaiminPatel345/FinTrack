# Expense Management System

A comprehensive microservices-based expense management system with multi-currency support, OCR receipt processing, and configurable approval workflows.

## 🌟 Features

- **Multi-Company Support**: Isolated data per company
- **Role-Based Access Control**: Admin, Manager, Employee roles
- **Multi-Currency**: Automatic currency conversion with real-time rates
- **OCR Processing**: Extract data from receipt images automatically
- **Flexible Approval Workflows**: Sequential, Percentage-based, Specific Approver, and Hybrid rules
- **Email Notifications**: Automated emails for all key events
- **Audit Trail**: Complete history of all changes
- **Cloudinary Integration**: Secure receipt image storage

## 🏗️ Architecture

### Backend Services (Microservices)
- **API Gateway** (Port 5000): Routes requests to appropriate services
- **Auth Service** (Port 5001): Authentication, JWT, password management
- **User Service** (Port 5002): User CRUD, manager relationships
- **Expense Service** (Port 5003): Expense management, categories
- **Approval Service** (Port 5004): Approval workflows and rules
- **Currency Service** (Port 5005): Exchange rates, currency conversion
- **OCR Service** (Port 5006): Python-based receipt text extraction
- **Notification Service** (Port 5007): Email and in-app notifications
- **Queue Service**: Background job processing with pg-boss

### Tech Stack
- **Backend**: Node.js, TypeScript, Express
- **Databases**: PostgreSQL (primary), MongoDB (logs, OCR, notifications)
- **Caching**: Redis
- **Queue**: pg-boss (PostgreSQL-based)
- **OCR**: Python, Flask, Tesseract/EasyOCR
- **Email**: Nodemailer with Gmail
- **File Storage**: Cloudinary
- **Authentication**: JWT with bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 15
- MongoDB >= 7
- Python >= 3.9
- Redis (optional)

### Installation

```bash
# Run setup script
./setup.sh

# Or manually
npm run install:all
```

### Configuration

Copy `.env.example` to `.env` in each service directory and update with your credentials.

### Database Setup

```bash
# PostgreSQL migrations
cat database/postgres/migrations/*.sql | psql -d expense_management

# Seed categories
psql -d expense_management -f database/postgres/seeds/categories.sql

# MongoDB collections
mongosh expense_management database/mongodb/collections/*.js
mongosh expense_management database/mongodb/indexes/*.js
```

### Run Services

#### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

#### Manual Start (Development)
```bash
npm run dev:gateway   # Terminal 1
npm run dev:auth      # Terminal 2
npm run dev:user      # Terminal 3
npm run dev:expense   # Terminal 4
npm run dev:approval  # Terminal 5
npm run dev:currency  # Terminal 6
npm run dev:notification # Terminal 7
npm run dev:queue     # Terminal 8
```

### Verify Installation
```bash
curl http://localhost:5000/health
```

## 📚 Documentation

- **[SETUP.md](./SETUP.md)**: Detailed setup instructions
- **[FLOW.md](./FLOW.md)**: Complete technical specifications
- **[server/README.md](./server/README.md)**: Backend API documentation

## 🎯 API Endpoints

All endpoints are accessible through the API Gateway at `http://localhost:5000/api`

### Authentication
- `POST /auth/signup` - Create admin account
- `POST /auth/signin` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Users
- `GET /users` - List all users (Admin)
- `POST /users` - Create user (Admin)
- `PUT /users/:id` - Update user
- `POST /users/:id/manager` - Assign manager

### Expenses
- `GET /expenses` - List expenses (filtered by role)
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `POST /expenses/:id/submit` - Submit for approval

### Approvals
- `GET /approval-rules` - List approval rules
- `POST /approval-rules` - Create rule (Admin)
- `GET /approvals/pending` - Pending approvals
- `POST /approvals/:id/approve` - Approve expense
- `POST /approvals/:id/reject` - Reject expense

### Currency
- `GET /currency/countries` - List countries with currencies
- `POST /currency/convert` - Convert between currencies

See [server/README.md](./server/README.md) for complete API documentation.

## 📊 Database Schema

### PostgreSQL Tables
- companies, users, manager_relationships
- expense_categories, expenses, expense_line_items  
- approval_rules, approval_steps, expense_approvals, approval_actions
- exchange_rates

### MongoDB Collections
- audit_logs - Complete audit trail
- ocr_results - Receipt OCR processing results
- notifications - User notifications

## 🔐 Environment Variables

Key variables required:

```env
# Authentication
JWT_SECRET=your_strong_secret_key

# Databases
POSTGRES_HOST=localhost
POSTGRES_DB=expense_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
MONGODB_URI=mongodb://localhost:27017/expense_management

# Email
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific service
cd server/auth-service && npm test
```

## 🛠️ Development

### Code Structure
```
hackathon/
├── server/
│   ├── shared/          # Shared types, utils, middleware
│   ├── api-gateway/     # API Gateway service
│   ├── auth-service/    # Authentication service
│   ├── user-service/    # User management
│   ├── expense-service/ # Expense management
│   ├── approval-service/# Approval workflows
│   ├── currency-service/# Currency conversion
│   ├── ocr-service/     # OCR processing (Python)
│   ├── notification-service/ # Notifications
│   └── queue-service/   # Background jobs
├── database/
│   ├── postgres/        # SQL migrations & seeds
│   └── mongodb/         # MongoDB collections & indexes
├── client/              # Frontend (React - to be added)
└── docs/               # Additional documentation
```

### Adding a New Service

1. Create service directory in `server/`
2. Copy `package.json` and `tsconfig.json` from existing service
3. Create `src/` with `app.ts` and `server.ts`
4. Add service to `docker-compose.yml`
5. Add proxy route in API Gateway
6. Update root `package.json` workspaces

## 📦 Deployment

### Docker Deployment
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Checklist
- [ ] Set strong JWT_SECRET
- [ ] Configure production database credentials
- [ ] Enable SSL/TLS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Check [SETUP.md](./SETUP.md) for setup help
- Review [FLOW.md](./FLOW.md) for technical details

## 🎯 Roadmap

- [x] Core microservices architecture
- [x] Authentication and authorization
- [x] Expense management with OCR
- [x] Multi-currency support
- [x] Approval workflows
- [ ] Frontend application (React)
- [ ] WebSocket for real-time updates
- [ ] Advanced reporting and analytics
- [ ] Mobile app
- [ ] Integration with accounting software

---

**Built with ❤️ for efficient expense management**
4 oct hackathon ; name will change
