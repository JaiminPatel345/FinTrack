import { MongoClient, Db } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_management';
let client: MongoClient;
let db: Db;

export const connectMongoDB = async () => {
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  }
  return db;
};

export const getDB = () => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB first.');
  }
  return db;
};
