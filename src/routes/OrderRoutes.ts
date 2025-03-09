import { Router } from 'express';
import {
  saveOrder,
  getOrderByInvoiceUid,
  getAllOrdersByPersonUid
} from '../controllers/OrderController';
import { OrderService } from '../services/OrderService';

const router = Router();
const orderService = new OrderService();

// POST /api/order
router.post('/', saveOrder);

// create an order
router.post('/v1/order/create', async (req, res) => {
  const token = req.query.token as string;
  const { personUid, itemList, invoiceDetails } = req.body;

  try {
    const orderId = await orderService.createOrder(token, personUid, itemList,
      invoiceDetails);
    res.status(200).json({ orderId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/order/:invoiceUid
router.get('/:invoiceUid', getOrderByInvoiceUid);

// GET /api/order/person/:personUid
router.get('/person/:personUid', getAllOrdersByPersonUid);



export default router;