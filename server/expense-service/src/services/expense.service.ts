import pool from '../config/database';

export class ExpenseService {
  async createExpense(data: any) {
    const { userId, companyId, title, description, totalAmount, currency, category, date, status } = data;
    
    const result = await pool.query(
      `INSERT INTO expenses (user_id, company_id, title, description, total_amount, currency, category, date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [userId, companyId, title, description, totalAmount, currency, category, date, status || 'draft']
    );
    return result.rows[0];
  }

  async getExpenseById(expenseId: number, companyId: number) {
    const result = await pool.query(
      `SELECT e.*, u.first_name, u.last_name, u.email
       FROM expenses e
       JOIN users u ON e.user_id = u.id
       WHERE e.id = $1 AND e.company_id = $2`,
      [expenseId, companyId]
    );
    return result.rows[0];
  }

  async getAllExpenses(companyId: number, filters: any = {}) {
    let query = `
      SELECT e.*, u.first_name, u.last_name, u.email
      FROM expenses e
      JOIN users u ON e.user_id = u.id
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

    if (filters.category) {
      query += ` AND e.category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters.startDate) {
      query += ` AND e.date >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND e.date <= $${paramCount}`;
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

  async submitExpense(expenseId: number, companyId: number) {
    const result = await pool.query(
      `UPDATE expenses 
       SET status = 'pending', submitted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND company_id = $2 AND status = 'draft'
       RETURNING *`,
      [expenseId, companyId]
    );

    if (!result.rows[0]) {
      throw new Error('Expense not found or already submitted');
    }

    return result.rows[0];
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
