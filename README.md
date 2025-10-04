# Do not copy my code :/ 
### We will update name later so google can't find our repo :)

A comprehensive microservices-based expense management system with multi-currency support, OCR receipt processing, and configurable approval workflows.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

## 🌟 Key Features

- 🏢 **Multi-Company Support** - Isolated data per company
- 🔐 **Role-Based Access Control** - Admin, Manager, Employee roles
- 💱 **Multi-Currency** - Automatic conversion with real-time rates
- 📸 **OCR Receipt Processing** - Extract data from images automatically
- ✅ **Flexible Approval Workflows** - Sequential, percentage, hybrid rules
- 📧 **Email Notifications** - Automated notifications for all events
- 📋 **Complete Audit Trail** - Track all changes
- ☁️ **Cloud Storage** - Secure receipt storage with Cloudinary

## 🏗️ Architecture

**Microservices Backend** with 8 independent services:
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
- **Databases**: PostgreSQL, MongoDB
- **Caching**: Redis
- **Queue**: pg-boss (PostgreSQL-based)
- **OCR**: Python, Flask, Tesseract/EasyOCR
- **Email**: Nodemailer with Gmail
- **File Storage**: Cloudinary
- **Authentication**: JWT with bcrypt

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0
- PostgreSQL >= 15
- MongoDB >= 7
- Python >= 3.9 (for OCR)
- Redis (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JaiminPatel345/hackathon.git
   cd hackathon
   ```

2. **Run automated setup**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   
   # Or manually
   yarn install:all
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` in each service directory and update with your credentials.

4. **Database Setup**
   ```bash
   # PostgreSQL migrations
   cat database/postgres/migrations/*.sql | psql -d expense_management
   
   # Seed categories
   psql -d expense_management -f database/postgres/seeds/categories.sql
   
   # MongoDB collections
   mongosh expense_management database/mongodb/collections/*.js
   mongosh expense_management database/mongodb/indexes/*.js
   ```

5. **Run Services**

   #### Using Docker Compose (Recommended)
   ```bash
   docker-compose up -d
   ```

   #### Manual Start (Development)
   ```bash
   yarn dev:gateway   # Terminal 1
   yarn dev:auth      # Terminal 2
   yarn dev:user      # Terminal 3
   yarn dev:expense   # Terminal 4
   yarn dev:approval  # Terminal 5
   yarn dev:currency  # Terminal 6
   yarn dev:notification # Terminal 7
   yarn dev:queue     # Terminal 8
   ```

6. **Verify Installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

| Document | Description |
|----------|-------------|
| 📖 [Full Documentation](./docs/FULL_DOCUMENTATION.md) | Complete system overview and architecture |
| ⚙️ [Setup Guide](./docs/SETUP.md) | Detailed installation and configuration |
| ⚡ [Quick Reference](./docs/QUICK_REFERENCE.md) | Common commands and API examples |
| � [Project Status](./docs/PROJECT_STATUS.md) | Implementation status and roadmap |
| �📦 [Yarn Migration](./docs/YARN_MIGRATION.md) | Package manager migration guide |
| 🔧 [Backend API Docs](./server/README.md) | Service-specific API documentation |

Additional documentation:
- **[SETUP.md](./SETUP.md)**: Detailed setup instructions
- **[FLOW.md](./FLOW.md)**: Complete technical specifications

## 🛠️ Available Scripts

Scripts are located in the [`scripts/`](./scripts) folder:

```bash
# Setup
./scripts/setup.sh              # Automated project setup

# Development
yarn install:all                # Install all dependencies
yarn dev:gateway               # Start API Gateway
yarn dev:auth                  # Start Auth Service
# ... (see docs/QUICK_REFERENCE.md for all)

# Type Checking
yarn check:build               # Check TypeScript compilation
./scripts/check-build.sh       # Alternative type check
./scripts/check-typescript.sh  # Runtime type check

# Docker
yarn docker:up                 # Start all services
yarn docker:down               # Stop all services
yarn docker:logs               # View logs

# Database
yarn db:migrate                # Run PostgreSQL migrations
yarn db:seed                   # Seed initial data
yarn mongo:setup               # Setup MongoDB collections
```

## 📁 Project Structure

```
hackathon/
├── client/                    # Frontend (to be implemented)
├── server/                    # Backend microservices
│   ├── shared/               # Shared types, utils, middleware
│   ├── api-gateway/          # API Gateway (Port 5000)
│   ├── auth-service/         # Authentication (Port 5001)
│   ├── user-service/         # User Management (Port 5002)
│   ├── expense-service/      # Expense Management (Port 5003)
│   ├── approval-service/     # Approval Workflows (Port 5004)
│   ├── currency-service/     # Currency Exchange (Port 5005)
│   ├── ocr-service/          # OCR Processing (Port 5006)

│   ├── notification-service/ # Notifications (Port 5007)- `POST /approvals/:id/approve` - Approve expense

│   └── queue-service/        # Background Jobs- `POST /approvals/:id/reject` - Reject expense

│   ├── currency-service/     # Currency Exchange (Port 5005)
│   ├── ocr-service/          # OCR Processing (Port 5006)
│   ├── notification-service/ # Notifications (Port 5007)
│   └── queue-service/        # Background Jobs
├── database/                  # Database schemas and migrations
│   ├── postgres/             # PostgreSQL migrations & seeds
│   └── mongodb/              # MongoDB collections & indexes
├── scripts/                   # Utility scripts
│   ├── setup.sh              # Automated setup
│   ├── check-build.sh        # Type checking
│   └── check-typescript.sh   # Runtime check
├── docs/                      # Documentation
│   ├── FULL_DOCUMENTATION.md # Complete docs
│   ├── SETUP.md              # Setup guide
│   ├── QUICK_REFERENCE.md    # Quick reference
│   └── PROJECT_STATUS.md     # Status tracking
├── docker-compose.yml         # Docker orchestration
└── package.json              # Workspace configuration
```

## 🎯 API Endpoints

All requests go through the API Gateway at `http://localhost:5000/api`

### Authentication

- `POST /auth/signup` - Create new company & admin user
- `POST /auth/signin` - Login with credentials
- `POST /auth/change-password` - Change password
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Users

- `GET /users` - List all users (admin/manager)
- `POST /users` - Create new user
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
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

GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=http://localhost:3000
```

## � Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```


## 🤝 Contributing (After hackathon)

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
- [ ] Expense management with OCR
- [x] Multi-currency support
- [x] Approval workflows
- [x] Frontend application (React)
- [ ] WebSocket for real-time updates
- [ ] Advanced reporting and analytics

---

**Built with ❤️ for efficient expense management**
4 oct hackathon ; name will change
