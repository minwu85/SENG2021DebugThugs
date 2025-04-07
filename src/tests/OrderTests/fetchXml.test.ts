import axios from 'axios';
import { closeServer, createOrder, fetchXmlRequest, getServerUrl, registerUserRequest, startTestServer } from "../testHelper";
import { SessionRepository } from "../../repository/PersonRepository";
import { OrderRepository } from '../../repository/OrderRepository';

describe('fetchXml', () => {
  let token: string;
  let personUid: string;
  let orderUid: string;
  
  beforeAll(async () => {
    await startTestServer(); // Start the test server first
  });

  beforeEach(async () => {
    const SERVER_URL = getServerUrl();

    // insert clear function
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;

    const sessionRepo = new SessionRepository();
    const uid = await sessionRepo.findPersonUidFromToken(token);
    if (uid === null) {
      throw new Error('Person UID not found');
    }
    personUid = uid;

    // create order
    const order = await createOrder(
      token,
      personUid,
      [
        {
          itemId: 'itemId',
          itemQuantity: 2,
          itemSeller: 'seller'
        }
      ],
      '{"details": "Valid invoice details"}'
    );
    orderUid = order.data.result;
  });

  test('successful xml return', async () => {
    const res = await fetchXmlRequest(orderUid);

    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual(expect.any(String));

    // check xml was added to order object in repo
    const orderRepo = new OrderRepository();
    const findOrder = await orderRepo.findByOrderUid(orderUid);

    const xmlOrder = findOrder?.xml;
    expect(xmlOrder).toStrictEqual(expect.any(String));
  });

  test('order does not exist', async () => {
    try {
      await fetchXmlRequest('wrongorderuid');
      fail('Did not throw expected error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(500);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String)});
      } else {
        throw error;
      }
    }
  });

  afterAll(async () => {
    await closeServer();
  });
});