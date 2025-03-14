import { PORT, server } from '../../index'
import { OrderRepository } from "../../repository/OrderRepository";
import { closeServer, createOrder, registerUserRequest } from "../testHelper";
import { SessionRepository } from "../../repository/PersonRepository";

const SERVER_URL = `http://localhost:${PORT}`;

describe('createOrder', () => {
  let token;
  let personUid;
  beforeEach(async () => {
    // insert clear function

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;

    const sessionRepo = new SessionRepository();
    personUid = sessionRepo.findPersonUidFromToken(token);
  });

  test('successful order creation', async () => {
      const res = await createOrder(
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
      )

      expect(res.status).toBe(200);
      expect(res.data.result).toStrictEqual(expect.any(String));
      
      // check has been added to repo
      const repo = new OrderRepository;
      const find = repo.findByOrderUid(res.data.result);
      expect(find).toBeDefined();
  });
});

export async function createOrder(
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

  afterAll(async () => {
    await closeServer(server);
  });
});