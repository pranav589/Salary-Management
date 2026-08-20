import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/lib/prisma';

// Mock the prisma singleton
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    employee: {
      findMany: jest.fn(),
    },
    exchangeRate: {
      findMany: jest.fn(),
      findUnique: jest.fn().mockResolvedValue({ currency: 'USD', rateToUsd: 1.0 }),
    },
    country: {
      findUnique: jest.fn().mockResolvedValue({ code: 'US', name: 'United States', currency: 'USD' }),
      findMany: jest.fn().mockResolvedValue([
        { code: 'US', name: 'United States', currency: 'USD' },
        { code: 'IN', name: 'India', currency: 'INR' },
        { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
        { code: 'DE', name: 'Germany', currency: 'EUR' }
      ]),
    },
    department: {
      findUnique: jest.fn().mockResolvedValue({ name: 'Engineering' }),
    },
  },
}));

describe('Analytics API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockActiveEmployees = [
    { name: 'Emp 1', salary: 120000, currency: 'USD', country: 'US', department: 'Engineering' }, // 120k USD/yr -> 10k/mo
    { name: 'Emp 2', salary: 240000, currency: 'USD', country: 'US', department: 'Engineering' }, // 240k USD/yr -> 20k/mo
    { name: 'Emp 3', salary: 1000000, currency: 'INR', country: 'IN', department: 'Sales' }, // 1M INR * 0.012 = 12k USD/yr -> 1k/mo
  ];

  const mockExchangeRates = [
    { currency: 'USD', rateToUsd: 1.0 },
    { currency: 'INR', rateToUsd: 0.012 },
    { currency: 'GBP', rateToUsd: 1.27 },
    { currency: 'EUR', rateToUsd: 1.08 },
  ];

  describe('GET /api/analytics/overview', () => {
    it('should calculate overall statistics (KPI cards) correctly in USD', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockActiveEmployees);
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue(mockExchangeRates);

      const res = await request(app).get('/api/analytics/overview');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({
        totalActiveEmployees: 3,
        // (120k + 240k + 12k) / 12 = 372k / 12 = 31k
        totalMonthlyPayrollUsd: 31000.00,
        // 372k / 3 = 124k
        averageSalaryUsd: 124000.00,
        // Sorted: [12000, 120000, 240000] -> Mid is 120000
        medianSalaryUsd: 120000.00,
      });
    });

    it('should return zeroes if there are no active employees', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue(mockExchangeRates);

      const res = await request(app).get('/api/analytics/overview');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({
        totalActiveEmployees: 0,
        totalMonthlyPayrollUsd: 0,
        averageSalaryUsd: 0,
        medianSalaryUsd: 0,
      });
    });
  });

  describe('GET /api/analytics/by-country', () => {
    it('should aggregate headcount and monthly payroll spend by country', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockActiveEmployees);
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue(mockExchangeRates);
      (prisma.country.findMany as jest.Mock).mockResolvedValue([
        { code: 'US', name: 'United States', currency: 'USD' },
        { code: 'IN', name: 'India', currency: 'INR' },
        { code: 'UK', name: 'United Kingdom', currency: 'GBP' },
        { code: 'DE', name: 'Germany', currency: 'EUR' }
      ]);

      const res = await request(app).get('/api/analytics/by-country');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const usData = res.body.data.find((c: any) => c.country === 'US');
      const inData = res.body.data.find((c: any) => c.country === 'IN');

      expect(usData).toEqual({
        country: 'US',
        headcount: 2,
        totalMonthlyPayrollUsd: 30000.00, // (120k + 240k) / 12 = 30k
        averageSalaryUsd: 180000.00,      // 360k / 2 = 180k
      });

      expect(inData).toEqual({
        country: 'IN',
        headcount: 1,
        totalMonthlyPayrollUsd: 1000.00,  // 12k / 12 = 1k
        averageSalaryUsd: 12000.00,       // 12k / 1 = 12k
      });
    });
  });

  describe('GET /api/analytics/by-department', () => {
    it('should aggregate headcount and monthly payroll spend by department', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockActiveEmployees);
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue(mockExchangeRates);

      const res = await request(app).get('/api/analytics/by-department');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const engData = res.body.data.find((d: any) => d.department === 'Engineering');
      const salesData = res.body.data.find((d: any) => d.department === 'Sales');

      expect(engData).toEqual({
        department: 'Engineering',
        headcount: 2,
        totalMonthlyPayrollUsd: 30000.00, // (120k + 240k) / 12 = 30k
        averageSalaryUsd: 180000.00,
      });

      expect(salesData).toEqual({
        department: 'Sales',
        headcount: 1,
        totalMonthlyPayrollUsd: 1000.00,
        averageSalaryUsd: 12000.00,
      });
    });
  });

  describe('GET /api/analytics/salary-distribution', () => {
    it('should distribute employee salaries into histogram bands correctly', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue(mockActiveEmployees);
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue(mockExchangeRates);

      const res = await request(app).get('/api/analytics/salary-distribution');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      // Expected salaries: 12k (in <$50k), 120k (in $100k-$150k), 240k (in $200k-$250k)
      const lowBand = res.body.data.find((b: any) => b.band === '< $50k');
      const midBand = res.body.data.find((b: any) => b.band === '$100k - $150k');
      const highBand = res.body.data.find((b: any) => b.band === '$200k - $250k');

      expect(lowBand.count).toBe(1);
      expect(midBand.count).toBe(1);
      expect(highBand.count).toBe(1);
    });
  });
});
