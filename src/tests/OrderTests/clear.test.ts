import axios from 'axios';
import { PORT, server } from '../../index';
import { closeServer } from '../testHelper';

const SERVER_URL = `http://localhost:${PORT}`;

describe('clearOrder', () => {
  test('successful order clearing', async () => {
    const res = await axios.delete(`${SERVER_URL}/api/order/v1/clear`);
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ message: expect.any(String) });
  });

  afterAll(async () => {
    await closeServer(server);
  });
});
