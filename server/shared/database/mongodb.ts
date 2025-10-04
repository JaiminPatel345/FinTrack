import { MongoClient, Db } from 'mongodb';
import logger from '../utils/logger';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectMongoDB = async (uri?: string): Promise<Db> => {
  try {
    const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'expense_management';

    client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(dbName);
    
    logger.info('Connected to MongoDB', { database: dbName });
    
    return db;
  } catch (error) {
    logger.error('MongoDB connection error', error);
    throw error;
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB first.');
  }
  return db;
};

export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info('MongoDB connection closed');
  }
};

// Collection helpers
export const getCollection = (collectionName: string) => {
  return getDB().collection(collectionName);
};

export const COLLECTIONS = {
  AUDIT_LOGS: 'audit_logs',
  OCR_RESULTS: 'ocr_results',
  NOTIFICATIONS: 'notifications'
};
