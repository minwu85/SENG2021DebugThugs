import axios from 'axios';
import { PORT, server } from '../../index';
import { OrderRepository } from '../../repository/OrderRepository';
import { closeServer } from '../testHelper';
//import { cancelOrder } from '../../controllers/OrderController';
import { Request, Response } from 'express';

const SERVER_URL = `http://localhost:${PORT}`;

describe('cancelOrder', () => {
  let orderId: string;

  beforeAll(async () => {
    // Create an order to test
    const createRes = await createOrder(
      'testToken',
      'testPersonUid',
      [{ itemId: 'item123', itemQuantity: 2, itemSeller: 'sellerX' }],
      'invoiceDetails'
    );

    orderId = createRes.data.orderId;
    expect(orderId).toStrictEqual(expect.any(String));  // Make sure we have an orderId
  });

  test('successful order cancellation', async () => {
    // Mock the request and response for the cancelOrder controller method
    const req = {
      body: { orderUid: orderId },
      header: jest.fn().mockReturnValue('testToken') // Mock the token header
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    // Call the cancelOrder controller method
//    await cancelOrder(req, res);

    // Check that the response is as expected
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });

    // Verify the order is no longer found in the repository
    const repo = new OrderRepository();
    const find = await repo.findByOrderUid(orderId);
    expect(find?.status).toBe('Deleted'); // The order should have been marked as 'Deleted'
  });

  afterAll(async () => {
    await closeServer(server); // Ensure the server is closed after the tests
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
