# Expense Management System# Expense Management System



A comprehensive microservices-based expense management system with multi-currency support, OCR receipt processing, and configurable approval workflows.A comprehensive microservices-based expense management system with multi-currency support, OCR receipt processing, and configurable approval workflows.



[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)## 🌟 Features

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)- **Multi-Company Support**: Isolated data per company

- **Role-Based Access Control**: Admin, Manager, Employee roles

## 🌟 Key Features- **Multi-Currency**: Automatic currency conversion with real-time rates

- **OCR Processing**: Extract data from receipt images automatically

- 🏢 **Multi-Company Support** - Isolated data per company- **Flexible Approval Workflows**: Sequential, Percentage-based, Specific Approver, and Hybrid rules

- 🔐 **Role-Based Access Control** - Admin, Manager, Employee roles  - **Email Notifications**: Automated emails for all key events

- 💱 **Multi-Currency** - Automatic conversion with real-time rates- **Audit Trail**: Complete history of all changes

- 📸 **OCR Receipt Processing** - Extract data from images automatically- **Cloudinary Integration**: Secure receipt image storage

- ✅ **Flexible Approval Workflows** - Sequential, percentage, hybrid rules

- 📧 **Email Notifications** - Automated notifications for all events## 🏗️ Architecture

- 📋 **Complete Audit Trail** - Track all changes

- ☁️ **Cloud Storage** - Secure receipt storage with Cloudinary### Backend Services (Microservices)

- **API Gateway** (Port 5000): Routes requests to appropriate services

## 🏗️ Architecture- **Auth Service** (Port 5001): Authentication, JWT, password management

- **User Service** (Port 5002): User CRUD, manager relationships

**Microservices Backend** with 8 independent services:- **Expense Service** (Port 5003): Expense management, categories

- API Gateway, Auth, User, Expense, Approval, Currency, OCR (Python), Notification, Queue- **Approval Service** (Port 5004): Approval workflows and rules

- **Currency Service** (Port 5005): Exchange rates, currency conversion

**Tech Stack**: Node.js, TypeScript, Express, PostgreSQL, MongoDB, Redis, Python- **OCR Service** (Port 5006): Python-based receipt text extraction

- **Notification Service** (Port 5007): Email and in-app notifications

## 🚀 Quick Start- **Queue Service**: Background job processing with pg-boss



### Prerequisites### Tech Stack

```bash- **Backend**: Node.js, TypeScript, Express

# Required- **Databases**: PostgreSQL (primary), MongoDB (logs, OCR, notifications)

- Node.js >= 18.0.0- **Caching**: Redis

- Yarn >= 1.22.0- **Queue**: pg-boss (PostgreSQL-based)

- PostgreSQL >= 15- **OCR**: Python, Flask, Tesseract/EasyOCR

- MongoDB >= 7- **Email**: Nodemailer with Gmail

- Python >= 3.9 (for OCR)- **File Storage**: Cloudinary

```- **Authentication**: JWT with bcrypt



### Installation## 🚀 Quick Start



1. **Clone the repository**### Prerequisites

   ```bash- Node.js >= 18.0.0

   git clone https://github.com/JaiminPatel345/hackathon.git- PostgreSQL >= 15

   cd hackathon- MongoDB >= 7

   ```- Python >= 3.9

- Redis (optional)

2. **Run automated setup**

   ```bash### Installation

   chmod +x scripts/setup.sh

   ./scripts/setup.sh```bash

   ```# Run setup script

./setup.sh

3. **Configure environment variables**

   ```bash# Or manually

   # Update .env files in each service directoryyarn install:all

   # See docs/SETUP.md for details```

   ```

### Configuration

4. **Start services**

   ```bashCopy `.env.example` to `.env` in each service directory and update with your credentials.

   # Using Docker

   yarn docker:up### Database Setup

   

   # Or individually```bash

   yarn dev:gateway# PostgreSQL migrations

   yarn dev:authcat database/postgres/migrations/*.sql | psql -d expense_management

   # ... other services

   ```# Seed categories

psql -d expense_management -f database/postgres/seeds/categories.sql

5. **Test the API**

   ```bash# MongoDB collections

   curl http://localhost:5000/healthmongosh expense_management database/mongodb/collections/*.js

   ```mongosh expense_management database/mongodb/indexes/*.js

```

## 📚 Documentation

### Run Services

Comprehensive documentation is available in the [`docs/`](./docs) folder:

#### Using Docker Compose (Recommended)

| Document | Description |```bash

|----------|-------------|docker-compose up -d

| 📖 [Full Documentation](./docs/FULL_DOCUMENTATION.md) | Complete system overview and architecture |```

| ⚙️ [Setup Guide](./docs/SETUP.md) | Detailed installation and configuration |

| ⚡ [Quick Reference](./docs/QUICK_REFERENCE.md) | Common commands and API examples |#### Manual Start (Development)

| 📊 [Project Status](./docs/PROJECT_STATUS.md) | Implementation status and roadmap |```bash

| 📦 [Yarn Migration](./docs/YARN_MIGRATION.md) | Package manager migration guide |yarn dev:gateway   # Terminal 1

| 🔧 [Backend API Docs](./server/README.md) | Service-specific API documentation |yarn dev:auth      # Terminal 2

yarn dev:user      # Terminal 3

## 🛠️ Available Scriptsyarn dev:expense   # Terminal 4

yarn dev:approval  # Terminal 5

Scripts are located in the [`scripts/`](./scripts) folder:yarn dev:currency  # Terminal 6

yarn dev:notification # Terminal 7

```bashyarn dev:queue     # Terminal 8

# Setup```

./scripts/setup.sh              # Automated project setup

### Verify Installation

# Development```bash

yarn install:all                # Install all dependenciescurl http://localhost:5000/health

yarn dev:gateway               # Start API Gateway```

yarn dev:auth                  # Start Auth Service

# ... (see docs/QUICK_REFERENCE.md for all)## 📚 Documentation



# Type Checking- **[SETUP.md](./SETUP.md)**: Detailed setup instructions

yarn check:build               # Check TypeScript compilation- **[FLOW.md](./FLOW.md)**: Complete technical specifications

./scripts/check-build.sh       # Alternative type check- **[server/README.md](./server/README.md)**: Backend API documentation

./scripts/check-typescript.sh  # Runtime type check

## 🎯 API Endpoints

# Docker

yarn docker:up                 # Start all servicesAll endpoints are accessible through the API Gateway at `http://localhost:5000/api`

yarn docker:down               # Stop all services

yarn docker:logs               # View logs### Authentication

- `POST /auth/signup` - Create admin account

# Database- `POST /auth/signin` - User login

yarn db:migrate                # Run PostgreSQL migrations- `POST /auth/forgot-password` - Request password reset

yarn db:seed                   # Seed initial data- `POST /auth/reset-password` - Reset password

yarn mongo:setup               # Setup MongoDB collections

```### Users

- `GET /users` - List all users (Admin)

## 📁 Project Structure- `POST /users` - Create user (Admin)

- `PUT /users/:id` - Update user

```- `POST /users/:id/manager` - Assign manager

hackathon/

├── client/                    # Frontend (to be implemented)### Expenses

├── server/                    # Backend microservices- `GET /expenses` - List expenses (filtered by role)

│   ├── shared/               # Shared types, utils, middleware- `POST /expenses` - Create expense

│   ├── api-gateway/          # API Gateway (Port 5000)- `PUT /expenses/:id` - Update expense

│   ├── auth-service/         # Authentication (Port 5001)- `POST /expenses/:id/submit` - Submit for approval

│   ├── user-service/         # User Management (Port 5002)

│   ├── expense-service/      # Expense Management (Port 5003)### Approvals

│   ├── approval-service/     # Approval Workflows (Port 5004)- `GET /approval-rules` - List approval rules

│   ├── currency-service/     # Currency Exchange (Port 5005)- `POST /approval-rules` - Create rule (Admin)

│   ├── ocr-service/          # OCR Processing (Port 5006)- `GET /approvals/pending` - Pending approvals

│   ├── notification-service/ # Notifications (Port 5007)- `POST /approvals/:id/approve` - Approve expense

│   └── queue-service/        # Background Jobs- `POST /approvals/:id/reject` - Reject expense

├── database/                  # Database schemas and migrations

│   ├── postgres/             # PostgreSQL migrations & seeds### Currency

│   └── mongodb/              # MongoDB collections & indexes- `GET /currency/countries` - List countries with currencies

├── scripts/                   # Utility scripts- `POST /currency/convert` - Convert between currencies

│   ├── setup.sh              # Automated setup

│   ├── check-build.sh        # Type checkingSee [server/README.md](./server/README.md) for complete API documentation.

│   └── check-typescript.sh   # Runtime check

├── docs/                      # Documentation## 📊 Database Schema

│   ├── FULL_DOCUMENTATION.md # Complete docs

│   ├── SETUP.md              # Setup guide### PostgreSQL Tables

│   ├── QUICK_REFERENCE.md    # Quick reference- companies, users, manager_relationships

│   └── PROJECT_STATUS.md     # Status tracking- expense_categories, expenses, expense_line_items  

├── docker-compose.yml         # Docker orchestration- approval_rules, approval_steps, expense_approvals, approval_actions

└── package.json              # Workspace configuration- exchange_rates

```

### MongoDB Collections

## 🔌 API Endpoints- audit_logs - Complete audit trail

- ocr_results - Receipt OCR processing results

All requests go through the API Gateway at `http://localhost:5000`- notifications - User notifications



### Authentication## 🔐 Environment Variables

```bash

POST /api/auth/signup          # Create new company & admin userKey variables required:

POST /api/auth/signin          # Login with credentials

POST /api/auth/forgot-password # Request password reset```env

POST /api/auth/reset-password  # Reset password with token# Authentication

```JWT_SECRET=your_strong_secret_key



### Users# Databases

```bashPOSTGRES_HOST=localhost

GET    /api/users              # List all users (admin/manager)POSTGRES_DB=expense_management

POST   /api/users              # Create new userPOSTGRES_USER=postgres

GET    /api/users/:id          # Get user detailsPOSTGRES_PASSWORD=your_password

PUT    /api/users/:id          # Update userMONGODB_URI=mongodb://localhost:27017/expense_management

DELETE /api/users/:id          # Delete user

```# Email

GMAIL_USER=your_email@gmail.com

### ExpensesGMAIL_APP_PASSWORD=your_app_password

```bash

GET    /api/expenses           # List expenses# File Storage

POST   /api/expenses           # Create expenseCLOUDINARY_CLOUD_NAME=your_cloud_name

GET    /api/expenses/:id       # Get expense detailsCLOUDINARY_API_KEY=your_api_key

PUT    /api/expenses/:id       # Update expenseCLOUDINARY_API_SECRET=your_api_secret

DELETE /api/expenses/:id       # Delete expense

POST   /api/expenses/:id/submit # Submit for approval# Frontend

```FRONTEND_URL=http://localhost:3000

```

See [docs/FULL_DOCUMENTATION.md](./docs/FULL_DOCUMENTATION.md) for complete API reference.

## 🧪 Testing

## 🧪 Testing

```bash

```bash# Run tests

# Run tests for all servicesyarn test

yarn test

# Test specific service

# Run tests for a specific servicecd server/auth-service && yarn test

cd server/auth-service && yarn test```

```

## 🛠️ Development

## 🤝 Contributing

### Code Structure

1. Fork the repository```

2. Create your feature branch (`git checkout -b feature/amazing-feature`)hackathon/

3. Commit your changes (`git commit -m 'Add some amazing feature'`)├── server/

4. Push to the branch (`git push origin feature/amazing-feature`)│   ├── shared/          # Shared types, utils, middleware

5. Open a Pull Request│   ├── api-gateway/     # API Gateway service

│   ├── auth-service/    # Authentication service

## 📝 License│   ├── user-service/    # User management

│   ├── expense-service/ # Expense management

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.│   ├── approval-service/# Approval workflows

│   ├── currency-service/# Currency conversion

## 👨‍💻 Author│   ├── ocr-service/     # OCR processing (Python)

│   ├── notification-service/ # Notifications

**Jaimin Patel**│   └── queue-service/   # Background jobs

- GitHub: [@JaiminPatel345](https://github.com/JaiminPatel345)├── database/

│   ├── postgres/        # SQL migrations & seeds

## 🙏 Acknowledgments│   └── mongodb/         # MongoDB collections & indexes

├── client/              # Frontend (React - to be added)

- Built with modern microservices architecture└── docs/               # Additional documentation

- Uses industry-standard tools and best practices```

- Designed for scalability and maintainability

### Adding a New Service

---

1. Create service directory in `server/`

**Need Help?** Check the [Setup Guide](./docs/SETUP.md) or [Quick Reference](./docs/QUICK_REFERENCE.md)2. Copy `package.json` and `tsconfig.json` from existing service

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
