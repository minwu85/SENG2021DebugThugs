import axios from 'axios';
import { startTestServer, closeServer, getServerUrl } from '../testHelper';
import { PersonRepository, SessionRepository } from '../../repository/PersonRepository';
import { registerUserRequest } from '../testHelper';

describe('registerUser', () => {
  beforeAll(async () => {
    await startTestServer(); // Start the test server first
  });

  beforeEach(async () => {
    const SERVER_URL = getServerUrl();
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);
  });

  test('successful registration', async () => {
    const res = await registerUserRequest('test', 'test', 'test');

    expect(res.status).toBe(200);
    console.log(res.data);
    console.log(res.data.result);
    expect(res.data).toStrictEqual(expect.any(String));

    // Check that person was pushed into person repo and token into session
    const repoP = new PersonRepository();
    const findPerson = await repoP.findByUsername('test'); // Ensure async handling
    expect(findPerson).not.toBeNull();
    expect(findPerson).toBeDefined();

    const repoS = new SessionRepository();
    const findSession = await repoS.findPersonUidFromToken(res.data);
    expect(findSession).toStrictEqual(expect.any(String));
  });

  afterAll(async () => {
    await closeServer();
  });
});
