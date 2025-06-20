import { Router } from 'express';

import {
  getSales,
  getSale,
  getSalesByParams,
  createSale,
  updateSale,
} from '../controller/sales.controller.js';

const router = Router();

router.get('/sales', getSales);
router.get('/sale/:id', getSale);
router.post('/sale', createSale);
router.post('/sales/byparams', getSalesByParams);
router.put('/sale/:id', updateSale);

export default router;
