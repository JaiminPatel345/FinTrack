import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { services } from './services.config';

const createProxyConfig = (target: string, serviceName: string, pathRewrite?: Record<string, string>): Options => ({
  target,
  changeOrigin: true,
  pathRewrite: pathRewrite || {},
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[${serviceName}] ${req.method} ${req.url} -> ${target}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error(`[${serviceName}] Proxy Error:`, err.message);
    (res as any).status(503).json({
      success: false,
      error: `${serviceName} unavailable`,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Auth service routes are mounted at root "/" (e.g., /signup, /signin)
// So /api/auth/signup -> /signup (remove /api/auth prefix)
export const createAuthProxy = () => createProxyMiddleware(
  createProxyConfig(services.auth, 'Auth Service', { '^/api/auth': '' })
);

// User service routes are mounted at "/api/users"
// So /api/users -> /api/users (no rewrite needed)
export const createUsersProxy = () => createProxyMiddleware(
  createProxyConfig(services.user, 'User Service')
);

// Expense service routes are mounted at "/api/expenses"
// So /api/expenses -> /api/expenses (no rewrite)
// Categories might be at "/api/categories" on expense service
export const createExpensesProxy = () => createProxyMiddleware(
  createProxyConfig(services.expense, 'Expense Service')
);

// Approval service routes are mounted at "/api/approvals"
// So /api/approvals -> /api/approvals (no rewrite)
// Approval rules might be at "/api/approval-rules" on approval service
export const createApprovalsProxy = () => createProxyMiddleware(
  createProxyConfig(services.approval, 'Approval Service')
);

// Currency service routes are mounted at "/api/currency"
// So /api/currency -> /api/currency (no rewrite)
export const createCurrencyProxy = () => createProxyMiddleware(
  createProxyConfig(services.currency, 'Currency Service')
);

// OCR service routes are mounted at "/api/ocr"
// So /api/ocr -> /api/ocr (no rewrite)
export const createOcrProxy = () => createProxyMiddleware(
  createProxyConfig(services.ocr, 'OCR Service')
);

// Notification service routes are mounted at "/api/notifications"
// So /api/notifications -> /api/notifications (no rewrite)
export const createNotificationsProxy = () => createProxyMiddleware(
  createProxyConfig(services.notification, 'Notification Service')
);
