// MongoDB Collection Schema for Notifications
db.createCollection('notifications', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['company_id', 'user_id', 'type', 'title', 'message', 'channels', 'created_at'],
      properties: {
        company_id: {
          bsonType: 'string',
          description: 'Company UUID - required'
        },
        user_id: {
          bsonType: 'string',
          description: 'User UUID - required'
        },
        type: {
          enum: ['welcome', 'password_reset', 'password_setup', 'expense_submitted', 
                 'approval_pending', 'expense_approved', 'expense_rejected', 'approval_reminder'],
          description: 'Notification type - required'
        },
        title: {
          bsonType: 'string',
          description: 'Notification title - required'
        },
        message: {
          bsonType: 'string',
          description: 'Notification message - required'
        },
        entity_type: {
          bsonType: 'string',
          description: 'Related entity type'
        },
        entity_id: {
          bsonType: 'string',
          description: 'Related entity UUID'
        },
        channels: {
          bsonType: 'array',
          items: {
            enum: ['in_app', 'email']
          },
          description: 'Notification channels - required'
        },
        is_read: {
          bsonType: 'bool',
          description: 'Read status'
        },
        read_at: {
          bsonType: 'date',
          description: 'When notification was read'
        },
        email_sent: {
          bsonType: 'bool',
          description: 'Email delivery status'
        },
        email_sent_at: {
          bsonType: 'date',
          description: 'When email was sent'
        },
        email_error: {
          bsonType: 'string',
          description: 'Email error message if failed'
        },
        priority: {
          enum: ['low', 'medium', 'high'],
          description: 'Notification priority'
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp - required'
        },
        expires_at: {
          bsonType: 'date',
          description: 'Expiration timestamp'
        }
      }
    }
  }
});
