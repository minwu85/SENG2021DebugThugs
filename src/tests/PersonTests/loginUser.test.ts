import { server } from '../../index'
import { SessionRepository } from "../../repository/PersonRepository";
import { closeServer } from '../testHelper'
import { registerUserRequest, loginUserRequest } from '../testHelper'

describe('loginUser', () => {
  beforeEach(async () => {
    // insert clear function

    await registerUserRequest('user', 'password', 'email');
  });

  test('successful login', async () => {
      const res = await loginUserRequest('email', 'password');

      expect(res.status).toBe(200);
      expect(res.data).toStrictEqual(expect.any(String));

      // check session was pushed
      const repo = new SessionRepository();
      const findSession = repo.findPersonUidFromToken(res.data);
      expect(findSession).toBeDefined();
  });

  test('wrong password', async () => {
    try {
      await loginUserRequest('email', 'wrongpassword');
      fail('Did not throw expected error');
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toStrictEqual(expect.any(String));
    }
  });

  test('wrong userInput', async () => {
    try {
      await loginUserRequest('wrongemail', 'password');
      fail('Did not throw expected error');
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toStrictEqual(expect.any(String));
    }
  });

  afterAll(async () => {
    await closeServer(server);
  });
});