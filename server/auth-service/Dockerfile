# Auth Service Dockerfile
# Build context: root of workspace (.)

# Base stage - shared dependencies
FROM node:20-alpine AS base

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

# Copy auth-service source
COPY server/auth-service ./server/auth-service/

WORKDIR /workspace/server/auth-service

# Development stage - with hot reload
FROM base AS development

EXPOSE 5001
CMD ["yarn", "dev"]

# Production stage - build and run optimized
FROM base AS production

RUN yarn build

EXPOSE 5001
CMD ["node", "dist/server.js"]
