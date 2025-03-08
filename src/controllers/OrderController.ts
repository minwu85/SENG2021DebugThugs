import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/OrderService';

const orderService = new OrderService();

// POST /api/order
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
