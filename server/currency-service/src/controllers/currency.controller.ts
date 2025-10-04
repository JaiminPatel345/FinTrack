import { Request, Response } from 'express';
import { CurrencyService } from '../services/currency.service';

const currencyService = new CurrencyService();

export class CurrencyController {
  async getExchangeRates(req: Request, res: Response) {
    try {
      const { baseCurrency } = req.query;
      
      if (!baseCurrency) {
        return res.status(400).json({ success: false, message: 'Base currency is required' });
      }
      
      const rates = await currencyService.getExchangeRates(baseCurrency as string);
      res.json({ success: true, data: rates });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExchangeRate(req: Request, res: Response) {
    try {
      const { from, to } = req.query;
      
      if (!from || !to) {
        return res.status(400).json({ success: false, message: 'From and to currencies are required' });
      }
      
      const rate = await currencyService.getExchangeRate(from as string, to as string);
      
      if (!rate) {
        return res.status(404).json({ success: false, message: 'Exchange rate not found' });
      }
      
      res.json({ success: true, data: rate });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async convertCurrency(req: Request, res: Response) {
    try {
      const { amount, from, to } = req.body;
      
      if (!amount || !from || !to) {
        return res.status(400).json({ success: false, message: 'Amount, from, and to currencies are required' });
      }
      
      const result = await currencyService.convertCurrency(parseFloat(amount), from, to);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateExchangeRates(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId;
      
      // Only admins can update rates
      if ((req as any).user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      
      const result = await currencyService.updateExchangeRates(companyId);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getSupportedCurrencies(req: Request, res: Response) {
    try {
      const currencies = await currencyService.getSupportedCurrencies();
      res.json({ success: true, data: currencies });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
