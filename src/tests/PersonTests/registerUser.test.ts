import axios from 'axios';
import { PORT, server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";
import { closeServer } from '../testHelper'
import { registerUserRequest } from '../testHelper'

const SERVER_URL = `http://localhost:${PORT}`;

describe('registerUser', () => {
  beforeEach(async () => {
    await axios.delete(`${SERVER_URL}/api/order/v1/clear`);
  });

  test('successful registration', async () => {
      const res = await registerUserRequest('test', 'test', 'test');

      expect(res.status).toBe(200);
      expect(res.data).toStrictEqual(expect.any(String));

      // check that person was pushed into person repo and token into session
      const repoP = new PersonRepository;
      const findPerson = repoP.findByUsername('test');
      expect(findPerson).not.toBeNull();
      expect(findPerson).toBeDefined();

      const repoS = new SessionRepository;
      const findSession = await repoS.findPersonUidFromToken(res.data);
      expect(findSession).toStrictEqual(expect.any(String));
  });

  afterAll(async () => {
    await closeServer(server);
  });
});