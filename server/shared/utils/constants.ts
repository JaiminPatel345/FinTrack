export const JWT_EXPIRY = '24h';
export const REFRESH_TOKEN_EXPIRY = '7d';
export const RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

export const DEFAULT_CURRENCY = 'USD';
export const CACHE_TTL = {
  CURRENCY_RATES: 86400, // 24 hours in seconds
  USER_DATA: 3600, // 1 hour
  EXCHANGE_RATE: 86400
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export const QUEUE_JOBS = {
  OCR_PROCESS: 'ocr-process',
  SEND_EMAIL: 'send-email',
  APPROVAL_NOTIFICATION: 'approval-notification',
  CURRENCY_SYNC: 'currency-sync'
};

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'],
  CLOUDINARY_FOLDER: 'expense_management/receipts'
};

export const OCR_CONFIG = {
  MIN_CONFIDENCE: 0.5,
  PROCESSING_TIMEOUT: 60000 // 1 minute
};

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

export const EXTERNAL_APIS = {
  EXCHANGE_RATE: 'https://api.exchangerate-api.com/v4/latest',
  COUNTRIES: 'https://restcountries.com/v3.1/all?fields=name,currencies'
};
