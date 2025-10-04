-- Create Approval Actions Table
CREATE TABLE IF NOT EXISTS approval_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_approval_id UUID NOT NULL REFERENCES expense_approvals(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    approver_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (action IN ('pending', 'approved', 'rejected')),
    comments TEXT,
    action_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_actions_expense_approval ON approval_actions(expense_approval_id);
CREATE INDEX idx_approval_actions_approver ON approval_actions(approver_id);
CREATE INDEX idx_approval_actions_action ON approval_actions(action);
CREATE INDEX idx_approval_actions_step_order ON approval_actions(step_order);
