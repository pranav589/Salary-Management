import { Request, Response, NextFunction } from 'express';
import * as employeeService from '../services/employeeService';

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

    const result = await employeeService.listEmployees({
      page,
      limit,
      search,
      country,
      department,
      employmentType,
      status,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: result.employees,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        pages: result.pages,
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
    const employee = await employeeService.getEmployee(id);

    res.status(200).json({
      success: true,
      data: employee,
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

    const newEmployee = await employeeService.createEmployee({
      name,
      email,
      country,
      department,
      role,
      salary,
      currency,
      employmentType,
      status,
      hireDate,
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: newEmployee,
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

    const updatedEmployee = await employeeService.updateEmployee(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
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

    const updatedEmployee = await employeeService.updateEmployeeStatus(id, status);

    res.status(200).json({
      success: true,
      message: `Employee status updated to ${status}`,
      data: updatedEmployee,
    });
  } catch (error) {
    next(error);
  }
}
