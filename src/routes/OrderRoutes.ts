import { Router } from 'express';
import {
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid,
  createOrder,
  fetchXml,
  cancelOrder,
  clearOrder,
  completeOrder
} from '../controllers/OrderController';

const router = Router();

// POST /api/order
// router.post('/', saveOrder);

router.post('/v1/order/create', createOrder);

// POST /api/order/cancel
router.post('/v1/order/cancel', cancelOrder);

router.post('/v1/order/complete', completeOrder);

// GET /api/order/:invoiceUid
// router.get('/:invoiceUid', getOrderByInvoiceUid);

router.get('/v1/order/fetchxml/:orderUid', fetchXml);

// GET /api/order/person/:personUid
// router.get('/person/:personUid', getAllOrdersByPersonUid);
router.get('/v1/order/retrieve/all/:personUid', getAllOrdersByPersonUid);

// DELETE /api/order/clear
router.delete('/v1/clear', clearOrder);

export default router;
