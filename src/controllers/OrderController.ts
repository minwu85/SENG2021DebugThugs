import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import orderRoutes from '../routes/OrderRoutes';
import { OrderRepository } from '../repository/OrderRepository';
import { Order } from '../domain/Order';
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
  } catch (error ) {
    if (error instanceof Error) {
      if (error.message === 'Invalid token') {
        res.status(401).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
}

// completeOrder
export async function completeOrder(req: Request, res: Response): Promise <void> {
  const { orderUid } = req.body;

  try {
    await orderService.completeOrder(orderUid);
    res.status(200).json({ message: 'Order completed successfully '});
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Unknown error' });
    }
  }
}

// cancelOrder
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderUid } = req.body;
    await orderService.cancelOrder(orderUid);
    res.status(200).json({ message: 'Order canceled successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Could not cancel order') {
        res.status(400).json({ error: 'Could not cancel order'});
      }
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

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

export async function fetchXml(req: Request, res: Response): Promise <any> {
  const { orderUid } = req.params;

  try {
    const result = await orderService.fetchXml(orderUid);

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
  } else {
      return res.status(500).json({ error: 'Unknown error' });
  }
  }
}

// GET /api/order/person/:personUid
export const getAllOrdersByPersonUid = async (req: Request, res: Response): Promise<void> => {
  try {
    const { personUid } = req.params;
    const repo = new OrderRepository();

    // Use the correct method: findAllByPersonUid
    const orders: Order[] = await repo.findAllByPersonUid(personUid);
    
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/order/clear
export const clearOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const repo = new OrderRepository();
    await repo.clear();
    res.status(200).json({ message: 'All orders cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


