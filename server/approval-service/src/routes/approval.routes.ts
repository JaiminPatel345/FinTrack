import { Router } from 'express';
import { ApprovalController } from '../controllers/approval.controller';

const router = Router();
const approvalController = new ApprovalController();

// Create approval workflow for expense (called by expense service)
router.post('/create-workflow', (req, res) => approvalController.createApprovalWorkflow(req, res));

// Get pending approvals for logged-in user
router.get('/pending', (req, res) => approvalController.getPendingApprovals(req, res));

// Get all approvals for an expense
router.get('/expense/:expenseId', (req, res) => approvalController.getExpenseApprovals(req, res));

// Get approval history for an expense
router.get('/expense/:expenseId/history', (req, res) => approvalController.getApprovalHistory(req, res));

// Approve an expense
router.post('/:id/approve', (req, res) => approvalController.approveExpense(req, res));

// Reject an expense
router.post('/:id/reject', (req, res) => approvalController.rejectExpense(req, res));

// Approval Rules (Admin only)
router.get('/rules', (req, res) => approvalController.getApprovalRules(req, res));
router.post('/rules', (req, res) => approvalController.createApprovalRule(req, res));
router.put('/rules/:id', (req, res) => approvalController.updateApprovalRule(req, res));

export default router;
