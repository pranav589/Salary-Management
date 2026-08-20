import { Request, Response, NextFunction } from 'express';
import * as analyticsService from '../services/analyticsService';

/**
 * Get overall summary statistics (active employees only)
 */
export async function getOverview(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getOverview();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get employee headcount and total monthly payroll grouped by country
 */
export async function getByCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getByCountry();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get employee headcount and monthly payroll spend grouped by department
 */
export async function getByDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getByDepartment();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get population distribution across salary bands (histogram data)
 */
export async function getSalaryDistribution(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await analyticsService.getSalaryDistribution();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}
