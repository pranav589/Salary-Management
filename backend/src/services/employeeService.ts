import { Employee, ExchangeRate } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { convertToUsd } from '../lib/currency';
import { AppError } from '../lib/errors';

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

  const lastNum = parseInt(lastEmployee.employeeId.replace('EMP-', ''), 10);
  const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
  return `EMP-${String(nextNum).padStart(5, '0')}`;
}

interface ListEmployeesOptions {
  page: number;
  limit: number;
  search: string;
  country?: string;
  department?: string;
  employmentType?: string;
  status?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export async function listEmployees(options: ListEmployeesOptions) {
  const { page, limit, search, country, department, employmentType, status, sortBy, sortOrder } = options;
  const offset = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { role: { contains: search } },
    ];
  }

  if (country) where.country = country.toUpperCase();
  if (department) where.department = department;
  if (employmentType) where.employmentType = employmentType.toUpperCase();
  if (status) where.status = status.toUpperCase();

  const [employees, total] = await prisma.$transaction([
    prisma.employee.findMany({
      where,
      orderBy: [
        { [sortBy]: sortOrder },
        { employeeId: 'asc' }
      ],
      skip: offset,
      take: limit,
    }),
    prisma.employee.count({ where }),
  ]);

  const exchangeRates = await prisma.exchangeRate.findMany();
  const ratesMap = exchangeRates.reduce<Record<string, number>>((acc: Record<string, number>, r: ExchangeRate) => {
    acc[r.currency] = r.rateToUsd;
    return acc;
  }, {});

  const formattedEmployees = employees.map((emp: Employee) => {
    const rate = ratesMap[emp.currency] || 1.0;
    const salaryUsd = parseFloat((emp.salary * rate).toFixed(2));
    return {
      ...emp,
      salaryUsd,
    };
  });

  return {
    employees: formattedEmployees,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
}

export async function getEmployee(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const salaryUsd = await convertToUsd(employee.salary, employee.currency);

  return {
    ...employee,
    salaryUsd,
  };
}

export async function createEmployee(data: {
  name: string;
  email: string;
  country: string;
  department: string;
  role: string;
  salary: number;
  currency: string;
  employmentType: string;
  status?: string;
  hireDate: string;
}) {
  const existingEmployee = await prisma.employee.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingEmployee) {
    throw new AppError('An employee with this email address already exists', 409);
  }

  const employeeId = await generateNextEmployeeId();

  const newEmployee = await prisma.employee.create({
    data: {
      employeeId,
      name: data.name,
      email: data.email.toLowerCase(),
      country: data.country.toUpperCase(),
      department: data.department,
      role: data.role,
      salary: data.salary,
      currency: data.currency.toUpperCase(),
      employmentType: data.employmentType.toUpperCase(),
      status: data.status ? data.status.toUpperCase() : 'ACTIVE',
      hireDate: new Date(data.hireDate),
    },
  });

  const salaryUsd = await convertToUsd(newEmployee.salary, newEmployee.currency);

  return {
    ...newEmployee,
    salaryUsd,
  };
}

export async function updateEmployee(id: string, updateData: any) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  if (updateData.email && updateData.email.toLowerCase() !== employee.email) {
    const emailExists = await prisma.employee.findUnique({
      where: { email: updateData.email.toLowerCase() },
    });

    if (emailExists) {
      throw new AppError('An employee with this email address already exists', 409);
    }
  }

  const formattedUpdateData = { ...updateData };
  if (formattedUpdateData.email) formattedUpdateData.email = formattedUpdateData.email.toLowerCase();
  if (formattedUpdateData.country) formattedUpdateData.country = formattedUpdateData.country.toUpperCase();
  if (formattedUpdateData.currency) formattedUpdateData.currency = formattedUpdateData.currency.toUpperCase();
  if (formattedUpdateData.employmentType) formattedUpdateData.employmentType = formattedUpdateData.employmentType.toUpperCase();
  if (formattedUpdateData.status) formattedUpdateData.status = formattedUpdateData.status.toUpperCase();
  if (formattedUpdateData.hireDate) formattedUpdateData.hireDate = new Date(formattedUpdateData.hireDate);

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: formattedUpdateData,
  });

  const salaryUsd = await convertToUsd(updatedEmployee.salary, updatedEmployee.currency);

  return {
    ...updatedEmployee,
    salaryUsd,
  };
}

export async function updateEmployeeStatus(id: string, status: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: { status: status.toUpperCase() },
  });

  const salaryUsd = await convertToUsd(updatedEmployee.salary, updatedEmployee.currency);

  return {
    ...updatedEmployee,
    salaryUsd,
  };
}
