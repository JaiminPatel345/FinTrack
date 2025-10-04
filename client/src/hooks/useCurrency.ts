import { useCallback } from 'react';
import {
  useGetCountriesQuery,
  useConvertCurrencyMutation,
} from '@store/api/currencyApi';
import type { Country, CurrencyConversionRequest, CurrencyConversionResponse } from '@types/currency.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

export const useCurrency = (autoFetch = true) => {
  const { notifyError } = useNotificationContext();
  const { data: countries = [], isLoading, error, refetch } = useGetCountriesQuery(undefined, {
    skip: !autoFetch,
  });

  const [convertCurrencyMutation, { isLoading: isConverting }] = useConvertCurrencyMutation();

  const convertCurrency = useCallback(
    async (request: CurrencyConversionRequest): Promise<CurrencyConversionResponse | null> => {
      try {
        const response = await convertCurrencyMutation(request).unwrap();
        return response;
      } catch (err) {
        notifyError(handleApiError(err));
        return null;
      }
    },
    [convertCurrencyMutation, notifyError],
  );

  return {
    countries: countries as Country[],
    loading: isLoading || isConverting,
    error: error ? handleApiError(error) : null,
    fetchCountries: refetch,
    convertCurrency,
  };
};
