import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { corsOptions, rateLimitOptions } from './config/services.config';
import {
  createAuthProxy,
  createUsersProxy,
  createExpensesProxy,
  createApprovalsProxy,
  createCurrencyProxy,
  createOcrProxy,
  createNotificationsProxy
} from './config/proxy.config';

dotenv.config();

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit(rateLimitOptions);
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is healthy',
    timestamp: new Date()
  });
});

// Service routes (proxies)
app.use('/api/auth', createAuthProxy());
app.use('/api/users', createUsersProxy());
app.use('/api/expenses', createExpensesProxy());
app.use('/api/categories', createExpensesProxy());
app.use('/api/approvals', createApprovalsProxy());
app.use('/api/approval-rules', createApprovalsProxy());
app.use('/api/currency', createCurrencyProxy());
app.use('/api/ocr', createOcrProxy());
app.use('/api/notifications', createNotificationsProxy());

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
