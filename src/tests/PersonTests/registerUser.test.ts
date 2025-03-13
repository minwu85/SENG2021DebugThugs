import axios from 'axios';
import { PORT, server } from '../../index'
import { PersonRepository, SessionRepository } from "../../repository/PersonRepository";

const SERVER_URL = `http://localhost:${PORT}`;

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
      expect(findPerson).toBeDefined();

      const repoS = new SessionRepository;
      const findSession = repoS.findPersonUidFromToken(res.data);
      expect(findSession).toStrictEqual(expect.any(String));
  });

  afterAll(async () => {
    console.log('Closing server after tests...');
    await new Promise((resolve) => setTimeout(resolve, 500))
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
});

async function registerUserRequest(
  username: string,
  password: string,
  email: string
  ) {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/person/v1/registerUser`,
        {
          username, password, email
        },
        {
          timeout: 5 * 1000
        }
      );
      return res;
    } catch (error) {
      throw error;
    }
}