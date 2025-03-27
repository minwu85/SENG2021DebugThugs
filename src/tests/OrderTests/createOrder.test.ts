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
    // Ensure the test is using the dynamically set server URL
    const SERVER_URL = getServerUrl();

    // Clear previous orders
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;
    console.log('token: ', token);

    const sessionRepo = new SessionRepository();
    const uid = await sessionRepo.findPersonUidFromToken(token);
    if (uid === null) {
      throw new Error('Person UID not found');
    }
    personUid = uid;
  });

  test('successful order creation', async () => {
    const SERVER_URL = getServerUrl();

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

  afterAll(async () => {
    await closeServer();
  });
});
