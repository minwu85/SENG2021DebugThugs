import { OrderRepository } from '../repository/OrderRepository';
import { Order, Item } from '../domain/Order';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from './ServicesHelper';

type OrderStatus = 'Pending' | 'Completed' | 'Deleted';

export class OrderService {
  private orderRepo: OrderRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
  }

  /**
   * create an order
   * @param {object} itemList
   * @param {string} token
   * @param {string} personUid
   * @returns {string} orderId
  */
  public async createOrder (
    token: string,
    personUid: string,
    itemList?: Item[],
    invoiceDetails?: any
  ): Promise<string> {
    // validate token and personUid
    const validateToken = new Validation();

    try {
      validateToken.validateToken(token, personUid);
    } catch (error) {
      throw new Error('Invalid token');
    }
    
    // create orderUid
    const orderUid = uuidv4();

    // create new Order and save to repo
    const newOrder = new Order(orderUid, personUid, 'Pending', itemList, invoiceDetails);
    this.orderRepo.save(newOrder);

    return orderUid;
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
