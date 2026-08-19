import { Request, Response, NextFunction } from 'express';
import { Employee, ExchangeRate } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { convertToUsd } from '../lib/currency';

/**
 * Helper to generate the next sequential employee ID (e.g. EMP-10001)
 */
async function generateNextEmployeeId(): Promise<string> {
  const lastEmployee = await prisma.employee.findFirst({
    orderBy: { employeeId: 'desc' },
  });

  if (!lastEmployee) {
    return 'EMP-00001';
  }

  // Extract the number from EMP-XXXXX
  const lastNum = parseInt(lastEmployee.employeeId.replace('EMP-', ''), 10);
  const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
  return `EMP-${String(nextNum).padStart(5, '0')}`;
}

/**
 * List employees with search, filter, pagination, and sorting
 */
export async function listEmployees(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const search = (req.query.search as string) || '';
    const country = req.query.country as string;
    const department = req.query.department as string;
    const employmentType = req.query.employmentType as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    const offset = (page - 1) * limit;

    // Build Prisma query filters
    const where: any = {};

    // Global text search across name, email, and role
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { role: { contains: search } },
      ];
    }

    // Exact matches for filters
    if (country) where.country = country.toUpperCase();
    if (department) where.department = department;
    if (employmentType) where.employmentType = employmentType.toUpperCase();
    if (status) where.status = status.toUpperCase();

    // Query DB
    const [employees, total] = await prisma.$transaction([
      prisma.employee.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    // Fetch exchange rates map to convert salaries in-memory for pagination efficiency
    const exchangeRates = await prisma.exchangeRate.findMany();
    const ratesMap = exchangeRates.reduce<Record<string, number>>((acc: Record<string, number>, r: ExchangeRate) => {
      acc[r.currency] = r.rateToUsd;
      return acc;
    }, {});

    // Add USD equivalent salary to each employee
    const formattedEmployees = employees.map((emp: Employee) => {
      const rate = ratesMap[emp.currency] || 1.0;
      const salaryUsd = parseFloat((emp.salary * rate).toFixed(2));
      return {
        ...emp,
        salaryUsd,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedEmployees,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single employee details
 */
export async function getEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Employee not found',
          status: 404,
        },
      });
    }

    const salaryUsd = await convertToUsd(employee.salary, employee.currency);

    res.status(200).json({
      success: true,
      data: {
        ...employee,
        salaryUsd,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new employee
 */
export async function createEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, country, department, role, salary, currency, employmentType, status, hireDate } = req.body;

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'An employee with this email address already exists',
          status: 409,
        },
      });
    }

    const employeeId = await generateNextEmployeeId();

    const newEmployee = await prisma.employee.create({
      data: {
        employeeId,
        name,
        email: email.toLowerCase(),
        country: country.toUpperCase(),
        department,
        role,
        salary,
        currency: currency.toUpperCase(),
        employmentType: employmentType.toUpperCase(),
        status: status ? status.toUpperCase() : 'ACTIVE',
        hireDate: new Date(hireDate),
      },
    });

    const salaryUsd = await convertToUsd(newEmployee.salary, newEmployee.currency);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        ...newEmployee,
        salaryUsd,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update an existing employee details
 */
export async function updateEmployee(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Employee not found',
          status: 404,
        },
      });
    }

    // Check if email belongs to someone else
    if (updateData.email && updateData.email.toLowerCase() !== employee.email) {
      const emailExists = await prisma.employee.findUnique({
        where: { email: updateData.email.toLowerCase() },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'An employee with this email address already exists',
            status: 409,
          },
        });
      }
    }

    // Format body items before query
    if (updateData.email) updateData.email = updateData.email.toLowerCase();
    if (updateData.country) updateData.country = updateData.country.toUpperCase();
    if (updateData.currency) updateData.currency = updateData.currency.toUpperCase();
    if (updateData.employmentType) updateData.employmentType = updateData.employmentType.toUpperCase();
    if (updateData.status) updateData.status = updateData.status.toUpperCase();
    if (updateData.hireDate) updateData.hireDate = new Date(updateData.hireDate);

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    const salaryUsd = await convertToUsd(updatedEmployee.salary, updatedEmployee.currency);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: {
        ...updatedEmployee,
        salaryUsd,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update employee status (Soft deactivation)
 */
export async function updateEmployeeStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Employee not found',
          status: 404,
        },
      });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { status: status.toUpperCase() },
    });

    const salaryUsd = await convertToUsd(updatedEmployee.salary, updatedEmployee.currency);

    res.status(200).json({
      success: true,
      message: `Employee status updated to ${status}`,
      data: {
        ...updatedEmployee,
        salaryUsd,
      },
    });
  } catch (error) {
    next(error);
  }
}
