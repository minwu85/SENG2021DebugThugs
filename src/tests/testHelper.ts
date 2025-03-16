import axios from 'axios';
import { PORT } from '../index'
import { Item } from "../domain/Order";

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

export async function createOrder(
  token: string,
  personUid: string,
  itemList?: Item[],
  invoiceDetails?: any
  ) {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/order/v1/order/create`,
        {
          personUid, itemList, invoiceDetails
        },
        {
          headers: { token },
          timeout: 5 * 1000
        }
      );
      return res;
    } catch (error) {
      throw error;
    }
}

export async function fetchXmlRequest(orderUid: string) {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/order/v1/order/fetchxml${orderUid}`,
    );
    return res;
  } catch (error) {
    throw error;
  }
}

export async function logoutUserReq(token: string) {
  try {
    const res = await axios.delete(
      `${SERVER_URL}/api/person/v1/logoutUser`,
      {
        headers: { token },
        timeout: 5 * 1000
      }
    );
    return res;
  } catch (error) {
    throw error;
  }
}


export async function retrieveOrder(orderUid: string, token: string) {
  try {
      const res = await axios.get(
          `${SERVER_URL}/order/create/test/${orderUid}`,
          {
              headers: {token},
              timeout: 5 * 1000
          }
      );
      return res.data;
  } catch (error) {
     throw error;        
  }
}