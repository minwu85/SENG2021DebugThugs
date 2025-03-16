import { PORT, server } from '../../index'
import { OrderRepository } from "../../repository/OrderRepository";
import { closeServer, createOrder, registerUserRequest } from "../testHelper";
import { SessionRepository } from "../../repository/PersonRepository";

const SERVER_URL = `http://localhost:${PORT}`;

describe('createOrder', () => {
  let token: string;
  let personUid: string;
  beforeEach(async () => {
    // insert clear function

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;

    const sessionRepo = new SessionRepository();
    const uid = sessionRepo.findPersonUidFromToken(token);
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

  afterAll(async () => {
    await closeServer(server);
  });
});