import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_management';
let mongoClient: MongoClient;

export const connectMongoDB = async () => {
  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
  }
  return mongoClient.db();
};

export const getMongoClient = () => {
  if (!mongoClient) {
    throw new Error('MongoDB not connected');
  }
  return mongoClient;
};
