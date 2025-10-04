import { Request, Response } from 'express';
import { ExpenseService } from '../services/expense.service';

const expenseService = new ExpenseService();

export class ExpenseController {
  async createExpense(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const companyId = (req as any).user.companyId;
      
      const expense = await expenseService.createExpense({
        ...req.body,
        userId,
        companyId
      });
      
      res.status(201).json({ success: true, data: expense });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExpenseById(req: Request, res: Response) {
    try {
      const expenseId = req.params.id;
      const companyId = (req as any).user.companyId;
      
      const expense = await expenseService.getExpenseById(expenseId, companyId);
      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense not found' });
      }
      
      res.json({ success: true, data: expense });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllExpenses(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      const userId = (req as any).user.userId;
      const role = (req as any).user.role;
      
      const filters: any = { ...req.query };
      
      // Non-admins can only see their own expenses unless they're managers
      if (role !== 'admin' && !filters.userId) {
        filters.userId = userId;
      }
      
      const expenses = await expenseService.getAllExpenses(companyId, filters);
      res.json({ success: true, data: expenses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateExpense(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;
      
      const expense = await expenseService.updateExpense(expenseId, companyId, req.body);
      res.json({ success: true, data: expense });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteExpense(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      const companyId = (req as any).user.companyId;
      
      await expenseService.deleteExpense(expenseId, companyId);
      res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addLineItem(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      
      const lineItem = await expenseService.addLineItem(expenseId, req.body);
      res.status(201).json({ success: true, data: lineItem });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getLineItems(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      
      const lineItems = await expenseService.getLineItems(expenseId);
      res.json({ success: true, data: lineItems });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateLineItem(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      const lineItemId = parseInt(req.params.lineItemId);
      
      const lineItem = await expenseService.updateLineItem(lineItemId, expenseId, req.body);
      res.json({ success: true, data: lineItem });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteLineItem(req: Request, res: Response) {
    try {
      const expenseId = parseInt(req.params.id);
      const lineItemId = parseInt(req.params.lineItemId);
      
      await expenseService.deleteLineItem(lineItemId, expenseId);
      res.json({ success: true, message: 'Line item deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async submitExpense(req: Request, res: Response) {
    try {
      const expenseId = req.params.id;
      const userId = (req as any).user.userId;
      const companyId = (req as any).user.companyId;
      
      const expense = await expenseService.submitExpense(expenseId, userId, companyId);
      res.json({ success: true, data: expense, message: 'Expense submitted for approval' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExpenseStats(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      const stats = await expenseService.getExpenseStats(companyId, userId);
      res.json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
