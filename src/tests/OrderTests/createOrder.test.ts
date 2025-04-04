import { startTestServer, closeServer, getServerUrl } from '../testHelper';
import { OrderRepository } from '../../repository/OrderRepository';
import { registerUserRequest, createOrder } from '../testHelper';
import { SessionRepository } from '../../repository/PersonRepository';
import axios from 'axios';

describe('createOrder', () => {
  let token: string;
  let personUid: string;

  beforeAll(async () => {
    await startTestServer(); // Start the test server first
  });

  beforeEach(async () => {
    const SERVER_URL = getServerUrl();

    // Clear previous orders
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;

    const sessionRepo = new SessionRepository();
    const uid = await sessionRepo.findPersonUidFromToken(token);
    if (uid === null) {
      throw new Error('Person UID not found');
    }
    personUid = uid;
  });

  test('successful order creation', async () => {
    const res = await createOrder(
      token,
      personUid,
      [
        {
          itemId: 'itemId',
          itemQuantity: 2,
          itemSeller: 'seller',
        },
      ],
      '{"details": "Valid invoice details"}'
    );

    expect(res.status).toBe(200);
    expect(res.data.result).toStrictEqual(expect.any(String));

    // Check if the order exists in the repository
    const repo = new OrderRepository();
    const find = await repo.findByOrderUid(res.data.result);
    expect(find).toBeDefined();
  });

  test('invalid token', async () => {
    try {
      await createOrder(
        'invalidtoken',
        personUid,
        [
          {
            itemId: 'itemId',
            itemQuantity: 2,
            itemSeller: 'seller',
          },
        ],
        '{"details": "Valid invoice details"}'
      )
      fail('Did not throw expect error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(401);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }
  });

  test('invalid personUid', async () => {
    try {
      await createOrder(
        token,
        'invalidpersonUid',
        [
          {
            itemId: 'itemId',
            itemQuantity: 2,
            itemSeller: 'seller',
          },
        ],
        '{"details": "Valid invoice details"}'
      )
      fail('Did not throw expect error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(401);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }
  });

  test('invalid order details', async () => {
    try {
      await createOrder(
        token,
        personUid,
        [
          {
            itemId: 'itemId',
            itemQuantity: 2,
            itemSeller: '',
          },
        ],
        '{"details": "Valid invoice details"}'
      )
      fail('Did not throw expect error');
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
