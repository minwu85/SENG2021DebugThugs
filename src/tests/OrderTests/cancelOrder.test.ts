import axios from 'axios';
import { startServer, stopServer } from '../../startServer';
import { Server } from 'http';

const TEST_PORT = 5001;
const SERVER_URL = `http://localhost:${TEST_PORT}`;
let server: Server;

describe('cancel Order', () => {
  beforeAll(async () => {
    server = await startServer();
  });

  test('successful order cancel', async () => {
    const res = await axios.delete(`${SERVER_URL}/api/order/v1/clear`);
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ message: expect.any(String) });
  });

  afterAll(async () => {
    await stopServer();
  });
});
