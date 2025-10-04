import { ApiResponse } from '@types/common.types';
import {
  Country,
  CurrencyConversionRequest,
  CurrencyConversionResponse,
  ExchangeRate,
} from '@types/currency.types';
import { baseApi } from './baseApi';

type CountriesResponse = ApiResponse<Country[]>;
type ConversionResponse = ApiResponse<CurrencyConversionResponse>;
type RatesResponse = ApiResponse<{ rates: ExchangeRate[] }>;

export const currencyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query<Country[], void>({
      query: () => ({
        url: '/currency/countries',
        method: 'GET',
      }),
      transformResponse: (response: CountriesResponse) => response.data,
      providesTags: [{ type: 'Currency', id: 'COUNTRIES' }],
    }),
    convertCurrency: build.mutation<CurrencyConversionResponse, CurrencyConversionRequest>({
      query: (body) => ({
        url: '/currency/convert',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ConversionResponse) => response.data,
    }),
    getExchangeRates: build.query<ExchangeRate[], string>({
      query: (baseCurrency) => ({
        url: `/currency/rates/${baseCurrency}`,
        method: 'GET',
      }),
      transformResponse: (response: RatesResponse) => response.data.rates,
      providesTags: (_result, _error, baseCurrency) => [{ type: 'Currency', id: baseCurrency }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCountriesQuery,
  useConvertCurrencyMutation,
  useGetExchangeRatesQuery,
} = currencyApi;
