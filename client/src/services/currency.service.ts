import api from './api';
import { Country, CurrencyConversionRequest, CurrencyConversionResponse } from '@types/currency.types';

export const currencyService = {
  // Get all countries with currencies
  getCountries: async (): Promise<{ data: Country[] }> => {
    const response = await api.get('/currency/countries');
    return response.data;
  },

  // Convert currency
  convertCurrency: async (data: CurrencyConversionRequest): Promise<{ data: CurrencyConversionResponse }> => {
    const response = await api.post('/currency/convert', data);
    return response.data;
  },

  // Get exchange rates for base currency
  getExchangeRates: async (baseCurrency: string) => {
    const response = await api.get(`/currency/rates/${baseCurrency}`);
    return response.data;
  },
};
