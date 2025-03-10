import { Item } from "../../domain/Order";
import axios from 'axios';
import { PORT } from '../../index'

const SERVER_URL = `http://localhost:${PORT}`;;

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
        `${SERVER_URL}/v1/order/create`,
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