import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expenseRoutes from './routes/expense.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'expense-service' });
});

app.use('/api/expenses', expenseRoutes);

// Categories endpoint - returns predefined categories
app.get('/api/categories', async (req, res) => {
  try {
    // For now, return static categories - can be moved to database later
    const categories = [
      { id: '1', name: 'Travel', description: 'Travel and transportation expenses' },
      { id: '2', name: 'Meals', description: 'Food and beverages' },
      { id: '3', name: 'Office Supplies', description: 'Office equipment and supplies' },
      { id: '4', name: 'Software', description: 'Software licenses and subscriptions' },
      { id: '5', name: 'Hardware', description: 'Computer hardware and accessories' },
      { id: '6', name: 'Marketing', description: 'Marketing and advertising' },
      { id: '7', name: 'Training', description: 'Training and education' },
      { id: '8', name: 'Other', description: 'Other miscellaneous expenses' }
    ];
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch categories'
    });
  }
});

app.post('/api/categories', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Creating custom categories is not yet implemented'
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export default app;
