import { server } from '../../index';
import { closeServer } from '../testHelper';
import { registerUserRequest, updatePasswordRequest } from '../testHelper';

describe('updatePassword', () => {
  let personUid: string;
  let oldPassword: string;
  let newPassword: string;

  beforeEach(async () => {
    personUid = 'test-person-123';
    oldPassword = 'oldPass123';
    newPassword = 'newSecurePass456';

    // Ensure user is registered before testing password updates
    const registerRes = await registerUserRequest('testUser', oldPassword, 'test@example.com');
    
    if (registerRes.status !== 200) {
      throw new Error('User registration failed before updatePassword test');
    }
  });

  test('successful password update', async () => {
    const res = await updatePasswordRequest(personUid, oldPassword, newPassword);

    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ message: expect.any(String) });
  });

  test('incorrect old password', async () => {
    try {
      await updatePasswordRequest(personUid, 'wrongOldPass', newPassword);
      fail('Did not throw expected error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(400);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }
  });

  test('missing required fields', async () => {
    try {
      await updatePasswordRequest(personUid, oldPassword, ''); // Missing new password
      fail('Did not throw expected error');
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        expect(axiosError.response.status).toBe(400);
        expect(axiosError.response.data).toStrictEqual({ error: expect.any(String) });
      } else {
        throw error;
      }
    }
  });

  afterAll(async () => {
    await closeServer(server);
  });
});
