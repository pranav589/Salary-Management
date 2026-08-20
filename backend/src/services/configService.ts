import { prisma } from '../lib/prisma';
import { AppError } from '../lib/errors';

export async function getConfigs() {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
  });
  const departments = await prisma.department.findMany({
    orderBy: { name: 'asc' },
  });

  return {
    countries,
    departments: departments.map((d) => d.name),
  };
}

export async function addCountry(code: string, name: string, currency: string) {
  if (!code || !name || !currency) {
    throw new AppError('code, name, and currency are all required fields', 400);
  }

  const country = await prisma.country.upsert({
    where: { code: code.toUpperCase() },
    update: { name, currency: currency.toUpperCase() },
    create: {
      code: code.toUpperCase(),
      name,
      currency: currency.toUpperCase(),
    },
  });

  return country;
}

export async function addDepartment(name: string) {
  if (!name) {
    throw new AppError('name is a required field', 400);
  }

  const department = await prisma.department.upsert({
    where: { name },
    update: { name },
    create: { name },
  });

  return department;
}
