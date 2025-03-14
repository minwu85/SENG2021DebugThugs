import { Order } from '../domain/Order';

export class OrderRepository {
  private static orders: Order[] = [];

  public save(order: Order): Order {
    OrderRepository.orders.push(order);
    return order;
  }

  public findByOrderUid(orderUid: string): Order | null {
    return OrderRepository.orders.find(o => o.orderUid === orderUid) || null;
  }

  public findAllByPersonUid(personUid: string): Order[] {
    return OrderRepository.orders.filter(o => o.personUid === personUid);
  }
}
