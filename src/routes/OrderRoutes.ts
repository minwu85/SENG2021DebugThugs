import { Router } from 'express';
import {
  saveOrder,
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid,
  createOrder
} from '../controllers/OrderController';

const router = Router();

// POST /api/order
// router.post('/', saveOrder);

router.post('/v1/order/create', createOrder);

// GET /api/order/:invoiceUid
// router.get('/:invoiceUid', getOrderByInvoiceUid);

// GET /api/order/person/:personUid
// router.get('/person/:personUid', getAllOrdersByPersonUid);

export default router;
