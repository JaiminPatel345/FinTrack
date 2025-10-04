-- Add unique constraint to ensure only one admin per company
-- This partial unique index only applies when role='admin' AND is_active=true
CREATE UNIQUE INDEX idx_unique_admin_per_company 
ON users (company_id) 
WHERE role = 'admin' AND is_active = true;

-- Add comment for documentation
COMMENT ON INDEX idx_unique_admin_per_company IS 'Ensures only one active admin exists per company';
