import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import orderRoutes from '../routes/OrderRoutes';

const orderService = new OrderService();

// POST /api/order
// createOrder
export async function createOrder(req: Request, res: Response): Promise <void> {
  const token = req.header('token') as string;
  const { personUid, itemList, invoiceDetails } = req.body;

  if (!token) {
    res.status(401).json({ error: 'Token is required' });
  }

  try {
    const orderId = await orderService.createOrder(token, personUid, itemList,
      invoiceDetails);
    res.status(200).json({ orderId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function saveOrder(req: Request, res: Response) {
  try {
    const { personUid, status, invoiceDetails } = req.body;
    const savedOrder = await orderService.saveOrder(personUid, status, invoiceDetails);
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to save order' });
  }
}

// GET /api/order/:invoiceUid
export async function getOrderByInvoiceUid(req: Request, res: Response) {
  try {
    const { invoiceUid } = req.params;
    const order = await orderService.getOrderByUid(invoiceUid);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to get order' });
  }
}

// GET /api/order/person/:personUid
export async function getAllOrdersByPersonUid(req: Request, res: Response) {
  try {
    const { personUid } = req.params;
    const orders = await orderService.getAllOrdersByPersonUid(personUid);
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to get orders' });
  }
}