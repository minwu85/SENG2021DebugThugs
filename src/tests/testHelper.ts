import axios from 'axios';
import { PORT } from '../index'

const SERVER_URL = `http://localhost:${PORT}`;

// close server
export async function closeServer(server: { close: (callback: () => void) => void }) {
  console.log('Closing server after tests...');
  await new Promise((resolve) => setTimeout(resolve, 500));
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

// register a user
export async function registerUserRequest(
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

// logs in a user
export async function loginUserRequest(userInput: string, password: string) {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/person/v1/loginUser`,
      {
        userInput, password
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