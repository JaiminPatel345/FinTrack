import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';

const router = Router();
const expenseController = new ExpenseController();

// Expense CRUD
router.post('/', (req, res) => expenseController.createExpense(req, res));
router.get('/', (req, res) => expenseController.getAllExpenses(req, res));
router.get('/stats', (req, res) => expenseController.getExpenseStats(req, res));
router.get('/:id', (req, res) => expenseController.getExpenseById(req, res));
router.put('/:id', (req, res) => expenseController.updateExpense(req, res));
router.delete('/:id', (req, res) => expenseController.deleteExpense(req, res));

// Submit expense for approval
router.post('/:id/submit', (req, res) => expenseController.submitExpense(req, res));

// Line items
router.post('/:id/line-items', (req, res) => expenseController.addLineItem(req, res));
router.get('/:id/line-items', (req, res) => expenseController.getLineItems(req, res));
router.put('/:id/line-items/:lineItemId', (req, res) => expenseController.updateLineItem(req, res));
router.delete('/:id/line-items/:lineItemId', (req, res) => expenseController.deleteLineItem(req, res));

export default router;
