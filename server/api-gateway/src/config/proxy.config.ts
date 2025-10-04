import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { services } from './services.config';

const proxyOptions: Record<string, Options> = {
  auth: {
    target: services.auth,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '' },
    onError: (err, req, res) => {
      console.error('Auth Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'Auth service unavailable'
      });
    }
  },
  users: {
    target: services.user,
    changeOrigin: true,
    pathRewrite: { '^/api/users': '' },
    onError: (err, req, res) => {
      console.error('User Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'User service unavailable'
      });
    }
  },
  expenses: {
    target: services.expense,
    changeOrigin: true,
    pathRewrite: { '^/api/expenses': '', '^/api/categories': '/categories' },
    onError: (err, req, res) => {
      console.error('Expense Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'Expense service unavailable'
      });
    }
  },
  approvals: {
    target: services.approval,
    changeOrigin: true,
    pathRewrite: { '^/api/approvals': '', '^/api/approval-rules': '/approval-rules' },
    onError: (err, req, res) => {
      console.error('Approval Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'Approval service unavailable'
      });
    }
  },
  currency: {
    target: services.currency,
    changeOrigin: true,
    pathRewrite: { '^/api/currency': '' },
    onError: (err, req, res) => {
      console.error('Currency Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'Currency service unavailable'
      });
    }
  },
  ocr: {
    target: services.ocr,
    changeOrigin: true,
    pathRewrite: { '^/api/ocr': '' },
    onError: (err, req, res) => {
      console.error('OCR Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'OCR service unavailable'
      });
    }
  },
  notifications: {
    target: services.notification,
    changeOrigin: true,
    pathRewrite: { '^/api/notifications': '' },
    onError: (err, req, res) => {
      console.error('Notification Service Proxy Error:', err);
      (res as any).status(503).json({
        success: false,
        error: 'Notification service unavailable'
      });
    }
  }
};

export const createAuthProxy = () => createProxyMiddleware(proxyOptions.auth);
export const createUsersProxy = () => createProxyMiddleware(proxyOptions.users);
export const createExpensesProxy = () => createProxyMiddleware(proxyOptions.expenses);
export const createApprovalsProxy = () => createProxyMiddleware(proxyOptions.approvals);
export const createCurrencyProxy = () => createProxyMiddleware(proxyOptions.currency);
export const createOcrProxy = () => createProxyMiddleware(proxyOptions.ocr);
export const createNotificationsProxy = () => createProxyMiddleware(proxyOptions.notifications);
