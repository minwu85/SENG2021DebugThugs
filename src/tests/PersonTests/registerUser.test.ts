import { server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";
import { closeServer } from '../testHelper'
import { registerUserRequest } from '../testHelper'

describe('registerUser', () => {
  beforeEach(() => {
    // insert clear function
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
      const findSession = repoS.findPersonUidFromToken(res.data);
      expect(findSession).toStrictEqual(expect.any(String));
  });

  afterAll(async () => {
    await closeServer(server);
  });
});