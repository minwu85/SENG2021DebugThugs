import axios from 'axios';
import { closeServer, getServerUrl, startTestServer } from '../testHelper';

describe('clearOrder', () => {
  beforeAll(async () => {
    await startTestServer();
  })

  test('successful order clearing', async () => {
    const SERVER_URL = getServerUrl();
    console.log(SERVER_URL);
    const res = await axios.delete(`${SERVER_URL}/api/order/v1/clear`);
    console.log(res.data);
    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ message: expect.any(String) });
  });

  afterAll(async () => {
    // await closeServer();
  });
});
