import axios from 'axios';
import { closeServer,
  createOrder,
  getServerUrl,
  registerUserRequest,
  startTestServer,
  completeOrderReq } from "../testHelper";
import { SessionRepository } from "../../repository/PersonRepository";
import { OrderRepository } from '../../repository/OrderRepository';

describe('completeOrder', () => {
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

  test('successful completion', async () => {
    const res = await completeOrderReq(orderUid);
    expect(res.status).toBe(200);

    // check status has changed
    const orderRepo = new OrderRepository();
    const findOrder = await orderRepo.findByOrderUid(orderUid);
    expect(findOrder?.status).toBe('Completed');
  });

  test('invalid orderUid', async () => {
    try {
      await completeOrderReq('invalidorderUid');
      fail('Did not throw expected error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(400);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }
  });

  test('order already completed', async () => {
    await completeOrderReq(orderUid);

    try {
      await completeOrderReq(orderUid);
      fail('Did not throw expected error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(400);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }
  });

  afterAll(async () => {
    await closeServer();
  });
});