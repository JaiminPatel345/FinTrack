import pool from '../config/database';
import axios from 'axios';

export class CurrencyService {
  async getExchangeRates(baseCurrency: string) {
    const result = await pool.query(
      `SELECT * FROM exchange_rates WHERE from_currency = $1 AND date = CURRENT_DATE ORDER BY to_currency`,
      [baseCurrency]
    );
    return result.rows;
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    const result = await pool.query(
      `SELECT * FROM exchange_rates 
       WHERE from_currency = $1 AND to_currency = $2 
       ORDER BY date DESC LIMIT 1`,
      [fromCurrency, toCurrency]
    );
    return result.rows[0];
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string) {
    if (fromCurrency === toCurrency) {
      return { amount, convertedAmount: amount, rate: 1, fromCurrency, toCurrency };
    }

    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    const convertedAmount = amount * rate.rate;

    return {
      amount,
      convertedAmount: parseFloat(convertedAmount.toFixed(2)),
      rate: rate.rate,
      fromCurrency,
      toCurrency,
      date: rate.date
    };
  }

  async updateExchangeRates(companyId: number) {
    // In a real application, this would fetch from an external API
    // For now, we'll just update with mock data or maintain existing rates
    const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
    const baseRates: any = {
      'USD_EUR': 0.92,
      'USD_GBP': 0.79,
      'USD_INR': 83.12,
      'USD_JPY': 149.50,
      'EUR_USD': 1.09,
      'EUR_GBP': 0.86,
      'EUR_INR': 90.35,
      'EUR_JPY': 162.50,
      'GBP_USD': 1.27,
      'GBP_EUR': 1.16,
      'GBP_INR': 105.42,
      'GBP_JPY': 189.50,
    };

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      for (const from of currencies) {
        for (const to of currencies) {
          if (from !== to) {
            const key = `${from}_${to}`;
            const rate = baseRates[key] || (1 / (baseRates[`${to}_${from}`] || 1));

            await client.query(
              `INSERT INTO exchange_rates (from_currency, to_currency, rate, date, source)
               VALUES ($1, $2, $3, CURRENT_DATE, 'manual')
               ON CONFLICT (from_currency, to_currency, date) 
               DO UPDATE SET rate = $3, updated_at = CURRENT_TIMESTAMP`,
              [from, to, rate]
            );
          }
        }
      }

      await client.query('COMMIT');
      return { success: true, message: 'Exchange rates updated' };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getSupportedCurrencies() {
    const result = await pool.query(
      `SELECT DISTINCT from_currency as currency FROM exchange_rates 
       UNION 
       SELECT DISTINCT to_currency FROM exchange_rates
       ORDER BY currency`
    );
    return result.rows.map(r => r.currency);
  }
}
