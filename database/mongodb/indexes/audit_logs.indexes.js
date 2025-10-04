// Create indexes for audit_logs collection
db.audit_logs.createIndex({ company_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ user_id: 1, timestamp: -1 });
db.audit_logs.createIndex({ entity_type: 1, entity_id: 1 });
db.audit_logs.createIndex({ entity_id: 1 });
db.audit_logs.createIndex({ timestamp: -1 });
db.audit_logs.createIndex({ action: 1 });
