# OCR Service API Documentation

Base URL: `/ocr` (Port 5006, Python/Flask service)

All endpoints require authentication.

## Endpoints

### 1. Process Receipt

Upload and process a receipt image using OCR.

**Endpoint:** `POST /api/ocr/process`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file`: Receipt image file (JPEG, PNG, PDF)

**Example using cURL:**
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/receipt.jpg" \
  http://localhost:5006/api/ocr/process
```

**Example using JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:5006/api/ocr/process', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "merchant": "Starbucks Coffee",
    "date": "2024-10-04",
    "total": 125.50,
    "currency": "USD",
    "items": [
      {
        "description": "Grande Latte",
        "amount": 5.25
      },
      {
        "description": "Croissant",
        "amount": 3.50
      }
    ],
    "confidence": 0.95
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "No file provided"
}
```

400 Bad Request:
```json
{
  "success": false,
  "message": "Invalid file format. Supported: JPEG, PNG, PDF"
}
```

500 Internal Server Error:
```json
{
  "success": false,
  "message": "OCR processing failed: <error details>"
}
```

---

### 2. Get OCR Result

Retrieve a previously processed OCR result.

**Endpoint:** `GET /api/ocr/results/:resultId`

**Authentication:** Required

**URL Parameters:**
- `resultId` (string): OCR result ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "6527a1b2c3d4e5f6a7b8c9d0",
    "userId": 1,
    "merchant": "Starbucks Coffee",
    "date": "2024-10-04",
    "total": 125.50,
    "currency": "USD",
    "items": [
      {
        "description": "Grande Latte",
        "amount": 5.25
      }
    ],
    "confidence": 0.95,
    "status": "completed",
    "processedAt": "2024-10-04T12:00:00.000Z"
  }
}
```

**Error Responses:**

404 Not Found:
```json
{
  "success": false,
  "message": "OCR result not found"
}
```

---

### 3. Health Check

Check if OCR service is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "status": "healthy",
  "service": "ocr-service"
}
```

---

## Supported File Formats

- **JPEG/JPG** - Recommended for photos
- **PNG** - Recommended for scanned documents
- **PDF** - Single page receipts (first page only)

## File Size Limits

- Maximum file size: 10MB
- Recommended: Under 5MB for faster processing
- Images will be automatically resized if too large

## OCR Confidence Scores

The `confidence` field indicates OCR accuracy:

- **0.95 - 1.00**: Excellent - Data highly reliable
- **0.85 - 0.94**: Good - Data reliable with minor uncertainties
- **0.70 - 0.84**: Fair - Review recommended
- **Below 0.70**: Poor - Manual review required

## Best Practices for Receipt Images

1. **Lighting**: Ensure good lighting, avoid shadows
2. **Angle**: Take photo straight-on, not at an angle
3. **Focus**: Make sure text is clear and in focus
4. **Completeness**: Capture entire receipt including totals
5. **Resolution**: Higher resolution = better accuracy

## Data Extraction Fields

The OCR service attempts to extract:

- **Merchant Name**: Business/store name
- **Date**: Transaction date
- **Total Amount**: Final total with tax
- **Currency**: Currency code (USD, EUR, etc.)
- **Line Items**: Individual items with descriptions and amounts
- **Tax Amount**: Tax if separately shown
- **Payment Method**: Cash, card, etc. (if visible)

## Error Handling

Common error scenarios:

1. **Image too blurry**: Return low confidence score
2. **Receipt damaged**: Partial data extraction
3. **Non-receipt image**: Error message
4. **Unsupported language**: Currently supports English only

## Integration with Expense Service

Typical workflow:

1. User uploads receipt via frontend
2. Frontend calls OCR service
3. OCR extracts data
4. Frontend pre-fills expense form with OCR data
5. User reviews/edits and submits expense

---

## Data Models

### OCR Result Object
```typescript
{
  id: string;
  userId: number;
  merchant: string;
  date: string;  // ISO date format
  total: number;
  currency: string;
  items: Array<{
    description: string;
    amount: number;
    quantity?: number;
  }>;
  taxAmount?: number;
  paymentMethod?: string;
  confidence: number;  // 0.0 to 1.0
  status: 'processing' | 'completed' | 'failed';
  processedAt: string;
  imageUrl?: string;
}
```

---

## Technology Stack

- **Python 3.11**
- **Flask** - Web framework
- **Tesseract OCR** - OCR engine
- **Pillow** - Image processing
- **MongoDB** - Results storage

## Future Enhancements

- Multi-page PDF support
- Multiple language support
- Machine learning for better accuracy
- Receipt categorization
- Duplicate detection
- Batch processing
