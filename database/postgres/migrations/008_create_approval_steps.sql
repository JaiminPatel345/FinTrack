-- Create Approval Steps Table
CREATE TABLE IF NOT EXISTS approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_rule_id UUID NOT NULL REFERENCES approval_rules(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    approver_id UUID NOT NULL REFERENCES users(id),
    is_auto_approve BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(approval_rule_id, step_order)
);

CREATE INDEX idx_approval_steps_rule ON approval_steps(approval_rule_id);
CREATE INDEX idx_approval_steps_approver ON approval_steps(approver_id);
CREATE INDEX idx_approval_steps_order ON approval_steps(step_order);
