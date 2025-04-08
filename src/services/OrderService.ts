import { OrderRepository, saveXml } from '../repository/OrderRepository';
import { Order, Item } from '../domain/Order';
import { v4 as uuidv4 } from 'uuid';
import { Validation } from './ServicesHelper';
import { PersonRepository, SessionRepository } from '../repository/PersonRepository';
var convert = require('xml-js');

type OrderStatus = 'Pending' | 'Completed' | 'Deleted';

export class OrderService {
  private orderRepo: OrderRepository;
  private sessionRepo: SessionRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.sessionRepo = new SessionRepository();
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
    personUid?: string,
    itemList?: Item[],
    invoiceDetails?: any
  ): Promise<string> {
    // validate token and personUid
    const validation = new Validation();
    let personUidValidated;
    if (!personUid) {
      let personUidValidated = await this.sessionRepo.findPersonUidFromToken(token);
      if (!personUidValidated || personUidValidated) {
        throw new Error('Invalid token');
      }
    } else {
      personUidValidated = personUid;
    }

    if (typeof personUidValidated === 'string') {
      try {
        await validation.validateToken(token, personUidValidated);
      } catch (error) {
        throw new Error('Invalid token');
      }
    } else {
      throw new Error('Invalid token: personUidValidated is not a string');
    }

    // validate order details
    try {
      await validation.validateOrderDetails(personUidValidated, itemList);
    } catch (error) {
      throw error;
    }
    
    // create orderUid
    const orderUid = uuidv4();

    // create new Order and save to repo
    const newOrder = new Order(orderUid, personUidValidated, 'Pending', itemList, invoiceDetails);
    await this.orderRepo.save(newOrder);

    return orderUid;
  }

  /**
   * converts and order to xml
   * @param {string} orderUid
   * @returns {string} xml
  */
  public async fetchXml(orderUid: string): Promise <string> {
    const order = await this.orderRepo.findByOrderUid(orderUid);
    
    if (!order) {
      throw new Error('Order does not exist');
    }

    const orderFormatted = {
      orderUid: order.orderUid,
      personUid: order.personUid,
      status: order.status,
      itemList: order.itemList?.map(item => ({
        item: {
          itemId: item.itemId,
          itemQuantity: item.itemQuantity,
          itemSeller: item.itemSeller,
          itemType: item.itemType,
          itemPrice: item.itemPrice,
          priceDiscount: item.priceDiscount
        }
      })),
      invoiceDetails: order.invoiceDetails
    };

    var xmlOptions = {compact: true, ignoreComment: true, spaces: 4};
    const orderXml = convert.json2xml(orderFormatted, xmlOptions);

    await saveXml(orderUid, orderXml);

    return orderXml;
  }

  public async getOrderByUid(orderUid: string): Promise<Order | null> {
    return await this.orderRepo.findByOrderUid(orderUid);
  }

  public async getAllOrdersByPersonUid(personUid: string): Promise<Order[]> {
    return await this.orderRepo.findAllByPersonUid(personUid);
  }

  public async cancelOrder(orderUid: string): Promise<void> {
    const order = await this.orderRepo.findByOrderUid(orderUid);

    if (!order || order.status === 'Deleted') {
      throw new Error('Could not cancel order');
    }

    await this.orderRepo.updateOrderStatus('Deleted', orderUid);
  }

  public async completeOrder(orderUid: string): Promise <void> {
    const order = await this.orderRepo.findByOrderUid(orderUid);

    if (!order) {
      throw new Error('Order does not exist');
    }

    if (order.status === 'Completed') {
      throw new Error('Order is already completed');
    }

    await this.orderRepo.updateOrderStatus('Completed', orderUid);
  }
}
