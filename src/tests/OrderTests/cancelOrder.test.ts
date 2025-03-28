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

  test('successful deletion', async () => {
    console.log(':)');
  });

  afterAll(async () => {
    await closeServer();
  });
});