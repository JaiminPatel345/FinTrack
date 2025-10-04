-- Create Expense Approvals Table
CREATE TABLE IF NOT EXISTS expense_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    approval_rule_id UUID NOT NULL REFERENCES approval_rules(id),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    total_steps INTEGER NOT NULL,
    current_step INTEGER DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    UNIQUE(expense_id)
);

CREATE INDEX idx_expense_approvals_expense ON expense_approvals(expense_id);
CREATE INDEX idx_expense_approvals_rule ON expense_approvals(approval_rule_id);
CREATE INDEX idx_expense_approvals_company ON expense_approvals(company_id);
CREATE INDEX idx_expense_approvals_status ON expense_approvals(status);
