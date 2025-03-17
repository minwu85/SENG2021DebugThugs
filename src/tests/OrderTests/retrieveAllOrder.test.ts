import axios from 'axios';
import { PORT, server } from '../../index';
import { OrderRepository } from '../../repository/OrderRepository';
import { closeServer, registerUserRequest } from '../testHelper';
import { Order } from '../../domain/Order';
import { SessionRepository } from '../../repository/PersonRepository';

const SERVER_URL = `http://localhost:${PORT}`;

describe('retrieveAllOrders', () => {
  let token: string;
  let personUid: string;

  beforeAll(async () => {
    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;
    const sessionRepo = new SessionRepository();
    const uid = await sessionRepo.findPersonUidFromToken(token);
    if (uid === null) {
      throw new Error('Person UID not found');
    }
    personUid = uid;

    // Create an order to test retrieval
    await createOrder(token, personUid, [
      { itemId: 'item123', itemQuantity: 2, itemSeller: 'sellerX' }
    ], 'invoiceDetails');
  });
  console.log('order created');

  test('should retrieve all orders for a valid personUid', async () => {
    const res = await axios.get(
      `${SERVER_URL}/api/order/v1/order/retrieve/all/${personUid}`,
      { headers: { token }}
    );

    expect(res.status).toBe(200);
    expect(res.data.orders).toBeInstanceOf(Array);
    res.data.orders.forEach((order: Order) => {
      expect(order).toHaveProperty('orderUid', expect.any(String));
      expect(order).toHaveProperty('personUid', expect.any(String));
      expect(order).toHaveProperty('invoiceDetails', expect.any(String)); // Adjust fields as per schema
    });
  });

  test('should return 400 when personUid is missing', async () => {
    try {
      await axios.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${personUid}`, { headers: { token } });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toStrictEqual({ error: 'personUid is required' });
    }
  });

  test('should return 401 when token is missing', async () => {
    try {
      await axios.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${'notaUid'}`, { headers: { token: '' } });
      } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toStrictEqual({ error: 'Unauthorized' });
    }
  });

  // test('should return 200 with empty array if no orders exist', async () => {
  //   // create user with no orders
  //   const register2 = await registerUserRequest('user2', 'password2', 'email2');
  //   const token2 = register2.data;
  //   const sessionRepo = new SessionRepository();
  //   const uid2 = sessionRepo.findPersonUidFromToken(token2);
  //   if (uid2 === null) {
  //     throw new Error('Person UID not found');
  //   }
  //   const personUid2 = uid2;

  //   const res = await axios.get(
  //     await axios.get(`${SERVER_URL}/api/order/v1/order/retrieve/all/${personUid2}`,
  //       { headers: { token } })
  //   );

  //   expect(res.status).toBe(200);
  //   expect(res.data).toStrictEqual([]); // Expect empty array if no orders exist
  // });

  afterAll(async () => {
    await closeServer(server); // Ensure the server is closed after tests
  });
});

// Helper function to create an order
async function createOrder(token: string, personUid: string, itemList?: any[], invoiceDetails?: any) {
  try {
    return await axios.post(
      `${SERVER_URL}/api/order/v1/order/create`,
      { personUid, itemList, invoiceDetails },
      { headers: { token } }
    );
  } catch (error) {
    throw error;
  }
}
