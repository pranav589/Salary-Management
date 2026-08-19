import { Router } from 'express';
import {
  getOverview,
  getByCountry,
  getByDepartment,
  getSalaryDistribution,
} from '../controllers/analyticsController';

const router = Router();

router.get('/overview', getOverview);
router.get('/by-country', getByCountry);
router.get('/by-department', getByDepartment);
router.get('/salary-distribution', getSalaryDistribution);

export default router;
