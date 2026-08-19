import { z } from 'zod';

const COUNTRIES = ['US', 'IN', 'UK', 'DE'] as const;
const CURRENCIES = ['USD', 'INR', 'GBP', 'EUR'] as const;
const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Product'] as const;
const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'] as const;
const STATUSES = ['ACTIVE', 'INACTIVE'] as const;

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  country: z.enum(COUNTRIES, {
    errorMap: () => ({ message: 'Country must be US, IN, UK, or DE' }),
  }),
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({ message: 'Invalid department' }),
  }),
  role: z.string().min(1, 'Role is required').max(100),
  salary: z.number().positive('Salary must be a positive number'),
  currency: z.enum(CURRENCIES, {
    errorMap: () => ({ message: 'Currency must be USD, INR, GBP, or EUR' }),
  }),
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
