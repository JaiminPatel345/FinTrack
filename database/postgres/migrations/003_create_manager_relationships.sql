-- Create Manager Relationships Table
CREATE TABLE IF NOT EXISTS manager_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, manager_id)
);

CREATE INDEX idx_manager_relationships_employee ON manager_relationships(employee_id);
CREATE INDEX idx_manager_relationships_manager ON manager_relationships(manager_id);
CREATE INDEX idx_manager_relationships_company ON manager_relationships(company_id);
