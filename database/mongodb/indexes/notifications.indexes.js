// Create indexes for notifications collection
db.notifications.createIndex({ user_id: 1, created_at: -1 });
db.notifications.createIndex({ user_id: 1, is_read: 1 });
db.notifications.createIndex({ company_id: 1, created_at: -1 });
db.notifications.createIndex({ created_at: -1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ entity_type: 1, entity_id: 1 });

// TTL index - automatically delete notifications after expiration
db.notifications.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
