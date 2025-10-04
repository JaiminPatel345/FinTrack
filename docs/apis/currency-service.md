# Currency Service API Documentation

Base URL: `/currency` (via API Gateway at `http://localhost:5000`)

All endpoints require authentication.

## Endpoints

### 1. Get Supported Currencies

Get list of all supported currencies.

**Endpoint:** `GET /currency/currencies`

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": ["USD", "EUR", "GBP", "INR", "JPY"]
}
```

---

### 2. Get Exchange Rates

Get all exchange rates for a base currency.

**Endpoint:** `GET /currency/rates?baseCurrency=USD`

**Authentication:** Required

**Query Parameters:**
- `baseCurrency` (string): Base currency code (e.g., USD, EUR)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "from_currency": "USD",
      "to_currency": "EUR",
      "rate": 0.92,
      "date": "2024-10-04",
      "source": "manual",
      "created_at": "2024-10-04T10:00:00.000Z"
    },
    {
      "id": 2,
      "from_currency": "USD",
      "to_currency": "GBP",
      "rate": 0.79,
      "date": "2024-10-04",
      "source": "manual",
      "created_at": "2024-10-04T10:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Base currency is required"
}
```

---

### 3. Get Specific Exchange Rate

Get exchange rate between two currencies.

**Endpoint:** `GET /currency/rate?from=USD&to=EUR`

**Authentication:** Required

**Query Parameters:**
- `from` (string): From currency code
- `to` (string): To currency code

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "from_currency": "USD",
    "to_currency": "EUR",
    "rate": 0.92,
    "date": "2024-10-04",
    "source": "manual",
    "created_at": "2024-10-04T10:00:00.000Z",
    "updated_at": "2024-10-04T10:00:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "From and to currencies are required"
}
```

404 Not Found:
```json
{
  "success": false,
  "message": "Exchange rate not found"
}
```

---

### 4. Convert Currency

Convert amount from one currency to another.

**Endpoint:** `POST /currency/convert`

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 100.00,
  "from": "USD",
  "to": "EUR"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "amount": 100.00,
    "convertedAmount": 92.00,
    "rate": 0.92,
    "fromCurrency": "USD",
    "toCurrency": "EUR",
    "date": "2024-10-04"
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "success": false,
  "message": "Amount, from, and to currencies are required"
}
```

500 Internal Server Error:
```json
{
  "success": false,
  "message": "Exchange rate not found for USD to EUR"
}
```

---

### 5. Update Exchange Rates (Admin Only)

Manually update exchange rates.

**Endpoint:** `POST /currency/rates/update`

**Authentication:** Required (Admin role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Exchange rates updated"
  }
}
```

**Error Responses:**

403 Forbidden:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## Data Models

### Exchange Rate Object
```typescript
{
  id: number;
  from_currency: string;
  to_currency: string;
  rate: number;
  date: string;
  source: string;
  created_at: string;
  updated_at?: string;
}
```

### Conversion Result Object
```typescript
{
  amount: number;
  convertedAmount: number;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
  date: string;
}
```

## Notes

- Exchange rates are updated daily
- Conversions use the most recent available rate
- Same currency conversions return rate of 1.0
- Admin users can manually trigger rate updates
