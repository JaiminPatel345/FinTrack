import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import approvalRoutes from './routes/approval.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'approval-service' });
});

// Mount approval routes
app.use('/api/approvals', approvalRoutes);

// Alias for approval rules - map /api/approval-rules/* to /rules
app.get('/api/approval-rules', (req, res, next) => {
  req.url = '/api/approvals/rules';
  approvalRoutes(req, res, next);
});

app.post('/api/approval-rules', (req, res, next) => {
  req.url = '/api/approvals/rules';
  approvalRoutes(req, res, next);
});

app.put('/api/approval-rules/:id', (req, res, next) => {
  req.url = `/api/approvals/rules/${req.params.id}`;
  approvalRoutes(req, res, next);
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;
