import { PORT, server } from '../../index'
import { OrderRepository } from "../../repository/OrderRepository";
import { closeServer, createOrderReq, registerUserRequest } from "../testHelper";
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
      const res = await createOrderReq(
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