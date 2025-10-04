import { useEffect, useState } from 'react';
import { currencyService } from '@services/currency.service';
import { Country, CurrencyConversionRequest, CurrencyConversionResponse } from '@types/currency.types';
import { handleApiError } from '@utils/helpers';
import { useNotificationContext } from '@context/NotificationContext';

export const useCurrency = (autoFetch = true) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifyError } = useNotificationContext();

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await currencyService.getCountries();
      setCountries(response.data);
    } catch (err) {
      const message = handleApiError(err);
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = async (
    request: CurrencyConversionRequest
  ): Promise<CurrencyConversionResponse | null> => {
    try {
      const response = await currencyService.convertCurrency(request);
      return response.data;
    } catch (err) {
      notifyError(handleApiError(err));
      return null;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCountries();
    }
  }, [autoFetch]);

  return {
    countries,
    loading,
    error,
    fetchCountries,
    convertCurrency,
  };
};
