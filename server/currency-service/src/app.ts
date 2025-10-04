import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import currencyRoutes from './routes/currency.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'currency-service' });
});

app.use('/api/currency', currencyRoutes);

// Countries endpoint - returns countries with their currencies
app.get('/api/currency/countries', async (req, res) => {
  try {
    // Return common countries with currencies
    const countries = [
      { code: 'US', name: 'United States', currency: 'USD', symbol: '$' },
      { code: 'GB', name: 'United Kingdom', currency: 'GBP', symbol: '£' },
      { code: 'EU', name: 'European Union', currency: 'EUR', symbol: '€' },
      { code: 'IN', name: 'India', currency: 'INR', symbol: '₹' },
      { code: 'CN', name: 'China', currency: 'CNY', symbol: '¥' },
      { code: 'JP', name: 'Japan', currency: 'JPY', symbol: '¥' },
      { code: 'CA', name: 'Canada', currency: 'CAD', symbol: 'C$' },
      { code: 'AU', name: 'Australia', currency: 'AUD', symbol: 'A$' },
      { code: 'SG', name: 'Singapore', currency: 'SGD', symbol: 'S$' },
      { code: 'AE', name: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ' }
    ];
    
    res.status(200).json({
      success: true,
      data: countries
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch countries'
    });
  }
});

// Exchange rates by currency
app.get('/api/currency/rates/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    
    // This should ideally call an external API or database
    // For now, return sample rates
    const rates = {
      base: currency.toUpperCase(),
      rates: {
        'USD': 1.0,
        'EUR': 0.92,
        'GBP': 0.79,
        'INR': 83.12,
        'CNY': 7.24,
        'JPY': 149.50,
        'CAD': 1.36,
        'AUD': 1.53,
        'SGD': 1.34,
        'AED': 3.67
      },
      lastUpdated: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: rates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch exchange rates'
    });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

export default app;
