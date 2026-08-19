import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

/**
 * Fetch countries and departments config lists
 */
export async function getConfigs(req: Request, res: Response, next: NextFunction) {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: {
        countries,
        departments: departments.map((d) => d.name),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add a new country configuration dynamically
 */
export async function addCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, name, currency } = req.body;
    if (!code || !name || !currency) {
      res.status(400).json({
        success: false,
        message: 'code, name, and currency are all required fields',
      });
      return;
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

    res.status(201).json({
      success: true,
      message: 'Country configuration saved successfully',
      data: country,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Add a new department configuration dynamically
 */
export async function addDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({
        success: false,
        message: 'name is a required field',
      });
      return;
    }

    const department = await prisma.department.upsert({
      where: { name },
      update: { name },
      create: { name },
    });

    res.status(201).json({
      success: true,
      message: 'Department configuration saved successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
}
