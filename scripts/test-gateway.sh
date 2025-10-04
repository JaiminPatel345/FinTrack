#!/bin/bash

# API Gateway Route Test Script
# Tests all client-facing routes through the gateway

GATEWAY_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "API Gateway Route Verification"
echo "Gateway URL: $GATEWAY_URL"
echo "=========================================="
echo ""

# Function to test route
test_route() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    echo -n "Testing: $description ... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$GATEWAY_URL$endpoint" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        if [ "$response" == "000" ]; then
            echo -e "${RED}FAIL - Gateway not responding${NC}"
        elif [ "$response" == "503" ]; then
            echo -e "${YELLOW}WARN - Service unavailable (microservice not running)${NC}"
        elif [ "$response" == "404" ]; then
            echo -e "${RED}FAIL - Route not found${NC}"
        elif [ "$response" == "401" ]; then
            echo -e "${GREEN}OK - Route exists (401 expected - no auth)${NC}"
        else
            echo -e "${GREEN}OK - HTTP $response${NC}"
        fi
    else
        echo -e "${RED}FAIL - Cannot connect to gateway${NC}"
    fi
}

# Health Check
echo "=== Health Check ==="
test_route GET "/health" "Gateway Health"
echo ""

# Authentication Routes
echo "=== Authentication Routes ==="
test_route POST "/api/auth/signup" "POST /api/auth/signup"
test_route POST "/api/auth/signin" "POST /api/auth/signin"
test_route POST "/api/auth/change-password" "POST /api/auth/change-password"
test_route POST "/api/auth/forgot-password" "POST /api/auth/forgot-password"
test_route POST "/api/auth/reset-password" "POST /api/auth/reset-password"
echo ""

# User Management Routes
echo "=== User Management Routes ==="
test_route GET "/api/users" "GET /api/users"
test_route POST "/api/users" "POST /api/users"
test_route GET "/api/users/test-id" "GET /api/users/:id"
test_route PUT "/api/users/test-id" "PUT /api/users/:id"
test_route DELETE "/api/users/test-id" "DELETE /api/users/:id"
test_route POST "/api/users/test-id/send-password" "POST /api/users/:id/send-password"
test_route GET "/api/users/test-id/manager" "GET /api/users/:id/manager"
test_route POST "/api/users/test-id/manager" "POST /api/users/:id/manager"
test_route GET "/api/users/test-id/subordinates" "GET /api/users/:id/subordinates"
echo ""

# Category Routes
echo "=== Category Routes ==="
test_route GET "/api/categories" "GET /api/categories"
test_route POST "/api/categories" "POST /api/categories"
echo ""

# Expense Routes
echo "=== Expense Routes ==="
test_route GET "/api/expenses" "GET /api/expenses"
test_route POST "/api/expenses" "POST /api/expenses"
test_route GET "/api/expenses/stats" "GET /api/expenses/stats"
test_route GET "/api/expenses/test-id" "GET /api/expenses/:id"
test_route PUT "/api/expenses/test-id" "PUT /api/expenses/:id"
test_route DELETE "/api/expenses/test-id" "DELETE /api/expenses/:id"
test_route POST "/api/expenses/test-id/submit" "POST /api/expenses/:id/submit"
echo ""

# Approval Routes
echo "=== Approval Routes ==="
test_route GET "/api/approvals/pending" "GET /api/approvals/pending"
test_route GET "/api/approvals/expense/test-id" "GET /api/approvals/expense/:id"
test_route POST "/api/approvals/test-id/approve" "POST /api/approvals/:id/approve"
test_route POST "/api/approvals/test-id/reject" "POST /api/approvals/:id/reject"
echo ""

# Approval Rules Routes
echo "=== Approval Rules Routes ==="
test_route GET "/api/approval-rules" "GET /api/approval-rules"
test_route POST "/api/approval-rules" "POST /api/approval-rules"
test_route PUT "/api/approval-rules/test-id" "PUT /api/approval-rules/:id"
echo ""

# Currency Routes
echo "=== Currency Routes ==="
test_route GET "/api/currency/countries" "GET /api/currency/countries"
test_route POST "/api/currency/convert" "POST /api/currency/convert"
test_route GET "/api/currency/rates/USD" "GET /api/currency/rates/:currency"
echo ""

# OCR Routes
echo "=== OCR Routes ==="
test_route POST "/api/ocr/process" "POST /api/ocr/process"
echo ""

# 404 Test
echo "=== Error Handling ==="
test_route GET "/api/invalid-route" "GET /api/invalid-route (should be 404)"
echo ""

echo "=========================================="
echo "Gateway Route Verification Complete"
echo "=========================================="
echo ""
echo "Notes:"
echo "  - ${GREEN}OK${NC} means the route is properly configured"
echo "  - ${YELLOW}WARN${NC} means route exists but microservice is not running"
echo "  - ${RED}FAIL${NC} means route is not configured in gateway"
echo "  - 401 responses are normal for protected routes without auth"
echo ""
echo "To start all services:"
echo "  docker compose up -d"
echo "  # or"
echo "  yarn dev:gateway (in separate terminals for each service)"
