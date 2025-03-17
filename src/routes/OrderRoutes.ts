import { Router } from 'express';
import {
  saveOrder,
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid,
  createOrder,
  cancelOrder,
  clearOrder
} from '../controllers/OrderController';
import { OrderRepository } from '../repository/OrderRepository';

const router = Router();

// POST /api/order
// router.post('/', saveOrder);

router.post('/v1/order/create', createOrder);

// GET /api/order/:invoiceUid
// router.get('/:invoiceUid', getOrderByInvoiceUid);

// GET /api/order/person/:personUid
router.get('/person/:personUid', getAllOrdersByPersonUid);

// GET /api/order/cancel
router.delete('/v1/order/cancel', cancelOrder);
console.log('Cancel order route registered');

// DELETE /v1/clear
router.delete('/v1/clear', clearOrder);
console.log('Clear order route registered');


export default router;