import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import queueRoutes from './routes/queue.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'queue-service' });
});

app.use('/api/queue', queueRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

export default app;
