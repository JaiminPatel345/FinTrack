import axios from 'axios';

interface Country {
  name: {
    common: string;
  };
  currencies: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
}

export const countriesService = {
  /**
   * Fetch countries from REST Countries API
   */
  getCountries: async (): Promise<{ name: string; currency: string; currencyName: string }[]> => {
    try {
      const response = await axios.get<Country[]>(
        'https://restcountries.com/v3.1/all?fields=name,currencies'
      );

      return response.data
        .map((country) => {
          const currencyCode = Object.keys(country.currencies || {})[0];
          const currency = country.currencies?.[currencyCode];
          
          return {
            name: country.name.common,
            currency: currencyCode || '',
            currencyName: currency?.name || '',
          };
        })
        .filter((country) => country.currency) // Filter out countries without currency
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },
};
