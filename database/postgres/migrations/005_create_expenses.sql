-- Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    description TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL,
    converted_amount DECIMAL(15, 2),
    company_currency VARCHAR(3),
    exchange_rate DECIMAL(15, 6),
    expense_date DATE NOT NULL,
    paid_by VARCHAR(50) NOT NULL CHECK (paid_by IN ('cash', 'credit_card', 'debit_card', 'company_card', 'upi', 'net_banking', 'other')),
    gst_percentage DECIMAL(5, 2) DEFAULT 0,
    gst_amount DECIMAL(15, 2) DEFAULT 0,
    remarks TEXT,
    receipt_url TEXT,
    receipt_public_id TEXT,
    ocr_processed BOOLEAN DEFAULT false,
    ocr_confidence DECIMAL(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pending_approval', 'approved', 'rejected')),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_company ON expenses(company_id);
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_submitted_at ON expenses(submitted_at);
