import { Router } from 'express';
import { getConfigs, addCountry, addDepartment } from '../controllers/configController';

const router = Router();

// GET /api/configs - fetch countries and departments config lists
router.get('/', getConfigs);

// POST /api/configs/countries - add a new country configuration dynamically
router.post('/countries', addCountry);

// POST /api/configs/departments - add a new department configuration dynamically
router.post('/departments', addDepartment);

export default router;
