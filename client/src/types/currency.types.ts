export interface ExchangeRate {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  effectiveDate: string;
  source: string;
  createdAt: string;
}

export interface ConvertCurrencyRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string;
}

export interface ConvertCurrencyResponse {
  convertedAmount: number;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
  date: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}
