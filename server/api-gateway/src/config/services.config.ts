export const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
  user: process.env.USER_SERVICE_URL || 'http://localhost:5002',
  expense: process.env.EXPENSE_SERVICE_URL || 'http://localhost:5003',
  approval: process.env.APPROVAL_SERVICE_URL || 'http://localhost:5004',
  currency: process.env.CURRENCY_SERVICE_URL || 'http://localhost:5005',
  ocr: process.env.OCR_SERVICE_URL || 'http://localhost:5006',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5007'
};

export const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

export const rateLimitOptions = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
};
