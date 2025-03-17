import { server } from '../../index'
import { SessionRepository } from '../../repository/PersonRepository';
import { closeServer, logoutUserReq, registerUserRequest } from '../testHelper'

describe('loginUser', () => {
  let token: string;
  beforeEach(async () => {
    // insert clear function

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;
  });

  test('successful logout', async () => {
      const res = await logoutUserReq(token);

      expect(res.status).toBe(200);

      // check session no longer exists
      const repo = new SessionRepository;
      const find = repo.findPersonUidFromToken(token);
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
    const find = repo.findPersonUidFromToken(token);
    expect(find).toStrictEqual(expect.any(String));
  });

  afterAll(async () => {
    await closeServer(server);
  });
});