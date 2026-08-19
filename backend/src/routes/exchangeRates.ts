import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { syncExchangeRates } from '../services/exchangeRateService';

const router = Router();

// GET /api/exchange-rates - get current rates
router.get('/', async (req, res, next) => {
  try {
    const rates = await prisma.exchangeRate.findMany({
      orderBy: { currency: 'asc' },
    });
    res.status(200).json({
      success: true,
      data: rates,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/exchange-rates/sync - manual trigger to sync rates
router.post('/sync', async (req, res, next) => {
  try {
    const rates = await syncExchangeRates();
    res.status(200).json({
      success: true,
      message: 'Exchange rates synced successfully from live API',
      data: rates,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
