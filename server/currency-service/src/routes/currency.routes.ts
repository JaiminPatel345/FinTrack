import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';

const router = Router();
const currencyController = new CurrencyController();

// Get supported currencies
router.get('/currencies', (req, res) => currencyController.getSupportedCurrencies(req, res));

// Get exchange rates for a base currency
router.get('/rates', (req, res) => currencyController.getExchangeRates(req, res));

// Get specific exchange rate
router.get('/rate', (req, res) => currencyController.getExchangeRate(req, res));

// Convert currency
router.post('/convert', (req, res) => currencyController.convertCurrency(req, res));

// Update exchange rates (Admin only)
router.post('/rates/update', (req, res) => currencyController.updateExchangeRates(req, res));

export default router;
