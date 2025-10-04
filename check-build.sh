#!/bin/bash

# Simple TypeScript Compilation Check Script
# Uses tsc --noEmit to check for TypeScript errors without building

echo "🔍 Checking TypeScript compilation errors..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Track results
TOTAL=0
PASSED=0
FAILED=0

# Function to check a service
check_service() {
    local service=$1
    TOTAL=$((TOTAL + 1))
    
    echo -e "${BLUE}[$TOTAL]${NC} Checking ${YELLOW}$service${NC}..."
    
    if [ ! -d "server/$service" ]; then
        echo -e "${RED}  ✗ Directory not found${NC}"
        FAILED=$((FAILED + 1))
        echo ""
        return 1
    fi
    
    cd "server/$service" || return 1
    
    # Check if tsconfig.json exists
    if [ ! -f "tsconfig.json" ]; then
        echo -e "${YELLOW}  ⚠ No tsconfig.json found${NC}"
        cd ../..
        echo ""
        return 0
    fi
    
    # Run TypeScript compiler in check mode
    if yarn tsc --noEmit 2>&1 | tee /tmp/tsc_output.txt | grep -E "error TS[0-9]+:" > /dev/null; then
        echo -e "${RED}  ✗ TypeScript errors found:${NC}"
        grep "error TS" /tmp/tsc_output.txt | head -10
        FAILED=$((FAILED + 1))
    else
        echo -e "${GREEN}  ✓ No compilation errors${NC}"
        PASSED=$((PASSED + 1))
    fi
    
    cd ../..
    echo ""
}

# Check Node.js and yarn
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    echo -e "${RED}Error: yarn is not installed${NC}"
    exit 1
fi

# Check all services
SERVICES=(
    "api-gateway"
    "auth-service"
    "user-service"
    "expense-service"
    "approval-service"
    "currency-service"
    "notification-service"
    "queue-service"
)

for service in "${SERVICES[@]}"; do
    check_service "$service"
done

# Print summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total services: ${BLUE}$TOTAL${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Some services have TypeScript errors${NC}"
    echo ""
    echo -e "${YELLOW}💡 Common fixes:${NC}"
    echo "  1. Install dependencies: cd server/SERVICE_NAME && yarn install"
    echo "  2. Run: yarn install:all (from root)"
    echo "  3. Check the errors above and fix them"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ All services passed TypeScript check!${NC}"
    echo ""
    exit 0
fi
