import { Router } from 'express';
import {
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid,
  createOrder,
  fetchXml,
  cancelOrder,
  clearOrder
} from '../controllers/OrderController';
import { OrderRepository } from '../repository/OrderRepository';

const router = Router();

// POST /api/order
// router.post('/', saveOrder);

router.post('/v1/order/create', createOrder);

// POST /api/order/cancel
router.post('/v1/order/cancel', cancelOrder);

// GET /api/order/:invoiceUid
// router.get('/:invoiceUid', getOrderByInvoiceUid);

router.get('/v1/order/fetchxml:orderUid', fetchXml);

// GET /api/order/person/:personUid
// router.get('/person/:personUid', getAllOrdersByPersonUid);
router.get('/v1/order/retrieve/all/:personUid', getAllOrdersByPersonUid);

// DELETE /v1/clear
// router.delete('/v1/clear', (req, res) => {
//   try {
//     const repo = new OrderRepository();
//     repo.clear(); // Clear all stored orders
//     res.status(200).json({ message: 'Database cleared successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// DELETE /api/order/clear
router.delete('/v1/clear', clearOrder);

export default router;
