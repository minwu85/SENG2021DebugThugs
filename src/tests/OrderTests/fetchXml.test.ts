import axios from 'axios';
import { PORT, server } from '../../index'
import { closeServer, createOrder, fetchXmlRequest, registerUserRequest } from "../testHelper";
import { SessionRepository } from "../../repository/PersonRepository";

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

  test('order does not exist', async () => {
    try {
      await fetchXmlRequest('wrongorderuid');
      fail('Did not throw expected error');
    // } catch (error) {
    //   expect(error.response.status).toBe(500);
    //   expect(error.response.data).toStrictEqual(expect.any(String));
    // }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        expect(error.response.status).toBe(500);
        expect(error.response.data).toStrictEqual(expect.any(String));
      } else {
        throw error;
      }
    }
  });
});