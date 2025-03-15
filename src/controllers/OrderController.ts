import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import orderRoutes from '../routes/OrderRoutes';
import { OrderRepository } from '../repository/OrderRepository';
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
export const getAllOrdersByPersonUid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { personUid } = req.params;
    const repo = new OrderRepository();

    // Use the correct method: findAllByPersonUid
    const orders = repo.findAllByPersonUid(personUid);
    
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/order/cancel
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderUid } = req.body;
    const repo = new OrderRepository();
    
    const order = repo.findByOrderUid(orderUid);
    if (!order || order.status === 'Deleted') {
      res.status(400).json({ error: 'Order not found or already canceled' });
      return;
    }

    order.status = 'Deleted';
    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    throw error
  }
};

// DELETE /api/order/clear
export const clearOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const repo = new OrderRepository();
    repo.clear();
    res.status(200).json({ message: 'All orders cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


