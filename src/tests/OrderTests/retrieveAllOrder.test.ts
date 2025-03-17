import axios from 'axios';
import { PORT, server } from '../../index';
import { OrderRepository } from '../../repository/OrderRepository';
import { closeServer } from '../testHelper';

const SERVER_URL = `http://localhost:${PORT}`;

describe('retrieveAllOrders', () => {
  let token: string;
  let personUid: string;

  beforeAll(async () => {
    token = 'testToken'; // Replace with valid token logic if needed
    personUid = 'testPersonUid';

    // Create an order to test retrieval
    await createOrder(token, personUid, [
      { itemId: 'item123', itemQuantity: 2, itemSeller: 'sellerX' }
    ], 'invoiceDetails');
  });

  test('should retrieve all orders for a valid personUid', async () => {
    const res = await axios.get(
      `${SERVER_URL}/v1/order/retrieve/all`,
      { headers: { token }, params: { personUid } }
    );

    expect(res.status).toBe(200);
    expect(res.data).toBeInstanceOf(Array);
    res.data.forEach(order => {
      expect(order).toHaveProperty('orderUid', expect.any(String));
      expect(order).toHaveProperty('personUid', expect.any(String));
      expect(order).toHaveProperty('details', expect.any(String)); // Adjust fields as per schema
    });
  });

  test('should return 400 when personUid is missing', async () => {
    try {
      await axios.get(`${SERVER_URL}/v1/order/retrieve/all`, { headers: { token } });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toStrictEqual({ error: 'personUid is required' });
    }
  });

  test('should return 401 when token is missing', async () => {
    try {
      await axios.get(`${SERVER_URL}/v1/order/retrieve/all`, { params: { personUid } });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toStrictEqual({ error: 'Unauthorized' });
    }
  });

  test('should return 200 with empty array if no orders exist', async () => {
    const res = await axios.get(
      `${SERVER_URL}/v1/order/retrieve/all`,
      { headers: { token }, params: { personUid: 'nonExistentUid' } }
    );

    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual([]); // Expect empty array if no orders exist
  });

  afterAll(async () => {
    await closeServer(server); // Ensure the server is closed after tests
  });
});

// Helper function to create an order
async function createOrder(token: string, personUid: string, itemList?: any[], invoiceDetails?: any) {
  try {
    return await axios.post(
      `${SERVER_URL}/api/order/v1/order/create`,
      { personUid, itemList, invoiceDetails },
      { headers: { token } }
    );
  } catch (error) {
    throw error;
  }
}