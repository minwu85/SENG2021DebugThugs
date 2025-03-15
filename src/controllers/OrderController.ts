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
    const result = await orderService.createOrder(token, personUid, itemList,
      invoiceDetails);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// GET /api/order/:invoiceUid
export async function getOrderByInvoiceUid(req: Request, res: Response): Promise <any> {
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

export async function fetchXml(req: Request, res: Response): Promise <any> {
  const { orderUid } = req.params;

  try {
    const result = await orderService.fetchXml(orderUid);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

// GET /api/order/person/:personUid
export async function getAllOrdersByPersonUid(req: Request, res: Response): Promise <any> {
  try {
    const { personUid } = req.params;
    const orders = await orderService.getAllOrdersByPersonUid(personUid);
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Unable to get orders' });
  }
}