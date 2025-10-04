// MongoDB Collection Schema for Audit Logs
db.createCollection('audit_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['company_id', 'user_id', 'entity_type', 'entity_id', 'action', 'timestamp'],
      properties: {
        company_id: {
          bsonType: 'string',
          description: 'Company UUID - required'
        },
        user_id: {
          bsonType: 'string',
          description: 'User UUID - required'
        },
        entity_type: {
          enum: ['expense', 'user', 'approval', 'company', 'category'],
          description: 'Type of entity - required'
        },
        entity_id: {
          bsonType: 'string',
          description: 'Entity UUID - required'
        },
        action: {
          enum: ['create', 'update', 'delete', 'approve', 'reject', 'submit'],
          description: 'Action performed - required'
        },
        changes: {
          bsonType: 'object',
          description: 'Object containing field changes'
        },
        ip_address: {
          bsonType: 'string',
          description: 'IP address of the request'
        },
        user_agent: {
          bsonType: 'string',
          description: 'User agent string'
        },
        timestamp: {
          bsonType: 'date',
          description: 'Timestamp of the action - required'
        },
        metadata: {
          bsonType: 'object',
          description: 'Additional metadata'
        }
      }
    }
  }
});
