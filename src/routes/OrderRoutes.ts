import { Router } from 'express';
import {
  saveOrder,
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid
} from '../controllers/OrderController';

const router = Router();

// POST /api/order
router.post('/', saveOrder);

// GET /api/order/:invoiceUid
router.get('/:invoiceUid', getOrderByInvoiceUid);

// GET /api/order/person/:personUid
router.get('/person/:personUid', getAllOrdersByPersonUid);

export default router;