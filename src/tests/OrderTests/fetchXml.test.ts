import axios from 'axios';
import { PORT, server } from '../../index'
import { closeServer, createOrder, registerUserRequest } from "../testHelper";
import { SessionRepository } from "../../repository/PersonRepository";
import { OrderRepository } from '../../repository/OrderRepository';

const SERVER_URL = `http://localhost:${PORT}`;

describe('fetchXml', () => {
  let token;
  let personUid;
  let orderUid;
  beforeEach(async () => {
    // insert clear function

    // register user
    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;
    const sessionRepo = new SessionRepository();
    personUid = sessionRepo.findPersonUidFromToken(token);

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
      'details'
    );
    orderUid = order.data.result;
  });

  test('successful xml return', async () => {
    const res = await fetchXmlRequest(orderUid);

    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual(expect.any(String));
  });

  afterAll(async () => {
    await closeServer(server);
  });
});

async function fetchXmlRequest(orderUid: string) {
    try {
      const res = await axios.get(
        `${SERVER_URL}/api/order/v1/order/fetchxml${orderUid}`,
      );
      return res;
    } catch (error) {
      throw error;
    }
}