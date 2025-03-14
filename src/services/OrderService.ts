import { OrderRepository } from '../repository/OrderRepository';
import { Order, Item } from '../domain/Order';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from './ServicesHelper';
import xml from 'xml';

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
  public async createOrder(
    token: string,
    personUid: string,
    itemList?: Item[],
    invoiceDetails?: any
  ): Promise<string> {
    // validate token and personUid – will uncomment out when tokens are implemented
    // const validateToken = new Validation();

    // try {
    //   validateToken.validateToken(token, personUid);
    // } catch (error) {
    //   throw new Error('Invalid token');
    // }
    
    // create orderUid
    const orderUid = uuidv4();

    // create new Order and save to repo
    const newOrder = new Order(orderUid, personUid, 'Pending', itemList, invoiceDetails);
    this.orderRepo.save(newOrder);

    return orderUid;
  }

  /**
   * converts and order to xml
   * @param {string} orderUid
   * @returns {string} xml
  */
  public async fetchXml(orderUid: string): Promise <string> {
    const order = this.orderRepo.findByOrderUid(orderUid);
    
    if (!order) {
      throw new Error('Order does not exist');
    }

    const orderFormatted = {
      orderUid: order.orderUid,
      personUid: order.personUid,
      status: order.status,
      itemList: order.itemList?.map(item => ({
        itemId: item.itemId,
        itemQuantity: item.itemQuantity,
        itemSeller: item.itemSeller,
        itemType: item.itemType,
        itemPrice: item.itemPrice,
        priceDiscount: item.priceDiscount
      })),
      invoiceDetails: order.invoiceDetails
    };

    return xml([orderFormatted]);
  }

  public async getOrderByUid(orderUid: string): Promise<Order | null> {
    return this.orderRepo.findByOrderUid(orderUid);
  }

  public async getAllOrdersByPersonUid(personUid: string): Promise<Order[]> {
    return this.orderRepo.findAllByPersonUid(personUid);
  }
}
