import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class ApprovalService {
  /**
   * Create approval workflow for an expense
   * This is called when expense is submitted
   */
  async createApprovalWorkflow(expenseId: string, userId: string, companyId: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get expense details
      const expenseResult = await client.query(
        `SELECT e.*, c.currency_code as company_currency
         FROM expenses e
         JOIN companies c ON e.company_id = c.id
         WHERE e.id = $1 AND e.company_id = $2`,
        [expenseId, companyId]
      );

      if (expenseResult.rows.length === 0) {
        throw new Error('Expense not found');
      }

      const expense = expenseResult.rows[0];

      // Find matching approval rule
      const ruleResult = await client.query(
        `SELECT ar.*, 
                COALESCE(
                  (SELECT json_agg(json_build_object(
                    'id', as_data.id,
                    'step_order', as_data.step_order,
                    'approver_id', as_data.approver_id,
                    'is_auto_approve', as_data.is_auto_approve
                  ) ORDER BY as_data.step_order)
                  FROM approval_steps as_data
                  WHERE as_data.approval_rule_id = ar.id),
                  '[]'::json
                ) as steps
         FROM approval_rules ar
         WHERE ar.company_id = $1 
           AND ar.is_active = true
           AND (ar.category_id IS NULL OR ar.category_id = $2)
           AND (ar.min_amount IS NULL OR $3 >= ar.min_amount)
           AND (ar.max_amount IS NULL OR $3 <= ar.max_amount)
         ORDER BY ar.priority DESC
         LIMIT 1`,
        [companyId, expense.category_id, expense.converted_amount || expense.amount]
      );

      if (ruleResult.rows.length === 0) {
        throw new Error('No matching approval rule found');
      }

      const rule = ruleResult.rows[0];
      const steps = rule.steps || [];

      // If is_manager_approver is true, add manager as first step
      let approvalSteps = [...steps];
      if (rule.is_manager_approver) {
        const managerResult = await client.query(
          `SELECT manager_id 
           FROM manager_relationships 
           WHERE user_id = $1 AND is_active = true
           LIMIT 1`,
          [userId]
        );

        if (managerResult.rows.length > 0) {
          approvalSteps.unshift({
            id: uuidv4(),
            step_order: 0,
            approver_id: managerResult.rows[0].manager_id,
            is_auto_approve: false
          });
        }
      }

      if (approvalSteps.length === 0) {
        throw new Error('No approvers found for this rule');
      }

      // Create expense_approval record
      const expenseApprovalId = uuidv4();
      await client.query(
        `INSERT INTO expense_approvals (id, expense_id, approval_rule_id, company_id, total_steps, current_step, status, created_at)
         VALUES ($1, $2, $3, $4, $5, 1, 'pending', NOW())`,
        [expenseApprovalId, expenseId, rule.id, companyId, approvalSteps.length]
      );

      // Create approval_actions for each step (initially pending)
      for (const step of approvalSteps) {
        await client.query(
          `INSERT INTO approval_actions (id, expense_approval_id, step_order, approver_id, action, created_at)
           VALUES ($1, $2, $3, $4, 'pending', NOW())`,
          [uuidv4(), expenseApprovalId, step.step_order, step.approver_id]
        );
      }

      // Update expense status to pending_approval
      await client.query(
        `UPDATE expenses SET status = 'pending_approval', submitted_at = NOW() WHERE id = $1`,
        [expenseId]
      );

      await client.query('COMMIT');

      return {
        expenseApprovalId,
        rule,
        steps: approvalSteps,
        currentStep: 1
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getExpenseApprovals(expenseId: string) {
    const result = await pool.query(
      `SELECT aa.*, u.name, u.email
       FROM approval_actions aa
       JOIN users u ON aa.approver_id = u.id
       WHERE aa.expense_approval_id IN (
         SELECT id FROM expense_approvals WHERE expense_id = $1
       )
       ORDER BY aa.step_order`,
      [expenseId]
    );
    return result.rows;
  }

  async getPendingApprovals(approverId: string, companyId: string) {
    const result = await pool.query(
      `SELECT DISTINCT ON (e.id)
              e.id as expense_id,
              e.description,
              e.amount,
              e.currency,
              e.converted_amount,
              e.expense_date,
              u.name as employee_name,
              u.email as employee_email,
              ea.id as approval_id,
              ea.current_step,
              ea.total_steps,
              aa.id as action_id,
              aa.step_order
       FROM expenses e
       JOIN users u ON e.user_id = u.id
       JOIN expense_approvals ea ON e.id = ea.expense_id
       JOIN approval_actions aa ON ea.id = aa.expense_approval_id
       WHERE aa.approver_id = $1 
         AND aa.action = 'pending'
         AND e.company_id = $2
         AND e.status = 'pending_approval'
       ORDER BY e.id, e.submitted_at DESC`,
      [approverId, companyId]
    );
    return result.rows;
  }

  async approveExpense(actionId: string, approverId: string, comments?: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update approval action
      const actionResult = await client.query(
        `UPDATE approval_actions 
         SET action = 'approved', 
             comments = $1, 
             action_date = NOW()
         WHERE id = $2 AND approver_id = $3 AND action = 'pending'
         RETURNING *`,
        [comments, actionId, approverId]
      );

      if (actionResult.rows.length === 0) {
        throw new Error('Approval action not found or already processed');
      }

      const action = actionResult.rows[0];

      // Get expense approval details
      const expenseApprovalResult = await client.query(
        `SELECT ea.*, ar.rule_type, ar.percentage_required
         FROM expense_approvals ea
         JOIN approval_rules ar ON ea.approval_rule_id = ar.id
         WHERE ea.id = $1`,
        [action.expense_approval_id]
      );

      const expenseApproval = expenseApprovalResult.rows[0];

      // Evaluate approval based on rule type
      let isApproved = false;
      let shouldMoveToNext = false;

      if (expenseApproval.rule_type === 'sequential') {
        // Sequential: check if this is auto-approve or need to move to next step
        const currentStepResult = await client.query(
          `SELECT * FROM approval_actions 
           WHERE expense_approval_id = $1 AND step_order = $2`,
          [expenseApproval.id, expenseApproval.current_step]
        );

        if (currentStepResult.rows[0]?.step_order === action.step_order) {
          // Current step approved, move to next
          if (expenseApproval.current_step < expenseApproval.total_steps) {
            shouldMoveToNext = true;
            await client.query(
              `UPDATE expense_approvals SET current_step = current_step + 1 WHERE id = $1`,
              [expenseApproval.id]
            );
          } else {
            // Last step approved
            isApproved = true;
          }
        }
      } else if (expenseApproval.rule_type === 'percentage') {
        // Percentage: check if required percentage reached
        const approvedCountResult = await client.query(
          `SELECT COUNT(*) as approved, $1 as total
           FROM approval_actions
           WHERE expense_approval_id = $2 AND action = 'approved'`,
          [expenseApproval.total_steps, expenseApproval.id]
        );

        const approved = parseInt(approvedCountResult.rows[0].approved);
        const total = parseInt(approvedCountResult.rows[0].total);
        const percentage = (approved / total) * 100;

        if (percentage >= expenseApproval.percentage_required) {
          isApproved = true;
        }
      } else if (expenseApproval.rule_type === 'specific_approver') {
        // Specific approver: check if this approver has auto-approve
        const stepResult = await client.query(
          `SELECT is_auto_approve FROM approval_steps 
           WHERE approval_rule_id = $1 AND approver_id = $2`,
          [expenseApproval.approval_rule_id, approverId]
        );

        if (stepResult.rows[0]?.is_auto_approve) {
          isApproved = true;
        }
      } else if (expenseApproval.rule_type === 'hybrid') {
        // Hybrid: check both percentage AND specific approver
        const approvedCountResult = await client.query(
          `SELECT COUNT(*) as approved FROM approval_actions
           WHERE expense_approval_id = $1 AND action = 'approved'`,
          [expenseApproval.id]
        );

        const approved = parseInt(approvedCountResult.rows[0].approved);
        const percentage = (approved / expenseApproval.total_steps) * 100;

        // Check if specific approver
        const stepResult = await client.query(
          `SELECT is_auto_approve FROM approval_steps 
           WHERE approval_rule_id = $1 AND approver_id = $2`,
          [expenseApproval.approval_rule_id, approverId]
        );

        if (percentage >= expenseApproval.percentage_required || stepResult.rows[0]?.is_auto_approve) {
          isApproved = true;
        }
      }

      // Update expense status if approved
      if (isApproved) {
        await client.query(
          `UPDATE expense_approvals SET status = 'approved', completed_at = NOW() WHERE id = $1`,
          [expenseApproval.id]
        );
        await client.query(
          `UPDATE expenses SET status = 'approved' WHERE id = $1`,
          [expenseApproval.expense_id]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        action,
        isApproved,
        shouldMoveToNext,
        currentStep: expenseApproval.current_step + (shouldMoveToNext ? 1 : 0)
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async rejectExpense(actionId: string, approverId: string, comments: string) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Update approval action
      const actionResult = await client.query(
        `UPDATE approval_actions 
         SET action = 'rejected', 
             comments = $1, 
             action_date = NOW()
         WHERE id = $2 AND approver_id = $3 AND action = 'pending'
         RETURNING *`,
        [comments, actionId, approverId]
      );

      if (actionResult.rows.length === 0) {
        throw new Error('Approval action not found or already processed');
      }

      const action = actionResult.rows[0];

      // Get expense approval
      const expenseApprovalResult = await client.query(
        `SELECT * FROM expense_approvals WHERE id = $1`,
        [action.expense_approval_id]
      );

      const expenseApproval = expenseApprovalResult.rows[0];

      // Rejection immediately rejects entire expense (no further approvals)
      await client.query(
        `UPDATE expense_approvals SET status = 'rejected', completed_at = NOW() WHERE id = $1`,
        [expenseApproval.id]
      );

      await client.query(
        `UPDATE expenses SET status = 'rejected' WHERE id = $1`,
        [expenseApproval.expense_id]
      );

      await client.query('COMMIT');

      return {
        success: true,
        action,
        expenseId: expenseApproval.expense_id
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getApprovalRules(companyId: string) {
    const result = await pool.query(
      `SELECT ar.*,
              COALESCE(
                (SELECT json_agg(json_build_object(
                  'id', as_data.id,
                  'step_order', as_data.step_order,
                  'approver_id', as_data.approver_id,
                  'is_auto_approve', as_data.is_auto_approve
                ) ORDER BY as_data.step_order)
                FROM approval_steps as_data
                WHERE as_data.approval_rule_id = ar.id),
                '[]'::json
              ) as steps
       FROM approval_rules ar
       WHERE ar.company_id = $1 AND ar.is_active = true 
       ORDER BY ar.priority DESC`,
      [companyId]
    );
    return result.rows;
  }

  async createApprovalRule(data: any) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const { companyId, name, description, categoryId, minAmount, maxAmount, ruleType, isManagerApprover, percentageRequired, priority, approvers } = data;
      
      const ruleId = uuidv4();
      const result = await client.query(
        `INSERT INTO approval_rules (id, company_id, name, description, category_id, min_amount, max_amount, rule_type, is_manager_approver, percentage_required, priority, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, NOW(), NOW())
         RETURNING *`,
        [ruleId, companyId, name, description, categoryId, minAmount, maxAmount, ruleType, isManagerApprover, percentageRequired, priority]
      );

      // Create approval steps
      if (approvers && approvers.length > 0) {
        for (const approver of approvers) {
          await client.query(
            `INSERT INTO approval_steps (id, approval_rule_id, step_order, approver_id, is_auto_approve, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [uuidv4(), ruleId, approver.stepOrder, approver.approverId, approver.isAutoApprove || false]
          );
        }
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateApprovalRule(ruleId: string, companyId: string, data: any) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const fields = [];
      const values = [];
      let paramCount = 1;

      const allowedFields = ['name', 'description', 'category_id', 'min_amount', 'max_amount', 'rule_type', 'is_manager_approver', 'percentage_required', 'priority', 'is_active'];
      
      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          fields.push(`${field} = $${paramCount}`);
          values.push(data[field]);
          paramCount++;
        }
      }

      if (fields.length > 0) {
        fields.push(`updated_at = NOW()`);
        values.push(ruleId, companyId);

        const query = `
          UPDATE approval_rules 
          SET ${fields.join(', ')}
          WHERE id = $${paramCount} AND company_id = $${paramCount + 1}
          RETURNING *
        `;

        await client.query(query, values);
      }

      // Update approvers if provided
      if (data.approvers) {
        // Delete existing steps
        await client.query('DELETE FROM approval_steps WHERE approval_rule_id = $1', [ruleId]);

        // Insert new steps
        for (const approver of data.approvers) {
          await client.query(
            `INSERT INTO approval_steps (id, approval_rule_id, step_order, approver_id, is_auto_approve, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [uuidv4(), ruleId, approver.stepOrder, approver.approverId, approver.isAutoApprove || false]
          );
        }
      }

      await client.query('COMMIT');

      const result = await pool.query('SELECT * FROM approval_rules WHERE id = $1', [ruleId]);
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getApprovalHistory(expenseId: string) {
    const result = await pool.query(
      `SELECT aa.*, u.name, u.email
       FROM approval_actions aa
       JOIN users u ON aa.approver_id = u.id
       WHERE aa.expense_approval_id IN (
         SELECT id FROM expense_approvals WHERE expense_id = $1
       )
       ORDER BY aa.step_order, aa.action_date`,
      [expenseId]
    );
    return result.rows;
  }
}
