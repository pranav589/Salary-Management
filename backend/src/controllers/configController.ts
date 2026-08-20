import { Request, Response, NextFunction } from 'express';
import * as configService from '../services/configService';

/**
 * Fetch countries and departments config lists
 */
export async function getConfigs(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await configService.getConfigs();
    res.status(200).json({
      success: true,
      data,
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
    const country = await configService.addCountry(code, name, currency);

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
    const department = await configService.addDepartment(name);

    res.status(201).json({
      success: true,
      message: 'Department configuration saved successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
}
