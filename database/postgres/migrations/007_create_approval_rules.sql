-- Create Approval Rules Table
CREATE TABLE IF NOT EXISTS approval_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES expense_categories(id),
    min_amount DECIMAL(15, 2),
    max_amount DECIMAL(15, 2),
    rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('sequential', 'percentage', 'specific_approver', 'hybrid')),
    is_manager_approver BOOLEAN DEFAULT false,
    percentage_required DECIMAL(5, 2),
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_rules_company ON approval_rules(company_id);
CREATE INDEX idx_approval_rules_category ON approval_rules(category_id);
CREATE INDEX idx_approval_rules_active ON approval_rules(is_active);
CREATE INDEX idx_approval_rules_priority ON approval_rules(priority DESC);
