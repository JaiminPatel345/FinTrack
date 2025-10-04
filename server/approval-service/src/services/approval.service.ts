import pool from '../config/database';

export class ApprovalService {
  async getExpenseApprovals(expenseId: number) {
    const result = await pool.query(
      `SELECT ea.*, u.first_name, u.last_name, u.email
       FROM expense_approvals ea
       JOIN users u ON ea.approver_id = u.id
       WHERE ea.expense_id = $1
       ORDER BY ea.step_order`,
      [expenseId]
    );
    return result.rows;
  }

  async getPendingApprovals(approverId: number, companyId: number) {
    const result = await pool.query(
      `SELECT ea.*, e.title, e.total_amount, e.currency, u.first_name, u.last_name
       FROM expense_approvals ea
       JOIN expenses e ON ea.expense_id = e.id
       JOIN users u ON e.user_id = u.id
       WHERE ea.approver_id = $1 
         AND ea.status = 'pending'
         AND e.company_id = $2
       ORDER BY ea.created_at DESC`,
      [approverId, companyId]
    );
    return result.rows;
  }

  async approveExpense(approvalId: number, approverId: number, comments?: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update approval status
      const approvalResult = await client.query(
        `UPDATE expense_approvals 
         SET status = 'approved', 
             comments = $1, 
             approved_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND approver_id = $3 AND status = 'pending'
         RETURNING *`,
        [comments, approvalId, approverId]
      );

      if (!approvalResult.rows[0]) {
        throw new Error('Approval not found or already processed');
      }

      const approval = approvalResult.rows[0];

      // Insert approval action
      await client.query(
        `INSERT INTO approval_actions (approval_id, approver_id, action, comments)
         VALUES ($1, $2, 'approved', $3)`,
        [approvalId, approverId, comments]
      );

      // Check if all approvals are complete
      const remainingResult = await client.query(
        `SELECT COUNT(*) as pending_count
         FROM expense_approvals
         WHERE expense_id = $1 AND status = 'pending'`,
        [approval.expense_id]
      );

      if (parseInt(remainingResult.rows[0].pending_count) === 0) {
        // All approvals complete, update expense status
        await client.query(
          `UPDATE expenses 
           SET status = 'approved', approved_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [approval.expense_id]
        );
      }

      await client.query('COMMIT');
      return approval;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async rejectExpense(approvalId: number, approverId: number, comments: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update approval status
      const approvalResult = await client.query(
        `UPDATE expense_approvals 
         SET status = 'rejected', 
             comments = $1, 
             approved_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND approver_id = $3 AND status = 'pending'
         RETURNING *`,
        [comments, approvalId, approverId]
      );

      if (!approvalResult.rows[0]) {
        throw new Error('Approval not found or already processed');
      }

      const approval = approvalResult.rows[0];

      // Insert approval action
      await client.query(
        `INSERT INTO approval_actions (approval_id, approver_id, action, comments)
         VALUES ($1, $2, 'rejected', $3)`,
        [approvalId, approverId, comments]
      );

      // Update expense status to rejected
      await client.query(
        `UPDATE expenses 
         SET status = 'rejected'
         WHERE id = $1`,
        [approval.expense_id]
      );

      await client.query('COMMIT');
      return approval;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getApprovalRules(companyId: number) {
    const result = await pool.query(
      `SELECT * FROM approval_rules WHERE company_id = $1 AND is_active = true ORDER BY priority`,
      [companyId]
    );
    return result.rows;
  }

  async createApprovalRule(data: any) {
    const { companyId, name, description, minAmount, maxAmount, currency, requiresManagerApproval, requiresFinanceApproval, priority } = data;
    
    const result = await pool.query(
      `INSERT INTO approval_rules (company_id, name, description, min_amount, max_amount, currency, requires_manager_approval, requires_finance_approval, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [companyId, name, description, minAmount, maxAmount, currency, requiresManagerApproval, requiresFinanceApproval, priority]
    );
    return result.rows[0];
  }

  async updateApprovalRule(ruleId: number, companyId: number, data: any) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'description', 'min_amount', 'max_amount', 'currency', 'requires_manager_approval', 'requires_finance_approval', 'priority', 'is_active'];
    
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

    values.push(ruleId, companyId);

    const query = `
      UPDATE approval_rules 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND company_id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getApprovalHistory(expenseId: number) {
    const result = await pool.query(
      `SELECT aa.*, u.first_name, u.last_name, u.email, ea.step_order
       FROM approval_actions aa
       JOIN expense_approvals ea ON aa.approval_id = ea.id
       JOIN users u ON aa.approver_id = u.id
       WHERE ea.expense_id = $1
       ORDER BY aa.created_at`,
      [expenseId]
    );
    return result.rows;
  }
}
