import { z } from 'zod';
import { prisma } from '../lib/prisma';

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'] as const;
const STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required').transform((val) => val.toUpperCase())
    .refine(async (val) => {
      const country = await prisma.country.findUnique({ where: { code: val } });
      return !!country;
    }, { message: 'Country configuration not found' }),
  department: z.string().min(1, 'Department is required')
    .refine(async (val) => {
      const dept = await prisma.department.findUnique({ where: { name: val } });
      return !!dept;
    }, { message: 'Department configuration not found' }),
  role: z.string().min(1, 'Role is required').max(100),
  salary: z.number().positive('Salary must be a positive number'),
  currency: z.string().min(1, 'Currency is required').transform((val) => val.toUpperCase())
    .refine(async (val) => {
      const exchangeRate = await prisma.exchangeRate.findUnique({ where: { currency: val } });
      return !!exchangeRate;
    }, { message: 'Currency configuration not found' }),
  employmentType: z.enum(EMPLOYMENT_TYPES, {
    errorMap: () => ({ message: 'Employment type must be FULL_TIME, PART_TIME, or CONTRACTOR' }),
  }),
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: 'Status must be ACTIVE or INACTIVE' }),
  }).default('ACTIVE'),
  hireDate: z.string().datetime({ message: 'Hire date must be a valid ISO-8601 string' }).transform(val => new Date(val))
    .or(z.date()),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const updateStatusSchema = z.object({
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: 'Status must be ACTIVE or INACTIVE' }),
  }),
});
