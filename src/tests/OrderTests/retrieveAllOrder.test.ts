import axios from 'axios';
import { PORT, server } from '../../index';
import { closeServer } from '../testHelper';

const SERVER_URL = `http://localhost:${PORT}`;

describe('GET /v1/order/retrieve/all', () => {
  let token: string;
  let personUid: string;

  beforeAll(async () => {
    token = 'testToken'; // Replace with valid token logic if needed
    personUid = 'testPersonUid';

    // Create mock orders for testing
    await createOrder(token, personUid);
  });

  test('should retrieve all orders successfully (HTTP 200)', async () => {
    const res = await axios.get(
      `${SERVER_URL}/v1/order/retrieve/all`,
      { headers: { token }, params: { personUid } }
    );

    expect(res.status).toBe(200);
    expect(res.data).toBeInstanceOf(Array); // Expect an array of orders
  });

  test('should return 401 when token is missing', async () => {
    await expect(
      axios.get(`${SERVER_URL}/v1/order/retrieve/all`, { params: { personUid } })
    ).rejects.toThrow(/Request failed with status code 401/);
  });

  afterAll(async () => {
    await closeServer(server); // Ensure the server is closed after tests
  });
});

// Helper function to create an order (Minimal fields)
async function createOrder(token: string, personUid: string) {
  try {
    return await axios.post(
      `${SERVER_URL}/v1/order/create`,
      { personUid },
      { headers: { token } }
    );
  } catch (error) {
    throw error;
  }
}
