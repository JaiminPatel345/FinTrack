// MongoDB Collection Schema for OCR Results
db.createCollection('ocr_results', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['expense_id', 'company_id', 'user_id', 'receipt_url', 'ocr_status'],
      properties: {
        expense_id: {
          bsonType: 'string',
          description: 'Expense UUID - required'
        },
        company_id: {
          bsonType: 'string',
          description: 'Company UUID - required'
        },
        user_id: {
          bsonType: 'string',
          description: 'User UUID - required'
        },
        receipt_url: {
          bsonType: 'string',
          description: 'URL of the receipt image - required'
        },
        file_name: {
          bsonType: 'string'
        },
        file_size: {
          bsonType: 'number'
        },
        ocr_status: {
          enum: ['pending', 'processing', 'completed', 'failed'],
          description: 'Status of OCR processing - required'
        },
        ocr_provider: {
          enum: ['tesseract', 'easyocr'],
          description: 'OCR provider used'
        },
        extracted_data: {
          bsonType: 'object',
          properties: {
            vendor_name: { bsonType: 'string' },
            vendor_address: { bsonType: 'string' },
            date: { bsonType: 'string' },
            total_amount: { bsonType: 'number' },
            currency: { bsonType: 'string' },
            tax_amount: { bsonType: 'number' },
            line_items: { bsonType: 'array' },
            payment_method: { bsonType: 'string' },
            receipt_number: { bsonType: 'string' }
          }
        },
        confidence_scores: {
          bsonType: 'object',
          properties: {
            overall: { bsonType: 'number' },
            vendor_name: { bsonType: 'number' },
            date: { bsonType: 'number' },
            amount: { bsonType: 'number' }
          }
        },
        raw_text: {
          bsonType: 'string'
        },
        processing_time_ms: {
          bsonType: 'number'
        },
        processed_at: {
          bsonType: 'date'
        },
        created_at: {
          bsonType: 'date'
        }
      }
    }
  }
});
