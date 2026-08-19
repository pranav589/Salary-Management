import { Router } from 'express';
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from '../controllers/employeeController';
import { validate } from '../middleware/validate';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateStatusSchema,
} from '../validators/employee';

const router = Router();

// GET /api/employees - list with query params
router.get('/', listEmployees);

// POST /api/employees - create a new employee with Zod validation
router.post('/', validate(createEmployeeSchema), createEmployee);

// GET /api/employees/:id - get single employee
router.get('/:id', getEmployee);

// PUT /api/employees/:id - update existing employee with Zod validation
router.put('/:id', validate(updateEmployeeSchema), updateEmployee);

// PATCH /api/employees/:id/status - soft toggle ACTIVE/INACTIVE
router.patch('/:id/status', validate(updateStatusSchema), updateEmployeeStatus);

export default router;
