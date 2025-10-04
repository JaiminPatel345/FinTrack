export interface ExchangeRate {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  effectiveDate: Date;
  createdAt: Date;
}

export interface ConvertCurrencyRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: Date;
}

export interface ConvertCurrencyResponse {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
  exchangeRate: number;
  date: Date;
}

export interface Country {
  name: string;
  currency: string;
  currencyName: string;
  currencySymbol?: string;
}

export interface CurrencyRateApiResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}
