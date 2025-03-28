import { Order, Item } from '../domain/Order';
import { pool } from '../database/DatabaseConnection';
import { getAllOrders, getOrder, saveOrder, saveXmlToOrder, updateOrderStatus } from '../database/databaseHelpers';

export class OrderRepository {
  private static orders: Order[] = [];

  public async save(order: Order): Promise<Order> {
    await saveOrder(order);
    return order;
  }

  public async findByOrderUid(orderUid: string): Promise<Order | null> {
    const order = await getOrder(orderUid);
    return order;
  }

  public async findAllByPersonUid(personUid: string): Promise<Order[]> {
    const orders = getAllOrders(personUid);
    return orders;
  }

  public async updateOrderStatus(newStatus: string, orderUid: string): Promise <void> {
    await updateOrderStatus(orderUid, newStatus);
  }

  public async clear(): Promise<void> {
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM items');
  }
}

export async function saveXml(orderUid: string, xml: string): Promise<void> {
  await saveXmlToOrder(orderUid, xml);
}