import request from 'supertest';
import app from '../../src/app';
import { prisma } from '../../src/lib/prisma';

// Mock the prisma singleton
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    $transaction: jest.fn((promises) => Promise.all(promises)),
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    exchangeRate: {
      findMany: jest.fn(),
      findUnique: jest.fn().mockResolvedValue({ currency: 'USD', rateToUsd: 1.0 }),
    },
    country: {
      findUnique: jest.fn().mockResolvedValue({ code: 'US', name: 'United States', currency: 'USD' }),
    },
    department: {
      findUnique: jest.fn().mockResolvedValue({ name: 'Engineering' }),
    },
  },
}));

describe('Employee API Routes', () => {
  beforeEach(() => {
    (prisma.country.findUnique as jest.Mock).mockResolvedValue({ code: 'US', name: 'United States', currency: 'USD' });
    (prisma.department.findUnique as jest.Mock).mockResolvedValue({ name: 'Engineering' });
    (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({ currency: 'USD', rateToUsd: 1.0 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockEmployee = {
    id: 'test-uuid-1',
    employeeId: 'EMP-00001',
    name: 'Alice Smith',
    email: 'alice@example.com',
    country: 'US',
    department: 'Engineering',
    role: 'Software Engineer',
    salary: 100000,
    currency: 'USD',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    hireDate: new Date('2024-01-10T00:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('GET /api/employees', () => {
    it('should return a paginated list of employees with normalized USD salaries', async () => {
      // Mock db response
      (prisma.$transaction as jest.Mock).mockResolvedValue([[mockEmployee], 1]);
      (prisma.exchangeRate.findMany as jest.Mock).mockResolvedValue([
        { currency: 'USD', rateToUsd: 1.0 },
      ]);

      const res = await request(app).get('/api/employees?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].salaryUsd).toBe(100000);
      expect(res.body.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      });
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return a single employee details', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(mockEmployee);
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({
        currency: 'USD',
        rateToUsd: 1.0,
      });

      const res = await request(app).get('/api/employees/test-uuid-1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alice Smith');
      expect(res.body.data.salaryUsd).toBe(100000);
    });

    it('should return 404 if employee is not found', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/api/employees/non-existent-id');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Employee not found');
    });
  });

  describe('POST /api/employees', () => {
    const validPayload = {
      name: 'Bob Jones',
      email: 'bob@example.com',
      country: 'IN',
      department: 'Sales',
      role: 'Sales Executive',
      salary: 1200000,
      currency: 'INR',
      employmentType: 'FULL_TIME',
      status: 'ACTIVE',
      hireDate: '2024-02-15T00:00:00.000Z',
    };

    it('should create a new employee with valid payload', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null); // No existing email
      (prisma.employee.findFirst as jest.Mock).mockResolvedValue({ employeeId: 'EMP-00042' }); // Previous max ID
      (prisma.employee.create as jest.Mock).mockResolvedValue({
        ...validPayload,
        id: 'new-uuid',
        employeeId: 'EMP-00043',
        hireDate: new Date(validPayload.hireDate),
      });
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({
        currency: 'INR',
        rateToUsd: 0.012,
      });

      const res = await request(app).post('/api/employees').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.employeeId).toBe('EMP-00043');
      expect(res.body.data.salaryUsd).toBe(14400); // 1,200,000 * 0.012
    });

    it('should return 400 validation error if payload is invalid', async () => {
      const invalidPayload = { ...validPayload, email: 'not-an-email' };

      const res = await request(app).post('/api/employees').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('Validation failed');
      expect(res.body.error.details[0].field).toBe('email');
    });

    it('should return 409 conflict if email already exists', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(mockEmployee); // Email exists

      const res = await request(app).post('/api/employees').send(validPayload);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toBe('An employee with this email address already exists');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update employee details', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(mockEmployee);
      (prisma.employee.update as jest.Mock).mockResolvedValue({
        ...mockEmployee,
        role: 'Senior Software Engineer',
        salary: 120000,
      });
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({
        currency: 'USD',
        rateToUsd: 1.0,
      });

      const res = await request(app)
        .put('/api/employees/test-uuid-1')
        .send({ role: 'Senior Software Engineer', salary: 120000 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('Senior Software Engineer');
      expect(res.body.data.salary).toBe(120000);
    });
  });

  describe('PATCH /api/employees/:id/status', () => {
    it('should update employee status', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(mockEmployee);
      (prisma.employee.update as jest.Mock).mockResolvedValue({
        ...mockEmployee,
        status: 'INACTIVE',
      });
      (prisma.exchangeRate.findUnique as jest.Mock).mockResolvedValue({
        currency: 'USD',
        rateToUsd: 1.0,
      });

      const res = await request(app)
        .patch('/api/employees/test-uuid-1/status')
        .send({ status: 'INACTIVE' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('INACTIVE');
    });
  });
});
