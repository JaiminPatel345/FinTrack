import { Request, Response } from 'express';
import { ApprovalService } from '../services/approval.service';

const approvalService = new ApprovalService();

export class ApprovalController {
  async createApprovalWorkflow(req: Request, res: Response) {
    try {
      const { expenseId, userId, companyId } = req.body;
      
      if (!expenseId || !userId || !companyId) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }
      
      const workflow = await approvalService.createApprovalWorkflow(expenseId, userId, companyId);
      res.json({ success: true, data: workflow });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExpenseApprovals(req: Request, res: Response) {
    try {
      const expenseId = req.params.expenseId;
      const approvals = await approvalService.getExpenseApprovals(expenseId);
      res.json({ success: true, data: approvals });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPendingApprovals(req: Request, res: Response) {
    try {
      const approverId = (req as any).user.userId;
      const companyId = (req as any).user.companyId;
      
      const approvals = await approvalService.getPendingApprovals(approverId, companyId);
      res.json({ success: true, data: approvals });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async approveExpense(req: Request, res: Response) {
    try {
      const actionId = req.params.id;
      const approverId = (req as any).user.userId;
      const { comments } = req.body;
      
      const approval = await approvalService.approveExpense(actionId, approverId, comments);
      res.json({ success: true, data: approval });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async rejectExpense(req: Request, res: Response) {
    try {
      const actionId = req.params.id;
      const approverId = (req as any).user.userId;
      const { comments } = req.body;
      
      if (!comments) {
        return res.status(400).json({ success: false, message: 'Comments are required for rejection' });
      }
      
      const approval = await approvalService.rejectExpense(actionId, approverId, comments);
      res.json({ success: true, data: approval });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getApprovalRules(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      const rules = await approvalService.getApprovalRules(companyId);
      res.json({ success: true, data: rules });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createApprovalRule(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      
      // Only admins can create rules
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      
      const rule = await approvalService.createApprovalRule({
        ...req.body,
        companyId
      });
      res.status(201).json({ success: true, data: rule });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateApprovalRule(req: Request, res: Response) {
    try {
      const ruleId = req.params.id;
      const companyId = (req as any).user.companyId;
      
      // Only admins can update rules
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      
      const rule = await approvalService.updateApprovalRule(ruleId, companyId, req.body);
      res.json({ success: true, data: rule });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getApprovalHistory(req: Request, res: Response) {
    try {
      const expenseId = req.params.expenseId;
      const history = await approvalService.getApprovalHistory(expenseId);
      res.json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
