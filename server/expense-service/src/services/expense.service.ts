import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const CURRENCY_SERVICE_URL = process.env.CURRENCY_SERVICE_URL || 'http://localhost:5005';
const APPROVAL_SERVICE_URL = process.env.APPROVAL_SERVICE_URL || 'http://localhost:5004';

export class ExpenseService {
  /**
   * Convert currency using currency service
   */
  private async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<{ convertedAmount: number; exchangeRate: number }> {
    if (fromCurrency === toCurrency) {
      return { convertedAmount: amount, exchangeRate: 1 };
    }

    try {
      const response = await axios.post(`${CURRENCY_SERVICE_URL}/api/currency/convert`, {
        amount,
        fromCurrency,
        toCurrency
      });
      
      return {
        convertedAmount: response.data.data.convertedAmount,
        exchangeRate: response.data.data.exchangeRate
      };
    } catch (error) {
      console.error('Currency conversion failed:', error);
      // Fallback: return same amount with rate 1
      return { convertedAmount: amount, exchangeRate: 1 };
    }
  }

  async createExpense(data: any) {
    const { userId, companyId, categoryId, description, amount, currency, expenseDate, paidBy, gstPercentage, remarks, receiptUrl, receiptPublicId } = data;
    
    // Get company currency
    const companyResult = await pool.query(
      'SELECT currency_code FROM companies WHERE id = $1',
      [companyId]
    );

    const companyCurrency = companyResult.rows[0]?.currency_code || 'USD';

    // Convert currency if needed
    const { convertedAmount, exchangeRate } = await this.convertCurrency(amount, currency, companyCurrency);

    // Calculate GST
    const gstAmount = amount * ((gstPercentage || 0) / 100);

    const expenseId = uuidv4();
    const result = await pool.query(
      `INSERT INTO expenses (id, company_id, user_id, category_id, description, amount, currency, converted_amount, company_currency, exchange_rate, expense_date, paid_by, gst_percentage, gst_amount, remarks, receipt_url, receipt_public_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'draft', NOW(), NOW())
       RETURNING *`,
      [expenseId, companyId, userId, categoryId, description, amount, currency, convertedAmount, companyCurrency, exchangeRate, expenseDate, paidBy, gstPercentage || 0, gstAmount, remarks, receiptUrl, receiptPublicId]
    );
    
    return result.rows[0];
  }

  async getExpenseById(expenseId: string, companyId: string) {
    const result = await pool.query(
      `SELECT e.*, u.name, u.email, ec.name as category_name
       FROM expenses e
       JOIN users u ON e.user_id = u.id
       LEFT JOIN expense_categories ec ON e.category_id = ec.id
       WHERE e.id = $1 AND e.company_id = $2`,
      [expenseId, companyId]
    );
    return result.rows[0];
  }

  async getAllExpenses(companyId: string, filters: any = {}) {
    let query = `
      SELECT e.*, u.name, u.email, ec.name as category_name
      FROM expenses e
      JOIN users u ON e.user_id = u.id
      LEFT JOIN expense_categories ec ON e.category_id = ec.id
      WHERE e.company_id = $1
    `;
    const params: any[] = [companyId];
    let paramCount = 2;

    if (filters.userId) {
      query += ` AND e.user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }

    if (filters.status) {
      query += ` AND e.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters.categoryId) {
      query += ` AND e.category_id = $${paramCount}`;
      params.push(filters.categoryId);
      paramCount++;
    }

    if (filters.startDate) {
      query += ` AND e.expense_date >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND e.expense_date <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }

    query += ' ORDER BY e.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  async updateExpense(expenseId: number, companyId: number, data: any) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['title', 'description', 'total_amount', 'currency', 'category', 'date', 'status'];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field]);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(expenseId, companyId);

    const query = `
      UPDATE expenses 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND company_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteExpense(expenseId: number, companyId: number) {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND company_id = $2 RETURNING id',
      [expenseId, companyId]
    );
    return result.rows[0];
  }

  async addLineItem(expenseId: number, data: any) {
    const { description, amount, category, quantity } = data;
    
    const result = await pool.query(
      `INSERT INTO expense_line_items (expense_id, description, amount, category, quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [expenseId, description, amount, category, quantity || 1]
    );
    
    // Update total amount
    await pool.query(
      `UPDATE expenses 
       SET total_amount = (SELECT SUM(amount) FROM expense_line_items WHERE expense_id = $1)
       WHERE id = $1`,
      [expenseId]
    );

    return result.rows[0];
  }

  async getLineItems(expenseId: number) {
    const result = await pool.query(
      'SELECT * FROM expense_line_items WHERE expense_id = $1 ORDER BY created_at',
      [expenseId]
    );
    return result.rows;
  }

  async updateLineItem(lineItemId: number, expenseId: number, data: any) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['description', 'amount', 'category', 'quantity'];
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field]);
        paramCount++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(lineItemId);

    const query = `
      UPDATE expense_line_items 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    // Update total amount
    await pool.query(
      `UPDATE expenses 
       SET total_amount = (SELECT SUM(amount) FROM expense_line_items WHERE expense_id = $1)
       WHERE id = $1`,
      [expenseId]
    );

    return result.rows[0];
  }

  async deleteLineItem(lineItemId: number, expenseId: number) {
    await pool.query(
      'DELETE FROM expense_line_items WHERE id = $1',
      [lineItemId]
    );

    // Update total amount
    await pool.query(
      `UPDATE expenses 
       SET total_amount = (SELECT COALESCE(SUM(amount), 0) FROM expense_line_items WHERE expense_id = $1)
       WHERE id = $1`,
      [expenseId]
    );

    return { success: true };
  }

  async submitExpense(expenseId: string, userId: string, companyId: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get expense details
      const expenseResult = await client.query(
        `SELECT * FROM expenses 
         WHERE id = $1 AND company_id = $2 AND user_id = $3 AND status = 'draft'`,
        [expenseId, companyId, userId]
      );

      if (expenseResult.rows.length === 0) {
        throw new Error('Expense not found or already submitted');
      }

      // Update expense status to submitted
      await client.query(
        `UPDATE expenses 
         SET status = 'submitted', submitted_at = NOW()
         WHERE id = $1`,
        [expenseId]
      );

      await client.query('COMMIT');

      // Call approval service to create workflow (non-blocking)
      try {
        await axios.post(`${APPROVAL_SERVICE_URL}/api/approvals/create-workflow`, {
          expenseId,
          userId,
          companyId
        });
      } catch (error) {
        console.error('Failed to create approval workflow:', error);
        // Don't rollback expense submission if approval workflow fails
        // Admin can manually trigger it later
      }

      return expenseResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getExpenseStats(companyId: number, userId?: number) {
    let query = `
      SELECT 
        COUNT(*) as total_count,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count,
        SUM(total_amount) as total_amount,
        AVG(total_amount) as avg_amount
      FROM expenses
      WHERE company_id = $1
    `;
    
    const params: any[] = [companyId];
    
    if (userId) {
      query += ' AND user_id = $2';
      params.push(userId);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }
}
