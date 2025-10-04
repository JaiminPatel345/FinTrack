# Expense Service Dockerfile
# Build context: root of workspace (.)
FROM node:20-alpine

WORKDIR /workspace

# Copy root workspace configuration
COPY package.json yarn.lock ./

# Copy all service package.json files for workspace resolution
COPY server/api-gateway/package.json ./server/api-gateway/
COPY server/auth-service/package.json ./server/auth-service/
COPY server/user-service/package.json ./server/user-service/
COPY server/expense-service/package.json ./server/expense-service/
COPY server/approval-service/package.json ./server/approval-service/
COPY server/currency-service/package.json ./server/currency-service/
COPY server/notification-service/package.json ./server/notification-service/
COPY server/queue-service/package.json ./server/queue-service/

# Install all workspace dependencies
RUN yarn install --frozen-lockfile

# Copy shared code
COPY server/shared ./server/shared/

# Copy expense-service source
COPY server/expense-service ./server/expense-service/

# Build TypeScript
WORKDIR /workspace/server/expense-service
RUN yarn build

EXPOSE 5003
CMD ["node", "dist/server.js"]
