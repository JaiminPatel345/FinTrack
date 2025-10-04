#!/bin/bash

# Expense Management System - Setup Script
echo "🚀 Setting up Expense Management System Backend..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
    exit 1
fi

# Check yarn
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn -v)
    print_success "yarn found: $YARN_VERSION"
else
    print_error "yarn is not installed. Please install yarn: npm install -g yarn"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    POSTGRES_VERSION=$(psql --version)
    print_success "PostgreSQL found: $POSTGRES_VERSION"
else
    print_warning "PostgreSQL not found in PATH. Please ensure PostgreSQL is installed"
fi

# Check MongoDB
if command -v mongosh &> /dev/null; then
    print_success "MongoDB Shell found"
else
    print_warning "MongoDB Shell (mongosh) not found. Please ensure MongoDB is installed"
fi

# Check Python (for OCR service)
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python found: $PYTHON_VERSION"
else
    print_warning "Python3 not found. OCR service requires Python >= 3.9"
fi

echo ""
echo "📦 Installing dependencies..."

# Install root dependencies
print_success "Installing root dependencies..."
yarn install

# Install service dependencies
echo ""
echo "Installing service dependencies..."

services=("api-gateway" "auth-service" "user-service" "expense-service" "approval-service" "currency-service" "notification-service" "queue-service")

for service in "${services[@]}"; do
    if [ -d "server/$service" ]; then
        echo "  Installing $service dependencies..."
        cd "server/$service"
        yarn install
        cd ../..
        print_success "$service dependencies installed"
    fi
done

echo ""
echo "📝 Setting up environment files..."

# Copy .env.example to .env for each service
for service in "${services[@]}"; do
    if [ -f "server/$service/.env.example" ] && [ ! -f "server/$service/.env" ]; then
        cp "server/$service/.env.example" "server/$service/.env"
        print_success "Created .env file for $service"
    fi
done

echo ""
echo "🗄️  Database Setup Instructions:"
echo ""
echo "1. Start PostgreSQL and create database:"
echo "   createdb expense_management"
echo ""
echo "2. Run migrations in order:"
echo "   cd database/postgres/migrations"
echo "   psql -d expense_management -f 001_create_companies.sql"
echo "   psql -d expense_management -f 002_create_users.sql"
echo "   psql -d expense_management -f 003_create_manager_relationships.sql"
echo "   psql -d expense_management -f 004_create_expense_categories.sql"
echo "   psql -d expense_management -f 005_create_expenses.sql"
echo "   psql -d expense_management -f 006_create_expense_line_items.sql"
echo "   psql -d expense_management -f 007_create_approval_rules.sql"
echo "   psql -d expense_management -f 008_create_approval_steps.sql"
echo "   psql -d expense_management -f 009_create_expense_approvals.sql"
echo "   psql -d expense_management -f 010_create_approval_actions.sql"
echo "   psql -d expense_management -f 011_create_exchange_rates.sql"
echo ""
echo "3. Seed default categories:"
echo "   psql -d expense_management -f database/postgres/seeds/categories.sql"
echo ""
echo "4. Setup MongoDB collections and indexes:"
echo "   mongosh expense_management database/mongodb/collections/audit_logs.js"
echo "   mongosh expense_management database/mongodb/collections/ocr_results.js"
echo "   mongosh expense_management database/mongodb/collections/notifications.js"
echo "   mongosh expense_management database/mongodb/indexes/audit_logs.indexes.js"
echo "   mongosh expense_management database/mongodb/indexes/ocr_results.indexes.js"
echo "   mongosh expense_management database/mongodb/indexes/notifications.indexes.js"
echo ""

echo ""
echo "⚙️  Configuration:"
echo ""
echo "Please update the following in .env files:"
echo "  - Database credentials (PostgreSQL, MongoDB)"
echo "  - JWT_SECRET (use a strong random string)"
echo "  - Gmail credentials for email service"
echo "  - Cloudinary credentials for file uploads"
echo "  - Frontend URL"
echo ""

echo ""
print_success "Setup completed!"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Update .env files with your credentials"
echo "2. Run database migrations (see instructions above)"
echo "3. Start services:"
echo ""
echo "   Using Docker Compose:"
echo "   docker-compose up -d"
echo ""
echo "   Or manually (in separate terminals):"
echo "   yarn dev:gateway"
echo "   yarn dev:auth"
echo "   yarn dev:user"
echo "   yarn dev:expense"
echo "   yarn dev:approval"
echo "   yarn dev:currency"
echo "   yarn dev:notification"
echo "   yarn dev:queue"
echo ""
echo "API Gateway will be available at http://localhost:5000"
echo "Health check: http://localhost:5000/health"
echo ""
print_success "Happy coding! 🚀"
