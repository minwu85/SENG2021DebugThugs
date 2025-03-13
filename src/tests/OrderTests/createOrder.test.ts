import { Item } from "../../domain/Order";
import axios from 'axios';
import { PORT, server } from '../../index'
import { OrderRepository } from "../../repository/OrderRepository";

const SERVER_URL = `http://localhost:${PORT}`;

describe('createOrder', () => {
  beforeEach(() => {
    // insert clear function
  });

  test('successful order creation', async () => {
      const res = await createOrder(
        'test',
        'test',
        [
          {
            itemId: 'itemId',
            itemQuantity: 2,
            itemSeller: 'seller'
          }
        ],
        'details'
      )

      expect(res.status).toBe(200);
      expect(res.data.orderId).toStrictEqual(expect.any(String));
      
      // check has been added to repo
      const repo = new OrderRepository;
      const find = repo.findByOrderUid(res.data.orderId);
      expect(find).toBeDefined();
  });

  afterAll(async () => {
    console.log('Closing server after tests...');
    await new Promise((resolve) => setTimeout(resolve, 500))
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});

async function createOrder(
  token: string,
  personUid: string,
  itemList?: Item[],
  invoiceDetails?: any
  ) {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/order/v1/order/create`,
        {
          personUid, itemList, invoiceDetails
        },
        {
          headers: { token },
          timeout: 5 * 1000
        }
      );
      return res;
    } catch (error) {
      throw error;
    }
}