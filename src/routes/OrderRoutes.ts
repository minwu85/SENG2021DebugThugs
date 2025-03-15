import { Router } from 'express';
import {
  saveOrder,
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid,
  createOrder,
  cancelOrder 
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
router.delete('/v1/clear', (req, res) => {
  try {
    const repo = new OrderRepository();
    repo.clear(); // Clear all stored orders
    res.status(200).json({ message: 'Database cleared successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

console.log('Clear database route registered');

export default router;
