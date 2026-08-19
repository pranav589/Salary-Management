import { convertToUsd, getExchangeRatesMap } from '../../src/lib/currency';
import { prisma } from '../../src/lib/prisma';

// Mock the prisma singleton
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    exchangeRate: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    country: {
      findUnique: jest.fn().mockResolvedValue({ code: 'US', name: 'United States', currency: 'USD' }),
    },
    department: {
      findUnique: jest.fn().mockResolvedValue({ name: 'Engineering' }),
    },
  },
}));

describe('Currency Conversion Lib', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('convertToUsd', () => {
    it('should return the original amount if currency is USD', async () => {
      const result = await convertToUsd(150.50, 'USD');
      expect(result).toBe(150.50);
      expect(prisma.exchangeRate.findUnique).not.toHaveBeenCalled();
    });

    it('should convert local currency to USD using rate from database', async () => {
      // Mock findUnique to return rate for INR (1 INR = 0.012 USD)
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({
        currency: 'INR',
        rateToUsd: 0.012,
      });

      const result = await convertToUsd(1000, 'INR');
      expect(result).toBe(12.00); // 1000 * 0.012 = 12
      expect(prisma.exchangeRate.findUnique).toHaveBeenCalledWith({
        where: { currency: 'INR' },
      });
    });

    it('should round the converted amount to 2 decimal places', async () => {
      // Mock findUnique to return rate for GBP (1 GBP = 1.27 USD)
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({
        currency: 'GBP',
        rateToUsd: 1.27,
      });

      const result = await convertToUsd(123.45, 'GBP');
      // 123.45 * 1.27 = 156.7815 -> rounded to 156.78
      expect(result).toBe(156.78);
    });

    it('should throw an error if the currency exchange rate is not found', async () => {
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(convertToUsd(100, 'XYZ')).rejects.toThrow(
        'Exchange rate not found for currency: XYZ'
      );
    });
  });

  describe('getExchangeRatesMap', () => {
    it('should return a key-value mapping of currencies to exchange rates', async () => {
      const mockRates = [
        { currency: 'USD', rateToUsd: 1.0 },
        { currency: 'INR', rateToUsd: 0.012 },
        { currency: 'GBP', rateToUsd: 1.27 },
        { currency: 'EUR', rateToUsd: 1.08 },
      ];
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue(mockRates);

      const map = await getExchangeRatesMap();

      expect(map).toEqual({
        USD: 1.0,
        INR: 0.012,
        GBP: 1.27,
        EUR: 1.08,
      });
      expect(prisma.exchangeRate.findMany).toHaveBeenCalled();
    });
  });
});
