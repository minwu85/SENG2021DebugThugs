import axios from 'axios';
import { startServer, stopServer } from '../startServer';
import { Item } from '../domain/Order';
import { AddressInfo } from 'net';

let SERVER_URL: string;
let serverInstance: Awaited<ReturnType<typeof startServer>> | null = null;

export async function startTestServer() {
  if (serverInstance) {
    return serverInstance;
  }

  const server = await startServer();
  const address = server.address();

  if (!address || typeof address === 'string') {
    throw new Error('Failed to retrieve server address');
  }

  SERVER_URL = `http://localhost:${(address as AddressInfo).port}`;
  serverInstance = server;
  return server;
}

export async function closeServer() {
  if (serverInstance) {
    await stopServer();
    serverInstance = null;
  }
}

export function getServerUrl() {
  if (!SERVER_URL) {
    throw new Error('SERVER_URL is not set. Did you call startTestServer()?');
  }
  return SERVER_URL;
}

// Register a user
export async function registerUserRequest(
  username: string,
  password: string,
  email: string
) {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/person/v1/registerUser`,
      { username, password, email },
      { timeout: 5 * 1000 }
    );
    return res;
  } catch (error) {
    throw error;
  }
}

// Logs in a user
export async function loginUserRequest(userInput: string, password: string) {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/person/v1/loginUser`,
      { userInput, password },
      { timeout: 5 * 1000 }
    );
    return res;
  } catch (error) {
    throw error;
  }
}

// Create an order
export async function createOrder(
  token: string,
  personUid: string,
  itemList?: Item[],
  invoiceDetails?: any
) {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/order/v1/order/create`,
      { personUid, itemList, invoiceDetails },
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

// Fetch order XML
export async function fetchXmlRequest(orderUid: string) {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/order/v1/order/fetchxml/${orderUid}`
    );
    return res;
  } catch (error) {
    throw error;
  }
}

// Logout user
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

// cancel order
export async function cancelOrderReq(orderUid: string) {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/order/v1/order/cancel`,
      { orderUid },
      { timeout: 5 * 1000 }
    );
    return res;
  } catch (error) {
    throw error;
  }
}

// complete order
export async function completeOrderReq(orderUid: string) {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/order/v1/order/complete`,
      { orderUid },
      { timeout: 5 * 1000 }
    );
    return res;
  } catch (error) {
    throw error;
  }
}
