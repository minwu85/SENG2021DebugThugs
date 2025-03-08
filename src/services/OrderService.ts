import { OrderRepository } from '../repository/OrderRepository';
import { Order } from '../domain/Order';
import { v4 as uuidv4 } from 'uuid';

type OrderStatus = 'Pending' | 'Completed' | 'Deleted';

export class OrderService {
  private orderRepo: OrderRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
  }

  public async saveOrder(
    personUid: string,
    status: OrderStatus,
    invoiceDetails?: any
  ): Promise<Order> {
    const orderUid = uuidv4();
    const newOrder = new Order(orderUid, personUid, status, invoiceDetails);
    return this.orderRepo.save(newOrder);
  }

  public async getOrderByUid(orderUid: string): Promise<Order | null> {
    return this.orderRepo.findByOrderUid(orderUid);
  }

  public async getAllOrdersByPersonUid(personUid: string): Promise<Order[]> {
    return this.orderRepo.findAllByPersonUid(personUid);
  }
}
