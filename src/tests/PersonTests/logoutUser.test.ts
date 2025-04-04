import axios from 'axios';
import { SessionRepository } from '../../repository/PersonRepository';
import { closeServer, getServerUrl, logoutUserReq, registerUserRequest, startTestServer } from '../testHelper'

describe('loginUser', () => {
  let token: string;

  beforeAll(async () => {
    await startTestServer();
  });

  beforeEach(async () => {
    const SERVER_URL = getServerUrl();

    // Clear previous orders
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;
  });

  test('successful logout', async () => {
      const res = await logoutUserReq(token);

      expect(res.status).toBe(200);

      // check session no longer exists
      const repo = new SessionRepository;
      const find = await repo.findPersonUidFromToken(token);
      expect(find).toBeNull();
  });

  test('invalid token', async () => {
    try {
       await logoutUserReq('');
      fail('Did not throw expected error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(401);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }

    // check session still exists
    const repo = new SessionRepository;
    const find = await repo.findPersonUidFromToken(token);
    expect(find).toStrictEqual(expect.any(String));
  });

  test('already logged out', async () => {
    const res = await logoutUserReq(token);
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({});
    
    try {
      await logoutUserReq(token);
     fail('Did not throw expected error');
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

  afterAll(async () => {
    await closeServer();
  });
});