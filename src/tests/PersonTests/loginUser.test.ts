import axios from 'axios';
import { SessionRepository } from "../../repository/PersonRepository";
import { closeServer, getServerUrl, startTestServer } from '../testHelper'
import { registerUserRequest, loginUserRequest } from '../testHelper'

describe('loginUser', () => {
  let token: string;

  beforeAll(async () => {
    await startTestServer();
  });

  beforeEach(async () => {
    // insert clear function
    const SERVER_URL = getServerUrl();

    // Clear previous orders
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);

    const register = await registerUserRequest('user', 'password', 'email');
    token = register.data;

    await registerUserRequest('user', 'password', 'email');
  });

  test('successful login', async () => {
      const res = await loginUserRequest('email', 'password');

      expect(res.status).toBe(200);
      expect(res.data).toStrictEqual(expect.any(String));

      // check session was pushed
      const repo = new SessionRepository();
      const findSession = await repo.findPersonUidFromToken(res.data);
      expect(findSession).toBeDefined();
  });

  test('wrong password', async () => {
    try {
      await loginUserRequest('email', 'wrongpassword');
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

  test('wrong userInput', async () => {
    try {
      await loginUserRequest('wrongemail', 'password');
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