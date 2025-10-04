// Create indexes for ocr_results collection
db.ocr_results.createIndex({ expense_id: 1 }, { unique: true });
db.ocr_results.createIndex({ company_id: 1, created_at: -1 });
db.ocr_results.createIndex({ user_id: 1 });
db.ocr_results.createIndex({ ocr_status: 1 });
db.ocr_results.createIndex({ created_at: -1 });
