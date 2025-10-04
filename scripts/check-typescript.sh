#!/bin/bash

# TypeScript Build Check Script
# Runs yarn tsx to check for TypeScript errors in all services

echo "🔍 Checking TypeScript compilation in all services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Track results
TOTAL=0
PASSED=0
FAILED=0
SERVICES_WITH_ERRORS=()

# Function to check a service
check_service() {
    local service=$1
    local entry_point=$2
    
    TOTAL=$((TOTAL + 1))
    
    echo -e "${BLUE}[$TOTAL]${NC} Checking ${YELLOW}$service${NC}..."
    
    if [ ! -d "server/$service" ]; then
        echo -e "${RED}  ✗ Directory not found${NC}"
        FAILED=$((FAILED + 1))
        SERVICES_WITH_ERRORS+=("$service (directory not found)")
        echo ""
        return 1
    fi
    
    cd "server/$service" || return 1
    
    # Check if entry point exists
    if [ ! -f "$entry_point" ]; then
        echo -e "${RED}  ✗ Entry point not found: $entry_point${NC}"
        FAILED=$((FAILED + 1))
        SERVICES_WITH_ERRORS+=("$service (entry point not found)")
        cd ../..
        echo ""
        return 1
    fi
    
    # Run tsx to check for errors
    OUTPUT=$(yarn tsx "$entry_point" 2>&1 &)
    PID=$!
    
    # Give it 2 seconds to check for compilation errors
    sleep 2
    
    # Kill the process
    kill $PID 2>/dev/null
    wait $PID 2>/dev/null
    
    # Check for TypeScript errors in output
    if echo "$OUTPUT" | grep -iE "error TS[0-9]+:|SyntaxError|TypeError|Cannot find module" > /dev/null; then
        echo -e "${RED}  ✗ TypeScript errors found:${NC}"
        echo "$OUTPUT" | grep -iE "error TS[0-9]+:|SyntaxError|TypeError|Cannot find module" | head -10
        FAILED=$((FAILED + 1))
        SERVICES_WITH_ERRORS+=("$service")
    else
        echo -e "${GREEN}  ✓ No TypeScript errors${NC}"
        PASSED=$((PASSED + 1))
    fi
    
    cd ../..
    echo ""
}

# Check if yarn is available
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}Error: yarn is not installed. Please install yarn globally.${NC}"
    exit 1
fi

echo -e "${YELLOW}Installing tsx if not available...${NC}"
yarn global list tsx &> /dev/null || yarn global add tsx
echo ""

# Check shared module
echo -e "${BLUE}[0]${NC} Checking ${YELLOW}shared${NC} module..."
cd server/shared
if yarn tsc --noEmit 2>&1 | grep -E "error TS[0-9]+:" > /dev/null; then
    echo -e "${RED}  ✗ TypeScript errors in shared module${NC}"
    yarn tsc --noEmit 2>&1 | grep "error TS" | head -5
else
    echo -e "${GREEN}  ✓ No TypeScript errors in shared module${NC}"
fi
cd ../..
echo ""

# Check each service
check_service "api-gateway" "src/server.ts"
check_service "auth-service" "src/server.ts"
check_service "user-service" "src/server.ts"
check_service "expense-service" "src/server.ts"
check_service "approval-service" "src/server.ts"
check_service "currency-service" "src/server.ts"
check_service "notification-service" "src/server.ts"
check_service "queue-service" "src/server.ts"

# Print summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📊 SUMMARY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total services checked: ${BLUE}$TOTAL${NC}"
echo -e "Services passed: ${GREEN}$PASSED${NC}"
echo -e "Services with errors: ${RED}$FAILED${NC}"
echo ""

if [ $error_count -gt 0 ]; then
    echo ""
    echo "💡 Suggestions:"
    echo "  1. Make sure all dependencies are installed: yarn install:all"
    echo "  2. Check for missing imports or type definitions"
    echo "  3. Review the error messages above for specific issues"
    exit 1
else
    echo -e "${GREEN}✅ All services passed TypeScript compilation check!${NC}"
    echo ""
    echo -e "${YELLOW}Note:${NC} Some errors about missing dependencies are expected"
    echo "until you run 'yarn install' in each service directory or 'yarn install:all' from root."
    echo ""
    exit 0
fi
