import axios from 'axios';
import { startTestServer, closeServer, getServerUrl } from '../testHelper';
import { PersonRepository, SessionRepository } from '../../repository/PersonRepository';
import { registerUserRequest } from '../testHelper';

describe('registerUser', () => {
  beforeAll(async () => {
    await startTestServer();
  });

  beforeEach(async () => {
    const SERVER_URL = getServerUrl();
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);
  });

  test('successful registration', async () => {
    const res = await registerUserRequest('test', 'test', 'test');

    expect(res.status).toBe(200);

    expect(res.data).toStrictEqual(expect.any(String));

    // Check that person was pushed into person repo and token into session
    const repoP = new PersonRepository();
    const findPerson = await repoP.findByUsername('test');
    expect(findPerson).not.toBeNull();
    expect(findPerson).toBeDefined();

    const repoS = new SessionRepository();
    const findSession = await repoS.findPersonUidFromToken(res.data);
    expect(findSession).toStrictEqual(expect.any(String));
  });

  test('username already exists', async () => {
    await registerUserRequest('user', 'test', 'test');
    
    try {
      await registerUserRequest('user', 'test', 'test');
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
