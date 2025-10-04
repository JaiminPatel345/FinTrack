export interface Country {
  name: string;
  currency: string;
  currencyName: string;
}

export interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  effectiveDate: string;
}

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string;
}

export interface CurrencyConversionResponse {
  convertedAmount: number;
  exchangeRate: number;
}
