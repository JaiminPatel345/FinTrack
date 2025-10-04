import apiClient from './apiClient';
import type { ExchangeRate, ConvertCurrencyRequest } from '../types/currency.types';

export const currencyService = {
  /**
   * Get all currencies
   */
  getCurrencies: async (): Promise<string[]> => {
    const response = await apiClient.get<{ data: string[] }>('/api/currency/currencies');
    return response.data.data;
  },

  /**
   * Get exchange rates
   */
  getExchangeRates: async (baseCurrency: string): Promise<ExchangeRate[]> => {
    const response = await apiClient.get<{ data: ExchangeRate[] }>(`/api/currency/rates/${baseCurrency}`);
    return response.data.data;
  },

  /**
   * Convert currency
   */
  convert: async (data: ConvertCurrencyRequest): Promise<{ convertedAmount: number; rate: number }> => {
    const response = await apiClient.post<{ data: { convertedAmount: number; rate: number } }>('/api/currency/convert', data);
    return response.data.data;
  },

  /**
   * Get latest exchange rate
   */
  getRate: async (fromCurrency: string, toCurrency: string): Promise<ExchangeRate> => {
    const response = await apiClient.get<{ data: ExchangeRate }>(`/api/currency/rate/${fromCurrency}/${toCurrency}`);
    return response.data.data;
  },
};
